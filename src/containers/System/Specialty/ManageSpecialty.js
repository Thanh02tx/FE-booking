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
const mdParser = new MarkdownIt();
class ManageSpecialty extends Component {
    constructor(props) {
        super(props);
        this.state = {
            nameVi: '',
            nameEn: '',
            imageBase64: '',
            descriptionHTML: '',
            descriptionMarkdown: ''

        }
    }
    async componentDidMount() {

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
    handleEditorChange = ({ html, text }) => {
        this.setState({
            descriptionHTML: html,
            descriptionMarkdown: text
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
    handleSaveNewSpecialty = async () => {
        console.log('sds', this.state)
        let res = await createNewSpecialty(this.state)
        if (res && res.errCode === 0) {
            toast.success("Add new specialty succeed!")
            this.setState({
                nameVi: '',
                nameEn: '',
                imageBase64: '',
                descriptionHTML: '',
                descriptionMarkdown: ''
            })
        } else {
            toast.error("Something wrongs....")
        }

    }
    render() {

        return (
            <div className='mange-specialty-contianer'>
                <div className='ms-title'>Quản lý chuyên khoa</div>

                <div className='add-new-specialty row'>
                    <div className='col-4 form-group'>
                        <label>Tên chuyên khoa VI</label>
                        <input className='form-control' type='text'
                            onChange={(event) => this.handleOnChangeInput(event, 'nameVi')}
                            value={this.state.nameVi}
                        ></input>
                    </div>
                    <div className='col-4 form-group'>
                        <label>Tên chuyên khoa EN</label>
                        <input className='form-control' type='text'
                            onChange={(event) => this.handleOnChangeInput(event, 'nameEn')}
                            value={this.state.nameEn}
                        ></input>
                    </div>
                    <div className='col-4 form-group'>
                        <label>Ảnh chuyên khoa</label>
                        <input className='form-control-file' type="file"

                            onChange={(event) => this.handleOnChangeImage(event)}
                        ></input>
                    </div>
                    <div className='col-12'>
                        <MdEditor
                            style={{ height: '350px' }}
                            renderHTML={text => mdParser.render(text)}
                            onChange={this.handleEditorChange}
                            value={this.state.descriptionMarkdown}
                        />
                    </div>
                    <div className='col-12'>
                        <button className='btn-save-specialty'
                            onClick={() => this.handleSaveNewSpecialty()}
                        >Save</button>
                    </div>
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
