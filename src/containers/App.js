import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { ConnectedRouter as Router } from 'connected-react-router';
import { history } from '../redux'
import { ToastContainer } from 'react-toastify';
import { adminMenu, doctorMenu } from './Header/menuApp.js';

import { userIsAuthenticated, userIsNotAuthenticated } from '../hoc/authentication';

import { path } from '../utils'

import Home from '../routes/Home';
import Login from './Auth/Login';
import System from '../routes/System';
import Doctor from '../routes/Doctor.js';
import HomePage from './HomePage/HomePage.js';
import CustomScrollbars from '../components/CustomScrollbars.js';
import { CustomToastCloseButton } from '../components/CustomToast';
import ConfirmModal from '../components/ConfirmModal';
import DetailDoctor from './Patient/Doctor/DetailDoctor.js';
import VerifyEmail from './Patient/VerifyEmail.js';
import DetailSpecialty from './Patient/Specialty/DetailSpecialty.js';
import DetailClinic from './Patient/Clinic/DetailClinic.js';
import Register from './Auth/Register.js';
import DetailHandbook from './Patient/Handbook/DetailHandbook.js';
import ForgotPassword from './Auth/ForgotPassword.js';
import AllSpecialty from './Patient/Specialty/AllSpecialty.js';
import AllClinic from './Patient/Clinic/AllClinic.js';
import AllHandbook from './Patient/Handbook/AllHandbook.js';
import Account_Infor from './Patient/Account/Account_Infor.js';
import OutStandingDoctor from './Patient/Doctor/OutStandingDoctor.js';
import Patient_Record from './Patient/Account/Patient_Record.js';
import AppointmentBooking from './Patient/Doctor/AppointmentBooking.js';
import NoAccessPage from './Auth/NoAccessPage.js';
class App extends Component {

    handlePersistorState = () => {
        const { persistor } = this.props;
        let { bootstrapped } = persistor.getState();
        if (bootstrapped) {
            if (this.props.onBeforeLift) {
                Promise.resolve(this.props.onBeforeLift())
                    .then(() => this.setState({ bootstrapped: true }))
                    .catch(() => this.setState({ bootstrapped: true }));
            } else {
                this.setState({ bootstrapped: true });
            }
        }
    };

    componentDidMount() {
        this.handlePersistorState();
        const { isLoggedIn, userInfo } = this.props;
        if (isLoggedIn && userInfo.roleId === 'R3') {
            this.props.history.push('/home');
        }
    }

    render() {
        const { isLoggedIn, userInfo } = this.props;
        return (
            <Fragment>
                <Router history={history}>
                    <div className="main-container">
                        <ConfirmModal />


                        <div className="content-container">
                            <CustomScrollbars style={{ height: '100vh', width: '100%' }}>
                                <Switch>
                                    <Route path={path.HOME} exact component={(Home)} />
                                    {/* userIsNotAuthenticated */}
                                    <Route path={path.LOGIN} component={userIsNotAuthenticated(Login)} />
                                    <Route path="/no-access" component={NoAccessPage} />
                                    <Route path={path.SYSTEM} component={userIsAuthenticated(System)} />
                                    <Route path={'/doctor'} component={userIsAuthenticated(Doctor)} />
                                    <Route path={path.HOMEPAGE} component={HomePage} />
                                    <Route path={path.ACCOUNT_INFOR} component={Account_Infor} />
                                    <Route path={path.PATIENT_RECORD} component={Patient_Record} />
                                    <Route path={path.DETAIL_DOCTOR} component={DetailDoctor} />
                                    <Route path={path.DETAIL_HANDBOOK} component={DetailHandbook} />
                                    <Route path={path.ALL_HANDBOOK} component={AllHandbook} />
                                    <Route path={path.DETAIL_SPECIALTY} component={DetailSpecialty} />
                                    <Route path={path.ALL_SPECIALTY} component={AllSpecialty} />
                                    <Route path={path.DETAIL_CLINIC} component={DetailClinic} />
                                    <Route path={path.ALL_CLINIC} component={AllClinic} />
                                    <Route path={path.OUTSTANDING_DOCTOR} component={OutStandingDoctor} />
                                    <Route path={path.BOOKING} component={AppointmentBooking} />
                                    <Route path={path.VERIFY_EMAIL_BOOKING} component={VerifyEmail} />
                                    <Route path={path.REGISTER} component={Register} />
                                    <Route path={path.FORGOT_PASSWORD} component={ForgotPassword} />
                                </Switch>
                            </CustomScrollbars>
                        </div>

                        <ToastContainer
                            position='bottom-right'
                            autoClose={3000}
                            hideProgressBar={false}
                            newestOnTop={false}
                            rtl={false}
                            pauseOnFocusLoss
                            draggable
                            pauseOnHover
                        />
                    </div>
                </Router>
            </Fragment>
        )
    }
}

const mapStateToProps = state => {
    return {
        started: state.app.started,
        isLoggedIn: state.user.isLoggedIn,
        userInfo: state.user.userInfo,
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);