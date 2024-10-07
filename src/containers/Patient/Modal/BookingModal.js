import React, { Component } from 'react';
import { connect } from "react-redux";
import './BookingModal.scss';
import { FormattedMessage } from 'react-intl';
import { LANGUAGES } from '../../../utils';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import ProfileDoctor from '../Doctor/ProfileDoctor';
import _ from 'lodash';
import * as actions from '../../../store/actions';
import Select from 'react-select';
import { toast } from 'react-toastify';
import moment from 'moment';
import { postPatientBookAppointment } from '../../../services/userService';

class BookingModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            firstName: '',
            lastName: "",
            phoneNumber: '',
            email: '',
            address: '',
            reason: '',
            date: '',
            selectedGender: '',
            doctorId: '',
            timeType: '',
            genders: []
        }
    }
    async componentDidMount() {
        this.props.getGender()

    }
    builDataGender = (data) => {
        let language = this.props.language;
        let result = [];
        if (data && data.length > 0) {
            data.map(item => {
                let object = {};
                object.label = language === LANGUAGES.VI ? item.valueVi : item.valueEn;
                object.value = item.keyMap;
                result.push(object)
            })
        }
        return result;
    }
    async componentDidUpdate(prevProps, prevState, snaphot) {
        if (this.props.language !== prevProps.language) {
            this.setState({
                genders: this.builDataGender(this.props.genders)
            })
        }
        if (this.props.genders !== prevProps.genders) {
            this.setState({
                genders: this.builDataGender(this.props.genders)
            })
        }
        if (this.props.dataTime !== prevProps.dataTime) {
            if (this.props.dataTime && !_.isEmpty(this.props.dataTime)) {
                this.setState({
                    doctorId: this.props.dataTime.doctorId,
                    date: this.props.dataTime.date,
                    timeType: this.props.dataTime.timeType
                })
            }
        }
    }
    handleOnchangeInput = (event, id) => {
        let valueInput = event.target.value;
        let copyState = { ...this.state };
        copyState[id] = valueInput;
        this.setState({
            ...copyState
        })

    }
    handleChangeSelect = (selectedOption) => {
        this.setState({
            selectedGender: selectedOption
        })
    }
    buildDoctorName = (dataTime) => {
        let {language}= this.props;
        if (dataTime && !_.isEmpty(dataTime)) {
            let name = language ===LANGUAGES.VI ? `${dataTime.doctorData.firstName} ${dataTime.doctorData.lastName}` :
            `${dataTime.doctorData.lastName} ${dataTime.doctorData.firstName}`
        
            return name;
        }
        return '';
    }
    buildTimeBooking = (dataTime) => {
        let {language}= this.props;
        if (dataTime && !_.isEmpty(dataTime)) {
            let time = language ===LANGUAGES.VI ? dataTime.timeTypeData.valueVi : dataTime.timeTypeData.valueEn
            let date = language===LANGUAGES.VI ? moment.unix(dataTime.date/1000).format('dddd - DD/MM/YYYY')
            :moment.unix(dataTime.date/1000).locale('en').format('ddd - MM/DD/YYYY')
            return `${time} - ${date}`
        }
        return '';
    }
    handleConfirmBooking = async () => {
        let timeString= this.buildTimeBooking(this.props.dataTime);
        let doctorName= this.buildDoctorName(this.props.dataTime);
        let res = await postPatientBookAppointment({
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            phoneNumber: this.state.phoneNumber,
            email: this.state.email,
            address: this.state.address,
            reason: this.state.reason,
            date: this.state.date,
            selectedGender: this.state.selectedGender.value,
            doctorId: this.state.doctorId,
            timeType: this.state.timeType,
            language:this.props.language,
            timeString:timeString,
            doctorName:doctorName

        })
        if (res && res.errCode === 0) {
            toast.success("Booking a new appointment succeed!");
            this.props.closeBookingClose();
        }
        else {
            toast.error("Booking a new appointment error!")
        }
    }
    render() {
        let { isOpenModal, closeBookingClose, dataTime } = this.props;
        let doctorId = dataTime && !_.isEmpty(dataTime) ? dataTime.doctorId : '';
        console.log('dff', this.state, this.props)
        return (
            <Modal
                isOpen={isOpenModal}
                className='booking-modal-container'
                size='lg'
                centered
            >
                <div className='booking-modal-content'>
                    <div className='booking-modal-header'>
                        <span className='left'><FormattedMessage id="patient.booking-modal.title" /></span>
                        <span className='right'
                            onClick={closeBookingClose}
                        ><i className='fas fa-times'></i>
                        </span>
                    </div>
                    <div className='booking-modal-body'>
                        <div className='doctor-infor'>
                            <ProfileDoctor
                                doctorId={doctorId}
                                isShowDescription={false}
                                dataTime={dataTime}
                                isShowLinkDetail={false}
                                isShowPrice={true}
                            />
                        </div>

                        <div className='row'>
                            <div className='col-6 form-group'>
                                <label><FormattedMessage id="patient.booking-modal.firstName" /></label>
                                <input className='form-control'
                                    value={this.state.firstName}
                                    onChange={(event) => this.handleOnchangeInput(event, 'firstName')}
                                />
                            </div>
                            <div className='col-6 form-group'>
                                <label><FormattedMessage id="patient.booking-modal.lastName" /></label>
                                <input className='form-control'
                                    value={this.state.lastName}
                                    onChange={(event) => this.handleOnchangeInput(event, 'lastName')}
                                />
                            </div>
                            <div className='col-6 form-group'>
                                <label><FormattedMessage id="patient.booking-modal.phoneNumber" /></label>
                                <input className='form-control'
                                    value={this.state.phoneNumber}
                                    onChange={(event) => this.handleOnchangeInput(event, 'phoneNumber')}
                                />
                            </div>
                            <div className='col-6 form-group'>
                                <label><FormattedMessage id="patient.booking-modal.email" /></label>
                                <input className='form-control'
                                    value={this.state.email}
                                    onChange={(event) => this.handleOnchangeInput(event, 'email')}
                                />
                            </div>
                            <div className='col-6 form-group'>
                                <label><FormattedMessage id="patient.booking-modal.address" /></label>
                                <input className='form-control'
                                    value={this.state.address}
                                    onChange={(event) => this.handleOnchangeInput(event, 'address')}
                                />
                            </div>
                            <div className='col-6 form-group'>
                                <label><FormattedMessage id="patient.booking-modal.gender" /></label>
                                <Select
                                    value={this.state.selectedGender}
                                    onChange={this.handleChangeSelect}
                                    options={this.state.genders}
                                />
                            </div>
                            <div className='col-12 form-group'>
                                <label><FormattedMessage id="patient.booking-modal.reason" /></label>
                                <input className='form-control'
                                    value={this.state.reason}
                                    onChange={(event) => this.handleOnchangeInput(event, 'reason')}
                                />
                            </div>


                        </div>
                    </div>
                    <div className='booking-modal-footer'>
                        <button
                            className='btn-booking-confirm'
                            onClick={() => this.handleConfirmBooking()}
                        ><FormattedMessage id="patient.booking-modal.btnConfirm" />
                        </button>
                        <button
                            className='btn-booking-cancel'
                            onClick={closeBookingClose}
                        ><FormattedMessage id="patient.booking-modal.btnCancel" />
                        </button>
                    </div>
                </div>

            </Modal>
        );
    }

}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        genders: state.admin.genders,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getGender: () => dispatch(actions.fetchGenderStart())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(BookingModal);
