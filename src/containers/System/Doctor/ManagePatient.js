import React, { Component } from 'react';
import { connect } from "react-redux";
import './ManagePatient.scss';
import DatePicker from '../../../components/Input/DatePicker';
import { getAllPatientForDoctor, postSendRemedy } from '../../../services/userService';
import moment from 'moment';
import { LANGUAGES } from '../../../utils';
import RemedyModal from './RemedyModal';
import { toast } from 'react-toastify';
import { last } from 'lodash';
import HomeFooter from '../../HomePage/HomeFooter';
import LoadingOverlay from 'react-loading-overlay';
class ManagePatient extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentDate: moment(new Date()).startOf('day').valueOf(),
            dataPatient: [],
            isOpenRemedyModal: false,
            idBooking: '',
            isShowLoading: false
        }
    }
    async componentDidMount() {
        await this.getDataPatient()
    }
    async componentDidUpdate(prevProps, prevState, snaphot) {

    }
    getDataPatient = async () => {
        let { user } = this.props;
        let { currentDate } = this.state;
        let formatedDate = new Date(currentDate).getTime();
        if(this.props.user.token){
            let res = await getAllPatientForDoctor({
                date: formatedDate
            },this.props.user.token)
            if (res && res.errCode === 0) {
                this.setState({
                    dataPatient: res.data
                })
            }
        }
        
    }
    handleOnChangeDatePicker = (date) => {
        this.setState({
            currentDate: date[0]
        }, async () => {
            await this.getDataPatient()
        })
    }
    handleBtnConfirm = (id) => {
        this.setState({
            isOpenRemedyModal: true,
            idBooking: id
        })
    }
    handleBtnRemede = () => {

    }
    closeRemedyModal = () => {
        this.setState({
            isOpenRemedyModal: false,
            idBooking: {}
        })
    }
    sendRemedy = async (dataChild) => {
        console.log('sffdddss',dataChild)
        this.setState({
            isShowLoading:true
        })
        let res = await postSendRemedy({
            imgBase64: dataChild.base64Image,
            language: this.props.language,
            email: dataChild.dataBooking.Patient_Record.email,
            firstName: dataChild.dataBooking.Patient_Record.firstName,
            lastName: dataChild.dataBooking.Patient_Record.lastName,
            idBooking:dataChild.dataBooking.id,
            patientId:dataChild.dataBooking.Patient_Record.id,
            nameClinic: dataChild.dataBooking.Schedule.doctorData.Doctor_Infor.Clinic.name,
        },this.props.user.token)
        if (res && res.errCode === 0) {
            this.setState({
                isShowLoading:false
            })
            toast.success('Send Remedy succeed!')
            this.closeRemedyModal()
            await this.getDataPatient()
        } else {
            this.setState({
                isShowLoading:false
            })
            toast.error('Something wrongs....')
        }
    }
    render() {
        let { dataPatient, isOpenRemedyModal, idBooking } = this.state;
        let { language } = this.props;
        console.log('sfaa',dataPatient)
        return (
            <>
                <LoadingOverlay
                    active={this.state.isShowLoading}
                    spinner
                    text='Loading ...'
                >
                    <div className='manage-patient-container container' >
                        <div className='m-p-title'>
                            Quản lý bệnh nhân khám bệnh
                        </div>
                        <div className='manage-patient-body row'>
                            <div className='col-4 form-group'>
                                <label>Chọn ngày khám</label>
                                <DatePicker
                                    onChange={this.handleOnChangeDatePicker}
                                    className='form-control'
                                    value={this.state.currentDate}
                                />
                            </div>
                            <div className='col-12 table-manage-patient'>
                                <table style={{ width: '100%' }}>
                                    <tbody>
                                        <tr>
                                            <th>STT</th>
                                            <th>Thời gian</th>
                                            <th>Họ và tên</th>
                                            <th>Ngày sinh</th>
                                            <th>lý do</th>
                                            <th>Actions</th>
                                        </tr>
                                        {dataPatient && dataPatient.length > 0 ?
                                            dataPatient.map((item, index) => {
                                                let name = LANGUAGES.EN === language ? `${item.Patient_Record.firstName} ${item.Patient_Record.lastName}` :
                                                    `${item.Patient_Record.lastName} ${item.Patient_Record.firstName}`
                                                let time = language === LANGUAGES.VI ? item.Schedule.timeTypeData.valueVi : item.Schedule.timeTypeData.valueEn
                                                return (
                                                    <tr key={index}>
                                                        <td>{index + 1}</td>
                                                        <td>{time}</td>
                                                        <td>{name}</td>
                                                        <td>{item.Patient_Record.dateOfBirth}</td>
                                                        <td>{item.reason}</td>
                                                        <td>
                                                            <button className='mp-btn-confirm'
                                                                onClick={() => this.handleBtnConfirm(item.id)}>Xác nhận</button>
            
                                                        </td>
                                                    </tr>
                                                )
                                            })
                                            : <tr>
                                                <td colSpan={'6'} style={{ textAlign: 'center' }}>no data</td>
                                            </tr>
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <RemedyModal
                        isOpenModal={isOpenRemedyModal}
                        idBooking={idBooking}
                        closeRemedyModal={this.closeRemedyModal}
                        sendRemedy={this.sendRemedy}
                    />
                    
                </LoadingOverlay>


            </>
        );
    }

}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        user: state.user.userInfo
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManagePatient);
