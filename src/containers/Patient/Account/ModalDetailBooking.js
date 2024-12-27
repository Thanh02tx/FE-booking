import React, { Component } from 'react';
import { connect } from "react-redux";
import { FormattedMessage } from 'react-intl';
import { LANGUAGES } from '../../../utils';
import moment from 'moment';
import './ModalDetailBooking.scss';
import { getBookingById } from '../../../services/userService';
import { Modal, ModalBody, ModalHeader, Button, ModalFooter } from 'reactstrap';
import { toast } from 'react-toastify';
class ModalDetailBooking extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataBooking: {}
        }
    }
    async componentDidMount() {
        let { userInfo, idBooking } = this.props
        if (userInfo && userInfo.token && idBooking) {
            let res = await getBookingById(idBooking, userInfo.token)
            if (res && res.errCode === 0) {
                this.setState({
                    dataBooking: res.data
                })
            }
        }
    }
    async componentDidUpdate(prevProps, prevState, snaphot) {
        if (!prevProps.idBooking && this.props.idBooking) {
            let { userInfo, idBooking } = this.props
            if (userInfo && userInfo.token && idBooking) {
                let res = await getBookingById(idBooking, userInfo.token)
                if (res && res.errCode === 0) {
                    this.setState({
                        dataBooking: res.data
                    })
                }
            }
        }
    }

    render() {
        let { isOpenModalDetailBooking, closeDetailBookingModal, language,hideCancel } = this.props
        let { dataBooking } = this.state;
        let nameClinic = dataBooking && dataBooking.Schedule ? dataBooking.Schedule.doctorData.Doctor_Infor.Clinic.name : '';
        let addressClinic = dataBooking && dataBooking.Schedule ? dataBooking.Schedule.doctorData.Doctor_Infor.Clinic.address : '';
        let nameVi = dataBooking && dataBooking.Schedule ? `${dataBooking.Schedule.doctorData.Doctor_Infor.positionData.valueVi} ${dataBooking.Schedule.doctorData.lastName} ${dataBooking.Schedule.doctorData.firstName}` : '';
        let nameEn = dataBooking && dataBooking.Schedule ? `${dataBooking.Schedule.doctorData.Doctor_Infor.positionData.valueEn} ${dataBooking.Schedule.doctorData.firstName} ${dataBooking.Schedule.doctorData.lastName}` : '';
        let timeVi = dataBooking && dataBooking.Schedule ? dataBooking.Schedule.timeTypeData.valueVi : '';
        let timeEn = dataBooking && dataBooking.Schedule ? dataBooking.Schedule.timeTypeData.valueEn : '';
        let speVi = dataBooking && dataBooking.Schedule ? dataBooking.Schedule.doctorData.Doctor_Infor.Specialty.nameVi : '';
        let speEn = dataBooking && dataBooking.Schedule ? dataBooking.Schedule.doctorData.Doctor_Infor.Specialty.nameEn : '';
        let date = dataBooking && dataBooking.Schedule ? moment(new Date(Number(dataBooking.Schedule.date)).getTime()).locale('vi').format('DD/MM/YYYY') : ''
        let reason = dataBooking ? dataBooking.reason : '';
        console.log('sfss', dataBooking)
        return (
            <Modal
                isOpen={isOpenModalDetailBooking}
                className="modal-feedback-container"
                size="md"
                centered
            >
                <div className="modal-header">
                    <h5 className="modal-title">Thông tin lịch hẹn</h5>
                    <button
                        type="button"
                        className="close"
                        onClick={closeDetailBookingModal}
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
                        <div>
                            <p className='m-0'>{language === LANGUAGES.VI ? `Bác sĩ: ${nameVi}` : `Doctor: ${nameEn}`}</p>
                            <p className='m-0'>{language === LANGUAGES.VI ? `Chuyên khoa: ${speVi}` : `Specialty: ${speEn}`}</p>
                            <p className='m-0'>{language === LANGUAGES.VI ? `Thời gian: ${timeVi} - ${date}` : `Appointment Time: ${timeEn} - ${date} `}</p>
                            <p className='mb-4'>{language === LANGUAGES.VI ? 'Lý do: ' : 'Reason: '} {reason}</p>
                            {!hideCancel &&
                                <>
                                    <p className='m-0 text-center'>{language === LANGUAGES.VI ? 'Vui lòng đảm bảo đến đúng giờ theo lịch hẹn của bạn' : 'Please make sure to attend your appointment on time.'}</p>
                                    <p className='text-center m-0'><i>{language === LANGUAGES.VI ? '(Nếu bạn muốn hủy lịch hẹn, vui lòng liên hệ: xxxxxxxxxxx)' : '(If you wish to cancel your appointment, please contact: xxxxxxxxxxx)'}</i></p>
                                </>
                            }

                        </div>

                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button color="secondary" onClick={closeDetailBookingModal}>
                        {language === LANGUAGES.VI ? 'Đóng' : 'Close'}
                    </Button>
                </ModalFooter>
            </Modal>
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

export default connect(mapStateToProps, mapDispatchToProps)(ModalDetailBooking);
