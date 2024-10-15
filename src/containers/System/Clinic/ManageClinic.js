import React, { Component } from 'react';
import { connect } from "react-redux";
import { FormattedMessage } from 'react-intl';
import { LANGUAGES, CommonUtils } from '../../../utils';
import NumberFormat from 'react-number-format';
import * as actions from '../../../store/actions';
import './ManageClinic.scss';
import { toast } from 'react-toastify';
import { createNewClinic ,getAllCodeService} from '../../../services/userService';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import Select from 'react-select';
const mdParser = new MarkdownIt();
class ManageClinic extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            address: '',
            addressMap: '',
            imageBase64: '',
            descriptionHTMLVi: '',
            descriptionHTMLEn: '',
            descriptionMarkdownVi: '',
            descriptionMarkdownEn: '',
            listProvince:'',
            selectedProvince:''

        }
    }
    async componentDidMount() {
        this.buildDataProvince()
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
    buildDataProvince=async()=>{
        let res= await getAllCodeService('PROVINCE');
        let inputData=[]
        if(res&&res.errCode===0){
            inputData=res.data
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
            listProvince:result
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
    handleSaveNewClinic = async () => {
        console.log('sds', this.state)
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
                selectedProvince:''
            })
        } else {
            toast.error("Something wrongs....")
        }

    }
    handleChangeSelectedProvince=(selectedOption)=>{
        this.setState({
            selectedProvince:selectedOption
        })
    }
    render() {

        return (
            <div className='mange-specialty-contianer container'>
                <div className='ms-title'><FormattedMessage id="admin.manage-clinic.title"/></div>

                <div className='add-new-specialty row'>
                    <div className='col-4 form-group'>
                        <label><FormattedMessage id="admin.manage-clinic.clinic-name"/> </label>
                        <input className='form-control' type='text'
                            onChange={(event) => this.handleOnChangeInput(event, 'name')}
                            value={this.state.name}
                            placeholder='.....'
                        ></input>
                    </div>

                    <div className='col-4 form-group'>
                        <label><FormattedMessage id="admin.manage-clinic.clinic-province"/></label>
                        <Select
                            value={this.state.selectedProvince}
                            onChange={this.handleChangeSelectedProvince}
                            options={this.state.listProvince}
                            placeholder={<FormattedMessage id="admin.manage-clinic.clinic-province" />}
                        />
                    </div>
                    <div className='col-4 form-group'>
                        <label><FormattedMessage id="admin.manage-clinic.clinic-image"/></label>
                        <input className='form-control-file' type="file"

                            onChange={(event) => this.handleOnChangeImage(event)}
                        ></input>
                    </div>
                    <div className='col-6 form-group'>
                        <label><FormattedMessage id="admin.manage-clinic.clinic-address"/></label>
                        <input className='form-control' type='text'
                            onChange={(event) => this.handleOnChangeInput(event, 'address')}
                            value={this.state.address}
                            placeholder='.....'
                        ></input>
                    </div>
                    <div className='col-6 form-group'>
                        <label><FormattedMessage id="admin.manage-clinic.clinic-address-map"/> </label>
                        <input className='form-control' type='text'
                            onChange={(event) => this.handleOnChangeInput(event, 'addressMap')}
                            value={this.state.addressMap}
                            placeholder='.....'
                        ></input>
                    </div>
                    <div className='col-12'>
                        <label><FormattedMessage id="admin.manage-clinic.description-VI"/></label>
                        <MdEditor
                            style={{ minHeight: '100px' ,}}
                            renderHTML={text => mdParser.render(text)}
                            onChange={this.handleEditorChangeVi}
                            value={this.state.descriptionMarkdownVi}
                        />
                    </div>
                    <div className='col-12'>
                        <label><FormattedMessage id="admin.manage-clinic.description-EN"/></label>
                        <MdEditor
                            style={{ minHeight: '100px' ,}}
                            renderHTML={text => mdParser.render(text)}
                            onChange={this.handleEditorChangeEn}
                            value={this.state.descriptionMarkdownEn}
                        />
                    </div>
                    <div className='col-12'>
                    <div ><iframe width={"100%"} height={"600"} frameBorder="0" scrolling="no" marginHeight="0" marginWidth="0" src="https://maps.google.com/maps?width=100%25&amp;height=600&amp;hl=en&amp;q=b%C3%AAnh%20vi%E1%BB%87n%20h%E1%BB%93ng%20ng%E1%BB%8Dc%20h%C3%A0%20n%E1%BB%99+(My%20Business%20Name)&amp;t=&amp;z=14&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"><a href="https://www.gps.ie/">gps devices</a></iframe></div>
                    </div>
                    <div className='col-12'>
                        <button className='btn-save-specialty'
                            onClick={() => this.handleSaveNewClinic()}
                        >Save</button>
                    </div>
                </div>


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

export default connect(mapStateToProps, mapDispatchToProps)(ManageClinic);
