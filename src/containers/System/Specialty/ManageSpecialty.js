import React, { Component } from 'react';
import { connect } from "react-redux";
import { FormattedMessage } from 'react-intl';
import { LANGUAGES, CommonUtils } from '../../../utils';
import { Modal, ModalBody, ModalHeader, Button, ModalFooter } from 'reactstrap';
import './ManageSpecialty.scss';
import { toast } from 'react-toastify';
import { createNewSpecialty } from '../../../services/userService';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import { getAllSpecialty, putEditSpecialty, deleteSpecialty } from '../../../services/userService';
import { injectIntl } from 'react-intl';
const mdParser = new MarkdownIt();
class ManageSpecialty extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listSpecialty: [],
            listSpecialtyApi: [],
            id: '',
            nameVi: '',
            nameEn: '',
            nameDelete: '',
            image: '',
            descriptionHTMLVi: '',
            descriptionMarkdownVi: '',
            descriptionHTMLEn: '',
            descriptionMarkdownEn: '',
            isOpenModal: false,
            isOpenModalDelete: false,
            isCreate: true,

        }
    }
    async componentDidMount() {
        this.getAllDataSpeacialty();
    }
    getAllDataSpeacialty = async () => {
        let res = await getAllSpecialty();
        if (res && res.errCode === 0) {
            this.setState({
                listSpecialty: res.data,
                listSpecialtyApi: res.data
            })
        }
    }
    async componentDidUpdate(prevProps, prevState, snaphot) {

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

    handleAddNewSpecialty = async () => {
        let res = await createNewSpecialty({
            nameVi: this.state.nameVi,
            nameEn: this.state.nameEn,
            image: this.state.image,
            descriptionHTMLVi: this.state.descriptionHTMLVi,
            descriptionMarkdownVi: this.state.descriptionMarkdownVi,
            descriptionHTMLEn: this.state.descriptionHTMLEn,
            descriptionMarkdownEn: this.state.descriptionMarkdownEn
        })
        if (res && res.errCode === 0) {
            toast.success("Add new specialty succeed!")
            this.getAllDataSpeacialty();
            this.setState({
                nameVi: '',
                nameEn: '',
                image: '',
                descriptionMarkdownVi: '',
                descriptionMarkdownEn: '',
                isOpenModal: false,
                search: ''
            })
        } else {
            toast.error("Something wrongs....")
        }

    }
    handleShow = () => {
        this.setState({
            isShow: !this.state.isShow
        })
    }
    handleEditSpecialty = async (item) => {
        // console.log('ssa',item)
        this.handleShow()
        // let imageBase64 = new Buffer(item.image, 'base64').toString('binary')
        this.setState({
            id: item.id,
            nameVi: item.nameVi,
            nameEn: item.nameEn,
            descriptionHTMLEn: item.descriptionHTMLEn,
            descriptionHTMLVi: item.descriptionHTMLVi,
            descriptionMarkdownVi: item.descriptionMarkdownVi,
            descriptionMarkdownEn: item.descriptionMarkdownEn,
            image: item.image,
            isOpenModal: true,
            isCreate: false
        })
    }
    closeModalDeleteSpeacity = () => {

        this.setState({
            isOpenModalDelete: false,
        })
    }
    handleSaveSpecialty = async () => {
        let res = await putEditSpecialty({
            id: this.state.id,
            nameVi: this.state.nameVi,
            nameEn: this.state.nameEn,
            descriptionHTMLVi: this.state.descriptionHTMLVi,
            descriptionHTMLEn: this.state.descriptionHTMLEn,
            descriptionMarkdownVi: this.state.descriptionMarkdownVi,
            descriptionMarkdownEn: this.state.descriptionMarkdownEn,
            image: this.state.image
        })
        if (res && res.errCode === 0) {
            toast.success("Edit specialty succeed!")
            this.setState({
                id: '',
                nameVi: '',
                nameEn: '',
                image: '',
                descriptionHTMLVi: '',
                descriptionMarkdownVi: '',
                descriptionHTMLEn: '',
                descriptionMarkdownEn: '',
                image: '',
                isOpenModal: false,
                isCreate: true
            })
            this.getAllDataSpeacialty()
        }
        else {
            toast.error('Error')
        }
    }
    handleDeleteSpecialty = async (item) => {
        let { language } = this.props;
        this.setState({
            isOpenModalDelete: true,
            nameDelete: language === LANGUAGES.VI ? item.nameVi : item.nameEn,
            id: item.id
        })
        // let res = await deleteSpecialty(item.id)
        // if (res && res.errCode === 0) {
        //     this.getAllDataSpeacialty()
        //     toast.success('delete specialty succed')
        // } else {
        //     toast.error('error')
        // }
    }
    handleConfirmDeleteSpeacity = async () => {
        let res = await deleteSpecialty(this.state.id)
        if (res && res.errCode === 0) {
            this.getAllDataSpeacialty()
            this.setState({
                isOpenModalDelete: false,
                id: ''
            })
            toast.success('delete specialty succed')
        } else {
            toast.error('error')
        }
    }
    handleCancel = () => {
        this.setState({
            id: '',
            nameVi: '',
            nameEn: '',
            image: '',
            descriptionHTMLVi: '',
            descriptionMarkdownVi: '',
            descriptionHTMLEn: '',
            descriptionMarkdownEn: '',
            image: '',
            isShow: false,
            isCreate: true
        })
    }
    closeModalSpeacity = () => {
        this.setState({
            isOpenModal: false,
            nameVi: '',
            nameEn: '',
            image: '',
            descriptionMarkdownVi: '',
            descriptionMarkdownEn: '',
            image: '',
        })
    }
    addSpecialty = () => {
        this.setState({
            isOpenModal: true
        })
    }
    render() {
        let { isCreate, nameDelete, listSpecialty, isOpenModal, listSpecialtyApi, isOpenModalDelete, search } = this.state;
        let { intl, language } = this.props;
        let nameViPlaceHolder = intl.formatMessage({ id: 'admin.manage-specialty.specialty-name-VI' });
        let nameEnPlaceHolder = intl.formatMessage({ id: 'admin.manage-specialty.specialty-name-EN' });
        let enterPlaceHolder = intl.formatMessage({ id: 'admin.manage-specialty.enter' });
        let seachPlaceholder = language === LANGUAGES.VI ? 'Nhập tên chuyên khoa để tìm kiếm' : 'Enter specialty name to search'
        listSpecialty = listSpecialtyApi.filter(item =>
        (
            (item.nameVi && typeof item.nameVi === 'string' && item.nameVi.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().includes(
                search && typeof search === 'string' ? search.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase() : ''
            )) ||
            (item.nameEn && typeof item.nameEn === 'string' && item.nameEn.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().includes(
                search && typeof search === 'string' ? search.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase() : ''
            ))
        )
        );
        return (
            <div className='mange-specialty-contianer container'>
                <div className='ms-title'><FormattedMessage id="admin.manage-specialty.title" /></div>
                <div className='d-flex justify-content-between align-items-center'>
                    <input
                        className='form-control search'
                        value={search}
                        onChange={(event) => this.handleOnChangeInput(event, 'search')}
                        placeholder={seachPlaceholder}
                    />
                    <button
                        className='btn btn-primary px-3 my-3'
                        onClick={() => this.addSpecialty()}
                    >
                        <FormattedMessage id="admin.manage-specialty.add-specialty" />
                    </button>
                </div>

                <div>
                    <table className='table '>
                        <thead>
                            <tr>
                                <th><FormattedMessage id="admin.manage-specialty.serial-number" /></th>
                                <th><FormattedMessage id="admin.manage-specialty.specialty-name-VI" /></th>
                                <th><FormattedMessage id="admin.manage-specialty.specialty-name-EN" /></th>
                                <th><FormattedMessage id="admin.manage-specialty.action" /></th>
                            </tr>
                        </thead>
                        <tbody>
                            {listSpecialty.length > 0 ?
                                listSpecialty.map((item, index) => {
                                    return (
                                        <tr key={`specialty-${index}`}>
                                            <td>{index + 1}</td>
                                            <td>{item.nameVi}</td>
                                            <td>{item.nameEn}</td>
                                            <td>
                                                <div className='d-flex'>
                                                    <button className='btn-edit'
                                                        onClick={() => this.handleEditSpecialty(item)}
                                                    >
                                                        <i className='fas fa-pencil-alt'></i>
                                                    </button>
                                                    <button className='btn-delete'
                                                        onClick={() => this.handleDeleteSpecialty(item)}
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
                                    <td colSpan={'4'} className='text-center'><FormattedMessage id="admin.manage-specialty.no-data" /></td>
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
                        <h5 className="modal-title">{language === LANGUAGES.VI ? 'Thêm chuyên khoa' : 'Add Specialty'}</h5>
                        <button
                            type="button"
                            className="close"
                            onClick={() => this.closeModalSpeacity()}
                            aria-label="Close"
                        >
                            <span aria-hidden="true">x</span>
                        </button>
                    </div>
                    <ModalBody>
                        <div className='content-modal pl-2 pb-0'>
                            <div className='add-new-specialty row'>
                                <div className='col-md-4  form-group'>
                                    <label><FormattedMessage id="admin.manage-specialty.specialty-name-VI" /></label>
                                    <input className='form-control' type='text'
                                        onChange={(event) => this.handleOnChangeInput(event, 'nameVi')}
                                        value={this.state.nameVi}
                                        placeholder={nameViPlaceHolder}
                                    ></input>
                                </div>
                                <div className='col-md-4 form-group'>
                                    <label><FormattedMessage id="admin.manage-specialty.specialty-name-EN" /></label>
                                    <input className='form-control' type='text'
                                        onChange={(event) => this.handleOnChangeInput(event, 'nameEn')}
                                        value={this.state.nameEn}
                                        placeholder={nameEnPlaceHolder}
                                    ></input>
                                </div>
                                <div className='col-md-4  form-group'>
                                    <label><FormattedMessage id="admin.manage-specialty.specialty-image" /></label>
                                    <input className='form-control-file' type="file"

                                        onChange={(event) => this.handleOnChangeImage(event)}
                                    ></input>
                                </div>
                                <div className='col-12'>
                                    <label><FormattedMessage id="admin.manage-specialty.description-VI" /> </label>
                                    <MdEditor
                                        style={{ height: '150px' }}
                                        renderHTML={text => mdParser.render(text)}
                                        onChange={this.handleEditorChangeVi}
                                        value={this.state.descriptionMarkdownVi}
                                        placeholder={enterPlaceHolder}
                                    />
                                </div>
                                <div className='col-12'>
                                    <label><FormattedMessage id="admin.manage-specialty.description-EN" /></label>
                                    <MdEditor
                                        style={{ height: '150px' }}
                                        renderHTML={text => mdParser.render(text)}
                                        onChange={this.handleEditorChangeEn}
                                        value={this.state.descriptionMarkdownEn}
                                        placeholder={enterPlaceHolder}
                                    />
                                </div>
                            </div>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        {isCreate ?
                            <button
                                className=' btn btn-success my-3 px-3'
                                onClick={() => this.handleAddNewSpecialty()}
                            >
                                <FormattedMessage id="admin.manage-specialty.add-specialty" />
                            </button>
                            :

                            <button
                                className='btn btn-success my-3 px-3'
                                onClick={() => this.handleSaveSpecialty()}
                            >
                                <FormattedMessage id="admin.manage-specialty.save" />
                            </button>
                        }
                        <Button color="secondary" onClick={() => this.closeModalSpeacity()}>
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
                        <h5 className="modal-title">{language === LANGUAGES.VI ? 'Xoá chuyên khoa' : 'Delete Specialty'}</h5>
                        <button
                            type="button"
                            className="close"
                            onClick={() => this.closeModalDeleteSpeacity()}
                            aria-label="Close"
                        >
                            <span aria-hidden="true">x</span>
                        </button>
                    </div>
                    <ModalBody>
                        {language === LANGUAGES.VI
                            ? `Bạn chắc chắn muốn xoá chuyên khoa: ${nameDelete}?`
                            : `Are you sure you want to delete the specialty: ${nameDelete}?`
                        }
                    </ModalBody>
                    <ModalFooter>
                        <Button color="success" onClick={() => this.handleConfirmDeleteSpeacity()}>
                            {language === LANGUAGES.VI ? 'Xoá' : 'Delete'}
                        </Button>
                        <Button color="secondary" onClick={() => this.closeModalDeleteSpeacity()}>
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
        language: state.app.language
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(ManageSpecialty));
