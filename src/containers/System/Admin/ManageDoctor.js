import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import * as actions from '../../../store/actions';
import './ManageDoctor.scss';
import _ from 'lodash';
import { Modal, ModalBody, ModalHeader, Button, ModalFooter } from 'reactstrap';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import Select from 'react-select';
import { CRUD_ACTIONS, LANGUAGES, CommonUtils } from '../../../utils';
import { getInforDoctorById, getAllClinic, getAllDoctors, postChangeActiveDoctor, postCreateDoctorInfor, postUpdateDoctorInfor } from '../../../services/userService';
import { injectIntl } from 'react-intl';
import { toast } from 'react-toastify';
const mdParser = new MarkdownIt(/* Markdown-it options */);



class ManageDoctor extends Component {

    constructor(props) {
        super(props);
        this.state = {
            doctors: [],
            doctorsApi: [],
            search: '',
            doctorId: '',
            isOpenModal: false,
            isCreate: true,
            errMessage: '',
            isView: false,
            contentMarkdownVi: '',
            contentHTMLVi: '',
            contentMarkdownEn: '',
            contentHTMLEn: '',
            selectedOption: '',
            descriptionVi: '',
            descriptionEn: '',
            image: '',
            listDoctors: [],
            hasOldData: false, // chuyển sửa và lưu

            listPosition: [],
            listGender: [],
            listPrice: [],
            listPayment: [],
            listClinic: [],
            listSpecialty: [],
            selectedGender: '',
            selectedPosition: '',
            selectedPrice: '',
            selectedPayment: '',
            selectedClinic: '',
            selectedSpecialty: '',
            noteVi: '',
            noteEn: ''

        }
    }
    async componentDidMount() {
        let resDoctor = await getAllDoctors();
        if (resDoctor && resDoctor.errCode === 0) {
            this.setState({
                doctors: resDoctor.data,
                doctorsApi: resDoctor.data
            })
        }
        this.props.fetchAllDoctors();
        this.props.getAllRequiredDoctorInfor();
        this.props.getGenderStart();
        this.props.getPositionStart();
        let resClinic = await getAllClinic();
        if (resClinic && resClinic.errCode === 0) {
            this.setState({
                listClinic: this.buildDataInputSelect(resClinic.data, 'CLINIC')
            })

        }

    }
    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.allDoctors !== this.props.allDoctors) {

            let dataSelect = this.buildDataInputSelect(this.props.allDoctors, 'USERS');

            this.setState({
                listDoctors: dataSelect
            })
        }

        if (prevProps.allRequiredDoctorInfor !== this.props.allRequiredDoctorInfor) {
            let { resPrice, resPayment, resSpecialty } = this.props.allRequiredDoctorInfor;
            let dataSelectPrice = this.buildDataInputSelect(resPrice, 'PRICE');
            let dataSelectPayment = this.buildDataInputSelect(resPayment, 'PAYMENT');
            let dataSelectSpecialty = this.buildDataInputSelect(resSpecialty, 'SPECIALTY');
            this.setState({
                listPrice: dataSelectPrice,
                listPayment: dataSelectPayment,
                listSpecialty: dataSelectSpecialty
            })
        }
        if (prevProps.allGender !== this.props.allGender) {
            let genders = this.buildDataInputSelect(this.props.allGender, 'GENDER');
            this.setState({
                listGender: genders
            })
        }
        if (prevProps.allPosition !== this.props.allPosition) {
            let positions = this.buildDataInputSelect(this.props.allPosition, 'POSITION');
            this.setState({
                listPosition: positions
            })
        }
        if (prevProps.language !== this.props.language) {
            let dataSelect = this.buildDataInputSelect(this.props.allDoctors, "USERS");
            let dataGenders = this.buildDataInputSelect(this.props.allGender, "GENDER");
            let dataPositions = this.buildDataInputSelect(this.props.allPosition, "POSITION");
            let { resPrice, resPayment, resSpecialty } = this.props.allRequiredDoctorInfor;
            let dataSelectPrice = this.buildDataInputSelect(resPrice, 'PRICE');
            let dataSelectPayment = this.buildDataInputSelect(resPayment, 'PAYMENT');
            let dataSelectSpecialty = this.buildDataInputSelect(resSpecialty, 'SPECIALTY');
            let resClinic = await getAllClinic();
            if (resClinic && resClinic.errCode === 0) {
                this.setState({
                    listClinic: this.buildDataInputSelect(resClinic.data, 'CLINIC')
                })

            }
            this.setState({
                listPosition: dataPositions,
                listGender: dataGenders,
                listDoctors: dataSelect,
                listPrice: dataSelectPrice,
                listPayment: dataSelectPayment,
                listSpecialty: dataSelectSpecialty,
            })
        }
    }
    buildDataInputSelect = (inputData, type) => {
        let result = [];
        let { language } = this.props;
        if (inputData && inputData.length > 0) {
            if (type === "PRICE") {
                inputData.map((item, index) => {
                    let object = {};
                    let labelVi = `${item.valueVi} VND`;
                    let labelEn = `${item.valueEn} USD`;
                    object.label = language === LANGUAGES.VI ? labelVi : labelEn;
                    object.value = item.keyMap;
                    result.push(object);
                })
            }
            if (type === "PAYMENT" || type === "GENDER" || type === 'POSITION') {
                inputData.map((item, index) => {
                    let object = {};
                    let labelVi = `${item.valueVi}`;
                    let labelEn = `${item.valueEn}`;
                    object.label = language === LANGUAGES.VI ? labelVi : labelEn;
                    object.value = item.keyMap;
                    result.push(object);
                })
            }
            if (type === "SPECIALTY") {
                inputData.map((item, index) => {
                    let object = {};
                    let labelVi = `${item.nameVi}`;
                    let labelEn = `${item.nameEn}`;
                    object.label = language === LANGUAGES.VI ? labelVi : labelEn;
                    object.value = item.id;
                    result.push(object);
                })
            }
            if (type === "CLINIC") {
                inputData.map((item, index) => {
                    let object = {};
                    object.label = item.name;
                    object.value = item.id;
                    result.push(object);
                })
            }
            return result;
        }
    }
    handleOnChangeImage = async (event) => {
        let data = event.target.files;
        let file = data[0];
        if (file) {
            let base64 = await CommonUtils.getBase64(file);
            this.setState({
                image: base64
            })
        }
    }
    handleEditorChangeVi = ({ html, text }) => {
        this.setState({
            contentMarkdownVi: text,
            contentHTMLVi: html,
        })
    }
    handleEditorChangeEn = ({ html, text }) => {
        this.setState({
            contentMarkdownEn: text,
            contentHTMLEn: html,
        })
    }

    handleSaveDoctorInfor = () => {
        let { hasOldData } = this.state;
        this.props.saveDetailDoctors({
            image: this.state.image,
            contentHTMLVi: this.state.contentHTMLVi,
            contentMarkdownVi: this.state.contentMarkdownVi,
            contentHTMLEn: this.state.contentHTMLEn,
            contentMarkdownEn: this.state.contentMarkdownEn,
            descriptionVi: this.state.descriptionVi,
            descriptionEn: this.state.descriptionEn,
            doctorId: this.state.selectedOption.value,
            selectedPrice: this.state.selectedPrice.value,
            selectedPayment: this.state.selectedPayment.value,
            selectedSpecialty: this.state.selectedSpecialty.value,
            selectedGender: this.state.selectedGender.value,
            selectedPosition: this.state.selectedPosition.value,
            selectedClinic: this.state.selectedClinic.value,
            noteVi: this.state.noteVi,
            noteEn: this.state.noteEn,
            action: hasOldData === true ? CRUD_ACTIONS.EDIT : CRUD_ACTIONS.CREATE
        })
        this.setState({
            contentHTMLVi: '',
            contentMarkdownVi: '',
            descriptionVi: '',
            noteVi: '',
            contentHTMLEn: '',
            contentMarkdownEn: '',
            descriptionEn: '',
            noteEn: '',
            image: '',
            hasOldData: false,
            selectedPrice: '',
            selectedPayment: '',
            selectedGender: '',
            selectedPosition: '',
            selectedSpecialty: '',
            selectedClinic: '',
            selectedOption: ''
        })

    }
    handleChangeSelect = async (selectedOption) => {
        this.setState({ selectedOption });
        let { listPayment, listPrice, listSpecialty, listClinic, listPosition, listGender } = this.state
        let selectedPrice = '', selectedPayment = '', selectedSpecialty = '', selectedClinic = '', selectedGender = '', selectedPosition = '';
        let res = await getInforDoctorById(selectedOption.value);
        if (res && res.errCode === 0) {
            if (!_.isEmpty(res.data)) {
                let data = res.data;
                let paymentId = '', priceId = '', specialtyId = '', clinicId = '', positionId = '', gender = '';
                let imageBase64 = new Buffer.from(res.data.image, 'base64').toString('binary');
                paymentId = res.data.paymentId
                priceId = res.data.priceId
                specialtyId = res.data.specialtyId
                clinicId = res.data.clinicId
                positionId = res.data.positionId
                gender = res.data.gender
                selectedPrice = listPrice.find(item => {
                    return item && item.value === priceId
                })
                selectedGender = listGender.find(item => {
                    return item && item.value === gender
                })
                selectedPosition = listPosition.find(item => {
                    return item && item.value === positionId
                })
                selectedPayment = listPayment.find(item => {
                    return item && item.value === paymentId
                })
                selectedSpecialty = listSpecialty.find(item => {
                    return item && item.value === specialtyId
                })
                selectedClinic = listClinic.find(item => {
                    return item && item.value === clinicId
                })

                this.setState({
                    contentHTMLVi: data.contentHTMLVi,
                    contentMarkdownVi: data.contentMarkdownVi,
                    descriptionVi: data.descriptionVi,
                    contentHTMLEn: data.contentHTMLEn,
                    contentMarkdownEn: data.contentMarkdownEn,
                    descriptionEn: data.descriptionEn,
                    hasOldData: true,
                    image: imageBase64,
                    noteVi: data.noteVi,
                    noteEn: data.noteEn,
                    selectedPrice: selectedPrice,
                    selectedPayment: selectedPayment,
                    selectedGender: selectedGender,
                    selectedPosition: selectedPosition,
                    selectedSpecialty: selectedSpecialty,
                    selectedClinic: selectedClinic
                })

            } else {
                this.setState({
                    contentHTMLVi: '',
                    contentMarkdownVi: '',
                    descriptionVi: '',
                    contentHTMLEn: '',
                    contentMarkdownEn: '',
                    descriptionEn: '',
                    hasOldData: false,
                    image: '',
                    noteVi: '',
                    noteEn: '',
                    selectedPrice: '',
                    selectedPayment: '',
                    selectedSpecialty: '',
                    selectedClinic: '',
                    selectedGender: '',
                    selectedPosition: ''
                })
            }
        }
    }
    handleOnChangetext = (event, id) => {
        let stateCopy = { ...this.state };
        stateCopy[id] = event.target.value;
        this.setState({
            ...stateCopy
        })
    }
    handleChangeActive = async (id, isActive) => {
        let res = await postChangeActiveDoctor({
            id: id,
            isActive: isActive === 0 ? 1 : 0
        }, this.props.userInfo.token)
        if (res && res.errCode === 0) {
            toast.success("succed")
            let resDoctor = await getAllDoctors();
            if (resDoctor && resDoctor.errCode === 0) {
                this.setState({
                    doctors: resDoctor.data,
                    doctorsApi: resDoctor.data
                })
            }
        } else {
            toast.error("error")
        }
    }
    closeModal = () => {
        this.setState({
            isOpenModal: false,
            isCreate: true,
            doctorId: '',
            contentHTMLVi: '',
            contentMarkdownVi: '',
            descriptionVi: '',
            contentHTMLEn: '',
            contentMarkdownEn: '',
            descriptionEn: '',
            image: '',
            noteVi: '',
            noteEn: '',
            selectedPrice: '',
            selectedPayment: '',
            selectedSpecialty: '',
            selectedClinic: '',
            selectedGender: '',
            selectedPosition: ''
        })
    }
    handleChangeSelectedDoctorInfor = (selectedOption, { name }) => {
        this.setState({
            [name]: selectedOption
        });
    };
    handleClickCreateDoctor_Infor = (id) => {
        this.setState({
            doctorId: id,
            isOpenModal: true
        })
    }
    handleClickEditDoctor_Infor = () => {
        this.setState({
            isView: false
        })
    }
    handleClickViewDetail = async (id) => {
        // this.setState({
        //     isOpenModal:true
        // })
        let { listPayment, listPrice, listSpecialty, listClinic, listPosition, listGender } = this.state
        let selectedPrice = '', selectedPayment = '', selectedSpecialty = '', selectedClinic = '', selectedGender = '', selectedPosition = '';
        let res = await getInforDoctorById(id);
        if (res && res.errCode === 0) {
            if (!_.isEmpty(res.data)) {
                let data = res.data;
                let paymentId = '', priceId = '', specialtyId = '', clinicId = '', positionId = '', gender = '';
                let imageBase64 = new Buffer.from(res.data.image, 'base64').toString('binary');
                paymentId = res.data.paymentId
                priceId = res.data.priceId
                specialtyId = res.data.specialtyId
                clinicId = res.data.clinicId
                positionId = res.data.positionId
                gender = res.data.gender
                selectedPrice = listPrice.find(item => {
                    return item && item.value === priceId
                })
                selectedGender = listGender.find(item => {
                    return item && item.value === gender
                })
                selectedPosition = listPosition.find(item => {
                    return item && item.value === positionId
                })
                selectedPayment = listPayment.find(item => {
                    return item && item.value === paymentId
                })
                selectedSpecialty = listSpecialty.find(item => {
                    return item && item.value === specialtyId
                })
                selectedClinic = listClinic.find(item => {
                    return item && item.value === clinicId
                })

                this.setState({
                    contentHTMLVi: data.contentHTMLVi,
                    contentMarkdownVi: data.contentMarkdownVi,
                    descriptionVi: data.descriptionVi,
                    contentHTMLEn: data.contentHTMLEn,
                    contentMarkdownEn: data.contentMarkdownEn,
                    descriptionEn: data.descriptionEn,
                    image: imageBase64,
                    noteVi: data.noteVi,
                    noteEn: data.noteEn,
                    selectedPrice: selectedPrice,
                    selectedPayment: selectedPayment,
                    selectedGender: selectedGender,
                    selectedPosition: selectedPosition,
                    selectedSpecialty: selectedSpecialty,
                    selectedClinic: selectedClinic,
                    doctorId: id,
                    isView: true,
                    isOpenModal: true,
                    isCreate: false
                })
            }
        }
    }
    handleCreateDoctor_Infor = async () => {
        this.setState({
            errMessage: ''
        })
        let { doctorId, contentMarkdownVi, descriptionVi, contentHTMLEn, contentMarkdownEn, descriptionEn,
            contentHTMLVi, image, noteVi, noteEn, selectedPrice, selectedPayment, selectedGender,
            selectedPosition, selectedSpecialty, selectedClinic } = this.state;
        let { language } = this.props
        let errMes = '';
        if (!contentMarkdownVi || !descriptionVi || !contentMarkdownEn || !descriptionEn || !image || !selectedPrice
            || !selectedPayment || !selectedGender || !selectedPosition || !selectedSpecialty || !selectedClinic) {
            errMes = language === LANGUAGES.VI ? 'Vui lòng nhập đủ thông tin' : 'nssjfs'
            this.setState({
                errMessage: errMes
            })
        } else {
            let res = await postCreateDoctorInfor({
                doctorId: doctorId,
                specialtyId: selectedSpecialty.value,
                clinicId: selectedClinic.value,
                positionId: selectedPosition.value,
                priceId: selectedPrice.value,
                gender: selectedGender.value,
                image: image,
                paymentId: selectedPayment.value,
                contentHTMLVi: contentHTMLVi,
                contentHTMLEn: contentHTMLEn,
                contentMarkdownVi: contentMarkdownVi,
                contentMarkdownEn: contentMarkdownEn,
                descriptionVi: descriptionVi,
                descriptionEn: descriptionEn,
                noteVi: noteVi,
                noteEn: noteEn
            }, this.props.userInfo.token)
            if (res && res.errCode === 0) {
                toast.success('succed')
                this.closeModal()
                let resDoctor = await getAllDoctors();
                if (resDoctor && resDoctor.errCode === 0) {
                    this.setState({
                        doctors: resDoctor.data,
                        doctorsApi: resDoctor.data
                    })
                }
            }
            else {
                toast.error('error')
            }
        }


    }
    handleClickSaveDoctor_Infor = async () => {
        this.setState({
            errMessage: ''
        })
        let { doctorId, contentMarkdownVi, descriptionVi, contentHTMLEn, contentMarkdownEn, descriptionEn,
            contentHTMLVi, image, noteVi, noteEn, selectedPrice, selectedPayment, selectedGender,
            selectedPosition, selectedSpecialty, selectedClinic } = this.state;
        let { language } = this.props
        let errMes = '';
        if (!contentMarkdownVi || !descriptionVi || !contentMarkdownEn || !descriptionEn || !image || !selectedPrice
            || !selectedPayment || !selectedGender || !selectedPosition || !selectedSpecialty || !selectedClinic) {
            errMes = language === LANGUAGES.VI ? 'Vui lòng nhập đủ thông tin' : 'nssjfs'
            this.setState({
                errMessage: errMes
            })
        } else {
            let res = await postUpdateDoctorInfor({
                doctorId: doctorId,
                specialtyId: selectedSpecialty.value,
                clinicId: selectedClinic.value,
                positionId: selectedPosition.value,
                priceId: selectedPrice.value,
                gender: selectedGender.value,
                image: image,
                paymentId: selectedPayment.value,
                contentHTMLVi: contentHTMLVi,
                contentHTMLEn: contentHTMLEn,
                contentMarkdownVi: contentMarkdownVi,
                contentMarkdownEn: contentMarkdownEn,
                descriptionVi: descriptionVi,
                descriptionEn: descriptionEn,
                noteVi: noteVi,
                noteEn: noteEn
            }, this.props.userInfo.token)
            if (res && res.errCode === 0) {
                toast.success('succed')
                this.closeModal()
                let resDoctor = await getAllDoctors();
                if (resDoctor && resDoctor.errCode === 0) {
                    this.setState({
                        doctors: resDoctor.data,
                        doctorsApi: resDoctor.data
                    })
                }
            }
            else {
                toast.error('error')
            }
        }

    }
    render() {
        let { isView, doctors, doctorsApi, search, isOpenModal, isCreate } = this.state;
        doctors = doctorsApi.filter(item =>
            item.email.toLowerCase().includes(search.toLowerCase())
        );
        let { intl, language } = this.props;
        let noteViPlaceHolder = intl.formatMessage({ id: 'admin.manage-doctor.note-VI' });
        let noteEnPlaceHolder = intl.formatMessage({ id: 'admin.manage-doctor.note-EN' });
        let descriptionViPlaceHolder = intl.formatMessage({ id: 'admin.manage-doctor.intro-VI' });
        let descriptionEnPlaceHolder = intl.formatMessage({ id: 'admin.manage-doctor.intro-EN' });
        let enterPlaceHolder = intl.formatMessage({ id: 'admin.manage-doctor.enter' });
        let seachPlaceholder = language === LANGUAGES.VI ? 'Nhập email để tìm kiếm' : 'Enter email to search'
        return (

            <div className='manage-doctor-container container'>
                <div className='manage-doctor-title'> <FormattedMessage id="admin.manage-doctor.title" /></div>
                <div className='row my-3 ml-0'>
                    <input className='form-control col-4'
                        value={search}
                        onChange={(event) => this.handleOnChangetext(event, 'search')}
                        placeholder={seachPlaceholder}
                    />
                </div>
                <div className='more-infor'>

                    <table className='table'>
                        <thead>
                            <tr>
                                <th>{language === LANGUAGES.VI ? 'STT' : 'No.'}</th>
                                <th>{language === LANGUAGES.VI ? 'Họ và tên' : 'Fullname'}</th>
                                <th>Email</th>
                                <th>{language === LANGUAGES.VI ? 'Trạng thái' : 'Status'}</th>
                                <th>{language === LANGUAGES.VI ? 'Hành động' : 'Actions'}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {doctors && doctors.length > 0 ?
                                doctors.map((item, index) => {
                                    let active;
                                    if (item.Doctor_Infor.isActive == null) {
                                        active = language === LANGUAGES.VI ? 'Chưa có thông tin' : 'No information available';
                                    } else {
                                        if (item.Doctor_Infor.isActive == 0) {
                                            active = language === LANGUAGES.VI ? 'Chưa kích hoạt' : 'Not activated';
                                        } else {
                                            active = language === LANGUAGES.VI ? 'Đã kích hoạt' : 'Activated';
                                        }
                                    }

                                    return (
                                        <tr key={`dt-${index}`}>
                                            <td>{index + 1}</td>
                                            <td>{`${item.firstName} ${item.lastName}`}</td>
                                            <td>{item.email}</td>
                                            <td>{active} </td>
                                            <td>
                                                {item.Doctor_Infor.isActive === null ?
                                                    <button onClick={() => this.handleClickCreateDoctor_Infor(item.id)}>Tạo thông tin</button>
                                                    :
                                                    <>
                                                        <button
                                                            onClick={() => this.handleClickViewDetail(item.id)}
                                                        >
                                                            {language === LANGUAGES.VI ? 'Xem chi tiết' : 'View details'}

                                                        </button>
                                                        {item.Doctor_Infor.isActive === 0 ?
                                                            <button onClick={() => this.handleChangeActive(item.Doctor_Infor.id, item.Doctor_Infor.isActive)}>
                                                                {language === LANGUAGES.VI ? 'Kích hoạt' : 'Activate'}

                                                            </button>
                                                            :
                                                            <button onClick={() => this.handleChangeActive(item.Doctor_Infor.id, item.Doctor_Infor.isActive)}>
                                                                {language === LANGUAGES.VI ? 'Huỷ kích hoạt' : 'Deactivate'}

                                                            </button>
                                                        }
                                                    </>
                                                }
                                            </td>
                                        </tr>
                                    )
                                }) :
                                <tr>
                                    <td colSpan={5} className='text-center'>{language === LANGUAGES.VI ? 'Không có dữ liệu' : 'No data'}
                                    </td>
                                </tr>
                            }
                        </tbody>
                    </table>

                </div>
                <Modal
                    isOpen={isOpenModal}
                    size="lg"
                    centered
                >
                    <div className="modal-header">
                        <h5 className="modal-title">{language === LANGUAGES.VI ? 'Xoá chuyên khoa' : 'Delete Specialty'}</h5>
                        <button
                            type="button"
                            className="close"
                            onClick={() => this.closeModal()}
                            aria-label="Close"
                        >
                            <span aria-hidden="true">x</span>
                        </button>
                    </div>
                    <ModalBody>
                        <div className='more-infor-extra row'>
                            <div className='col-sm-6 form-group'>
                                <label>
                                    học vị
                                </label>
                                <Select
                                    value={this.state.selectedPosition}
                                    onChange={this.handleChangeSelectedDoctorInfor}
                                    options={this.state.listPosition}
                                    name="selectedPosition"
                                    placeholder={<FormattedMessage id="admin.manage-doctor.select-specialty" />}
                                    isDisabled={isView}
                                />
                            </div>
                            <div className='col-sm-6 form-group'>
                                <label>
                                    {/* <FormattedMessage id="admin.manage-doctor.select-specialty" /> */}
                                    giới tính
                                </label>
                                <Select
                                    value={this.state.selectedGender}
                                    onChange={this.handleChangeSelectedDoctorInfor}
                                    options={this.state.listGender}
                                    name="selectedGender"
                                    placeholder={<FormattedMessage id="admin.manage-doctor.select-specialty" />}
                                    isDisabled={isView}
                                />
                            </div>
                            <div className='col-sm-4 form-group'>
                                <label>
                                    {/* <FormattedMessage id="admin.manage-doctor.select-specialty" /> */}
                                    Image
                                </label>
                                <input className='form-control' type="file"
                                    onChange={(event) => this.handleOnChangeImage(event)}
                                    readOnly={isView}
                                />
                            </div>
                            <div className='col-sm-4 form-group'>
                                <label><FormattedMessage id="admin.manage-doctor.select-specialty" /></label>
                                <Select
                                    value={this.state.selectedSpecialty}
                                    onChange={this.handleChangeSelectedDoctorInfor}
                                    options={this.state.listSpecialty}
                                    name="selectedSpecialty"
                                    placeholder={<FormattedMessage id="admin.manage-doctor.select-specialty" />}
                                    isDisabled={isView}
                                />
                            </div>
                            <div className='col-sm-4 form-group'>
                                <label><FormattedMessage id="admin.manage-doctor.select-clinic" /></label>
                                <Select
                                    value={this.state.selectedClinic}
                                    onChange={this.handleChangeSelectedDoctorInfor}
                                    options={this.state.listClinic}
                                    name="selectedClinic"
                                    placeholder={<FormattedMessage id="admin.manage-doctor.select-clinic" />}
                                    isDisabled={isView}
                                />
                            </div>
                            <div className='col-sm-6 form-group'>
                                <label><FormattedMessage id="admin.manage-doctor.price" /></label>
                                <Select
                                    value={this.state.selectedPrice}
                                    onChange={this.handleChangeSelectedDoctorInfor}
                                    options={this.state.listPrice}
                                    name="selectedPrice"
                                    placeholder={<FormattedMessage id="admin.manage-doctor.price" />}
                                    isDisabled={isView}
                                />
                            </div>
                            <div className='col-sm-6 form-group'>
                                <label><FormattedMessage id="admin.manage-doctor.payment" /></label>
                                <Select
                                    value={this.state.selectedPayment}
                                    onChange={this.handleChangeSelectedDoctorInfor}
                                    options={this.state.listPayment}
                                    name="selectedPayment"
                                    placeholder={<FormattedMessage id="admin.manage-doctor.payment" />}
                                    isDisabled={isView}
                                />
                            </div>

                            <div className='col-sm-6 form-group'>
                                <label><FormattedMessage id="admin.manage-doctor.note-VI" /></label>
                                <input className='form-control'
                                    onChange={(event) => this.handleOnChangetext(event, 'noteVi')}
                                    value={this.state.noteVi}
                                    placeholder={noteViPlaceHolder}
                                    readOnly={isView}
                                />
                            </div>
                            <div className='col-sm-6 form-group'>
                                <label><FormattedMessage id="admin.manage-doctor.note-EN" /></label>
                                <input className='form-control'
                                    onChange={(event) => this.handleOnChangetext(event, 'noteEn')}
                                    value={this.state.noteEn}
                                    placeholder={noteEnPlaceHolder}
                                    readOnly={isView}
                                />

                            </div>
                            <div className='col-6 form-group'>

                                <label><FormattedMessage id="admin.manage-doctor.intro-VI" /></label>
                                <textarea
                                    className='form-control'
                                    // rows='4'
                                    onChange={(event) => this.handleOnChangetext(event, 'descriptionVi')}
                                    value={this.state.descriptionVi}
                                    placeholder={descriptionViPlaceHolder}
                                    readOnly={isView}
                                />
                            </div>
                            <div className='col-6 form-group'>

                                <label><FormattedMessage id="admin.manage-doctor.intro-EN" /></label>
                                <textarea
                                    className='form-control'
                                    // rows='4'
                                    onChange={(event) => this.handleOnChangetext(event, 'descriptionEn')}
                                    value={this.state.descriptionEn}
                                    placeholder={descriptionEnPlaceHolder}
                                    readOnly={isView}
                                />
                            </div>

                        </div>


                        <div className='manage-doctor-editor'>
                            <label><FormattedMessage id="admin.manage-doctor.content-VI" /></label>
                            {!isView ?
                                <MdEditor
                                    style={{ height: '150px' }}
                                    renderHTML={text => mdParser.render(text)}
                                    onChange={this.handleEditorChangeVi}
                                    value={this.state.contentMarkdownVi}
                                    placeholder={enterPlaceHolder}
                                /> :
                                <div dangerouslySetInnerHTML={{ __html: this.state.contentHTMLVi }}
                                    className='border p-1 rounded'
                                >
                                </div>
                            }
                        </div>
                        <div className='manage-doctor-editor'>
                            <label><FormattedMessage id="admin.manage-doctor.content-EN" /></label>
                            {!isView ?
                                <MdEditor
                                    style={{ height: '150px' }}
                                    renderHTML={text => mdParser.render(text)}
                                    onChange={this.handleEditorChangeEn}
                                    value={this.state.contentMarkdownEn}
                                    placeholder={enterPlaceHolder}
                                />
                                :
                                <div dangerouslySetInnerHTML={{ __html: this.state.contentHTMLEn }}
                                    className='border p-1 rounded'
                                >
                                </div>
                            }
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        {isCreate &&
                            <Button color="success" onClick={() => this.handleCreateDoctor_Infor()}>
                                {language === LANGUAGES.VI ? 'Thêm' : 'Create'}
                            </Button>
                        }
                        {isView ?
                            <Button color="success" onClick={() => this.handleClickEditDoctor_Infor()}>
                                {language === LANGUAGES.VI ? 'Sửa' : 'Edit'}
                            </Button>
                            :
                            <Button color="success" onClick={() => this.handleClickSaveDoctor_Infor()}>
                                {language === LANGUAGES.VI ? 'Lưu' : 'Save()'}
                            </Button>
                        }

                        <Button color="secondary" onClick={() => this.closeModal()}>
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
        userInfo: state.user.userInfo,
        allGender: state.admin.genders,
        allPosition: state.admin.positions,
        allDoctors: state.admin.allDoctors,
        language: state.app.language,
        allRequiredDoctorInfor: state.admin.allRequiredDoctorInfor
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getGenderStart: () => dispatch(actions.fetchGenderStart()),
        fetchAllDoctors: () => dispatch(actions.fetchAllDoctors()),
        saveDetailDoctors: (data) => dispatch(actions.saveDetailDoctors(data)),
        getAllRequiredDoctorInfor: () => dispatch(actions.getAllRequiredDoctorInfor()),
        getPositionStart: () => dispatch(actions.fetchPositionStart()),

    };
};

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(ManageDoctor));
