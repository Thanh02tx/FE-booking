import React, { Component } from 'react';
import { connect } from "react-redux";
import { FormattedMessage } from 'react-intl';
import { LANGUAGES, CommonUtils } from '../../../utils';
import * as actions from '../../../store/actions';
import { Modal, ModalBody, ModalHeader, Button, ModalFooter } from 'reactstrap';
import './ManageClinic.scss';
import { toast } from 'react-toastify';
import { createNewClinic, getAllCodeService, getAllClinic, editClinic, deleteClinic } from '../../../services/userService';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import Select from 'react-select';
import { injectIntl } from 'react-intl';
const mdParser = new MarkdownIt();
class ManageClinic extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listClinic: [],
            listClinicApi: [],
            search: '',
            id: '',
            name: '',
            address: '',
            addressMap: '',
            imageBase64: '',
            descriptionHTMLVi: '',
            descriptionHTMLEn: '',
            descriptionMarkdownVi: '',
            descriptionMarkdownEn: '',
            listProvince: '',
            selectedProvince: '',
            isOpenModal: false,
            isOpenModalDelete:false,
            isShow: false,
            isCreate: true,
            nameDelete:'',
            errMessage:''

        }
    }
    async componentDidMount() {
        this.buildDataProvince()
        this.getAllDataClinic()
    }
    getAllDataClinic = async () => {
        let res = await getAllClinic();
        if (res && res.errCode === 0) {
            this.setState({
                listClinicApi: res.data,
                listClinic: res.data
            })
        }
    }
    async componentDidUpdate(prevProps, prevState, snaphot) {

        if (prevProps.language !== this.props.language) {
            this.buildDataProvince();
        }

    }
    handleOnChangeInput = (event, id) => {
        let copyState = { ...this.state };
        copyState[id] = event.target.value;
        this.setState({
            ...copyState
        })
    }
    handleEditorChangeVi = ({ html, text }) => {
        this.setState({
            descriptionHTMLVi: html,
            descriptionMarkdownVi: text
        })
    }
    handleEditorChangeEn = ({ html, text }) => {
        this.setState({
            descriptionHTMLEn: html,
            descriptionMarkdownEn: text
        })
    }
    buildDataProvince = async () => {
        let res = await getAllCodeService('PROVINCE');
        let inputData = []
        if (res && res.errCode === 0) {
            inputData = res.data
        }
        let result = [];
        let { language } = this.props;
        inputData.map((item, index) => {
            let object = {};
            let labelVi = `${item.valueVi}`;
            let labelEn = `${item.valueEn}`;
            object.label = language === LANGUAGES.VI ? labelVi : labelEn;
            object.value = item.keyMap;
            result.push(object);
        })
        this.setState({
            listProvince: result
        })

    }
    handleOnChangeImage = async (event) => {
        let data = event.target.files;
        let file = data[0];
        if (file) {
            let base64 = await CommonUtils.getBase64(file);
            this.setState({
                imageBase64: base64
            })
        }
    }
    handleAddNewClinic = async () => {
        this.setState({
            errMessage:''
        })
        let{language} = this.props
        let {name,address,addressMap,imageBase64,descriptionMarkdownEn,descriptionMarkdownVi,descriptionHTMLEn,descriptionHTMLVi,selectedProvince}= this.state
        if(!name||!address||!addressMap||!imageBase64||!descriptionMarkdownEn||!descriptionMarkdownVi||!selectedProvince){
            this.setState({
                errMessage:language===LANGUAGES.VI?'Vui lòng nhập đủ thông tin':'Please provide complete information'
            })
        }else{
            let res = await createNewClinic({
                name: this.state.name,
                address: this.state.address,
                addressMap: this.state.addressMap,
                imageBase64: this.state.imageBase64,
                descriptionHTMLVi: this.state.descriptionHTMLVi,
                descriptionHTMLEn: this.state.descriptionHTMLEn,
                descriptionMarkdownVi: this.state.descriptionMarkdownVi,
                descriptionMarkdownEn: this.state.descriptionMarkdownEn,
                provinceId: this.state.selectedProvince.value
            })
            if (res && res.errCode === 0) {
                this.getAllDataClinic()
                toast.success("Add new specialty succeed!")
                this.setState({
                    name: '',
                    address: '',
                    addressMap: '',
                    imageBase64: '',
                    descriptionHTMLVi: '',
                    descriptionMarkdownVi: '',
                    descriptionHTMLEn: '',
                    descriptionMarkdownEn: '',
                    selectedProvince: '',
                    isOpenModal:false
                })
            } else {
                toast.error("Something wrongs....")
            }
        }
        

    }
    handleChangeSelectedProvince = (selectedOption) => {
        this.setState({
            selectedProvince: selectedOption
        })
    }
    handleShow = () => {
        this.setState({
            isShow: !this.state.isShow
        })
    }
    closeModalClinic = () => {
        this.setState({
            isOpenModal: false,
            isCreate: true,
            name: '',
            address: '',
            addressMap: '',
            imageBase64: '',
            descriptionMarkdownVi: '',
            descriptionMarkdownEn: '',
            selectedProvince: '',
        })
    }
    handleCancel = () => {
        this.setState({
            name: '',
            address: '',
            addressMap: '',
            imageBase64: '',
            descriptionHTMLVi: '',
            descriptionMarkdownVi: '',
            descriptionHTMLEn: '',
            descriptionMarkdownEn: '',
            selectedProvince: '',
            isShow: false,
            isCreate: true
        })
    }
    handleEditClinic = (item) => {
        let provinceId = item.provinceId;
        let selectedProvince = this.state.listProvince.find(proItem => {
            return proItem && proItem.value === provinceId
        })
        this.setState({
            isOpenModal: true,
            isCreate: false,
            id: item.id,
            name: item.name,
            address: item.address,
            addressMap: item.addressMap,
            imageBase64: item.image,
            descriptionHTMLVi: item.descriptionHTMLVi,
            descriptionMarkdownVi: item.descriptionMarkdownVi,
            descriptionHTMLEn: item.descriptionHTMLEn,
            descriptionMarkdownEn: item.descriptionMarkdownEn,
            selectedProvince: selectedProvince,
        })
    }
    handleSaveClinic = async () => {
        this.setState({
            errMessage:''
        })
        let{language} = this.props
        let {id,name,address,addressMap,imageBase64,descriptionMarkdownEn,descriptionMarkdownVi,selectedProvince,descriptionHTMLEn,descriptionHTMLVi}= this.state
        if(!name||!address||!addressMap||!imageBase64||!descriptionMarkdownEn||!descriptionMarkdownVi||!selectedProvince){
            this.setState({
                errMessage:language===LANGUAGES.VI?'Vui lòng nhập đủ thông tin':'Please provide complete information'
            })
        }else {
            let res = await editClinic({
                id: id,
                name: name,
                address: address,
                addressMap: addressMap,
                imageBase64: imageBase64,
                descriptionHTMLVi: descriptionHTMLVi,
                descriptionMarkdownVi:descriptionMarkdownVi,
                descriptionHTMLEn:descriptionHTMLEn,
                descriptionMarkdownEn:descriptionMarkdownEn,
                provinceId:selectedProvince.value,
            })
            if (res && res.errCode === 0) {
                this.getAllDataClinic()
                toast.success("edit succeed!")
                this.setState({
                    id: '',
                    name: '',
                    address: '',
                    addressMap: '',
                    imageBase64: '',
                    descriptionHTMLVi: '',
                    descriptionMarkdownVi: '',
                    descriptionHTMLEn: '',
                    descriptionMarkdownEn: '',
                    selectedProvince: '',
                    isOpenModal: false,
                    isCreate: true
                })
            } else {
                toast.error("Something wrongs....")
            }
        }
        
    }
    handleDeleteClinic = async (item) => {
        
        this.setState({
            isOpenModalDelete:true,
            id:item.id,
            nameDelete:item.name

        })
    }
    handleConfirmDeleteClinic=async()=>{
        let res = await deleteClinic(this.state.id)
        if (res && res.errCode === 0) {
            this.getAllDataClinic();
            this.setState({
                isOpenModalDelete:false,
                nameDelete:'',
                id:''
            })
            toast.success('delete clinic succed')
        }
        else {
            toast.error("error")
        }
    }
    addClinic = () => {
        this.setState({
            isOpenModal: true,
        })
    }
    closeModalDeleteClinic=()=>{
        this.setState({
            isOpenModalDelete:false
        })
    }
    render() {
        let { isCreate, listClinic, listClinicApi, search, isOpenModal,nameDelete,isOpenModalDelete ,errMessage} = this.state;
        let { intl, language } = this.props;
        let namePlaceHolder = intl.formatMessage({ id: 'admin.manage-clinic.clinic-name' });
        let addressPlaceHolder = intl.formatMessage({ id: 'admin.manage-clinic.clinic-address' });
        let addressMapPlaceHolder = intl.formatMessage({ id: 'admin.manage-clinic.clinic-address-map' });
        let enterPlaceHolder = intl.formatMessage({ id: 'admin.manage-clinic.enter' });
        listClinic = listClinicApi.filter(item =>
            item.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().includes(
                search.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
            )
        );
        let seachPlaceholder = language === LANGUAGES.VI ? 'Nhập tên phòng khám để tìm kiếm' : 'Enter clinic name to search'
        return (
            <div className='mange-clinic-contianer container'>
                <div className='ms-title'><FormattedMessage id="admin.manage-clinic.title" /></div>
                <div className='d-flex justify-content-between align-items-center'>
                    <input
                        className='form-control search'
                        value={search}
                        onChange={(event) => this.handleOnChangeInput(event, 'search')}
                        placeholder={seachPlaceholder}
                    />
                    <button
                        className='btn btn-primary px-3 my-3'
                        onClick={() => this.addClinic()}
                    >
                        <FormattedMessage id="admin.manage-clinic.add-clinic" />
                    </button>
                </div>

                <div >
                    <table className='table' style={{ width: '100%' }}>
                        <thead>
                            <tr>
                                <th><FormattedMessage id="admin.manage-clinic.serial-number" /> </th>
                                <th><FormattedMessage id="admin.manage-clinic.clinic-name" /></th>
                                <th><FormattedMessage id="admin.manage-clinic.clinic-address" /></th>
                                <th><FormattedMessage id="admin.manage-clinic.action" /></th>
                            </tr>
                        </thead>
                        <tbody>
                            {listClinic.length > 0 ?
                                listClinic.map((item, index) => {
                                    return (
                                        <tr key={`clinic-${index}`}>
                                            <td>{index + 1}</td>
                                            <td>{item.name}</td>
                                            <td>{item.address}</td>
                                            <td>
                                                <div className='d-flex'>
                                                    <button className='btn-edit'
                                                        onClick={() => this.handleEditClinic(item)}
                                                    >
                                                        <i className='fas fa-pencil-alt'></i>
                                                    </button>
                                                    <button className='btn-delete'
                                                        onClick={() => this.handleDeleteClinic(item)}
                                                    >
                                                        <i className='fas fa-trash'></i>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })

                                :
                                <tr>
                                    <td colSpan={'4'} className='text-center'><FormattedMessage id="admin.manage-clinic.no-data" /></td>
                                </tr>
                            }
                        </tbody>
                    </table>
                </div>
                <Modal
                    isOpen={isOpenModal}
                    // className="modal-feedback-container"
                    size="lg"
                    centered
                >
                    <div className="modal-header">
                        <h5 className="modal-title">{language === LANGUAGES.VI ? 'Thêm Phòng khám' : 'Add Clinic'}</h5>
                        <button
                            type="button"
                            className="close"
                            onClick={() => this.closeModalClinic()}
                            aria-label="Close"
                        >
                            <span aria-hidden="true">x</span>
                        </button>
                    </div>
                    <ModalBody>
                        <div className='content-modal pl-2 pb-0'>
                            <div className='add-new-specialty row'>
                                <div className='col-md-6 form-group'>
                                    <label><FormattedMessage id="admin.manage-clinic.clinic-name" /></label>
                                    <input className='form-control' type='text'
                                        onChange={(event) => this.handleOnChangeInput(event, 'name')}
                                        value={this.state.name}
                                        placeholder={namePlaceHolder}
                                    />
                                </div>

                                <div className='col-md-6 form-group'>
                                    <label><FormattedMessage id="admin.manage-clinic.clinic-province" /></label>
                                    <Select
                                        value={this.state.selectedProvince}
                                        onChange={this.handleChangeSelectedProvince}
                                        options={this.state.listProvince}
                                        placeholder={<FormattedMessage id="admin.manage-clinic.clinic-province" />}
                                    />
                                </div>


                                <div className='col-md-6 form-group'>
                                    <label><FormattedMessage id="admin.manage-clinic.clinic-address" /></label>
                                    <input className='form-control' type='text'
                                        onChange={(event) => this.handleOnChangeInput(event, 'address')}
                                        value={this.state.address}
                                        placeholder={addressPlaceHolder}
                                    />
                                </div>
                                <div className='col-md-6 form-group'>
                                    <label><FormattedMessage id="admin.manage-clinic.clinic-image" /></label>
                                    <input className='form-control-file' type="file"
                                        onChange={(event) => this.handleOnChangeImage(event)}
                                    />
                                </div>


                                <div className='col-12 form-group'>
                                    <label><FormattedMessage id="admin.manage-clinic.clinic-address-map" /></label>
                                    <textarea className='form-control' type='text'
                                        onChange={(event) => this.handleOnChangeInput(event, 'addressMap')}
                                        value={this.state.addressMap}
                                        placeholder={addressMapPlaceHolder}
                                    />
                                </div>

                                <div className='col-12'>
                                    <label><FormattedMessage id="admin.manage-clinic.description-VI" /></label>
                                    <MdEditor
                                        style={{ minHeight: '100px' }}
                                        renderHTML={text => mdParser.render(text)}
                                        onChange={this.handleEditorChangeVi}
                                        value={this.state.descriptionMarkdownVi}
                                        placeholder={enterPlaceHolder}
                                    />
                                </div>

                                <div className='col-12'>
                                    <label><FormattedMessage id="admin.manage-clinic.description-EN" /></label>
                                    <MdEditor
                                        style={{ minHeight: '100px' }}
                                        renderHTML={text => mdParser.render(text)}
                                        onChange={this.handleEditorChangeEn}
                                        value={this.state.descriptionMarkdownEn}
                                        placeholder={enterPlaceHolder}
                                    />
                                </div>

                            </div>
                            <p className='text-danger m-0'>{errMessage}</p>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        {isCreate ?
                            <button
                                className='btn btn-success px-3 my-3'
                                onClick={() => this.handleAddNewClinic()}
                            >
                                <FormattedMessage id="admin.manage-clinic.add-clinic" />
                            </button>
                            :


                            <button
                                className='btn btn-success px-3 my-3'
                                onClick={() => this.handleSaveClinic()}
                            >
                                <FormattedMessage id="admin.manage-clinic.save" />
                            </button>
                        }
                        <Button color="secondary" onClick={() => this.closeModalClinic()}>
                            {language === LANGUAGES.VI ? 'Đóng' : 'Close'}
                        </Button>
                    </ModalFooter>
                </Modal>
                <Modal
                    isOpen={isOpenModalDelete}
                    // className="modal-feedback-container"
                    size="lg"
                    centered
                >
                    <div className="modal-header">
                        <h5 className="modal-title">{language === LANGUAGES.VI ? 'Xoá Phòng khám' : 'Delete Clinic'}</h5>
                        <button
                            type="button"
                            className="close"
                            onClick={() => this.closeModalDeleteClinic()}
                            aria-label="Close"
                        >
                            <span aria-hidden="true">x</span>
                        </button>
                    </div>
                    <ModalBody>
                        {language === LANGUAGES.VI
                            ? `Bạn chắc chắn muốn xoá phòng khám: ${nameDelete}?`
                            : `Are you sure you want to delete the clinic: ${nameDelete}?`
                        }
                    </ModalBody>
                    <ModalFooter>
                        <Button color="success" onClick={() => this.handleConfirmDeleteClinic()}>
                            {language === LANGUAGES.VI ? 'Xoá' : 'Delete'}
                        </Button>
                        <Button color="secondary" onClick={() => this.closeModalDeleteClinic()}>
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
        language: state.app.language,
        allRequiredDoctorInfor: state.admin.allRequiredDoctorInfor
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getAllRequiredDoctorInfor: () => dispatch(actions.getAllRequiredDoctorInfor()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(ManageClinic));
