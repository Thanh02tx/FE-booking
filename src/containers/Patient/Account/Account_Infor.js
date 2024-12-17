import React, { Component } from 'react';
import { connect } from "react-redux";
import { FormattedMessage } from 'react-intl';
import { LANGUAGES, path } from '../../../utils';
import NumberFormat from 'react-number-format';
import './Account_Infor.scss';
import * as actions from "../../../store/actions";
import { changePassword } from '../../../services/userService';
import HomeHeader from '../../HomePage/HomeHeader';
import { toast } from 'react-toastify';
import _ from 'lodash';
import NoAccessPage from '../../Auth/NoAccessPage';
class Account_Infor extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isShowPassword: false,
            password: '',
            newPassword: '',
            confirmPassword: '',
            errMessagePass: '',
            isChangPassword: false,
        }
    }

    async componentDidMount() {

    }
    async componentDidUpdate(prevProps, prevState, snaphot) {
    }

    returnHome = () => {
        this.props.history.push(path.HOMEPAGE)
    }
    handleOnChangeInput = (event, id) => {
        let copyState = { ...this.state }
        copyState[id] = event.target.value;
        this.setState({
            ...copyState
        })
    }
    handleShowHidePassword = () => {
        this.setState({
            isShowPassword: !this.state.isShowPassword
        });
    }
    handleChangePassword = async () => {
        let { password, newPassword, confirmPassword } = this.state;
        let { language, user } = this.props;
        let message = '';
        this.setState({
            errMessagePass: ''
        })
        if (!password || !newPassword || !confirmPassword) {
            if (language === LANGUAGES.VI) {
                message = 'Vui lòng nhập đầy đủ thông tin.'
            } else {
                message = 'Please enter all required information.'
            }
        } else if (newPassword != confirmPassword) {
            if (language === LANGUAGES.VI) {
                message = 'Mật khẩu mới và xác nhận không khớp.'
            } else {
                message = 'New password and confirmation do not match.'
            }
        } else {
            let res = await changePassword({
                password: password,
                newPassword: newPassword
            },user.token)
            if (res && res.errCode === 0) {
                toast.success('Đổi mật khẩu thành công')
                this.setState({
                    errMessagePass: '',
                    isChangPassword: false,
                    password:'',
                    newPassword:'',
                    confirmPassword:''
                })
            }
            else {
                toast.error('Đổi mật khẩu thất bại')
                if (language === LANGUAGES.VI) {
                    message = 'Mật khẩu cũ không đúng.'
                } else {
                    message = 'Old password is incorrect.'
                }

            }
        }
        this.setState({
            errMessagePass: message
        })
    }
    handleShowChangePassword = () => {
        this.setState({
            errMessagePass: '',
            isChangPassword: !this.state.isChangPassword,
        })
    }
    render() {
        let { errMessagePass, isChangPassword } = this.state
        let { isLoggedIn,language } = this.props;
        return (
            <div className='account-container'>
                <HomeHeader />
                {isLoggedIn ?
                    <div className='container'>
                        <div>
                            <p className='m-0'>
                                <i
                                    className="fas fa-home"
                                    onClick={() => this.returnHome()}
                                ></i>
                                <span> /{language===LANGUAGES.VI?'Đổi mật khẩu':'Change Password'}</span>
                            </p>
                        </div>

                        <div className='d-flex mt-2'>
                            <button
                                className='btn btn-secondary px-2 mx-2'
                                onClick={() => this.handleShowChangePassword()}
                            >
                                {language===LANGUAGES.VI?'Đổi mật khẩu':'Change Password'}
                            </button>
                        </div>
                        {isChangPassword &&
                            <div className='change-password'>
                                <div className='form-group child content-input'>
                                    <label>Password:</label>
                                    <div className='custom-input-password'>
                                        <input className='form-control' type={this.state.isShowPassword ? 'text' : 'password'} placeholder='Enter your password'
                                            value={this.state.password}
                                            onChange={(event) => this.handleOnChangeInput(event, 'password')}
                                        />
                                        <span onClick={this.handleShowHidePassword}>
                                            <i className={this.state.isShowPassword ? "fas fa-eye" : "fas fa-eye-slash"}></i>
                                        </span>
                                    </div>
                                </div>
                                <div className='form-group child content-input'>
                                    <label>New Password:</label>
                                    <div className='custom-input-password'>
                                        <input className='form-control' type={this.state.isShowPassword ? 'text' : 'password'} placeholder='Enter your password'
                                            value={this.state.newPassword}
                                            onChange={(event) => this.handleOnChangeInput(event, 'newPassword')}
                                        />
                                        <span onClick={this.handleShowHidePassword}>
                                            <i className={this.state.isShowPassword ? "fas fa-eye" : "fas fa-eye-slash"}></i>
                                        </span>
                                    </div>
                                </div>
                                <div className='form-group child content-input'>
                                    <label>Confirm Password:</label>
                                    <div className='custom-input-password'>
                                        <input className='form-control' type={this.state.isShowPassword ? 'text' : 'password'} placeholder='Enter your password'
                                            value={this.state.confirmPassword}
                                            onChange={(event) => this.handleOnChangeInput(event, 'confirmPassword')}
                                        />
                                        <span onClick={this.handleShowHidePassword}>
                                            <i className={this.state.isShowPassword ? "fas fa-eye" : "fas fa-eye-slash"}></i>
                                        </span>
                                    </div>
                                </div>
                                <div className='child'>
                                    <p>{errMessagePass}</p>
                                </div>
                                <div className='child'>
                                    <button
                                        onClick={() => this.handleChangePassword()}
                                        className='btn btn-success my-2'
                                    >
                                        Xác nhận
                                    </button>
                                </div>
                            </div>
                        }
                    </div>
                    :
                    <NoAccessPage/>
                }
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        user: state.user.userInfo,
        isLoggedIn: state.user.isLoggedIn
    };
};

const mapDispatchToProps = dispatch => {
    return {
        userLoginSuccess: (userInfo) => dispatch(actions.userLoginSuccess(userInfo)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Account_Infor);
