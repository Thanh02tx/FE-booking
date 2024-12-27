import React, { Component } from 'react';
import { connect } from "react-redux";
import { FormattedMessage } from 'react-intl';
import { LANGUAGES, path } from '../../../utils';
import NumberFormat from 'react-number-format';
import HomeHeader from '../../HomePage/HomeHeader';
import NoAccessPage from '../../Auth/NoAccessPage';
import moment from 'moment';
import Select from 'react-select';
import { getAllPatientRecord, getAllBookingByPatientId, putPatientFeedback } from '../../../services/userService';
import './MedicalHistory.scss';
import localization from 'moment/locale/vi';
import ModalFeedback from './ModalFeedback';
import { toast } from 'react-toastify';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';
import ModalDetailBooking from './ModalDetailBooking';

class MedicalHistory extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listPatientApi: [],
            listPatient: [],
            selectedPatient: '',
            listBooking: {},
            idHistory: '',
            idBooking:'',
            isOpenModalFeedback: false,
            isOpenModalDetailBooking:false,
            isLightboxOpen: false,
            lightboxImage: '', // Image URL for Lightbox,
            image: ''
        }
    }

    async componentDidMount() {
        let { userInfo } = this.props;
        if (userInfo && userInfo.token) {
            let res = await getAllPatientRecord(userInfo.token);
            if (res && res.errCode == 0) {
                this.setState({
                    listPatientApi: res.data
                }, () => {
                    let listPatient = this.buildDataPatient(this.state.listPatientApi);
                    this.setState({
                        listPatient: listPatient
                    })
                })
            }
        }
    }

    buildDataPatient = (data) => {
        let result = [];
        let { language } = this.props
        data.map((item) => {
            let obj = {}
            let name = language === LANGUAGES.VI ? `${item.lastName} ${item.firstName}` : `${item.firstName} ${item.lastName}`;
            let rel = language === LANGUAGES.VI ? item.relationshipTypeData.valueVi : item.relationshipTypeData.valueEn;
            let age = language === LANGUAGES.VI ? `${this.calculateAge(item.dateOfBirth)} Tuổi` : `${this.calculateAge(item.dateOfBirth)} Age`
            obj.value = item.id;
            obj.label = `${name} - ${rel} - ${age}`
            result.push(obj)
        })
        return result
    }

    handleChangeSelect = async (selected) => {
        this.setState({
            selectedPatient: selected
        })
        let res = await getAllBookingByPatientId(selected.value, this.props.userInfo.token)
        if (res && res.errCode === 0) {
            this.setState({
                listBooking: res.data
            })
        }
    }

    handlePatientFeedback = async (dataChild) => {
        let res = await putPatientFeedback({
            ...dataChild
        }, this.props.userInfo.token)
        if (res && res.errCode === 0) {
            this.closeFeedbackModal();
            toast.success('succed')
            let resBk = await getAllBookingByPatientId(this.state.selectedPatient.value, this.props.userInfo.token)
            if (resBk && resBk.errCode === 0) {
                this.setState({
                    listBooking: resBk.data
                })
            }
        } else {
            toast.error('error')
        }
    }

    calculateAge = (dateOfBirthTimestamp) => {
        let birthDate = new Date(Number(dateOfBirthTimestamp));
        let currentYear = new Date().getFullYear(); // Lấy năm hiện tại
        let birthYear = birthDate.getFullYear(); // Lấy năm sinh
        return currentYear - birthYear; // Tính tuổi
    };

    async componentDidUpdate(prevProps, prevState, snaphot) {
        if (this.props.language != prevProps.language) {
            let listPatient = this.buildDataPatient(this.state.listPatientApi);
            this.setState({
                listPatient: listPatient
            })
        }
        if (this.props.userInfo != prevProps.userInfo) {
            let { userInfo } = this.props;
            if (userInfo && userInfo.token) {
                let res = await getAllPatientRecord(userInfo.token);
                if (res && res.errCode == 0) {
                    this.setState({
                        listPatientApi: res.data
                    }, () => {
                        let listPatient = this.buildDataPatient(this.state.listPatientApi);
                        this.setState({
                            listPatient: listPatient
                        })
                    })
                }
            }
        }
    }

    handleBtnFeedback = (id) => {
        this.setState({
            idHistory: id,
            isOpenModalFeedback: true,
        })
    }

    closeFeedbackModal = () => {
        this.setState({
            isOpenModalFeedback: false,
            idHistory: ''
        })
    }
    closeDetailBookingModal=()=>{
        this.setState({
            isOpenModalDetailBooking:false,
            idBooking:''
        })
    }
    returnHome = () => {
        this.props.history.push(path.HOMEPAGE)
    }
    handleViewResult = (image) => {
        let imageBase64 = Buffer.from(image, 'binary').toString('base64');
        let img = new Buffer(imageBase64, 'base64').toString('binary');
        // Cập nhật state
        this.setState({
            lightboxImage: img,
            isLightboxOpen: true,
        });
    };

    handleBtnViewAppointment=(id)=>{
        this.setState({
            idBooking:id,
            isOpenModalDetailBooking:true
        })
    }


    render() {
        let { isLoggedIn, language } = this.props;
        let { listPatient, listBooking, isOpenModalFeedback, idHistory,idBooking,isOpenModalDetailBooking, isLightboxOpen, lightboxImage, image } = this.state;
        console.log('errdda', listBooking)
        return (
            <div className='history-mediacal-container'>
                <HomeHeader />
                {!isLoggedIn ?
                    <NoAccessPage />
                    :
                    <div className='content'>
                        <p className='m-0 nav'>
                            <i
                                className="fas fa-home"
                                onClick={() => this.returnHome()}
                            ></i>
                            <span> /{language === LANGUAGES.VI ? 'Lịch sử khám bênh' : 'Medical history'}</span>
                        </p>
                        <label>Chọn Hồ sơ </label>
                        <Select
                            value={this.state.selectedPatient}
                            onChange={this.handleChangeSelect}
                            options={listPatient}
                        />
                        <div className='mt-3 list-booking'>
                            {listBooking && listBooking.Bookings &&
                                <>
                                    {listBooking.Bookings.length > 0 ?
                                        listBooking.Bookings.map((item, index) => {
                                            let date =item.Schedule? moment(new Date(Number(item.Schedule.date)).getTime()).locale('vi').format('DD/MM/YYYY'):'';
                                            let specicalty =item.Schedule? item.Schedule.doctorData.Doctor_Infor.Specialty:''
                                            return (
                                                <div className='child p-2' key={`booking-${index}`}>
                                                    <div className='status'>
                                                        <i>{language === LANGUAGES.VI ? item.statusData.valueVi : item.statusData.valueEn}</i>
                                                        <i>{item.History&&item.History.status === 2 && language === LANGUAGES.VI ? '-Đã đánh giá' : ''}</i>
                                                        <i>{item.History&&item.History.status === 2 && language === LANGUAGES.EN ? '-Reviewed' : ''}</i>
                                                    </div>
                                                    <p className='mb-0'>{item.Schedule?item.Schedule.doctorData.Doctor_Infor.Clinic.name:''}</p>
                                                    <p className='mb-0'>{language===LANGUAGES.VI?`Chuyên khoa: ${specicalty.nameVi}`:specicalty.nameEn}</p>
                                                    <p className='mb-0'>{date}</p>
                                                    <div className='mt-2'>
                                                        {item.History&&item.statusId === 'S4' &&
                                                            <button className='mr-2'
                                                                onClick={() => this.handleViewResult(item.History.imageResult)}
                                                            >
                                                                {language===LANGUAGES.VI?'Kết quả':'Results'}
                                                            </button>
                                                        }
                                                        {item.History&&item.History.status === 1 &&
                                                            <button
                                                                onClick={() => this.handleBtnFeedback(item.History.id)}
                                                            >
                                                                {language===LANGUAGES.VI?'Đánh giá':'Feedback'}
                                                            </button>
                                                        }
                                                        {item.statusId&&(item.statusId==='S2'||item.statusId==='S3')&&
                                                            <button 
                                                                onClick={()=>this.handleBtnViewAppointment(item.id)}
                                                            >
                                                                {language===LANGUAGES.VI?'Xem chi tiết':'Details'}
                                                            </button>
                                                        }
                                                    </div>
                                                </div>
                                            )
                                        })
                                        : <>{language===LANGUAGES.VI?'Chưa có lịch hẹn':'No appointments available'}</>
                                    }
                                </>
                            }
                        </div>
                        {image &&
                            <div style={{ height: '1000px', width: '100%', backgroundImage: `url(${image})` }}>
                            </div>}
                    </div>
                }

                <ModalFeedback
                    isOpenModal={isOpenModalFeedback}
                    idHistory={idHistory}
                    closeFeedbackModal={this.closeFeedbackModal}
                    handlePatientFeedback={this.handlePatientFeedback}
                />
                <ModalDetailBooking
                    idBooking={idBooking}
                    isOpenModalDetailBooking={isOpenModalDetailBooking}
                    closeDetailBookingModal={this.closeDetailBookingModal}
                    hideCancel={false}
                    // handlePatientFeedback={this.handlePatientFeedback}
                />
                {/* Lightbox for Image */}
                {isLightboxOpen && (
                    <Lightbox
                        mainSrc={lightboxImage}
                        onCloseRequest={() => this.setState({ isLightboxOpen: false })}
                    />

                )}
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        userInfo: state.user.userInfo,
        isLoggedIn: state.user.isLoggedIn,
    };
};

const mapDispatchToProps = dispatch => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(MedicalHistory);
