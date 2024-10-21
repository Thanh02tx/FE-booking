import React, { Component } from 'react';
import { connect } from "react-redux";
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { LANGUAGES } from '../../../utils';
import './ManageHandbook.scss';
import { createNewHandbook } from '../../../services/userService';
import { toast } from 'react-toastify';
import { CommonUtils } from '../../../utils';
import { getAllHandbook, putEditHandbook, deleteHandbook } from '../../../services/userService';
const mdParser = new MarkdownIt();

class ManageHandbook extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: '',
            listHandbook: [],
            nameVi: '',
            nameEn: '',
            headingVi: '',
            headingEn: '',
            contentHTMLVi: '',
            contentMarkdownVi: '',
            contentHTMLEn: '',
            contnetMarkdownEn: '',
            listHeading: [],
            isShow: false,
            isCreate: true,
            editingIndex: ''
        };
    }
    async componentDidMount() {
        this.getAllDataHandbook()
    }
    getAllDataHandbook = async () => {
        let res = await getAllHandbook();
        if (res && res.errCode === 0) {
            this.setState({
                listHandbook: res.data
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
            contentHTMLEn: ''
        }));
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
            isCreate: false,
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
                isCreate: true
            });
        }
    }

    handleAddnewHandbook = async () => {
        let res = await createNewHandbook({
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
                isShow: false
            })
            toast.success('Succed!')
        }
        else {
            toast.error('Error!')
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
            imageBase64 = new Buffer.from(item.image, 'base64').toString('binary');
        }
        this.setState({
            id: item.id,
            image: imageBase64,
            nameVi: item.nameVi,
            nameEn: item.nameEn,
            listHeading: item.Handbook_Contents,
            isCreate: false,
            isShow: true,
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
                isShow: false
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
    render() {
        let { language } = this.props;
        let { isShow, isCreate, listHandbook, nameVi, nameEn } = this.state;
        return (
            <div className='manage-handbook-container container'>
                <div className='title p-4'>
                    Quản lý cẩm nang
                </div>
                <button
                    className='btn  btn-primary px-3'
                    onClick={() => this.handleShow()}
                >
                    Thêm cẩm nang
                </button>
                {isShow === true &&

                    <div>
                        <div className='row'>
                            <div className='col-md-4  form-group'>
                                <label>Tên VI</label>
                                <input
                                    className='form-control'
                                    type='text'
                                    onChange={(event) => this.handleInputChange(event, 'nameVi')}
                                    value={nameVi}
                                />
                            </div>
                            <div className='col-md-4 form-group'>
                                <label>Tên EN</label>
                                <input
                                    className='form-control'
                                    type='text'
                                    value={nameEn}
                                    onChange={(event) => this.handleInputChange(event, 'nameEn')}
                                />
                            </div>
                            <div className='col-md-4 form-group'>
                                <label>Ảnh</label>
                                <input
                                    className='form-control'
                                    type='file'
                                    onChange={(event) => this.handleOnChangeImage(event)}
                                />
                            </div>
                        </div>
                        <div className='nhap row'>
                            <div className='col-sm-6'>
                                <label>Tên mục VI</label>
                                <input
                                    className='form-control'
                                    type='text'
                                    value={this.state.headingVi}
                                    onChange={(event) => this.handleInputChange(event, 'headingVi')}
                                />
                            </div>
                            <div className='col-sm-6'>
                                <label>Tên mục EN</label>
                                <input
                                    className='form-control'
                                    type='text'
                                    value={this.state.headingEn}
                                    onChange={(event) => this.handleInputChange(event, 'headingEn')}
                                />
                            </div>
                            <div className='col-12'>
                                <label>Nội dung VI</label>
                                <MdEditor
                                    style={{ height: '150px' }}
                                    renderHTML={text => mdParser.render(text)}
                                    onChange={this.handleEditorChange('contentHTMLVi', 'contentMarkdownVi')}
                                    value={this.state.contentMarkdownVi}
                                />
                            </div>
                            <div className='col-12'>
                                <label>Nội dung EN</label>
                                <MdEditor
                                    style={{ height: '150px' }}
                                    renderHTML={text => mdParser.render(text)}
                                    onChange={this.handleEditorChange('contentHTMLEn', 'contentMarkdownEn')}
                                    value={this.state.contentMarkdownEn}
                                />
                            </div>
                        </div>

                        <button className='btn btn-light my-2' onClick={this.handleAddToList}>Thêm</button>




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
                                                            <div>{item.headingVi}</div>
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
                        <div>
                            {isCreate === true ?
                                <button
                                    className='btn btn-success m-3 px-4'
                                    onClick={this.handleAddnewHandbook}
                                >
                                    Xác nhận
                                </button> :
                                <button
                                    className='btn btn-dark my-2'
                                    onClick={this.handleSaveHandbook}
                                >
                                    Cập nhập
                                </button>
                            }

                        </div>
                    </div>
                }
                <div className='tb-handbook mt-3'>
                    <table className='table  '>
                        <tr>
                            <th>STT</th>
                            <th>Name Vi</th>
                            <th>Name En</th>
                            <th>Hành động</th>
                        </tr>
                        {listHandbook.length > 0 &&
                            listHandbook.map((item, index) => {
                                return (
                                    <tr key={`handbook-${index}`}>
                                        <td>{index + 1}</td>
                                        <td>{item.nameVi}</td>
                                        <td>{item.nameEn}</td>
                                        <td>
                                            {isCreate ?
                                                <button
                                                    className='btn btn-warning mx-3 px-3'
                                                    onClick={() => this.handleUpdateHandbook(item)}
                                                >
                                                    Sửa
                                                </button>
                                                :
                                                <button
                                                    className='btn btn-warning mx-3 px-3'
                                                    onClick={() => this.handleCancel()}
                                                >
                                                    Huỷ
                                                </button>
                                            }
                                            <button
                                                className='btn btn-danger px-3'
                                                onClick={() => this.handleDeleteHandbook(item)}
                                            >
                                                Xoá
                                            </button>
                                        </td>
                                    </tr>
                                )
                            })

                        }
                    </table>
                </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(ManageHandbook);
