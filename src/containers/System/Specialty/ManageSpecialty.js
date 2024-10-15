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
            descriptionHTMLVi: '',
            descriptionMarkdownVi: '',
            descriptionHTMLEn: '',
            descriptionMarkdownEn: ''

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
                descriptionHTMLVi: '',
                descriptionMarkdownVi: '',
                descriptionHTMLEn: '',
                descriptionMarkdownEn: ''
            })
        } else {
            toast.error("Something wrongs....")
        }

    }
    render() {

        return (
            <div className='mange-specialty-contianer'>
                <div className='ms-title'><FormattedMessage id="admin.manage-specialty.title"/></div>

                <div className='add-new-specialty row'>
                    <div className='col-4 form-group'>
                        <label><FormattedMessage id="admin.manage-specialty.specialty-name-VI"/></label>
                        <input className='form-control' type='text'
                            onChange={(event) => this.handleOnChangeInput(event, 'nameVi')}
                            value={this.state.nameVi}
                            placeholder='...'
                        ></input>
                    </div>
                    <div className='col-4 form-group'>
                        <label><FormattedMessage id="admin.manage-specialty.specialty-name-EN"/></label>
                        <input className='form-control' type='text'
                            onChange={(event) => this.handleOnChangeInput(event, 'nameEn')}
                            value={this.state.nameEn}
                            placeholder='...'
                        ></input>
                    </div>
                    <div className='col-4 form-group'>
                        <label><FormattedMessage id="admin.manage-specialty.specialty-image"/></label>
                        <input className='form-control-file' type="file"

                            onChange={(event) => this.handleOnChangeImage(event)}
                        ></input>
                    </div>
                    <div className='col-12'>
                        <label><FormattedMessage id="admin.manage-specialty.description-VI"/> </label>
                        <MdEditor
                            style={{ height: '150px' }}
                            renderHTML={text => mdParser.render(text)}
                            onChange={this.handleEditorChangeVi}
                            value={this.state.descriptionMarkdownVi}
                        />
                    </div>
                    <div className='col-12'>
                        <label><FormattedMessage id="admin.manage-specialty.description-EN"/></label>
                        <MdEditor
                            style={{ height: '150px' }}
                            renderHTML={text => mdParser.render(text)}
                            onChange={this.handleEditorChangeEn}
                            value={this.state.descriptionMarkdownEn}
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
