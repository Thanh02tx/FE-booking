import React, { Component } from 'react';
import { connect } from "react-redux";
import { Redirect, Route, Switch } from 'react-router-dom';
import ManageSchedule from '../containers/System/Doctor/ManageSchedule';
import Header from '../containers/Header/Header';
import ManagePatient from '../containers/System/Doctor/ManagePatient';
import { doctorMenu } from '../containers/Header/menuApp';
import { checkRole } from '../services/userService';
import VerticalNav from '../containers/Header/VerticalNav';

class Doctor extends Component {
    state = {
        isLoading: true, // Đang kiểm tra quyền
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
            console.log('API Response:', res);

            if (res && res.errCode === 0 && res.role === 'doctor') {
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
        const { isLoggedIn } = this.props;
        const { isLoading, hasAccess } = this.state;

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
            );
        }

        // Nếu không có quyền truy cập, điều hướng đến /no-access
        if (!hasAccess) {
            return <Redirect to="/no-access" />;
        }

        // Nếu có quyền truy cập, hiển thị các trang quản lý
        return (
            <div className='system-container'>
                {isLoggedIn && <VerticalNav menuApp={doctorMenu} />}

                <div className="content">
                    <div className="system-list">
                        <Switch>
                            <Route path="/doctor/manage-schedule" component={ManageSchedule} />
                            <Route path="/doctor/manage-patient" component={ManagePatient} />
                        </Switch>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        userInfo: state.user.userInfo,
    };
};

const mapDispatchToProps = dispatch => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(Doctor);
