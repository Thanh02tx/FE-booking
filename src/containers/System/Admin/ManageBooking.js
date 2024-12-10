import React, { Component } from 'react';
import { connect } from "react-redux";
import { FormattedMessage } from 'react-intl';
import { LANGUAGES } from '../../../utils';
import NumberFormat from 'react-number-format';
import { getAllBookingAdmin,confirmAppointment } from '../../../services/userService';
import './ManageBooking.scss';
class ManageBooking extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listBooking: [] // Danh sách lịch hẹn
        };
        this._isMounted = false; // Cờ kiểm tra trạng thái mount
    }

    componentDidMount() {
        this._isMounted = true; // Đánh dấu rằng component đã mount
        this.getDataBooking();
    }

    componentWillUnmount() {
        this._isMounted = false; // Đánh dấu rằng component đã unmount
    }

    getDataBooking = async () => {
        // Kiểm tra xem token có tồn tại không
        if (this.props.userInfo && this.props.userInfo.token) {
            try {
                let res = await getAllBookingAdmin(this.props.userInfo.token);
                // Chỉ cập nhật state nếu component đang mount
                if (res && res.errCode === 0 && this._isMounted) {
                    this.setState({
                        listBooking: res.data
                    });
                }
            } catch (error) {
                console.error("Lỗi khi lấy danh sách lịch hẹn:", error);
            }
        }
    }

    componentDidUpdate(prevProps) {
        // Khi thông tin userInfo thay đổi, gọi lại API để lấy dữ liệu mới
        if (this.props.userInfo !== prevProps.userInfo) {
            this.getDataBooking();
        }
    }
    handleConfirmAppointment=async(id)=>{
        let res = await confirmAppointment(id,this.props.userInfo.token)
        if(res&&res.errCode===0){
            this.getDataBooking()
        }
    }
    render() {
        let { listBooking } = this.state;
        console.log('sf',listBooking)
        return (
            <div className='manage-booking-container'>
                <div className='title text-center'>
                    Quản lý lịch hẹn
                </div>
                {listBooking.length > 0 ? (
                    <div className='content'>
                        <div >Danh sách lịch hẹn:</div>
                        {listBooking.map((item, index) => {
                            return (
                                <div className='child' key={`appointment-${index}`}>
                                    <div>{`${item.Patient_Record.firstName} ${item.Patient_Record.lastName}`}</div>
                                    <div>{item.Patient_Record.email}</div>
                                    <div>{item.Patient_Record.dateOfBirth}</div>
                                    <div>{`${item.Schedule.doctorData.Doctor_Infor.positionData.valueVi} ${item.Schedule.doctorData.firstName} ${item.Schedule.doctorData.lastName}`}</div>
                                    <div>{`${item.Schedule.date} ${item.Schedule.timeTypeData.valueVi}`}</div>
                                    <div>{item.Schedule.doctorData.Doctor_Infor.Specialty.nameVi}</div>
                                    <div>{item.Schedule.doctorData.Doctor_Infor.Clinic.name}</div>
                                    <div>{item.Schedule.doctorData.Doctor_Infor.Clinic.address}</div>
                                    <div> 
                                        <button onClick={()=>this.handleConfirmAppointment(item.id)}>Duyệt</button>
                                        <button>Huỷ</button>
                                    </div>
                                </div>
                        )
                        })}
                    </div>
                ) : (
                    <div>Không có lịch hẹn nào.</div>
                )}
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
