import React, { Component } from 'react';
import { connect } from "react-redux";
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Modal, ModalBody, ModalHeader, Button, ModalFooter } from 'reactstrap';
import { LANGUAGES } from '../../../utils';
import './ManageHandbook.scss';
import { createNewHandbook } from '../../../services/userService';
import { toast } from 'react-toastify';
import { CommonUtils } from '../../../utils';
import { getAllHandbook, putEditHandbook, deleteHandbook } from '../../../services/userService';
import { FormattedMessage } from 'react-intl';
import { injectIntl } from 'react-intl';
import { lang } from 'moment';
const mdParser = new MarkdownIt();

class ManageHandbook extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: '',
            listHandbook: [],
            listHandbookApi: [],
            nameVi: '',
            nameEn: '',
            headingVi: '',
            headingEn: '',
            contentHTMLVi: '',
            contentMarkdownVi: '',
            contentHTMLEn: '',
            contnetMarkdownEn: '',
            listHeading: [],
            errMessageHeading: '',
            errMessageHandbook: '',
            isShow: false,
            isCreateHandbook: true,
            isCreateHeading: true,
            editingIndex: '',
            search: '',
            isOpenModalHandbook: false,
            showFormHeading: false

        };
    }
    async componentDidMount() {
        this.getAllDataHandbook()
    }
    getAllDataHandbook = async () => {
        let res = await getAllHandbook();
        if (res && res.errCode === 0) {
            this.setState({
                listHandbook: res.data,
                listHandbookApi: res.data
            })
        }
    }
    // Hàm xử lý khi nhập dữ liệu cho trường 'x'
    handleInputChange = (event, id) => {
        let copyState = { ...this.state }
        copyState[id] = event.target.value;
        this.setState({ ...copyState });
    }

    // Hàm xử lý khi editor thay đổi cho 'y'
    handleEditorChange = (HTML, Markdown) => ({ html, text }) => {
        let copyState = { ...this.state }
        copyState[HTML] = html
        copyState[Markdown] = text
        this.setState({ ...copyState });
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

    handleAddToList = () => {
        const { headingVi, headingEn, contentMarkdownVi, contentMarkdownEn, contentHTMLVi, contentHTMLEn } = this.state;
        let { language } = this.props;
        this.setState({
            errMessageHeading: ''
        })
        if (!headingEn || !headingVi || !contentMarkdownEn || !contentMarkdownVi) {
            this.setState({
                errMessageHeading: language === LANGUAGES.VI ? 'Vui lòng nhập đủ thông tin' : 'Please provide complete information'
            })
        } else {
            const newItem = {
                headingVi: headingVi,
                headingEn: headingEn,
                contentMarkdownVi: contentMarkdownVi,
                contentMarkdownEn: contentMarkdownEn,
                contentHTMLVi: contentHTMLVi,
                contentHTMLEn: contentHTMLEn
            };

            // Thêm đối tượng vào mảng và reset lại các trường
            this.setState(prevState => ({
                listHeading: [...prevState.listHeading, newItem],
                headingVi: '',
                headingEn: '',
                contentMarkdownVi: '',
                contentMarkdownEn: '',
                contentHTMLVi: '',
                contentHTMLEn: '',
                isCreateHeading: true,
                showFormHeading: false
            }));
        }

    }

    // Hàm xử lý khi kéo thả thay đổi vị trí
    handleOnDragEnd = (result) => {
        if (!result.destination) return;

        const items = Array.from(this.state.listHeading);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        this.setState({ listHeading: items });
    }

    // Hàm xử lý khi xóa một phần tử khỏi danh sách
    handleDeleteItem = (index) => {
        const updatedList = this.state.listHeading.filter((item, i) => i !== index);
        this.setState({ listHeading: updatedList });
    }
    handleUpdateItem = (index) => {
        let itemToEdit = this.state.listHeading[index];

        this.setState({
            headingVi: itemToEdit.headingVi,
            headingEn: itemToEdit.headingEn,
            contentMarkdownVi: itemToEdit.contentMarkdownVi,
            contentMarkdownEn: itemToEdit.contentMarkdownEn,
            contentHTMLVi: itemToEdit.contentHTMLVi,
            contentHTMLEn: itemToEdit.contentHTMLEn,
            editingIndex: index,
            isCreateHeading: false,
            showFormHeading: true
        });
    }
    handleSaveItem = () => {

        if (this.state.editingIndex !== '') {
            let updatedList = [...this.state.listHeading]; // Tạo bản sao của listHeading

            // Cập nhật lại thông tin của item đang chỉnh sửa
            updatedList[this.state.editingIndex] = {
                headingVi: this.state.headingVi,
                headingEn: this.state.headingEn,
                contentMarkdownVi: this.state.contentMarkdownVi,
                contentMarkdownEn: this.state.contentMarkdownEn,
                contentHTMLVi: this.state.contentHTMLVi,
                contentHTMLEn: this.state.contentHTMLEn
            };
            this.setState({
                listHeading: updatedList,
                headingVi: '',
                headingEn: '',
                contentMarkdownVi: '',
                contentMarkdownEn: '',
                contentHTMLVi: '',
                contentHTMLEn: '',
                editingIndex: '',
                isCreateHeading: true,
                showFormHeading: false
            });
        }
    }

    handleAddnewHandbook = async () => {
        let { nameVi, nameEn, image, listHeading } = this.state;
        let { language } = this.props;
        this.setState({
            errMessageHandbook: ''
        })
        if (!nameEn || !nameVi || !image || !listHeading) {
            this.setState({
                errMessageHandbook: language === LANGUAGES.VI ? 'Vui lòng nhập đủ thông tin cẩm nang' : 'Please provide complete handbook information'
            })
        } else {
            let res = await createNewHandbook({
                nameVi: nameVi,
                nameEn: nameEn,
                image: image,
                listHeading: listHeading
            })
            if (res && res.errCode === 0) {
                this.getAllDataHandbook()
                this.setState({
                    nameVi: '',
                    nameEn: '',
                    image: '',
                    listHeading: [],
                    isOpenModalHandbook: false,

                })
                toast.success('Succed!')
            }
            else {
                toast.error('Error!')
            }
        }


    }
    handleShow = () => {
        this.setState({
            isShow: !this.state.isShow,
        })
    }
    handleUpdateHandbook = (item) => {
        let imageBase64 = ''
        if (item.image) {
            imageBase64 = Buffer.from(item.image, 'base64').toString('binary');
        }
        this.setState({
            id: item.id,
            image: imageBase64,
            nameVi: item.nameVi,
            nameEn: item.nameEn,
            listHeading: item.Handbook_Contents,
            isOpenModalHandbook: true,
            isCreateHandbook: false

        })
    }
    handleSaveHandbook = async () => {
        console.log('dfsf', this.state)
        let res = await putEditHandbook({
            id: this.state.id,
            nameVi: this.state.nameVi,
            nameEn: this.state.nameEn,
            image: this.state.image,
            listHeading: this.state.listHeading
        })
        if (res && res.errCode === 0) {
            this.getAllDataHandbook()
            this.setState({
                nameVi: '',
                nameEn: '',
                image: '',
                listHeading: [],
                isOpenModalHandbook: false,
                isCreateHandbook: true
            })
            toast.success('Succed!')
        }
        else {
            toast.error('Error!')
        }

    }
    handleDeleteHandbook = async (item) => {
        let res = await deleteHandbook(item.id)
        if (res && res.errCode === 0) {
            this.getAllDataHandbook()
            toast.success('Succed!')
        } else {
            toast.error('Error!')
        }
    }
    closeModalHandbook = () => {
        this.setState({
            isOpenModalHandbook: false,
            image: '',
            nameVi: '',
            nameEn: '',
            listHeading: []
        })
    }
    handleCancel = () => {
        this.setState({
            nameVi: '',
            nameEn: '',
            image: '',
            listHeading: [],
            isCreate: true,
            isShow: false
        })
    }
    handleCancelEditItem = () => {
        this.setState({
            isCreateHeading: true,
            showFormHeading: false
        })
    }
    addHandbook = () => {
        this.setState({
            isOpenModalHandbook: true,
            showFormHeading:false
        })
    }
    addHeading = () => {
        this.setState({
            showFormHeading: true
        })
    }
    render() {
        let { language, intl } = this.props;
        let { isShow, isCreate, listHandbook, listHandbookApi, nameVi, nameEn, search, isCreateHandbook, showFormHeading, isCreateHeading, isOpenModalHandbook, errMessageHeading, errMessageHandbook } = this.state;
        let nameViPlaceHolder = intl.formatMessage({ id: 'admin.manage-handbook.name-VI' });
        let nameEnPlaceHolder = intl.formatMessage({ id: 'admin.manage-handbook.name-EN' });
        let headingViPlaceHolder = intl.formatMessage({ id: 'admin.manage-handbook.heading-VI' });
        let headingEnPlaceHolder = intl.formatMessage({ id: 'admin.manage-handbook.heading-EN' });
        let contentPlaceHolder = intl.formatMessage({ id: 'admin.manage-handbook.enter' });
        let seachPlaceholder = language === LANGUAGES.VI ? 'Nhập tên cẩm nang để tìm kiếm' : 'Enter handbook name to search'
        listHandbook = listHandbookApi.filter(item =>
            item.nameVi.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().includes(
                search.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
            ) || item.nameEn.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().includes(
                search.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
            )
        );
        return (
            <div className='manage-handbook-container container'>
                <div className='title'>
                    <FormattedMessage id="admin.manage-handbook.title" />
                </div>
                <div className='d-flex justify-content-between align-items-center'>
                    <input
                        className='form-control search'
                        value={search}
                        onChange={(event) => this.handleInputChange(event, 'search')}
                        placeholder={seachPlaceholder}
                    />
                    <button
                        className='btn  btn-primary px-3 my-3'
                        onClick={() => this.addHandbook()}
                    >
                        <FormattedMessage id="admin.manage-handbook.add-handbook" />
                    </button>
                </div>
                <div className='tb-handbook mt-3'>
                    <table className='table  '>
                        <tr>
                            <th><FormattedMessage id="admin.manage-handbook.serial-number" /></th>
                            <th><FormattedMessage id="admin.manage-handbook.name-VI" /></th>
                            <th><FormattedMessage id="admin.manage-handbook.name-EN" /></th>
                            <th><FormattedMessage id="admin.manage-handbook.action" /></th>
                        </tr>
                        {listHandbook.length > 0 ?
                            listHandbook.map((item, index) => {
                                return (
                                    <tr key={`handbook-${index}`}>
                                        <td>{index + 1}</td>
                                        <td>{item.nameVi}</td>
                                        <td>{item.nameEn}</td>
                                        <td>
                                            <div className='d-flex'>
                                                <button className='btn-edit'
                                                    onClick={() => this.handleUpdateHandbook(item)}
                                                >
                                                    <i className='fas fa-pencil-alt'></i>
                                                </button>
                                                <button className='btn-delete'
                                                    onClick={() => this.handleDeleteHandbook(item)}
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
                                <td colSpan={4} className='text-center'>{language === LANGUAGES.VI ? 'Không có dữ liệu' : 'No data'}</td>
                            </tr>

                        }
                    </table>
                </div>
                <Modal
                    isOpen={isOpenModalHandbook}
                    className="modal-feedback-container"
                    size="lg"
                    centered
                >
                    <div className="modal-header">
                        <h5 className="modal-title">{language === LANGUAGES.VI ? 'Thêm cẩm nang' : 'Add handbook'}</h5>
                        <button
                            type="button"
                            className="close"
                            onClick={() => this.closeModalHandbook()}
                            aria-label="Close"
                        >
                            <span aria-hidden="true">x</span>
                        </button>
                    </div>
                    <ModalBody>
                        <div className='content-modal pl-2 pb-0'>
                            <div>
                                <div className='row'>
                                    <div className='col-md-4  form-group'>
                                        <label><FormattedMessage id="admin.manage-handbook.name-VI" /></label>
                                        <input
                                            className='form-control'
                                            type='text'
                                            onChange={(event) => this.handleInputChange(event, 'nameVi')}
                                            value={nameVi}
                                            placeholder={nameViPlaceHolder}
                                        />
                                    </div>
                                    <div className='col-md-4 form-group'>
                                        <label><FormattedMessage id="admin.manage-handbook.name-EN" /></label>
                                        <input
                                            className='form-control'
                                            type='text'
                                            value={nameEn}
                                            onChange={(event) => this.handleInputChange(event, 'nameEn')}
                                            placeholder={nameEnPlaceHolder}
                                        />
                                    </div>
                                    <div className='col-md-4 form-group'>
                                        <label><FormattedMessage id="admin.manage-handbook.image" /></label>
                                        <input
                                            className='form-control'
                                            type='file'
                                            onChange={(event) => this.handleOnChangeImage(event)}

                                        />
                                    </div>
                                </div>
                                <div className='py-2 border-top border-bottom'>
                                    {isCreateHeading ?
                                        <button
                                            className='btn btn-secondary'
                                            onClick={() => this.addHeading()}
                                        >
                                            {language === LANGUAGES.VI ? 'Thêm đề mục' : 'Add heading'}
                                        </button>
                                        :
                                        <p>{language === LANGUAGES.VI ? 'Sửa đề mục' : 'Edit heading'}</p>
                                    }

                                    {showFormHeading &&
                                        <div className='content-modal pl-2 pb-0'>
                                            <div className='nhap row'>
                                                <div className='col-sm-6'>
                                                    <label><FormattedMessage id="admin.manage-handbook.heading-VI" /></label>
                                                    <input
                                                        className='form-control'
                                                        type='text'
                                                        value={this.state.headingVi}
                                                        onChange={(event) => this.handleInputChange(event, 'headingVi')}
                                                        placeholder={headingViPlaceHolder}
                                                    />
                                                </div>
                                                <div className='col-sm-6'>
                                                    <label><FormattedMessage id="admin.manage-handbook.heading-EN" /></label>
                                                    <input
                                                        className='form-control'
                                                        type='text'
                                                        value={this.state.headingEn}
                                                        onChange={(event) => this.handleInputChange(event, 'headingEn')}
                                                        placeholder={headingEnPlaceHolder}
                                                    />
                                                </div>
                                                <div className='col-12'>
                                                    <label><FormattedMessage id="admin.manage-handbook.content-VI" /></label>
                                                    <MdEditor
                                                        style={{ height: '150px' }}
                                                        renderHTML={text => mdParser.render(text)}
                                                        onChange={this.handleEditorChange('contentHTMLVi', 'contentMarkdownVi')}
                                                        value={this.state.contentMarkdownVi}
                                                        placeholder={contentPlaceHolder}
                                                    />
                                                </div>
                                                <div className='col-12'>
                                                    <label><FormattedMessage id="admin.manage-handbook.content-EN" /></label>
                                                    <MdEditor
                                                        style={{ height: '150px' }}
                                                        renderHTML={text => mdParser.render(text)}
                                                        onChange={this.handleEditorChange('contentHTMLEn', 'contentMarkdownEn')}
                                                        value={this.state.contentMarkdownEn}
                                                        placeholder={contentPlaceHolder}
                                                    />
                                                </div>
                                            </div>
                                            <p className='text-danger m-0'>{errMessageHeading}</p>
                                            {isCreateHeading ?
                                                <button
                                                    className='btn btn-light my-2'
                                                    onClick={() => this.handleAddToList()}
                                                >
                                                    <FormattedMessage id="admin.manage-handbook.add" />
                                                </button> :
                                                <>
                                                    <button
                                                        className='btn btn-light my-2'
                                                        onClick={() => this.handleSaveItem()}
                                                    >
                                                        {language === LANGUAGES.VI ? 'Lưu đề mục' : 'Save heading'}
                                                    </button>
                                                    <button
                                                        className='btn btn-light my-2'
                                                        onClick={() => this.handleCancelEditItem()}
                                                    >
                                                        {language === LANGUAGES.VI ? 'Huỷ' : 'Cancel'}
                                                    </button>
                                                </>

                                            }


                                        </div>
                                    }
                                </div>
                                <div className='xy-list'>
                                    <h5>Danh sách các đề mục</h5>


                                    <DragDropContext onDragEnd={this.handleOnDragEnd}>
                                        <Droppable droppableId="xyList">
                                            {(provided) => (
                                                <ul className='list-group' {...provided.droppableProps} ref={provided.innerRef}>
                                                    {this.state.listHeading.map((item, index) => (
                                                        <Draggable key={index} draggableId={`item-${index}`} index={index}>
                                                            {(provided) => (
                                                                <li
                                                                    className='list-group-item'
                                                                    ref={provided.innerRef}
                                                                    {...provided.draggableProps}
                                                                    {...provided.dragHandleProps}
                                                                >
                                                                    <div>{language === LANGUAGES.VI ? item.headingVi : item.headingEn}</div>
                                                                    <div dangerouslySetInnerHTML={{ __html: language === LANGUAGES.VI ? item.contentHTMLVi : item.contentHTMLEn }} />

                                                                    <div>
                                                                        <button
                                                                            className='btn btn-danger mx-3'
                                                                            onClick={() => this.handleDeleteItem(index)}
                                                                        >
                                                                            Xóa
                                                                        </button>

                                                                        <button
                                                                            className='btn btn-warning'
                                                                            onClick={() => this.handleUpdateItem(index)}
                                                                        >
                                                                            Sửa
                                                                        </button>
                                                                    </div>
                                                                </li>
                                                            )}
                                                        </Draggable>
                                                    ))}
                                                    {provided.placeholder}
                                                </ul>
                                            )}
                                        </Droppable>
                                    </DragDropContext>
                                </div>

                            </div>
                            <p className='text-danger m-0'>{errMessageHandbook}</p>

                        </div>
                    </ModalBody>
                    <ModalFooter>
                        {isCreateHandbook ?
                            <Button
                                onClick={() => this.handleAddnewHandbook()}
                            >
                                {language === LANGUAGES.VI ? 'Thêm mới' : 'Add new'}
                            </Button>
                            :
                            <Button
                                onClick={() => this.handleSaveHandbook()}
                            >
                                {language === LANGUAGES.VI ? 'Lưu cẩm nang' : 'save handbook'}
                            </Button>
                        }
                        <Button color="secondary" onClick={() => this.closeModalHandbook()}>
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
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(ManageHandbook));
