import React, { Component } from 'react';
import { connect } from "react-redux";
import { FormattedMessage } from 'react-intl';
import { LANGUAGES } from '../../../utils';
import NumberFormat from 'react-number-format';
import { getFeedbackAdmin, putApproveFeedback, getHistoryById } from '../../../services/userService';
import './ManageFeedback.scss';
import { toast } from 'react-toastify';
import moment from 'moment';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
class ManageFeedback extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listFeedback: [],
            detailHistory: {},
            isShowModal: false
        }
    }
    async componentDidMount() {
        this.getDataFeedback()
    }
    getDataFeedback = async () => {
        let { userInfo } = this.props;
        if (userInfo && userInfo.token) {
            let res = await getFeedbackAdmin(userInfo.token);
            if (res && res.errCode === 0) {
                this.setState({
                    listFeedback: res.data
                })
            }
        }

    }
    async componentDidUpdate(prevProps, prevState, snaphot) {

    }
    handleApprove = async (id) => {
        let res = await putApproveFeedback({
            id: id
        }, this.props.userInfo.token)
        if (res && res.errCode === 0) {
            this.getDataFeedback();
            toast.success("Approve succed!")
        } else {
            toast.error("Error")
        }
    }
    handleDetailHistory = async (id) => {
        let res = await getHistoryById(id, this.props.userInfo.token)
        if (res && res.errCode === 0) {
            this.setState({
                detailHistory: res.data,
                isShowModal: true
            })
        }
    }
    handleClodeModal = () => {
        this.setState({
            isShowModal: false
        })
    }
    render() {
        let { listFeedback, detailHistory } = this.state;
        let { language } = this.props
        console.log('sfsss', detailHistory)
        let nameClinic = detailHistory && detailHistory.Booking ? detailHistory.Booking.Schedule.doctorData.Doctor_Infor.Clinic.name : '';
        let addressClinic = detailHistory && detailHistory.Booking ? detailHistory.Booking.Schedule.doctorData.Doctor_Infor.Clinic.address : '';
        let nameVi = detailHistory && detailHistory.Booking ? `${detailHistory.Booking.Schedule.doctorData.Doctor_Infor.positionData.valueVi} ${detailHistory.Booking.Schedule.doctorData.lastName} ${detailHistory.Booking.Schedule.doctorData.firstName}` : '';
        let nameEn = detailHistory && detailHistory.Booking ? `${detailHistory.Booking.Schedule.doctorData.Doctor_Infor.positionData.valueEn} ${detailHistory.Booking.Schedule.doctorData.firstName} ${detailHistory.Booking.Schedule.doctorData.lastName}` : '';
        let timeVi = detailHistory && detailHistory.Booking ? detailHistory.Booking.Schedule.timeTypeData.valueVi : '';
        let timeEn = detailHistory && detailHistory.Booking ? detailHistory.Booking.Schedule.timeTypeData.valueEn : '';
        let speVi = detailHistory && detailHistory.Booking ? detailHistory.Booking.Schedule.doctorData.Doctor_Infor.Specialty.nameVi : '';
        let speEn = detailHistory && detailHistory.Booking ? detailHistory.Booking.Schedule.doctorData.Doctor_Infor.Specialty.nameEn : '';
        let date = detailHistory && detailHistory.Booking ? moment(new Date(Number(detailHistory.Booking.Schedule.date)).getTime()).locale('vi').format('DD/MM/YYYY') : ''
        let reason = detailHistory && detailHistory.Booking ? detailHistory.Booking.reason : '';
        let namePatientVi = detailHistory && detailHistory.Booking ? `${detailHistory.Booking.Patient_Record.lastName} ${detailHistory.Booking.Patient_Record.firstName}` : '';
        let namePatientEn = detailHistory && detailHistory.Booking ? `${detailHistory.Booking.Patient_Record.firstName} ${detailHistory.Booking.Patient_Record.lastName}` : '';
        let email = detailHistory && detailHistory.Booking ? detailHistory.Booking.Patient_Record.email : '';
        let dateOfBirth = detailHistory && detailHistory.Booking ? moment(new Date(Number(detailHistory.Booking.Patient_Record.dateOfBirth)).getTime()).locale('vi').format('DD/MM/YYYY') : ''
        return (
            <div className='manage-feedback-container container'>
                <div className='title'>
                    {language===LANGUAGES.VI?'Quản lý Đánh giá':'Feedback Management'}
                </div>
                <table className='table' style={{ width: '100%' }}>
                    <thead>
                        <tr>
                            <th rowSpan={2}>{language === LANGUAGES.VI ? 'STT' : 'No.'}</th>
                            <th colSpan={4}>
                                {language === LANGUAGES.VI ?
                                    <>Chất lượng <i>(Số sao)</i></>
                                    :
                                    <>Quality <i>(Stars)</i></>
                                }
                            </th>
                            <th rowSpan={2} className='detail'>
                                {language === LANGUAGES.VI ? 'Chi tiết' : 'Detail'}
                            </th>
                            <th rowSpan={2}>
                                {language === LANGUAGES.VI ? 'Hành động' : 'Actions'}
                            </th>
                        </tr>
                        <tr>
                            <th>
                                {language === LANGUAGES.VI ? 'Bác sĩ' : 'Doctor'}
                            </th>
                            <th>
                                {language === LANGUAGES.VI ? 'Thời gian chờ' : 'Waiting Time'}
                            </th>
                            <th>
                                {language === LANGUAGES.VI ? 'Cơ sở vật chất' : 'Facilities'}
                            </th>
                            <th>
                                {language === LANGUAGES.VI ? 'Nhân viên hỗ trợ' : 'Staff'}
                            </th>

                        </tr>

                    </thead>
                    <tbody>
                        {listFeedback && listFeedback.length > 0 ?
                            <>
                                {
                                    listFeedback.map((item, index) => {
                                        return (
                                            <tr key={`fb-${index}`}>
                                                <td>{index + 1}</td>
                                                <td>{item.doctorRating}</td>
                                                <td>{item.waitingTimeRating}</td>
                                                <td>{item.facilityRating}</td>
                                                <td>{item.staffRating}</td>
                                                <td>{item.comments}</td>
                                                <td>
                                                    <div className='d-flex' >
                                                        <button
                                                            onClick={() => this.handleApprove(item.id)}
                                                        >
                                                            {language === LANGUAGES.VI ? 'Duyệt' : 'Approve'}
                                                        </button>
                                                        <button
                                                            onClick={() => this.handleDetailHistory(item.id)}
                                                        >
                                                            {language === LANGUAGES.VI ? 'Chi tiết' : 'Detail'}
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    })
                                }
                            </>
                            : <tr>
                                <td colSpan={7}>{language === LANGUAGES.VI ? 'Không có dữ liệu' : 'No data'}</td>
                            </tr>
                        }
                    </tbody>
                </table>
                <Modal
                    isOpen={this.state.isShowModal}
                    className="modal-feedback-container"
                    size="md"
                    centered
                >
                    <div className="modal-header">
                        <h5 className="modal-title">{language === LANGUAGES.VI ? 'Thông tin khám bệnh' : 'Medical Information'}</h5>
                        <button
                            type="button"
                            className="close"
                            onClick={() => this.handleClodeModal()}
                            aria-label="Close"
                        >
                            <span aria-hidden="true">x</span>
                        </button>
                    </div>
                    <ModalBody>
                        <div className='content-modal pl-2 pb-0'>
                            <div className='border-bottom'>
                                <h4>{nameClinic}</h4>
                                <h6>{addressClinic}</h6>
                            </div>
                            <div className='border-bottom'>
                                <p className='m-0'>{language === LANGUAGES.VI ? `Bác sĩ: ${nameVi}` : `Doctor: ${nameEn}`}</p>
                                <p className='m-0'>{language === LANGUAGES.VI ? `Chuyên khoa: ${speVi}` : `Specialty: ${speEn}`}</p>
                                <p className='m-0'>{language === LANGUAGES.VI ? `Thời gian: ${timeVi} - ${date}` : `Appointment Time: ${timeEn} - ${date} `}</p>
                                <p className='mb-2'>{language === LANGUAGES.VI ? 'Lý do: ' : 'Reason: '} {reason}</p>
                                {/* <p className='m-0 text-center'>{language === LANGUAGES.VI ? 'Vui lòng đảm bảo đến đúng giờ theo lịch hẹn của bạn' : 'Please make sure to attend your appointment on time.'}</p>
                                <p className='text-center m-0'><i>{language === LANGUAGES.VI ? '(Nếu bạn muốn hủy lịch hẹn, vui lòng liên hệ: xxxxxxxxxxx)' : '(If you wish to cancel your appointment, please contact: xxxxxxxxxxx)'}</i></p> */}
                            </div>
                            <div>
                                <p className='m-0'>{language === LANGUAGES.VI ? `Người khám: ${namePatientVi}` : `Patient: ${namePatientEn}`}</p>
                                <p className='m-0'>{`Email: ${email}`}</p>
                                <p className='m-0'>{language === LANGUAGES.VI ? `Ngày sinh: ${dateOfBirth}` : `Date of birth: ${dateOfBirth}`}</p>
                            </div>

                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="secondary" onClick={() => this.handleClodeModal()}>
                            {language === LANGUAGES.VI ? 'Đóng' : 'Close'}
                        </Button>
                    </ModalFooter>
                </Modal>
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        userInfo: state.user.userInfo,
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageFeedback);
