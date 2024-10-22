import React, { Component } from 'react';
import { connect } from "react-redux";
import { FormattedMessage } from 'react-intl';
import { LANGUAGES, CommonUtils } from '../../../utils';
import NumberFormat from 'react-number-format';
import './ManageSpecialty.scss';
import { toast } from 'react-toastify';
import { createNewSpecialty } from '../../../services/userService';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import { getAllSpecialty,putEditSpecialty ,deleteSpecialty} from '../../../services/userService';
const mdParser = new MarkdownIt();
class ManageSpecialty extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listSpecialty: [],
            id:'',
            nameVi: '',
            nameEn: '',
            image:'',
            descriptionHTMLVi: '',
            descriptionMarkdownVi: '',
            descriptionHTMLEn: '',
            descriptionMarkdownEn: '',
            isShow: false,
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
                listSpecialty: res.data
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
        let res = await createNewSpecialty(this.state)
        if (res && res.errCode === 0) {
            toast.success("Add new specialty succeed!")
            this.setState({
                nameVi: '',
                nameEn: '',
                image: '',
                descriptionHTMLVi: '',
                descriptionMarkdownVi: '',
                descriptionHTMLEn: '',
                descriptionMarkdownEn: ''
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
        this.handleShow()
        let imageBase64 = new Buffer.from(item.image, 'base64').toString('binary');
        this.setState({
            id:item.id,
            nameVi: item.nameVi,
            nameEn: item.nameEn,
            descriptionHTMLEn: item.descriptionHTMLEn,
            descriptionHTMLVi: item.descriptionHTMLVi,
            descriptionMarkdownVi: item.descriptionMarkdownVi,
            descriptionMarkdownEn: item.descriptionMarkdownEn,
            image: imageBase64,
            isCreate: false
        })
    }
    handleSaveSpecialty=async()=>{
       let res = await putEditSpecialty({
            id:this.state.id,
            nameVi:this.state.nameVi,
            nameEn:this.state.nameEn,
            descriptionHTMLVi:this.state.descriptionHTMLVi,
            descriptionHTMLEn:this.state.descriptionHTMLEn,
            descriptionMarkdownVi:this.state.descriptionMarkdownVi,
            descriptionMarkdownEn:this.state.descriptionMarkdownEn,
            image:this.state.image
        })
        if(res&&res.errCode===0){
            toast.success("Edit specialty succeed!")
            this.setState({
                id:'',
                nameVi: '',
                nameEn: '',
                image: '',
                descriptionHTMLVi: '',
                descriptionMarkdownVi: '',
                descriptionHTMLEn: '',
                descriptionMarkdownEn: '',
                image:'',
                isShow:false,
                isCreate:true
            })
            this.getAllDataSpeacialty()
        }
        else{
            toast.error('Error')
        }
    }
    handleDeleteSpecialty=async(item)=>{
        let res = await deleteSpecialty(item.id)
        if(res&&res.errCode===0){
            this.getAllDataSpeacialty()
            toast.success('delete specialty succed')
        }else{
            toast.error('error')
        }
    }
    handleCancel=()=>{
        this.setState({
            id:'',
            nameVi: '',
            nameEn: '',
            image: '',
            descriptionHTMLVi: '',
            descriptionMarkdownVi: '',
            descriptionHTMLEn: '',
            descriptionMarkdownEn: '',
            image:'',
            isShow:false,
            isCreate:true
        })
    }
    render() {
        let { isShow, isCreate, listSpecialty } = this.state;
        return (
            <div className='mange-specialty-contianer container'>
                <div className='ms-title'><FormattedMessage id="admin.manage-specialty.title" /></div>
                <button
                    className='btn btn-primary px-3 my-3'
                    onClick={() => this.handleShow()}
                >
                    Thêm Chuyên khoa
                </button>
                {isShow &&
                    <div className='add-new-specialty row'>
                        <div className='col-4 form-group'>
                            <label><FormattedMessage id="admin.manage-specialty.specialty-name-VI" /></label>
                            <input className='form-control' type='text'
                                onChange={(event) => this.handleOnChangeInput(event, 'nameVi')}
                                value={this.state.nameVi}
                                placeholder='...'
                            ></input>
                        </div>
                        <div className='col-4 form-group'>
                            <label><FormattedMessage id="admin.manage-specialty.specialty-name-EN" /></label>
                            <input className='form-control' type='text'
                                onChange={(event) => this.handleOnChangeInput(event, 'nameEn')}
                                value={this.state.nameEn}
                                placeholder='...'
                            ></input>
                        </div>
                        <div className='col-4 form-group'>
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
                            />
                        </div>
                        <div className='col-12'>
                            <label><FormattedMessage id="admin.manage-specialty.description-EN" /></label>
                            <MdEditor
                                style={{ height: '150px' }}
                                renderHTML={text => mdParser.render(text)}
                                onChange={this.handleEditorChangeEn}
                                value={this.state.descriptionMarkdownEn}
                            />
                        </div>
                        <div className='col-12'>
                            {isCreate ?
                                <button
                                    className=' btn btn-success my-3 px-3'
                                    onClick={() => this.handleAddNewSpecialty()}
                                >
                                    Thêm Chuyên khoa
                                </button>
                                :
                                <>
                                    <button
                                        className='btn btn-success my-3 px-3'
                                        onClick={() => this.handleSaveSpecialty()}
                                    >
                                        Lưu thay đổi
                                    </button>
                                    <button
                                        className='btn btn-dark m-3 px-3'
                                        onClick={() => this.handleCancel()}
                                    >
                                        Huỷ
                                    </button>
                                </>
                            }
                        </div>
                    </div>
                }
                <div>
                    <table className='table '>
                        <thead>
                            <tr>
                                <th>STT</th>
                                <th>Name</th>
                                <th>Naem En</th>
                                <th>Action</th>
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

                                                <button
                                                    className='btn btn-warning mx-3'
                                                    onClick={() => this.handleEditSpecialty(item)}
                                                >
                                                    Sửa
                                                </button>



                                                <button
                                                    className='btn btn-danger'
                                                    onClick={() => this.handleDeleteSpecialty(item)}
                                                >
                                                    Xoá
                                                </button>
                                            </td>
                                        </tr>
                                    )
                                })
                                :
                                <tr>
                                    <td colSpan={'4'}>k có data</td>
                                </tr>
                            }
                        </tbody>
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
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageSpecialty);
