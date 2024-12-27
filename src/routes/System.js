import React, { Component } from 'react';
import { connect } from "react-redux";
import { Redirect, Route, Switch } from 'react-router-dom';
import UserManage from '../containers/System/UserManage';
import UserRedux from '../containers/System/Admin/UserRedux';
import Header from '../containers/Header/Header';
import ManageDoctor from '../containers/System/Admin/ManageDoctor';
import ManageSpecialty from '../containers/System/Specialty/ManageSpecialty';
import ManageClinic from '../containers/System/Clinic/ManageClinic';
import ManageHandbook from '../containers/System/Handbook/ManageHandbook';
import ManageNewAppointment from '../containers/System/Admin/ManageNewAppointment';
import ManageSchedule from '../containers/System/Doctor/ManageSchedule';
import { adminMenu } from '../containers/Header/menuApp';
import { checkRole } from '../services/userService';
import VerticalNav from '../containers/Header/VerticalNav';
import ManageFeedback from '../containers/System/Admin/ManageFeedback';
import './System.scss';
import ManageBooking from '../containers/System/Admin/ManageBooking';

class System extends Component {
    state = {
        isLoading: true,  // Đang kiểm tra quyền
        hasAccess: false, // Người dùng có quyền truy cập hay không
    };

    async componentDidMount() {
        const { userInfo } = this.props;

        // Kiểm tra nếu không có token
        if (!userInfo || !userInfo.token) {
            this.setState({ isLoading: false, hasAccess: false });
            return;
        }

        try {
            // Gọi API để kiểm tra quyền
            const res = await checkRole(userInfo.token);
            console.log('ssd', res)

            if (res && res.errCode === 0 && res.role === 'admin') {
                this.setState({ hasAccess: true });
            } else {
                this.setState({ hasAccess: false });
            }
        } catch (error) {
            console.error("Error checking role:", error);
            this.setState({ hasAccess: false });
        } finally {
            // Cập nhật trạng thái khi hoàn thành
            this.setState({ isLoading: false });
        }
    }

    render() {
        const { systemMenuPath, isLoggedIn } = this.props;
        const { isLoading, hasAccess } = this.state;
        console.log('sfass', isLoading, hasAccess)
        console.log('sfaaaaass', this.props.userInfo)
        // Nếu người dùng chưa đăng nhập, điều hướng đến trang đăng nhập
        if (!isLoggedIn) {
            return <Redirect to="/login" />;
        }

        // Nếu vẫn đang tải dữ liệu, hiển thị thông báo "Loading..."
        if (isLoading) {
            return (
                <>
                    <Header />
                    <div>Loading...</div>
                </>

            )
        }

        // // Nếu không có quyền truy cập, điều hướng đến /no-access
        if (!hasAccess) {
            return <Redirect to="/no-access" />;
        }

        // Nếu có quyền truy cập, hiển thị các trang quản lý
        return (
            <div className='system-container'>
                {isLoggedIn && <VerticalNav menuApp={adminMenu} />}
                <div className='content'>
                    {/* {isLoggedIn && <Header menu={adminMenu} />} */}
                    <div className="system-content">
                        <div className="system-list">
                            <Switch>
                                <Route path="/system/user-manage" component={UserManage} />
                                <Route path="/system/user-redux" component={UserRedux} />
                                <Route path="/system/manage-doctor" component={ManageDoctor} />
                                <Route path="/system/manage-specialty" component={ManageSpecialty} />
                                <Route path="/system/manage-schedule" component={ManageSchedule} />
                                <Route path="/system/manage-feedback" component={ManageFeedback} />
                                <Route path="/system/manage-clinic" component={ManageClinic} />
                                <Route path="/system/manage-handbook" component={ManageHandbook} />
                                <Route path="/system/manage-booking" component={ManageBooking} />
                                <Route path="/system/manage-new-appointment" component={ManageNewAppointment} />
                                <Route component={() => <Redirect to={systemMenuPath} />} />
                            </Switch>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        systemMenuPath: state.app.systemMenuPath,
        isLoggedIn: state.user.isLoggedIn,
        language: state.app.language,
        userInfo: state.user.userInfo,
    };
};


export default connect(mapStateToProps)(System);
