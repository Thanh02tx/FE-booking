import React, { Component } from 'react';
import { connect } from "react-redux";
import { FormattedMessage } from 'react-intl';
import { LANGUAGES } from '../../../utils';
import NumberFormat from 'react-number-format';
import moment from 'moment';
import { getAllUpcomingAppointment,cancelAppointment, confirmAppointment } from '../../../services/userService';
import { Modal, ModalBody, ModalHeader, Button, ModalFooter } from 'reactstrap';
import './ManageNewAppointment.scss';
import ModalDetailBooking from '../../Patient/Account/ModalDetailBooking';
import { toast } from 'react-toastify';
class ManageNewAppointment extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listBooking: [],
            listBookingApi:[],
            isOpenCancelAppointment: false,
            booking: {},
            cancellationReason:'',
            search:'',
            errMessage:''
        };
        this._isMounted = false; // Cờ kiểm tra trạng thái mount
    }

    componentDidMount() {
        this._isMounted = true; // Đánh dấu rằng component đã mount
        this.getDataBooking();
    }

    componentWillUnmount() {
        this._isMounted = false; 
    }

    getDataBooking = async () => {
        if (this.props.userInfo && this.props.userInfo.token) {
            try {
                let res = await getAllUpcomingAppointment(this.props.userInfo.token);
                if (res && res.errCode === 0 && this._isMounted) {
                    this.setState({
                        listBookingApi: res.data,
                        listBooking:res.data
                    });
                }
            } catch (error) {
                console.error("Lỗi khi lấy danh sách lịch hẹn:", error);
            }
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.userInfo !== prevProps.userInfo) {
            this.getDataBooking();
        }
    }
    handleConfirmAppointment = async (id) => {
        let res = await confirmAppointment(id, this.props.userInfo.token)
        if (res && res.errCode === 0) {
            this.getDataBooking()
        }
    }
    closeCancelAppointment = () => {
        this.setState({
            isOpenCancelAppointment: false,
            booking: {},
            cancellationReason:''
        })
    }
    handleOpenCancelAppointment = (item) => {
        this.setState({
            isOpenCancelAppointment: true,
            booking: item
        })
    }
    handleOnchangeInput=(event,id)=>{
        this.setState({
            [id]:event.target.value
        })
    }
    handleConfirmCancellation = async(id) => {
        let { language } = this.props;
        this.setState({
            errMessage: ''
        });

        if (!this.state.cancellationReason) {
            this.setState({
                errMessage: language === LANGUAGES.VI ? 'Vui lòng nhập lý do hủy' : 'Please enter the cancellation reason.'
            });
        } else {
            let res = await cancelAppointment({
                reason:this.state.cancellationReason,
                id:id
            },this.props.userInfo.token)
            if(res&&res.errCode===0){
                toast.success("Cancel Appointment Succed!")
                this.setState({
                    isOpenCancelAppointment:false,
                    booking:{},
                })
                this.getDataBooking()
            }else{
                toast.error("Cancel appointment error!")
            }
        }
    }
    render() {
        let { listBooking,listBookingApi, isOpenCancelAppointment, booking,search ,cancellationReason,errMessage} = this.state;
        let { language } = this.props;
        listBooking = listBookingApi.filter(item =>
            item.Patient_Record.email.toLowerCase().includes(search.toLowerCase())
        );
        let seachPlaceholder = language === LANGUAGES.VI ? 'Nhập email để tìm kiếm' : 'Enter email to search'
        console.log('sf', listBooking)
        return (
            <div className='manage-approval-container container'>
                <div className='title text-center'>
                    Lịch hẹn mới
                </div>
                <input
                    className='form-control search'
                    value={search}
                    onChange={(event)=>this.handleOnchangeInput(event,'search')}
                    placeholder={seachPlaceholder}
                />
                <table className='table'>
                    <thead>
                        <tr>
                            <th>STT</th>
                            <th>Full name</th>
                            <th>Email</th>
                            <th>Status</th>
                            <th>Doctor</th>
                            <th>Time</th>
                            <th>Clinic</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {listBooking.length > 0 ?
                            <>
                                {listBooking.map((item, index) => {
                                    return (
                                        <tr key={`bk-${index}`}>
                                            <td>{index + 1}</td>
                                            <td>{`${item.Patient_Record.firstName} ${item.Patient_Record.lastName}`}</td>
                                            <td>{item.Patient_Record.email}</td>
                                            <td>{item.statusData.valueVi}</td>
                                            <td>{`${item.Schedule.doctorData.Doctor_Infor.positionData.valueVi} ${item.Schedule.doctorData.firstName} ${item.Schedule.doctorData.lastName}`}</td>
                                            <td>{`${moment(new Date(Number(item.Schedule.date))).format('DD/MM/YYYY')} ${item.Schedule.timeTypeData.valueVi}`}</td>
                                            <td>{item.Schedule.doctorData.Doctor_Infor.Clinic.name}</td>
                                            <td>
                                                {item.statusId === 'S2' && <button onClick={() => this.handleConfirmAppointment(item.id)}>Duyệt</button>}
                                                <button onClick={() => this.handleOpenCancelAppointment(item)}>Huy</button>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </>
                            : <tr>
                                <td colSpan={7}>No data</td>
                            </tr>
                        }
                    </tbody>
                </table>
                <Modal
                    isOpen={isOpenCancelAppointment}
                    className="modal-feedback-container"
                    size="md"
                    centered
                >
                    <div className="modal-header">
                        <h5 className="modal-title">{language===LANGUAGES.VI?'Huỷ lịch hẹn':'Cancel Appointment'}</h5>
                        <button
                            type="button"
                            className="close"
                            onClick={() => this.closeCancelAppointment()}
                            aria-label="Close"
                        >
                            <span aria-hidden="true">x</span>
                        </button>
                    </div>
                    <ModalBody>
                        <div className='content-modal pl-2 pb-0'>
                            <div>
                                <label>Thông tin đặt lịch</label>
                                <div className='border rounded p-1'>
                                    <div>{language === LANGUAGES.VI ? 'Bệnh nhân:' : 'Patient:'} {booking && booking.Patient_Record ? `${booking.Patient_Record.firstName} ${booking.Patient_Record.lastName}` : ''}</div>
                                    <div>Email: {booking && booking.Patient_Record ? booking.Patient_Record.email : ''}</div>
                                    <div>
                                        {booking && booking.Schedule && language === LANGUAGES.EN ? `Bác sĩ: ${booking.Schedule.doctorData.Doctor_Infor.positionData.valueEn} ${booking.Schedule.doctorData.firstName} ${booking.Schedule.doctorData.lastName}` : ''}
                                        {booking && booking.Schedule && language === LANGUAGES.VI ? `Doctor: ${booking.Schedule.doctorData.Doctor_Infor.positionData.valueVi} ${booking.Schedule.doctorData.lastName} ${booking.Schedule.doctorData.firstName}` : ''}
                                    </div>
                                    <div>{language === LANGUAGES.VI ? 'Thời gian: ' : 'Time: '} {booking && booking.Schedule ? `${moment(new Date(Number(booking.Schedule.date))).format('DD/MM/YYYY')} ${booking.Schedule.timeTypeData.valueVi}` : ''}</div>
                                    <div>{language === LANGUAGES.VI ? 'Phòng khám: ' : 'Clinic: '}{booking && booking.Schedule ? booking.Schedule.doctorData.Doctor_Infor.Clinic.name : ''}</div>
                                </div>

                            </div>
                            <div className='form-group'>
                                <label>{language===LANGUAGES.VI?'Lý do huỷ':'Cancellation Reason'}</label>
                                <input
                                    className='form-control'
                                    value={cancellationReason}
                                    onChange={(event)=>this.handleOnchangeInput(event,'cancellationReason')}
                                />
                            </div>
                            <p className="text-danger m-0">{errMessage}</p>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button
                            onClick={()=>this.handleConfirmCancellation(booking.id)}
                        >
                            {language === LANGUAGES.VI ? 'Xác nhận' : 'Confirm'}
                        </Button>
                        <Button color="secondary" onClick={() => this.closeCancelAppointment()}>
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
        isLoggedIn: state.user.isLoggedIn,
        language: state.app.language,
        userInfo: state.user.userInfo,
    };
};

const mapDispatchToProps = dispatch => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageNewAppointment);
