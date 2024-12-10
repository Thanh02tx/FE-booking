import React, { Component } from 'react';
import { connect } from "react-redux";
import { FormattedMessage } from 'react-intl';
import { LANGUAGES, path } from '../../../utils';
import NumberFormat from 'react-number-format';
import './Patient_Record.scss';
import Select from 'react-select';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import * as actions from "../../../store/actions";
import { getAllPatientRecord, updatePatientRecord, getAllProvinceJson, getAllDistrictJson, getAllWardJson, getAllCodeService, createNewPatientRecord } from '../../../services/userService';
import HomeHeader from '../../HomePage/HomeHeader';
import { toast } from 'react-toastify';
import _ from 'lodash';
import DatePicker from '../../../components/Input/DatePicker';
import HomeFooter from '../../HomePage/HomeFooter';
import { lang } from 'moment';
class Patient_Record extends Component {
    constructor(props) {
        super(props);

        this.state = {
            listProvinceVn: [],
            listProvince: [],
            listDistrictVn: [],
            listDistrict: [],
            listWardVn: [],
            listWard: [],
            genders: [],
            listRelationshipService: [],
            listRelationship: [],
            relationship: '',
            showModal: false,
            listPatient: [],
            id: '',
            firstName: '',
            lastName: '',
            phoneNumber: '',
            email: '',
            cccd: '',
            bhyt: '',
            province: '',
            district: '',
            ward: '',
            address: '',
            gender: '',
            dateOfBirth: '',
            idPatient: '',
            isCreate: true
        }
    }
    async componentDidMount() {
        this.props.getGender()
        if (this.props.userInfo && this.props.userInfo.token) {
            let res = await getAllPatientRecord(this.props.userInfo.token);
            if (res && res.errCode === 0) {
                this.setState({
                    listPatient: res.data
                })
            }
        }

        let resProvince = await getAllProvinceJson();
        if (resProvince.errCode == 0) {
            this.setState({
                listProvinceVn: resProvince.data,
                listProvince: this.buildData(resProvince.data)
            })
        }
        let resRelationship = await getAllCodeService('RELATIONSHIP')
        if (resRelationship && resRelationship.errCode === 0) {
            this.setState({
                listRelationshipService: resRelationship.data,
                listRelationship: this.buildDataAllcode(resRelationship.data)
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
    async componentDidUpdate(prevProps, prevState, snaphot) {
        if (prevProps.userInfo != this.props.userInfo) {
            if (this.props.userInfo.token) {
                let res = await getAllPatientRecord(this.props.userInfo.token);
                if (res && res.errCode === 0) {
                    this.setState({
                        listPatient: res.data
                    })
                }
            }
        }
        if (this.props.language !== prevProps.language) {
            this.setState({
                listProvince: this.buildData(this.state.listProvinceVn),
                listDistrict: this.buildData(this.state.listDistrictVn),
                listWard: this.buildData(this.state.listWardVn),
                genders: this.buildDataAllcode(this.props.genders),
                listRelationship: this.buildDataAllcode(this.state.listRelationshipService)
            })
        }
        if (this.props.genders !== prevProps.genders) {
            this.setState({
                genders: this.buildDataAllcode(this.props.genders)
            })
        }
    }
    buildDataAllcode = (data) => {
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
    handleChangeSelect = (selectedOption, name) => {
        let copyState = { ...this.state }
        copyState[name.name] = selectedOption;
        this.setState({
            ...copyState
        })
    }
    handleOnChangeDatePicker = (date) => {
        this.setState({
            dateOfBirth: date[0],
        })
    }
    toggle = () => {
        this.setState({
            showModal: !this.state.showModal
        })
    }

    handleOnchangeInput = (event, id) => {
        let valueInput = event.target.value;
        let copyState = { ...this.state };
        copyState[id] = valueInput;
        this.setState({
            ...copyState
        })
    }
    calculateAge = (dateOfBirthTimestamp) => {
        let birthDate = new Date(Number(dateOfBirthTimestamp));
        let currentYear = new Date().getFullYear(); // Lấy năm hiện tại
        let birthYear = birthDate.getFullYear(); // Lấy năm sinh
        return currentYear - birthYear; // Tính tuổi
    };
    handleCreatePatientRecord = async () => {
        let { id, firstName, lastName, bhyt, email, phoneNumber, dateOfBirth, province, district, ward, gender, address, relationship } = this.state
        if (!firstName || !lastName || !email || !dateOfBirth || !province || !district || !gender || !relationship) {

        }
        let formatedDate = new Date(dateOfBirth).getTime();

        let res = await createNewPatientRecord({
            firstName: firstName,
            lastName: lastName,
            email: email,
            bhyt: bhyt,
            phoneNumber: phoneNumber,
            dateOfBirth: formatedDate,
            provinceId: province.value,
            districtId: district.value,
            wardId: ward.value,
            gender: gender.value,
            address: address,
            relationship: relationship.value
        }, this.props.userInfo.token);  // Truyền token trực tiếp vào hàm
                
        if (res && res.errCode === 0) {
            toast.success('Create Succed')
            this.setState({
                firstName: '',
                lastName: '',
                email: '',
                bhyt: '',
                phoneNumber: '',
                dateOfBirth: '',
                province: '',
                district: '',
                ward: '',
                gender: '',
                address: '',
                relationship: '',
                showModal: false
            })
            let res = await getAllPatientRecord(this.props.userInfo.token);
            if (res && res.errCode === 0) {
                this.setState({
                    listPatient: res.data
                })
            }
        } else {
            toast.error("error")
        }
    }
    handleEditPatientRecord = async (patient) => {
        let { genders, listRelationship, listProvince } = this.state;
        let relationship = patient.relationship;
        let gender = patient.gender;
        let district = '', ward = '';
        let selectedGender = genders.find(item => item && item.value === gender);
        let selectedRelationship = listRelationship.find(item => item && item.value === relationship);
        let province = listProvince.find(item => item && item.value === patient.provinceId);
        const [resDistrict, resWard] = await Promise.all([
            getAllDistrictJson(patient.provinceId),
            getAllWardJson(patient.districtId)
        ]);

        if (resDistrict && resDistrict.errCode === 0 && resWard && resWard.errCode === 0) {
            // Tìm district và ward từ dữ liệu trả về
            this.setState({
                listWardVn: resWard.data,
                listWard: this.buildData(resWard.data),
                listDistrictVn: resDistrict.data,
                listDistrict: this.buildData(resDistrict.data)
            })
            district = this.state.listDistrict.find(item => item && item.value === patient.districtId);
            ward = this.state.listWard.find(item => item && item.value === patient.wardId);
            this.setState({
                listDistrictVn: resDistrict.data,
                listDistrict: this.buildData(resDistrict.data),
                listWardVn: resWard.data,
                listWard: this.buildData(resWard.data),
                idPatient: patient.id,
                firstName: patient.firstName,
                lastName: patient.lastName,
                email: patient.email,
                phoneNumber: patient.phoneNumber,
                bhyt: patient.bhyt,
                address: patient.address,
                gender: selectedGender,
                province: province,
                district: district,
                ward: ward,
                dateOfBirth: new Date(Number(patient.dateOfBirth)),
                relationship: selectedRelationship,
                showModal: true,
                isCreate: false
            });

        }
    };
    handleUpdatePatientRecord = async () => {
        let { idPatient, firstName, lastName, email, phoneNumber, dateOfBirth, province, district, bhyt, ward, gender, address, relationship } = this.state;
        let formatedDate = new Date(dateOfBirth).getTime();
        let res = await updatePatientRecord({
            id: idPatient,
            firstName: firstName,
            lastName: lastName,
            email: email,
            bhyt: bhyt,
            phoneNumber: phoneNumber,
            dateOfBirth: formatedDate,
            provinceId: province.value,
            districtId: district.value,
            wardId: ward.value,
            gender: gender.value,
            address: address,
            relationship: relationship.value
        })
        if (res && res.errCode === 0) {
            let resAllPatient = await getAllPatientRecord(this.props.userInfo.token);
            if (resAllPatient && resAllPatient.errCode === 0) {
                this.setState({
                    showModal: false,
                    listPatient: resAllPatient.data,
                    id: '',
                    firstName: '',
                    lastName: '',
                    email: '',
                    bhyt: '',
                    phoneNumber: '',
                    dateOfBirth: '',
                    province: '',
                    district: '',
                    ward: '',
                    gender: '',
                    address: '',
                    relationship: '',
                    isCreate: true
                })
            }

            toast.success('Update succed')
        }
        else {
            toast.error('Error')
        }

    }
    cancelModal = () => {
        this.setState({
            id: '',
            firstName: '',
            lastName: '',
            email: '',
            bhyt: '',
            phoneNumber: '',
            dateOfBirth: '',
            province: '',
            district: '',
            ward: '',
            gender: '',
            address: '',
            relationship: '',
            showModal: false,
            isCreate: true
        })
    }

    render() {
        let { isLoggedIn, language } = this.props;
        let { showModal, listDistrict, listProvince, listPatient, listWard, isCreate } = this.state;
        console.log('ssd',this.props.userInfo)
        return (
            <div className='patient-record-container'>
                <HomeHeader />
                <div className='patient-record-content'>
                    {isLoggedIn ?
                        <div>
                            <div>
                                <button
                                    className='btn btn-success my-2'
                                    onClick={() => this.toggle()}
                                >
                                    <i className="fas fa-user-plus"> Thành viên</i>
                                </button>
                            </div>
                            <div className='patient-list'>
                                {listPatient && listPatient.length > 0 && listPatient.map((item, index) => {
                                    let nameVi = `${item.lastName} ${item.firstName}`;
                                    let nameEn = `${item.firstName} ${item.lastName}`;
                                    let rel = language === LANGUAGES.VI ? item.relationshipTypeData.valueVi : item.relationshipTypeData.valueEn;
                                    let age = language === LANGUAGES.VI ? `${this.calculateAge(item.dateOfBirth)} Tuổi` : `${this.calculateAge(item.dateOfBirth)} Age`
                                    return (
                                        <div className='patient-child pl-2 pt-1 mr-3 mb-3' key={`patient-${index}`}>
                                            <div>
                                                <div className='child-name'>
                                                    {language === LANGUAGES.VI ? nameVi : nameEn}
                                                </div>
                                                <div className='child-age'>
                                                    {`${rel} - ${age}`}
                                                </div>
                                            </div>
                                            <div>
                                                <i
                                                    className="fas fa-user-edit"
                                                    onClick={() => this.handleEditPatientRecord(item)}
                                                />
                                            </div>

                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                        :
                        <div>
                            Bạn cần đăng nhập
                        </div>
                    }
                </div>

                <div >
                    <Modal isOpen={showModal}
                        // toggle={() => this.toggle()}
                        // size='sm'
                        // centered
                        className='patient-record-modal'
                    >
                        <ModalHeader>{language === LANGUAGES.VI ? 'Thêm thành viên:' : 'Add a member:'}</ModalHeader>
                        <ModalBody>
                            <div className='row'>
                                <div className='col-6 form-group child'>
                                    <label><FormattedMessage id="patient.booking-modal.firstName" /></label>
                                    <input className='form-control'
                                        value={this.state.firstName}
                                        onChange={(event) => this.handleOnchangeInput(event, 'firstName')}
                                    />
                                </div>
                                <div className='col-6 form-group child'>
                                    <label><FormattedMessage id="patient.booking-modal.lastName" /></label>
                                    <input className='form-control'
                                        value={this.state.lastName}
                                        onChange={(event) => this.handleOnchangeInput(event, 'lastName')}
                                    />
                                </div>

                                <div className='col-6 form-group child'>
                                    <label>phone
                                        {/* <FormattedMessage id="patient.booking-modal.phoneNumber" /> */}
                                    </label>
                                    <input className='form-control'
                                        value={this.state.phoneNumber}
                                        onChange={(event) => this.handleOnchangeInput(event, 'phoneNumber')}
                                    />
                                </div>
                                <div className='col-6 form-group child'>
                                    <label><FormattedMessage id="patient.booking-modal.email" /></label>
                                    <input className='form-control'
                                        type='email'
                                        value={this.state.email}
                                        onChange={(event) => this.handleOnchangeInput(event, 'email')}
                                    />
                                </div>
                                <div className='col-6 form-group child'>
                                    <label>Ngày sinh
                                        {/* <FormattedMessage id="patient.booking-modal.phoneNumber" /> */}
                                    </label>
                                    <DatePicker
                                        onChange={this.handleOnChangeDatePicker}
                                        className='form-control'
                                        value={this.state.dateOfBirth}
                                        maxDate={new Date()}
                                    />
                                </div>
                                <div className='col-6 form-group child'>
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
                                <div className='col-12 form-group child'>
                                    <label><FormattedMessage id="patient.booking-modal.address" /></label>
                                    <input className='form-control'
                                        value={this.state.address}
                                        onChange={(event) => this.handleOnchangeInput(event, 'address')}
                                    />
                                </div>
                                <div className='col-6 form-group child'>
                                    <label>Tỉnh thành
                                        {/* <FormattedMessage id="patient.booking-modal.gender" /> */}
                                    </label>
                                    <Select
                                        className='select-child'
                                        value={this.state.province}
                                        onChange={this.handleChangeSelectProvince}
                                        options={listProvince}
                                    />
                                </div>
                                <div className='col-6 form-group child'>
                                    <label>Quận huyện
                                        {/* <FormattedMessage id="patient.booking-modal.gender" /> */}
                                    </label>
                                    <Select
                                        value={this.state.district}
                                        onChange={this.handleChangeSelectDistrict}
                                        options={listDistrict}
                                    />
                                </div>
                                <div className='col-6 form-group child'>
                                    <label>Xã phường
                                        {/* <FormattedMessage id="patient.booking-modal.gender" /> */}
                                    </label>
                                    <Select
                                        value={this.state.ward}
                                        onChange={this.handleChangeSelectWard}
                                        options={listWard}
                                    />
                                </div>


                                <div className='col-6 form-group child'>
                                    <label><FormattedMessage id="patient.booking-modal.gender" /></label>
                                    <Select
                                        name='gender'
                                        value={this.state.gender}
                                        onChange={this.handleChangeSelect}
                                        options={this.state.genders}
                                    />
                                </div>
                                <div className='col-6 form-group child'>
                                    <label>Quan hệ</label>
                                    <Select
                                        name='relationship'
                                        value={this.state.relationship}
                                        onChange={this.handleChangeSelect}
                                        options={this.state.listRelationship}
                                    />
                                </div>
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            {isCreate ?
                                <Button
                                    onClick={() => this.handleCreatePatientRecord()}
                                >
                                    Thêm
                                </Button>
                                :
                                <Button
                                    onClick={() => this.handleUpdatePatientRecord()}
                                >
                                    Sửa
                                </Button>
                            }
                            <Button
                                color="secondary"
                                onClick={() => this.cancelModal()}
                            >
                                {language === LANGUAGES.VI ? 'Đóng' : 'Close'}
                            </Button>
                        </ModalFooter>
                    </Modal>
                    <HomeFooter />
                </div>
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        userInfo: state.user.userInfo,
        isLoggedIn: state.user.isLoggedIn,
        genders: state.admin.genders,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        userLoginSuccess: (userInfo) => dispatch(actions.userLoginSuccess(userInfo)),
        getGender: () => dispatch(actions.fetchGenderStart())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Patient_Record);
