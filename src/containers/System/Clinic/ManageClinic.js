import React, { Component } from 'react';
import { connect } from "react-redux";
import { FormattedMessage } from 'react-intl';
import { LANGUAGES, CommonUtils } from '../../../utils';
import NumberFormat from 'react-number-format';
import * as actions from '../../../store/actions';
import './ManageClinic.scss';
import { toast } from 'react-toastify';
import { createNewClinic, getAllCodeService, getAllClinic ,editClinic,deleteClinic} from '../../../services/userService';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import Select from 'react-select';
const mdParser = new MarkdownIt();
class ManageClinic extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listClinic: [],
            id:'',
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
            isShow: false,
            isCreate: true,

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
                isShow:false
            })
        } else {
            toast.error("Something wrongs....")
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
            isShow:false,
            isCreate:true
        })
    }
    handleEditClinic=(item)=>{
        let provinceId = item.provinceId;
        let selectedProvince = this.state.listProvince.find(proItem => {
            return proItem && proItem.value === provinceId
        })
        this.setState({
            isShow:true,
            isCreate:false,
            id:item.id,
            name:item.name,
            address:item.address,
            addressMap:item.addressMap,
            imageBase64: item.image,
            descriptionHTMLVi: item.descriptionHTMLVi,
            descriptionMarkdownVi: item.descriptionMarkdownVi,
            descriptionHTMLEn: item.descriptionHTMLEn,
            descriptionMarkdownEn: item.descriptionMarkdownEn,
            selectedProvince: selectedProvince,
        })
    }
    handleSaveClinic=async()=>{
        let res = await editClinic({
            id:this.state.id,
            name:this.state.name,
            address:this.state.address,
            addressMap:this.state.addressMap,
            imageBase64: this.state.imageBase64,
            descriptionHTMLVi: this.state.descriptionHTMLVi,
            descriptionMarkdownVi: this.state.descriptionMarkdownVi,
            descriptionHTMLEn: this.state.descriptionHTMLEn,
            descriptionMarkdownEn: this.state.descriptionMarkdownEn,
            provinceId: this.state.selectedProvince.value,
        })
        if(res&&res.errCode===0){
            this.getAllDataClinic()
            toast.success("edit succeed!")
            this.setState({
                id:'',
                name: '',
                address: '',
                addressMap: '',
                imageBase64: '',
                descriptionHTMLVi: '',
                descriptionMarkdownVi: '',
                descriptionHTMLEn: '',
                descriptionMarkdownEn: '',
                selectedProvince: '',
                isShow:false,
                isCreate:true
            })
        } else {
            toast.error("Something wrongs....")
        }
    }
    handleDeleteClinic=async(item)=>{
        let res = await deleteClinic(item.id)
        if(res&&res.errCode===0){
            this.getAllDataClinic();
            toast.success('delete clinic succed')
        }
        else{
            toast.error("error")
        }
    }
    render() {
        let { isShow, isCreate, listClinic } = this.state;
        return (
            <div className='mange-specialty-contianer container'>
                <div className='ms-title'><FormattedMessage id="admin.manage-clinic.title" /></div>
                <div>
                    <button
                        className='btn btn-primary px-3 my-3'
                        onClick={() => this.handleShow()}
                    >
                        Thêm phòng khám
                    </button>
                </div>
                {isShow &&
                    <div className='add-new-specialty row'>
                        <div className='col-4 form-group'>
                            <label><FormattedMessage id="admin.manage-clinic.clinic-name" /> </label>
                            <input className='form-control' type='text'
                                onChange={(event) => this.handleOnChangeInput(event, 'name')}
                                value={this.state.name}
                                placeholder='.....'
                            ></input>
                        </div>

                        <div className='col-4 form-group'>
                            <label><FormattedMessage id="admin.manage-clinic.clinic-province" /></label>
                            <Select
                                value={this.state.selectedProvince}
                                onChange={this.handleChangeSelectedProvince}
                                options={this.state.listProvince}
                                placeholder={<FormattedMessage id="admin.manage-clinic.clinic-province" />}
                            />
                        </div>
                        <div className='col-4 form-group'>
                            <label><FormattedMessage id="admin.manage-clinic.clinic-image" /></label>
                            <input className='form-control-file' type="file"

                                onChange={(event) => this.handleOnChangeImage(event)}
                            ></input>
                        </div>
                        <div className='col-6 form-group'>
                            <label><FormattedMessage id="admin.manage-clinic.clinic-address" /></label>
                            <input className='form-control' type='text'
                                onChange={(event) => this.handleOnChangeInput(event, 'address')}
                                value={this.state.address}
                                placeholder='.....'
                            ></input>
                        </div>
                        <div className='col-6 form-group'>
                            <label><FormattedMessage id="admin.manage-clinic.clinic-address-map" /> </label>
                            <input className='form-control' type='text'
                                onChange={(event) => this.handleOnChangeInput(event, 'addressMap')}
                                value={this.state.addressMap}
                                placeholder='.....'
                            ></input>
                        </div>
                        <div className='col-12'>
                            <label><FormattedMessage id="admin.manage-clinic.description-VI" /></label>
                            <MdEditor
                                style={{ minHeight: '100px', }}
                                renderHTML={text => mdParser.render(text)}
                                onChange={this.handleEditorChangeVi}
                                value={this.state.descriptionMarkdownVi}
                            />
                        </div>
                        <div className='col-12'>
                            <label><FormattedMessage id="admin.manage-clinic.description-EN" /></label>
                            <MdEditor
                                style={{ minHeight: '100px', }}
                                renderHTML={text => mdParser.render(text)}
                                onChange={this.handleEditorChangeEn}
                                value={this.state.descriptionMarkdownEn}
                            />
                        </div>
                        <div className='col-12'>
                            {isCreate ?

                                <button
                                    className='btn btn-success px-3 my-3'
                                    onClick={() => this.handleAddNewClinic()}
                                >
                                    Thêm phòng khám
                                </button>

                                :
                                <>

                                    <button
                                        className='btn btn-success px-3 my-3'
                                        onClick={() => this.handleSaveClinic()}
                                    >
                                        Lưu thông tin
                                    </button>
                                    <button
                                        className='btn btn-dark px-3 m-3'
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
                    <table className='table'>
                        <thead>
                            <tr>
                                <th>STT</th>
                                <th>Name</th>
                                <th>Address</th>
                                <th>action</th>
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
                                                <button
                                                    className='btn btn-warning mx-3 px-3'
                                                    onClick={() => this.handleEditClinic(item)}
                                                >
                                                    Sửa
                                                </button>
                                                <button
                                                    className='btn btn-danger px-3'
                                                    onClick={() => this.handleDeleteClinic(item)}
                                                >
                                                    Xoá
                                                </button>
                                            </td>
                                        </tr>
                                    )
                                })

                                :
                                <tr>
                                    <td colSpan={'4'}>No data</td>
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
