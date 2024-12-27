import React, { Component } from 'react';
import { connect } from "react-redux";
import { FormattedMessage } from 'react-intl';
import { LANGUAGES } from '../../../utils';
import { getAllBookingAdmin, confirmAppointment, getAllClinic, getAllCodeService } from '../../../services/userService';
import ReactSelect from 'react-select';
import moment from 'moment';
import ModalDetailBooking from '../../Patient/Account/ModalDetailBooking';
import './ManageBooking.scss';
class ManageBooking extends Component {
    constructor(props) {
        super(props);
        const today = new Date();
        const formattedDate = today.toISOString().split('T')[0];
        this.state = {
            listBooking: [],
            listBookingApi: [],
            listClinic: [],
            listStatus: [],
            clinic: {},
            status: {},
            currentDate: formattedDate,
            idBooking: '',
            isOpenModalDetailBooking: false,
            search: ''
        }
    }

    async componentDidMount() {
        this._isMounted = true; // Đánh dấu rằng component đã mount
        let resClinic = await getAllClinic();
        if (resClinic && resClinic.errCode === 0) {
            this.setState({
                listClinic: this.buidDataClinic(resClinic.data)
            }, () => {
                this.setState({
                    clinic: this.state.listClinic[0]
                })
            })
        }
        let resStatus = await getAllCodeService('STATUS');
        if (resStatus && resStatus.errCode === 0) {
            this.setState({
                listStatus: this.buidDataStatus(resStatus.data)
            }, () => {
                this.setState({
                    status: this.state.listStatus[0]
                })
            })
        }

    }
    buidDataClinic = (data) => {
        let { language } = this.props
        let list = data.map((item) => ({
            value: item.id,
            label: item.name,
        }));
        if (list && list.length > 0) {
            list.unshift({
                value: 'ALL',
                label: language === LANGUAGES.VI ? 'Tất cả phòng khám' : 'All clinics',
            })
        }
        return list
    };

    buidDataStatus = (data) => {
        let { language } = this.props;
        let list = data.map((item) => ({
            value: item.keyMap,
            label: language === LANGUAGES.VI ? item.valueVi : item.valueEn,
        }));
        if (list && list.length > 0) {
            list.unshift({
                value: 'ALL',
                label: language === LANGUAGES.VI ? 'Tất cả' : 'All',
            })
        }
        return list
    };
    componentWillUnmount() {
        this._isMounted = false;
    }

    // getDataBooking = async () => {
    //     // Kiểm tra xem token có tồn tại không
    //     if (this.props.userInfo && this.props.userInfo.token) {
    //         try {
    //             let res = await getAllBookingAdmin(this.props.userInfo.token);
    //             // Chỉ cập nhật state nếu component đang mount
    //             if (res && res.errCode === 0 && this._isMounted) {
    //                 this.setState({
    //                     listBooking: res.data
    //                 });
    //             }
    //         } catch (error) {
    //             console.error("Lỗi khi lấy danh sách lịch hẹn:", error);
    //         }
    //     }
    // }

