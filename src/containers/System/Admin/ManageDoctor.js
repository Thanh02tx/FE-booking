import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import * as actions from '../../../store/actions';
import * as ReactDOM from 'react-dom';
import './ManageDoctor.scss';
import _ from 'lodash';
//bài viết baiviet
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import Select from 'react-select';
import { CRUD_ACTIONS, LANGUAGES } from '../../../utils';
import { getInforDoctorById, getAllClinic } from '../../../services/userService';

const mdParser = new MarkdownIt(/* Markdown-it options */);



class ManageDoctor extends Component {

    constructor(props) {
        super(props);
        this.state = {
            //lưu markdown
            contentMarkdownVi: '',
            contentHTMLVi: '',
            ontentMarkdownEn: '',
            contentHTMLEn: '',
            selectedOption: '',
            descriptionVi: '',
            descriptionEn: '',
            listDoctors: [],
            hasOldData: false, // chuyển sửa và lưu

            //lưu doctor_infor
            listPrice: [],
            listPayment: [],
            listClinic: [],
            listSpecialty: [],
            selectedPrice: '',
            selectedPayment: '',
            selectedClinic: '',
            selectedSpecialty: '',
            noteVi: '',
            noteEn: ''

        }
    }
    async componentDidMount() {
        this.props.fetchAllDoctors();
        this.props.getAllRequiredDoctorInfor();
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
        if (prevProps.language !== this.props.language) {
            let dataSelect = this.buildDataInputSelect(this.props.allDoctors, "USERS");
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
            if (type === "USERS") {
                inputData.map((item, index) => {
                    let object = {};
                    let labelVi = `${item.lastName} ${item.firstName}`;
                    let labelEn = `${item.firstName} ${item.lastName}`;
                    object.label = language === LANGUAGES.VI ? labelVi : labelEn;
                    object.value = item.id;
                    result.push(object);
                })
            }
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
            if (type === "PAYMENT") {
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
            hasOldData: false,
            selectedPrice: '',
            selectedPayment: '',
            selectedSpecialty: '',
            selectedClinic: '',
            selectedOption: ''
        })

    }
    handleChangeSelect = async (selectedOption) => {
        this.setState({ selectedOption });
        let { listPayment, listPrice, listSpecialty, listClinic } = this.state
        let selectedPrice = '', selectedPayment = '', selectedSpecialty = '', selectedClinic = '';
        let res = await getInforDoctorById(selectedOption.value);
        if (res && res.errCode === 0) {
            if (!_.isEmpty(res.data)) {
                let data = res.data;
                let paymentId = '', priceId = '', specialtyId = '', clinicId = '';

                paymentId = res.data.paymentId
                priceId = res.data.priceId
                specialtyId = res.data.specialtyId
                clinicId = res.data.clinicId
                selectedPrice = listPrice.find(item => {
                    return item && item.value === priceId
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
                    noteVi: data.noteVi,
                    noteEn: data.noteEn,
                    selectedPrice: selectedPrice,
                    selectedPayment: selectedPayment,
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
                    noteVi: '',
                    noteEn: '',
                    selectedPrice: '',
                    selectedPayment: '',
                    selectedSpecialty: '',
                    selectedClinic: ''
                })
            }
        }
    }
    handleChangeSelectedDoctorInfor = async (selectedOption, name) => {
        let stateName = name.name;
        let copyState = { ...this.sate };
        copyState[stateName] = selectedOption;
        this.setState({
            ...copyState
        })
    }
    handleOnChangetext = (event, id) => {
        let stateCopy = { ...this.state };
        stateCopy[id] = event.target.value;
        this.setState({
            ...stateCopy
        })
    }
    render() {
        let { hasOldData } = this.state;
        return (

            <div className='manage-doctor-container container'>
                <div className='manage-doctor-title'> <FormattedMessage id="admin.manage-doctor.title" /></div>
                <div className='more-infor'>


                </div>
                <div className='more-infor-extra row'>
                    <div className='col-4 form-group'>
                        <label><FormattedMessage id="admin.manage-doctor.select-doctor" /></label>
                        <Select
                            value={this.state.selectedOption}
                            onChange={this.handleChangeSelect}
                            options={this.state.listDoctors}
                            placeholder={<FormattedMessage id="admin.manage-doctor.select-doctor" />}
                        />
                    </div>
                    <div className='col-4 form-group'>
                        <label><FormattedMessage id="admin.manage-doctor.select-specialty" /></label>
                        <Select
                            value={this.state.selectedSpecialty}
                            onChange={this.handleChangeSelectedDoctorInfor}
                            options={this.state.listSpecialty}
                            name="selectedSpecialty"
                            placeholder={<FormattedMessage id="admin.manage-doctor.select-specialty" />}
                        />
                    </div>
                    <div className='col-4 form-group'>
                        <label><FormattedMessage id="admin.manage-doctor.select-clinic" /></label>
                        <Select
                            value={this.state.selectedClinic}
                            onChange={this.handleChangeSelectedDoctorInfor}
                            options={this.state.listClinic}
                            name="selectedClinic"
                            placeholder={<FormattedMessage id="admin.manage-doctor.select-clinic" />}
                        />
                    </div>
                    <div className='col-4 form-group'>
                        <label><FormattedMessage id="admin.manage-doctor.price" /></label>
                        <Select
                            value={this.state.selectedPrice}
                            onChange={this.handleChangeSelectedDoctorInfor}
                            options={this.state.listPrice}
                            name="selectedPrice"
                            placeholder={<FormattedMessage id="admin.manage-doctor.price" />}
                        />
                    </div>
                    <div className='col-4 form-group'>
                        <label><FormattedMessage id="admin.manage-doctor.payment" /></label>
                        <Select
                            value={this.state.selectedPayment}
                            onChange={this.handleChangeSelectedDoctorInfor}
                            options={this.state.listPayment}
                            name="selectedPayment"
                            placeholder={<FormattedMessage id="admin.manage-doctor.payment" />}
                        />
                    </div>

                    <div className='col-6 form-group'>
                        <label><FormattedMessage id="admin.manage-doctor.note-VI" /></label>
                        <input className='form-control'
                            onChange={(event) => this.handleOnChangetext(event, 'noteVi')}
                            value={this.state.noteVi}
                            placeholder='...'
                        >
                        </input>
                    </div>
                    <div className='col-6 form-group'>
                        <label><FormattedMessage id="admin.manage-doctor.note-EN" /></label>
                        <input className='form-control'
                            onChange={(event) => this.handleOnChangetext(event, 'noteEn')}
                            value={this.state.noteEn}
                            placeholder='...'
                        >
                        </input>
                    </div>
                    <div className='col-6 form-group'>

                        <label><FormattedMessage id="admin.manage-doctor.intro-VI" /></label>
                        <textarea
                            className='form-control'
                            // rows='4'
                            onChange={(event) => this.handleOnChangetext(event, 'descriptionVi')}
                            value={this.state.descriptionVi}
                            placeholder='...'
                        >
                        </textarea>
                    </div>
                    <div className='col-6 form-group'>

                        <label><FormattedMessage id="admin.manage-doctor.intro-EN" /></label>
                        <textarea
                            className='form-control'
                            // rows='4'
                            onChange={(event) => this.handleOnChangetext(event, 'descriptionEn')}
                            value={this.state.descriptionEn}
                            placeholder='...'
                        >
                        </textarea>
                    </div>

                </div>


                <div className='manage-doctor-editor'>
                    <label>Thông tin</label>
                    <MdEditor
                        style={{ height: '150px' }}
                        renderHTML={text => mdParser.render(text)}
                        onChange={this.handleEditorChangeVi}
                        value={this.state.contentMarkdownVi} />
                </div>
                <div className='manage-doctor-editor'>
                    <label>Thông tin</label>
                    <MdEditor
                        style={{ height: '150px' }}
                        renderHTML={text => mdParser.render(text)}
                        onChange={this.handleEditorChangeEn}
                        value={this.state.contentMarkdownEn} />
                </div>
                <button className={hasOldData === true ? 'save-content-doctor' : 'create-content-doctor'}
                    onClick={() => this.handleSaveDoctorInfor()}
                ><span>{hasOldData === true ? <FormattedMessage id="admin.manage-doctor.save" /> : <FormattedMessage id="admin.manage-doctor.add" />}</span>
                </button>
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {
        allDoctors: state.admin.allDoctors,
        language: state.app.language,
        allRequiredDoctorInfor: state.admin.allRequiredDoctorInfor
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchAllDoctors: () => dispatch(actions.fetchAllDoctors()),
        saveDetailDoctors: (data) => dispatch(actions.saveDetailDoctors(data)),
        getAllRequiredDoctorInfor: () => dispatch(actions.getAllRequiredDoctorInfor()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageDoctor);