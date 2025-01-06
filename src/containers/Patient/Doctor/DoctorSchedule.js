import React, { Component } from 'react';
import { connect } from "react-redux";
import './DoctorSchedule.scss';
import moment from 'moment';
import localization from 'moment/locale/vi';
import { FormattedMessage } from 'react-intl';
import { LANGUAGES, path } from '../../../utils';
import BookingModal from '../Modal/BookingModal';
import { getScheduleDoctorByDate } from '../../../services/userService';
import { withRouter } from 'react-router';
class DoctorSchedule extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allDays: [],
            allAvailabelTime: [],
            isOpenModalBooking: false,
            dataScheduleTimeModal: {}

        }
    }
    async componentDidMount() {
        let { language } = this.props;
        let allDays = this.getArrDays(language);
        if (this.props.doctorIdFromParent) {
            let res = await getScheduleDoctorByDate(this.props.doctorIdFromParent, allDays[0].value);
            this.setState({
                allAvailabelTime: res.data ? res.data : []
            })
        }
        this.setState({
            allDays: allDays,
        });




    }
    getArrDays = (language) => {
        let allD = [];
        for (let i = 0; i < 7; i++) {
            let object = {};
            if (language === LANGUAGES.VI) {
                if (i === 0) {
                    let ddMM = moment(new Date()).format('DD/MM');
                    let today = `Hôm nay - ${ddMM}`;
                    object.label = today;
                }
                else {
                    let labelVi = moment(new Date()).add(i, 'days').format('dddd - DD/MM');
                    object.label = this.capitalizeFirstLetter(labelVi);
                }
            } else {
                if (i === 0) {
                    let ddMM = moment(new Date()).format('DD/MM');
                    let today = `Today - ${ddMM}`;
                    object.label = today;
                }
                else {
                    object.label = moment(new Date()).add(i, 'days').locale('en').format('ddd - DD/MM');
                }
            }

            object.value = moment(new Date()).add(i, 'days').startOf('day').valueOf();
            allD.push(object);
        }
        return allD;

    }
    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.language !== prevProps.language) {
            let allDays = this.getArrDays(this.props.language);
            this.setState({
                allDays: allDays
            })
        }
        if (this.props.doctorIdFromParent !== prevProps.doctorIdFromParent) {
            let allDays = this.getArrDays(this.props.language);
            let res = await getScheduleDoctorByDate(this.props.doctorIdFromParent, allDays[0].value);
            this.setState({
                allAvailabelTime: res.data ? res.data : []
            })
        }
    }
    handleOnChangeSelect = async (event) => {
        if (this.props.doctorIdFromParent && this.props.doctorIdFromParent !== -1) {
            let doctorId = this.props.doctorIdFromParent;
            let date = event.target.value;
            let res = await getScheduleDoctorByDate(doctorId, date)
            if (res && res.errCode === 0) {
                this.setState({
                    allAvailabelTime: res.data ? res.data : []
                })
            }
            let allAvailabelTime = [];
            if (res && res.errCode === 0) {
                allAvailabelTime = res.data ? res.data.map(item => ({
                    ...item,
                    enough: item.currentNumber >= item.maxNumber // Gán enough = true nếu currentNumber >= maxNumber
                })) : [];
            }

            this.setState({
                allAvailabelTime
            });
        }
    }
    capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    handleClickScheduleTime = (time) => {
        this.setState({
            isOpenModalBooking: true,
            dataScheduleTimeModal: time
        })
    }
    closeBookingClose = () => {
        this.setState({
            isOpenModalBooking: false
        })
    }
    returnScheduleTime=(item)=>{
        if(this.props.history){
            this.props.history.push(path.BOOKING.replace(':token',item.token))
        }
    }
    render() {
        let { allDays, allAvailabelTime, isOpenModalBooking, dataScheduleTimeModal } = this.state;
        let { language } = this.props;
        console.log('sfsa',allAvailabelTime)
        return (
            <>
                <div className='doctor-schedule-container'>
                    <div className='all-schedule'>
                        <select onChange={(event) => this.handleOnChangeSelect(event)}>
                            {allDays && allDays.length > 0 &&
                                allDays.map((item, index) => {
                                    return (
                                        <option
                                            value={item.value}
                                            key={index}
                                        >
                                            {item.label}
                                        </option>
                                    )
                                })}

                        </select>
                    </div>
                    <div className='all-available-time'>
                        <div className='text-calendar'>
                            <i className='fas fa-calendar-alt'><span><FormattedMessage id="patient.detail-doctor.schedule" /></span></i>
                        </div>
                        <div className='time-content'>
                            {allAvailabelTime && allAvailabelTime.length > 0 ?
                                <>
                                    <div className='time-content-btns'>
                                        {allAvailabelTime.map((item, index) => {
                                            let timeDisplay = language === LANGUAGES.VI ? item.timeTypeData.valueVi : item.timeTypeData.valueEn
                                            return (
                                                <button
                                                    key={index}
                                                    className={`${language === LANGUAGES.VI ? 'btn-vi' : 'btn-en'} ${item.currentNumber>=item.maxNumber ? 'btn-disabled' : ''}`}
                                                    // 
                                                    onClick={item.currentNumber>=item.maxNumber ? null : () => this.returnScheduleTime(item)}
                                                    disabled={item.currentNumber>=item.maxNumber} // Vô hiệu hóa nút nếu enough === true
                                                >{timeDisplay}
                                                </button>
                                            )
                                        })
                                        }
                                    </div>
                                    <div className='book-free'>
                                        <span><FormattedMessage id='patient.detail-doctor.choose' /><i className='far fa-hand-point-up'></i><FormattedMessage id='patient.detail-doctor.book-free' /></span>
                                    </div>
                                </>
                                :
                                <div className='no-schedule'><FormattedMessage id='patient.detail-doctor.no-schedule' /></div>
                            }
                        </div>
                    </div>
                </div>
                <BookingModal
                    isOpenModal={isOpenModalBooking}
                    closeBookingClose={this.closeBookingClose}
                    dataTime={dataScheduleTimeModal}

                />
            </>
        );
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(DoctorSchedule));