    async componentDidUpdate(prevProps) {
        if (this.props.userInfo !== prevProps.userInfo) {
            // this.getDataBooking();
        }
        if (this.props.language !== prevProps.language) {
            let resClinic = await getAllClinic();
            if (resClinic && resClinic.errCode === 0) {
                this.setState({
                    listClinic: this.buidDataClinic(resClinic.data)
                })
            }
            let resStatus = await getAllCodeService('STATUS');
            if (resStatus && resStatus.errCode === 0) {
                this.setState({
                    listStatus: this.buidDataStatus(resStatus.data)
                })
            }
        }
    }
    handleChangeSelect = (selected, name) => {
        this.setState({
            [name]: selected,
        });
    };
    handleDateChange = (event) => {
        this.setState({ currentDate: event.target.value });
    };
    handleFilter = async () => {
        let { userInfo } = this.props;
        const date = new Date(this.state.currentDate);
        date.setHours(date.getHours() - 7);
        const timestamp = date.getTime();
        console.log('sa', timestamp)
        if (userInfo && userInfo.token) {
            let res = await getAllBookingAdmin({
                clinic: this.state.clinic.value,
                status: this.state.status.value,
                date: timestamp
            }, userInfo.token)
            if (res && res.errCode === 0) {
                this.setState({
                    listBookingApi: res.data,
                    listBooking: res.data
                })
            }
        }

    }
    handleOnchangeInput = (event, id) => {
        this.setState({
            [id]: event.target.value
        })
    }
    closeDetailBookingModal = () => {
        this.setState({
            isOpenModalDetailBooking: false,
            idBooking: ''
        })
    }
    handleDetail = (id) => {
        this.setState({
            idBooking: id,
            isOpenModalDetailBooking: true
        })
    }
    render() {
        let { listBooking, listBookingApi, listClinic, listStatus, status, clinic, idBooking, search, isOpenModalDetailBooking } = this.state;
        let { language } = this.props;
        listBooking = listBookingApi.filter(item =>
            item.Patient_Record.email.toLowerCase().includes(search.toLowerCase())
        );
        let seachPlaceholder = language === LANGUAGES.VI ? 'Nhập email để tìm kiếm' : 'Enter email to search'
        return (
            <div className='manage-booking-container container'>
                <div className='title text-center'>
                    {language === LANGUAGES.VI ? 'Quản lý lịch hẹn' : 'Appointment Management'}
                </div>
                <div className='d-flex row'>
                    <div className='form-group col-3'>
                        <label> {language === LANGUAGES.VI ? 'Chọn Phòng khám' : 'Select Clinic'}</label>
                        <ReactSelect
                            value={clinic}
                            onChange={(selected) => this.handleChangeSelect(selected, 'clinic')}
                            options={listClinic}
                        />
                    </div>
                    <div className='form-group col-2'>
                        <label> {language === LANGUAGES.VI ? 'Chọn Trạng thái' : 'Select Status'}</label>
                        <ReactSelect
                            value={status}
                            onChange={(selected) => this.handleChangeSelect(selected, 'status')}
                            options={listStatus}
                        />
                    </div>
                    <div className='form-group col-3'>
                        <label> {language === LANGUAGES.VI ? 'Chọn Ngày' : 'Select Date'}</label>
                        <input className='form-control'
                            type='date'
                            value={this.state.currentDate}
                            onChange={this.handleDateChange}
                        />
                    </div>

                    <div className='form-group col-2'>
                        <label>.</label>
                        <div>
                            <button className='btn btn-primary'
                                onClick={() => this.handleFilter()}
                            >
                                {language === LANGUAGES.VI ? 'Lọc' : 'Filter'}
                            </button>
                        </div>
                    </div>
                </div>
                <div>
                    <input
                        className='form-control search'
                        value={search}
                        onChange={(event) => this.handleOnchangeInput(event, 'search')}
                        placeholder={seachPlaceholder}
                    />
                </div>
                <div className='fs-3 my-2'>
                    {language === LANGUAGES.VI ? 'Danh sách lịch hẹn:' : 'Appointment List:'}
                </div>
                <table className='table'>
                    <thead>
                        <tr>
                            <th>{language === LANGUAGES.VI ? 'STT' : 'No.'}</th>
                            <th>{language === LANGUAGES.VI ? 'Họ tên' : 'Full name'}</th>
                            <th>Email</th>
                            <th>{language === LANGUAGES.VI ? 'Trạng thái' : 'Status'}</th>
                            <th>{language === LANGUAGES.VI ? 'Bác sĩ' : 'Doctor'}</th>
                            <th>{language === LANGUAGES.VI ? 'Thời gian' : 'Time'}</th>
                            <th>{language === LANGUAGES.VI ? 'Phòng khám' : 'Clinic'}</th>
                            <th>{language === LANGUAGES.VI ? 'Hành động' : 'Actions'}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {listBooking.length > 0 ?
                            <>
                                {listBooking.map((item, index) => {
                                    return (
                                        <tr key={`bk-${index}`}>
                                            <td>{index + 1}</td>
                                            <td>{`${item.Patient_Record.firstName} ${item.Patient_Record.lastName}`}</td>
                                            <td>{item.Patient_Record.email}</td>
                                            <td>{language === LANGUAGES.EN ? item.statusData.valueEn : item.statusData.valueVi}</td>
                                            <td>{`${item.Schedule.doctorData.Doctor_Infor.positionData.valueVi} ${item.Schedule.doctorData.firstName} ${item.Schedule.doctorData.lastName}`}</td>
                                            <td>{`${moment(new Date(Number(item.Schedule.date))).format('DD/MM/YYYY')} ${item.Schedule.timeTypeData.valueVi}`}</td>
                                            <td>{item.Schedule.doctorData.Doctor_Infor.Clinic.name}</td>
                                            <td className='d-flex'>
                                                <button onClick={() => this.handleDetail(item.id)}>Chi tiết</button>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </>
                            : <tr>
                                <td colSpan={8} className='text-center'>{language === LANGUAGES.VI ? 'Không có dữ liệu' : 'No data'}</td>
                            </tr>
                        }
                    </tbody>
                </table>
                <ModalDetailBooking
                    idBooking={idBooking}
                    isOpenModalDetailBooking={isOpenModalDetailBooking}
                    closeDetailBookingModal={this.closeDetailBookingModal}
                    hideCancel={true}
                />
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn, // Trạng thái đăng nhập
        language: state.app.language, // Ngôn ngữ hiện tại
        userInfo: state.user.userInfo, // Thông tin người dùng
    };
};

const mapDispatchToProps = dispatch => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageBooking);
