import React, { Component } from 'react';
import { connect } from "react-redux";
import './ManageSchedule.scss';
import { FormattedMessage } from 'react-intl';
import Select from 'react-select';
import * as actions from '../../../store/actions';
import { CRUD_ACTIONS, LANGUAGES, dateFormat } from '../../../utils';
import DatePicker from '../../../components/Input/DatePicker';
import moment from 'moment';
import { toast } from 'react-toastify';
import _ from 'lodash';
import FormattedDate from '../../../components/Formating/FormattedDate';
import { saveScheduleByDateAndDoctorId, allScheduleByDateAndDoctorId } from '../../../services/userService';
class ManageSchedule extends Component {
    constructor(props) {
        super(props)
        this.state = {
            listDoctors: [],
            selectedDoctor: {},
            currentDate: '',
            rangeTime: [],
        }
    }
    componentDidMount() {
        this.props.fetchAllDoctors();
        this.props.fetchAllScheduleTime();
    }
    buildDataInputSelect = (inputData) => {
        let result = [];
        let { language } = this.props;
        if (inputData && inputData.length > 0) {
            inputData.map((item, index) => {
                let object = {};
                let labelVi = `${item.lastName} ${item.firstName} - ${item.email}`;
                let labelEn = `${item.firstName} ${item.lastName} - ${item.email}`;
                object.label = language === LANGUAGES.VI ? labelVi : labelEn;
                object.value = item.id;
                result.push(object);
            })
            return result;
        }
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.allDoctors !== this.props.allDoctors) {
            let dataSelect = this.buildDataInputSelect(this.props.allDoctors);
            this.setState({
                listDoctors: dataSelect
            })
        }
        if (prevProps.allScheduleTime !== this.props.allScheduleTime) {
            let data = this.props.allScheduleTime;
            if (data && data.length > 0) {
                data = data.map(item => ({ ...item, isSelected: false }))
            }
            this.setState({
                rangeTime: data
            })
        }
        if (prevProps.language !== this.props.language) {
            let dataSelect = this.buildDataInputSelect(this.props.allDoctors);
            console.log('dss', dataSelect)
            this.setState({
                listDoctors: dataSelect
            })
        }
    }
    handleChangeSelect = async (selectedOption) => {
        this.setState({ selectedDoctor: selectedOption });

    }
    handleOnChangeDatePicker = (date) => {
        this.setState({
            currentDate: date[0],

        })
    }
    handleClickBtnTime = (time) => {
        let { rangeTime } = this.state;
        if (rangeTime && rangeTime.length > 0) {

            rangeTime = rangeTime.map(item => {
                if (item.id === time.id) item.isSelected = !item.isSelected;
                return item;
            })
        }
        this.setState({
            rangeTime: rangeTime
        })
    }
    handleSaveSchedule = async () => {
        let result = [];
        let { rangeTime, selectedDoctor, currentDate } = this.state;
        if (!currentDate) {
            toast.error("Invalid date!");
            return;
        }
        if (!selectedDoctor && _.isEmpty(selectedDoctor)) {
            toast.error("Invalid selected doctor!");
            return;
        }
        let formatedDate = new Date(currentDate).getTime();
        if (rangeTime && rangeTime.length > 0) {
            let selectedTime = rangeTime.filter(item => item.isSelected === true);
            if (selectedTime && selectedTime.length > 0) {
                selectedTime.map(schedule => {
                    let object = {};
                    object.date = formatedDate;
                    object.timeType = schedule.keyMap;
                    result.push(object);
                })

            } else {
                toast.error("Invalid selected time!");
                return;
            }
        }
        let res = await saveScheduleByDateAndDoctorId({
            arrSchedule: result,
            doctorId: selectedDoctor.value,
            date: formatedDate
        },this.props.userInfo.token)
        if (res && res.errCode === 0) {
            toast.success("Save Infor Succeed!")
            let listTime = this.state.rangeTime.map((item) => {
                return {
                    ...item,
                    isSelected: false,
                };
            });
            this.setState({
                currentDate:'',
                selectedDoctor:{},
                rangeTime: listTime,
            })
        } else {
            toast.error("error saveBulkScheduleDoctor")
        }
    }
    handleSearch = async () => {
        let { selectedDoctor, currentDate } = this.state;
        let res = await allScheduleByDateAndDoctorId({
            doctorId: selectedDoctor.value,
            date: new Date(currentDate).getTime()
        }, this.props.userInfo.token)
        if (res && res.errCode === 0) {
            let listSchedule = res.data;
            let updatedRangeTime = this.state.rangeTime.map((item) => {
                let matched = listSchedule.some(schedule => schedule.timeType === item.keyMap);
                return {
                    ...item,
                    isSelected: matched,
                };
            });

            this.setState({
                rangeTime: updatedRangeTime,
            });
        }
    }
    render() {
        let { rangeTime } = this.state;
        let { language } = this.props;
        let yesterday = new Date(new Date().setDate(new Date().getDate() - 1))
        return (
            <div className='manage-schedule-container'>
                <div className='m-s-title'>
                    <FormattedMessage id="manage-schedule.title" />
                </div>
                <div className='container'>
                    <div className='row'>
                        <div className='col-6 form-group'>
                            <label><FormattedMessage id="manage-schedule.choose-doctor" /></label>
                            <Select
                                value={this.state.selectedDoctor}
                                onChange={this.handleChangeSelect}
                                options={this.state.listDoctors}

                            />
                        </div>
                        <div className='col-4 form-group'>
                            <label><FormattedMessage id="manage-schedule.choose-date" /></label>
                            <DatePicker
                                onChange={this.handleOnChangeDatePicker}
                                className='form-control'
                                selected={this.state.currentDate}
                                minDate={yesterday}
                            />
                        </div>
                        <div className='col-2 form-group'>
                            <label className='text-white'>.</label>
                            <button className='btn btn-primary form-control'
                                onClick={() => this.handleSearch()}
                            >
                                Search
                            </button>
                        </div>
                        <div className='col-12 pick-hour-container'>
                            {rangeTime && rangeTime.length > 0 &&
                                rangeTime.map((item, index) => {
                                    return (
                                        <button
                                            className={item.isSelected === true ? 'btn btn-schedule active' : 'btn btn-schedule'}
                                            key={index}
                                            onClick={() => this.handleClickBtnTime(item)}
                                        >
                                            {language === LANGUAGES.VI ? item.valueVi : item.valueEn}
                                        </button>
                                    )
                                })}
                        </div>
                        <div className='col-12'>
                            <button className='btn btn-primary btn-save-schedule'
                                onClick={() => this.handleSaveSchedule()}>
                                <FormattedMessage id="manage-schedule.save" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        allDoctors: state.admin.allDoctors,
        language: state.app.language,
        allScheduleTime: state.admin.allScheduleTime,
        userInfo: state.user.userInfo,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchAllDoctors: () => dispatch(actions.fetchAllDoctors()),
        fetchAllScheduleTime: () => dispatch(actions.fetchAllScheduleTime()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageSchedule);
