import React, { Component } from 'react';
import { connect } from "react-redux";
import './RemedyModal.scss';
import { toast } from 'react-toastify';
import moment from 'moment';
import * as actions from '../../../store/actions';
import { Modal, Button, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { CommonUtils } from '../../../utils';
import { getBookingById, getAllProvinceJson, getAllDistrictJson, getAllWardJson } from '../../../services/userService';
import html2canvas from 'html2canvas';
import _ from 'lodash';
import localization from 'moment/locale/vi';
class RemedyModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            createPre: false,
            prescriptions: [],
            dataBooking: {},
            hide: false,
            base64Image: '',
            district:{},
            province:{},
            ward:{}
        };
    }
    async componentDidMount() {
        this.buildData()
    }
    buildData=async()=>{
        if (this.props.userInfo&&this.props.userInfo.token && this.props.idBooking) {
            let res = await getBookingById(this.props.idBooking, this.props.userInfo.token)
            if (res && res.errCode === 0) {
                this.setState({
                    dataBooking: res.data
                }, async () => {
                    if (!_.isEmpty(this.state.dataBooking)) {
                        let resProvince = await getAllProvinceJson();
                        let resDistrict = await getAllDistrictJson(this.state.dataBooking.Patient_Record.provinceId)
                        let resWard = await getAllWardJson(this.state.dataBooking.Patient_Record.districtId)
                        if(resProvince&&resProvince.errCode===0&&resDistrict&&resDistrict.errCode===0&&resWard&&resWard.errCode===0){
                            let province = resProvince.data.find(item=>item&&item.id===this.state.dataBooking.Patient_Record.provinceId)
                            let district = resDistrict.data.find(item=>item&&item.id===this.state.dataBooking.Patient_Record.districtId)
                            let ward={}
                            if(this.state.dataBooking.Patient_Record.wardId){
                                ward = resWard.data.find(item=>item&& item.id=== this.state.dataBooking.Patient_Record.wardId)
                            }
                            this.setState({
                                province:province,
                                district:district,
                                ward:ward
                            })
                        }
                    }


                })
            }
        }
    }
    async componentDidUpdate(prevProps, prevState, snaphot) {
        if (this.props.idBooking !== prevProps.idBooking) {
            this.buildData()
        }
    }
    handleCreatePres = () => {
        this.setState({
            createPre: !this.state.createPre,
        });
    };
    handleSendRemedy = async () => {
        // Ẩn các trường nhập liệu
        this.setState({ hide: true }, async () => {
            try {
                const contentModal = document.querySelector('.content-modal');
                if (contentModal) {
                    // Sử dụng html2canvas để chụp ảnh nội dung
                    const canvas = await html2canvas(contentModal, {
                        useCORS: true, // Đảm bảo xử lý ảnh từ nguồn khác nếu có
                    });
                    const imgData = canvas.toDataURL("image/png");
    
                    // Trực tiếp gọi sendRemedy với imgData
                    await this.props.sendRemedy({
                        base64Image: imgData,
                        dataBooking: this.state.dataBooking
                    });
                }
            } catch (error) {
                console.error("Error capturing content-modal:", error);
            } finally {
                this.setState({ 
                    hide: false,
                    prescriptions: [] 
                });
                this.props.closeRemedyModal();
            }
        });
    };
    
    handleAddRow = () => {
        // Thêm một dòng mới vào danh sách prescriptions
        this.setState((prevState) => ({
            prescriptions: [
                ...prevState.prescriptions,
                { name: '', quantity: '', instructions: '' }, // Mẫu dòng mới
            ],
        }));
    };

    handleInputChange = (index, field, value) => {
        const updatedPrescriptions = [...this.state.prescriptions];
        updatedPrescriptions[index][field] = value;
        this.setState({ prescriptions: updatedPrescriptions });
    };

    handleDeleteRow = (index) => {
        this.setState((prevState) => {
            const updatedPrescriptions = prevState.prescriptions.filter((_, i) => i !== index);
            return { prescriptions: updatedPrescriptions };
        });
    };
    render() {
        console.log('ês',this.state)
        let { isOpenModal, closeRemedyModal } = this.props;
        let { createPre, prescriptions, dataBooking, hide ,province,district,ward} = this.state;
        let dateOfBirth = '';
        if (dataBooking && dataBooking.Patient_Record && dataBooking.Patient_Record.dateOfBirth) {
            dateOfBirth = moment(new Date(Number(dataBooking.Patient_Record.dateOfBirth))).format('DD/MM/YYYY');
        }
        let appointmentDate='';
        if (dataBooking && dataBooking.Schedule && dataBooking.Schedule.date) {
            appointmentDate = `${moment(new Date(Number(dataBooking.Schedule.date)))
                .locale('vi') // Cài đặt ngôn ngữ tiếng Việt
                .format('DD [tháng] MM [năm] YYYY')} / ${moment(new Date(Number(dataBooking.Schedule.date)))
                .locale('en') // Cài đặt ngôn ngữ tiếng Anh
                .format('D MMMM YYYY')}`;
              
        }
        let provinceClinic = dataBooking && dataBooking.Schedule? dataBooking.Schedule.doctorData.Doctor_Infor.Clinic.provinceData:{}
        let dateVi =provinceClinic? `${provinceClinic.valueVi},${moment(new Date().getTime()).locale('vi').format('DD [tháng] MM [năm] YYYY')}`:'';
        let dateEn = provinceClinic? `${provinceClinic.valueEn}, ${moment(new Date().getTime()).locale('en') .format('D MMMM YYYY')}`:''
        let gender = dataBooking && dataBooking.Patient_Record ? `${dataBooking.Patient_Record.genderPatient.valueVi}/${dataBooking.Patient_Record.genderPatient.valueEn}` : ''
        let positionVi = dataBooking && dataBooking.Schedule ? dataBooking.Schedule.doctorData.Doctor_Infor.positionData.valueVi : '';
        let positionEn = dataBooking && dataBooking.Schedule ? dataBooking.Schedule.doctorData.Doctor_Infor.positionData.valueEn : '';
        let specialty = dataBooking && dataBooking.Schedule ? `${dataBooking.Schedule.doctorData.Doctor_Infor.Specialty.nameVi}/${dataBooking.Schedule.doctorData.Doctor_Infor.Specialty.nameEn}` : '';
        let doctorName = dataBooking && dataBooking.Schedule ? `${dataBooking.Schedule.doctorData.lastName} ${dataBooking.Schedule.doctorData.firstName}` : ''
        let patientName = dataBooking && dataBooking.Patient_Record ? `${dataBooking.Patient_Record.lastName} ${dataBooking.Patient_Record.firstName}` : ''
        let nameClinic = dataBooking && dataBooking.Schedule ? dataBooking.Schedule.doctorData.Doctor_Infor.Clinic.name : '';
        let addressClinic = dataBooking && dataBooking.Schedule ? dataBooking.Schedule.doctorData.Doctor_Infor.Clinic.address : ''
        let addressPatient =  dataBooking && dataBooking.Patient_Record? `${dataBooking.Patient_Record.address}, ${ward? ward.full_name:''}, ${district? district.full_name:''}, ${province? province.full_name:''}`:''
        return (
            <Modal
                isOpen={isOpenModal}
                className="booking-modal-container"
                size="lg"
                centered
            >
                <div className="modal-header">
                    <h5 className="modal-title">Kết Quả Khám Bệnh<i>(Medical Examination Results)</i></h5>
                    <button
                        type="button"
                        className="close"
                        onClick={closeRemedyModal}
                        aria-label="Close"
                    >
                        <span aria-hidden="true">x</span>
                    </button>
                </div>
                <ModalBody>
                    <div className='content-modal pl-2'>
                        <div className='text-center  '>
                            <h3 className='text-uppercase mb-0 text-red'>{nameClinic}</h3>
                            <h6 className='text-red'>{addressClinic}</h6>
                            <h4 className='mb-0'>Kết Quả Khám Bệnh</h4>
                            <h6><i>(Medical Examination Results)</i></h6>
                        </div>
                        <div>
                            <p className='mb-1'>{positionVi} <i>({positionEn})</i>:{doctorName}</p>
                            <p className='mb-1'>Chuyên khoa <i>(Specialty)</i>: {specialty}</p>
                        </div>
                        <div className='patient-content'>
                            <p className="mb-1">Họ tên bệnh nhân <i>(Patient's Name)</i>: {patientName}</p>
                            <p className="mb-1">Ngày sinh <i>(Date of birth)</i>: {dateOfBirth}</p>
                            <p className="mb-1">Giới tính <i>(Gender)</i>: {gender}</p>
                            <p className='mb-1'>Địa chỉ <i>(Address)</i>: {addressPatient}</p>
                            <p className='mb-1'>Ngày hẹn <i>(Appointment Date)</i>: {appointmentDate}</p>
                        </div>
                        <div className="row">
                            <div className="form-group col-12 mb-0">
                                <label>Chuẩn đoán <i>(Diagnosis)</i>:</label>
                                <textarea
                                    className="form-control p-0"
                                    style={{
                                        resize: 'none',// Tùy chọn không cho phép kéo thả thay đổi kích thước
                                        border: hide ? 'none' : '',
                                        outline: hide ? 'none' : '', width: '100%' // Loại bỏ viền nếu hide là true
                                    }}
                                    rows="1" // Thiết lập số dòng mặc định
                                    onInput={(e) => {
                                        e.target.style.height = 'auto'; // Đặt lại chiều cao để tính toán chính xác
                                        e.target.style.height = `${e.target.scrollHeight}px`; // Điều chỉnh chiều cao dựa trên nội dung
                                    }}
                                />
                            </div>
                            {!hide &&
                                <div className='form-group col-12 mb-0'>
                                    <button
                                        className="btn btn-secondary px-2 py-1 my-2 "
                                        onClick={() => this.handleCreatePres()}
                                    >
                                        Tạo đơn thuốc
                                    </button>
                                </div>
                            }
                            {createPre && (
                                <div className="col-12">
                                    <label>Đơn thuốc <i>(Prescription)</i>:</label>
                                    <table className="table table-bordered">
                                        <thead>
                                            <tr>
                                                <th style={{ width: '5%' }}>STT <br /><i>(No.)</i></th>
                                                <th style={{ width: '30%' }}>Tên thuốc <br /><i>(Medication Name)</i></th>
                                                <th style={{ width: '15%' }}>Số lượng <br /><i>(Quantity)</i></th>
                                                <th style={{ width: '40%' }}>Cách sử dụng <br /><i>(Instructions)</i></th>
                                                {!hide &&
                                                    <th style={{ width: '10%' }}>Action</th>
                                                }
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {prescriptions.map((prescription, index) => (
                                                <tr key={index}>
                                                    <td className='p-2'>{index + 1}</td>
                                                    <td className='p-2'>
                                                        <input
                                                            type="text"
                                                            style={{
                                                                border: hide ? 'none' : '',
                                                                outline: hide ? 'none' : '', width: '100%' // Loại bỏ viền nếu hide là true
                                                            }}
                                                            value={prescription.name}
                                                            onChange={(e) =>
                                                                this.handleInputChange(index, 'name', e.target.value)
                                                            }
                                                        />
                                                    </td>
                                                    <td className='p-2'>
                                                        <input
                                                            type="text"
                                                            value={prescription.quantity}
                                                            style={{
                                                                border: hide ? 'none' : '',
                                                                outline: hide ? 'none' : '', width: '100%' // Loại bỏ viền nếu hide là true
                                                            }}
                                                            onChange={(e) =>
                                                                this.handleInputChange(index, 'quantity', e.target.value)
                                                            }
                                                        />
                                                    </td>
                                                    <td className='p-2'>
                                                        <input
                                                            type="text"
                                                            value={prescription.instructions}
                                                            style={{
                                                                border: hide ? 'none' : '',
                                                                outline: hide ? 'none' : '', width: '100%' // Loại bỏ viền nếu hide là true
                                                            }}
                                                            onChange={(e) =>
                                                                this.handleInputChange(index, 'instructions', e.target.value)
                                                            }
                                                        />
                                                    </td>
                                                    {!hide &&
                                                        <td className='p-2'>
                                                            <button
                                                                className="btn btn-danger btn-sm"
                                                                onClick={() => this.handleDeleteRow(index)}
                                                            >
                                                                Xoá
                                                            </button>
                                                        </td>
                                                    }
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    {!hide &&
                                        <button
                                            className="btn btn-primary"
                                            onClick={this.handleAddRow}
                                        >
                                            Thêm
                                        </button>
                                    }
                                </div>
                            )}
                            <div className="col-12 form-group mb-3">
                                <label>Ghi chú <i>(Note)</i>:</label>
                                <textarea
                                    className="form-control p-0"
                                    rows="1" // Thiết lập số dòng mặc định
                                    style={{
                                        resize: 'none',// Tùy chọn không cho phép kéo thả thay đổi kích thước
                                        border: hide ? 'none' : '',
                                        outline: hide ? 'none' : '', width: '100%' // Loại bỏ viền nếu hide là true
                                    }}
                                    onInput={(e) => {
                                        e.target.style.height = 'auto'; // Đặt lại chiều cao để tính toán chính xác
                                        e.target.style.height = `${e.target.scrollHeight}px`; // Điều chỉnh chiều cao dựa trên nội dung
                                    }}
                                />
                            </div>
                            <div className='col-6'></div>
                            <div className='col-6 text-center'>
                                <p className='mb-0'>{dateVi}</p>
                                <p className='mb-5'><i>({dateEn})</i></p>
                                <p className='mt-5'>{doctorName}</p>
                            </div>
                        </div>

                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={() => this.handleSendRemedy()}>
                        Send
                    </Button>
                    <Button color="secondary" onClick={closeRemedyModal}>
                        Cancel
                    </Button>
                </ModalFooter>
            </Modal>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        language: state.app.language,
        genders: state.admin.genders,
        userInfo: state.user.userInfo,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getGender: () => dispatch(actions.fetchGenderStart()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(RemedyModal);
