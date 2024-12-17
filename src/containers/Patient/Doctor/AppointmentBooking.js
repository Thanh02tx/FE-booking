import React, { Component } from 'react';
import { connect } from "react-redux";
import './AppointmentBooking.scss';
import { FormattedMessage } from 'react-intl';
import { LANGUAGES } from '../../../utils';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import ProfileDoctor from '../Doctor/ProfileDoctor';
import _, { times } from 'lodash';
import * as actions from '../../../store/actions';
import { toast } from 'react-toastify';
import moment, { lang } from 'moment';
import Select from 'react-select';
import { withRouter } from 'react-router';
import HomeHeader from '../../HomePage/HomeHeader';
import HomeFooter from '../../HomePage/HomeFooter';
import DatePicker from '../../../components/Input/DatePicker';
import { getScheduleByToken, getAllProvinceJson, getAllDistrictJson, getAllWardJson, postPatientBookAppointment, getAllPatientRecord, postBookAppointmentNoSignIn } from '../../../services/userService';
class AppointmentBooking extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listPatient: [],
            selectedPatient: '',
            dataTime: {},
            listProvinceVn: [],
            listProvince: [],
            listDistrictVn: [],
            listDistrict: [],
            listWardVn: [],
            listWard: [],
            province: '',
            district: '',
            ward: '',
            firstName: '',
            lastName: "",
            phoneNumber: '',
            email: '',
            dateOfBirth: '',
            address: '',
            bhyt: '',
            reason: '',
            selectedGender: '',
            doctorId: '',
            genders: [],
            errMessage: '',
            reasonSignIn: '',
            showModal: false,
            book_ok: true,
            errMesSignIn: ''
        }
    }
    async componentDidMount() {
        if (this.props.match && this.props.match.params && this.props.match.params.token) {
            let res = await getScheduleByToken(this.props.match.params.token)
            if (res && res.errCode == 0) {
                this.setState({
                    dataTime: res.data
                })
            }
        }
        let { user } = this.props;
        if (user && user.token) {
            let res = await getAllPatientRecord(user.token)
            if (res && res.errCode === 0) {
                this.setState({
                    listPatient: res.data
                })

            }

        }
        this.props.getGender()
        let res = await getAllProvinceJson();
        if (res.errCode == 0) {
            this.setState({
                listProvinceVn: res.data,
                listProvince: this.buildData(res.data)
            })
        }


    }
    buildData = (data) => {
        let { language } = this.props;
        let result = data.map((item) => {
            return {
                value: item.id,
                label: language === LANGUAGES.VI ? item.full_name : item.full_name_en
            };
        });

        return result;
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
                listProvince: this.buildData(this.state.listProvinceVn),
                listDistrict: this.buildData(this.state.listDistrictVn),
                listWard: this.buildData(this.state.listWardVn)
            })
        }
        if (this.props.genders !== prevProps.genders) {
            this.setState({
                genders: this.builDataGender(this.props.genders)
            })
        }
        if (this.props.user !== prevProps.user) {
            if (this.props.user&&this.props.user.token) {
                let res = await getAllPatientRecord(this.props.user.token)
                if (res && res.errCode === 0) {
                    this.setState({
                        listPatient: res.data
                    })
                }
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
    handleOnChangeDatePicker = (date) => {
        this.setState({
            dateOfBirth: date[0],
        })
    }
    handleChangeSelect = (selectedOption) => {
        this.setState({
            selectedGender: selectedOption
        })
    }
    buildTimeBooking = (dataTime) => {
        let { language } = this.props;
        if (dataTime && !_.isEmpty(dataTime)) {
            let time = language === LANGUAGES.VI ? dataTime.timeTypeData.valueVi : dataTime.timeTypeData.valueEn
            let date = language === LANGUAGES.VI ? moment.unix(dataTime.date / 1000).format('dddd - DD/MM/YYYY')
                : moment.unix(dataTime.date / 1000).locale('en').format('ddd - MM/DD/YYYY')
            return `${time} - ${date}`
        }
        return '';
    }
    buildDoctorName = (dataTime) => {
        let { language } = this.props;
        if (dataTime && !_.isEmpty(dataTime)) {
            let name = language === LANGUAGES.VI ? `${dataTime.doctorData.firstName} ${dataTime.doctorData.lastName}` :
                `${dataTime.doctorData.lastName} ${dataTime.doctorData.firstName}`

            return name;
        }
        return '';
    }
    handleBookingNoSignIn = async () => {
        this.setState({
            errMessage: ''
        })
        let mes = ''

        let { dataTime, firstName, lastName, phoneNumber, email, bhyt, province,
            district, ward, address, selectedGender, reason, dateOfBirth } = this.state
        let timeString = this.buildTimeBooking(dataTime);
        let doctorName = this.buildDoctorName(dataTime);
        let { language } = this.props;
        if (!firstName || !lastName || !phoneNumber || !email || !province || !district || !address || !selectedGender || !reason) {
            if (language === LANGUAGES.VI) {
                mes = 'Vui lòng nhập đầy đủ thông tin.'
            } else {
                mes = 'Please enter all required information.'
            }
        }

        let res = await postBookAppointmentNoSignIn({
            firstName: firstName,
            lastName: lastName,
            phoneNumber: phoneNumber,
            email: email,
            bhyt: bhyt,
            province: province.value,
            district: district.value,
            dateOfBirth: new Date(dateOfBirth).getTime(),
            ward: ward ? ward.value : '',
            gender: selectedGender.value,
            address: address,
            reason: reason,
            schedule: dataTime,
            language: language,
            timeString: timeString,
            doctorName: doctorName

        })
        if (res && (res.errCode === 0 || res.errCode === 2)) {
            this.setState({
                firstName: '',
                lastName: '',
                phoneNumber: '',
                email: '',
                bhyt: '',
                province: '',
                district: '',
                ward: '',
                address: '',
                selectedGender: '',
                reason: '',
                dateOfBirth: '',
            })
            if (res.errCode === 0) {
                this.setState({
                    showModal: true,
                    book_ok: true,
                })
                toast.success("Booking a new appointment succed!")
            } else {
                this.setState({
                    showModal: true,
                    book_ok: false,
                })
                toast.error("Booking a new appointment error!")
            }
        }
        else {
            toast.error("Booking a new appointment error!")
        }
    }
    HandleBookAppointment = async () => {
        this.setState({
            errMesSignIn: ''
        })
        let message = '';

        let { dataTime, reasonSignIn, selectedPatient } = this.state;
        let { language } = this.props;
        if (!selectedPatient) {
            message = language === LANGUAGES.VI ? 'Vui lòng chọn người khám.' : 'Please select a patient to book an appointment.'
        }
        else {
            if (!reasonSignIn) {
                message = language === LANGUAGES.VI ? 'Vui lòng điền lý do khám.' : 'Please provide a reason for the appointment.'
            }
            else {
                let res = await postPatientBookAppointment({
                    reason: reasonSignIn,
                    schedule: dataTime,
                    patientId: selectedPatient.id
                })
                console.log('é', res)
                if (res && res.errCode === 0) {
                    toast.success('succed')
                    this.setState({
                        reasonSignIn: '',
                        selectedPatient: ''
                    })
                } else {
                    toast.error("error")
                }
            }
        }

        this.setState({
            errMesSignIn: message
        })
    }

    handleChangeSelectProvince = async (selectedOption) => {
        this.setState(
            {
                province: selectedOption,
                district: '',
                ward: ''
            },
            async () => {
                let res = await getAllDistrictJson(this.state.province.value);
                if (res && res.errCode === 0) {
                    this.setState({
                        listDistrictVn: res.data,
                        listDistrict: this.buildData(res.data)
                    });
                }
            }
        );
    };
    handleChangeSelectDistrict = async (selectedOption) => {
        this.setState(
            {
                district: selectedOption,
                ward: ''
            },
            async () => {
                let res = await getAllWardJson(this.state.district.value);
                if (res && res.errCode === 0) {
                    this.setState({
                        listWardVn: res.data,
                        listWard: this.buildData(res.data)
                    });
                }
            }
        );
    };

    handleChangeSelectWard = (selectedOption) => {
        this.setState({
            ward: selectedOption
        })
    }
    calculateAge = (dateOfBirthTimestamp) => {
        let birthDate = new Date(Number(dateOfBirthTimestamp));
        let currentYear = new Date().getFullYear(); // Lấy năm hiện tại
        let birthYear = birthDate.getFullYear(); // Lấy năm sinh
        return currentYear - birthYear; // Tính tuổi
    };
    toggle = () => {
        this.setState({
            showModal: false
        })
    }
    handleRadioChange = (patient) => {
        this.setState({ selectedPatient: patient });
    };
    render() {
        let { dataTime, listProvince, listDistrict, listWard, showModal, book_ok, listPatient, selectedPatient, errMesSignIn } = this.state;
        let { isLoggedIn, language } = this.props;
        let doctorId = dataTime && !_.isEmpty(dataTime) ? dataTime.doctorId : '';
        return (
            <div className='appointment-booking-container'>
                <HomeHeader />
                <div className='profile-dt'>
                    <ProfileDoctor
                        doctorId={doctorId}
                        isShowDescription={false}
                        dataTime={dataTime}
                        isShowLinkDetail={false}
                        isShowPrice={true}
                    />
                </div>
                <div className='content-booking '>
                    {!isLoggedIn ?
                        <>
                            <h5>Đặt lịch khám không cần đăng nhập</h5>
                            <p>Nếu muốn lưu lại thông tin khám bệnh bạn nên đăng nhập</p>
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
                                    <label>phone
                                        {/* <FormattedMessage id="patient.booking-modal.phoneNumber" /> */}
                                    </label>
                                    <input className='form-control'
                                        value={this.state.phoneNumber}
                                        onChange={(event) => this.handleOnchangeInput(event, 'phoneNumber')}
                                    />
                                </div><div className='col-6 form-group'>
                                    <label>date Of Birth
                                        {/* <FormattedMessage id="patient.booking-modal.phoneNumber" /> */}
                                    </label>
                                    <DatePicker
                                        onChange={this.handleOnChangeDatePicker}
                                        className='form-control'
                                        value={this.state.dateOfBirth}
                                        maxDate={new Date()}
                                    />
                                </div>
                                <div className='col-6 form-group'>
                                    <label><FormattedMessage id="patient.booking-modal.email" /></label>
                                    <input className='form-control'
                                        type='email'
                                        value={this.state.email}
                                        onChange={(event) => this.handleOnchangeInput(event, 'email')}
                                    />
                                </div>
                                <div className='col-6 form-group'>
                                    <label>Mã BHYT
                                        {/* <FormattedMessage id="patient.booking-modal.phoneNumber" /> */}
                                    </label>
                                    <input className='form-control'
                                        value={this.state.bhyt}
                                        pattern="^\d{10}$"
                                        type='text'
                                        onChange={(event) => this.handleOnchangeInput(event, 'bhyt')}
                                    />
                                </div>
                                <div className='col-4 form-group'>
                                    <label>Tỉnh thành
                                        {/* <FormattedMessage id="patient.booking-modal.gender" /> */}
                                    </label>
                                    <Select
                                        value={this.state.province}
                                        onChange={this.handleChangeSelectProvince}
                                        options={listProvince}
                                    />
                                </div>
                                <div className='col-4 form-group'>
                                    <label>Quận huyện
                                        {/* <FormattedMessage id="patient.booking-modal.gender" /> */}
                                    </label>
                                    <Select
                                        value={this.state.district}
                                        onChange={this.handleChangeSelectDistrict}
                                        options={listDistrict}
                                    />
                                </div>
                                <div className='col-4 form-group'>
                                    <label>Xã phường
                                        {/* <FormattedMessage id="patient.booking-modal.gender" /> */}
                                    </label>
                                    <Select
                                        value={this.state.ward}
                                        onChange={this.handleChangeSelectWard}
                                        options={listWard}
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

                                <div className='col-12'>
                                    <button
                                        onClick={() => this.handleBookingNoSignIn()}
                                        className='btn btn-success my-2'
                                    >
                                        Đặt lịch
                                    </button>
                                </div>

                            </div>
                        </>
                        :
                        <div className=' pt-3 '>

                            <div className='d-flex flex-wrap'>
                                {listPatient.length > 0 && listPatient.map((item, index) => {
                                    let nameVi = `${item.lastName} ${item.firstName}`;
                                    let nameEn = `${item.firstName} ${item.lastName}`;
                                    let rel = language === LANGUAGES.VI ? item.relationshipTypeData.valueVi : item.relationshipTypeData.valueEn;
                                    let age = language === LANGUAGES.VI ? `${this.calculateAge(item.dateOfBirth)} Tuổi` : `${this.calculateAge(item.dateOfBirth)} Age`
                                    return (
                                        <div className="patient d-flex align-items-center" key={`patient-${index}`}>
                                            {/* Checkbox */}
                                            <input
                                                type="radio"
                                                name="selectedPatient"
                                                className="mr-1"
                                                checked={selectedPatient.id === item.id}
                                                onChange={() => this.handleRadioChange(item)}
                                            />

                                            {/* Thông tin bệnh nhân */}
                                            <div>
                                                <div className="pt-name">
                                                    {language === LANGUAGES.VI ? nameVi : nameEn}
                                                </div>
                                                <div className="pt-age">{`${rel} - ${age}`}</div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                            <div className='form-group mb-2'>
                                <label>Lý do
                                    {/* <FormattedMessage id="patient.booking-modal.phoneNumber" /> */}
                                </label>
                                <input className='form-control'
                                    value={this.state.reasonSignIn}
                                    type='text'
                                    onChange={(event) => this.handleOnchangeInput(event, 'reasonSignIn')}
                                />
                            </div>
                            <p className='mes-signin'>{errMesSignIn}</p>
                            <button className='btn  btn-booking'
                                onClick={() => this.HandleBookAppointment()}
                            >
                                <i className="far fa-calendar-check"> Đặt lịch</i>
                            </button>

                        </div>
                    }
                </div>
                <Modal isOpen={showModal}
                    toggle={() => this.toggle()}
                    size='sm'
                    centered
                >
                    <ModalHeader>{language === LANGUAGES.VI ? 'Thông báo:' : 'Message:'}</ModalHeader>
                    <ModalBody>
                        {
                            book_ok
                                ? (
                                    language === LANGUAGES.VI
                                        ? <div>Lịch hẹn của bạn đã được đặt thành công.<br />Vui lòng kiểm tra email và nhấn vào liên kết để xác nhận lịch hẹn.</div>
                                        : <div>Your appointment has been successfully scheduled.<br /> Kindly check your email and click the link to confirm your appointment.</div>
                                )
                                : (
                                    language === LANGUAGES.VI
                                        ? <div>Bạn đã đặt lịch hẹn với bác sĩ vào ngày này.<br /> Vui lòng kiểm tra lại thông tin.</div>
                                        : <div>You have already scheduled an appointment with this doctor on this date.<br /> Please kindly check again.</div>
                                )
                        }
                    </ModalBody>
                    <ModalFooter>
                        <Button
                            color="secondary"
                            onClick={() => { this.toggle() }}
                        >
                            {language === LANGUAGES.VI ? 'Đóng' : 'Close'}
                        </Button>
                    </ModalFooter>
                </Modal>
                <HomeFooter />
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        genders: state.admin.genders,
        user: state.user.userInfo,
        isLoggedIn: state.user.isLoggedIn
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getGender: () => dispatch(actions.fetchGenderStart())
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AppointmentBooking));
