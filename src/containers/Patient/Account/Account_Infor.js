import React, { Component } from 'react';
import { connect } from "react-redux";
import { FormattedMessage } from 'react-intl';
import { LANGUAGES, path } from '../../../utils';
import NumberFormat from 'react-number-format';
import './Account_Infor.scss';
import * as actions from "../../../store/actions";
import { changePassword, editUserHome } from '../../../services/userService';
import HomeHeader from '../../HomePage/HomeHeader';
import { toast } from 'react-toastify';
import _ from 'lodash';
class Account_Infor extends Component {
    constructor(props) {
        super(props);

        this.state = {
            id: '',
            firstName: '',
            lastName: '',
            phoneNumber: '',
            address: '',
            isShowPassword: false,
            password: '',
            newPassword: '',
            confirmPassword: '',
            errMessagePass: '',
            errMessageInfor: '',
            isChangPassword: false,
            isShowInfor: true,
            isChangInfor: false
        }
    }

    async componentDidMount() {
        if(this.props.user){
            this.setState({
                firstName: this.props.user.firstName? this.props.user.firstName: '',
                lastName: this.props.user.lastName?this.props.user.lastName: '',
                phoneNumber: this.props.user.phonenumber ?this.props.user.phonenumber : '',
                address: this.props.user.address ?this.props.user.address:''
            })
        }

    }
    async componentDidUpdate(prevProps, prevState, snaphot) {
        if (prevProps.user != this.props.user) {
            if(this.props.user){
                this.setState({
                    firstName: this.props.user.firstName? this.props.user.firstName: '',
                    lastName: this.props.user.lastName?this.props.user.lastName: '',
                    phoneNumber: this.props.user.phonenumber ?this.props.user.phonenumber : '',
                    address: this.props.user.address ?this.props.user.address:''
                })
            }
        }
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
                id: user.id,
                password: password,
                newPassword: newPassword
            })
            if (res && res.errCode === 0) {
                toast.success('Đổi mật khẩu thành công')
                this.setState({
                    errMessagePass: '',
                    isChangPassword: false,
                    isShowInfor: true
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
    handleSaveUser = async () => {
        let { firstName, lastName, phoneNumber, address, id } = this.state;
        this.setState({
            errMessageInfor: ''
        })
        let message = '';
        if (!firstName || !lastName || !address || !phoneNumber) {
            if (this.props.language === LANGUAGES.VI) {
                message = 'Vui lòng nhập đầy đủ thông tin.'
            } else {
                message = 'Please enter all required information.'
            }
        } else {
            let res = await editUserHome({
                id: id,
                firstName: firstName,
                lastName: lastName,
                address: address,
                phoneNumber: phoneNumber
            })
            if (res && res.errCode === 0) {
                this.props.userLoginSuccess(res.data);
                toast.success("Suar thoong tin thanhf coong")
                this.setState({
                    firstName: this.props.user.firstName,
                    lastName: this.props.user.lastName,
                    phoneNumber: this.props.user.phonenumber,
                    address: this.props.user.address,
                    isChangInfor: false
                })
                message = ''
            } else {
                toast.error('Lỗi')
            }
        }
        this.setState({
            errMessageInfor: message
        })
    }
    handleShowChangePassword = () => {
        this.setState({
            errMessagePass: '',
            isChangPassword: !this.state.isChangPassword,
            isShowInfor: !this.state.isShowInfor
        })
    }
    handleChangeInfor = () => {
        let { firstName, lastName, phonenumber, address, id } = this.props.user;
        this.setState({
            isChangPassword: false,
            isChangInfor: true,
            isShowInfor: true,
            id: id,
            firstName: firstName,
            lastName: lastName,
            phoneNumber: phonenumber,
            address: address
        })
    }
    handleOnChangetext = (event, id) => {
        this.props[id] = event.target.value
    }
    render() {
        let { errMessagePass, errMessageInfor, isChangPassword, isChangInfor, isShowInfor, firstName, lastName, address, phoneNumber } = this.state
        let { isLoggedIn } = this.props;
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
                                <span> /Thông tin tài khoản</span>
                            </p>
                        </div>

                        <div className='d-flex mt-2'>
                            <button
                                className='btn btn-secondary px-2'
                                onClick={() => this.handleChangeInfor()}
                            >
                                Sửa thông tin
                            </button>
                            <button
                                className='btn btn-secondary px-2 mx-2'
                                onClick={() => this.handleShowChangePassword()}
                            >
                                Đổi mật khẩu
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
                        {isShowInfor &&
                            <div className='account-infor'>
                                <div className='form-group child'>
                                    <label>First Name</label>
                                    <input
                                        className='form-control'
                                        type='text'
                                        onChange={(event) => this.handleOnChangeInput(event, 'firstName')}
                                        value={isChangInfor ? firstName : this.props.user.firstName}
                                        // readOnly={!isChangInfor}
                                    />
                                </div>
                                <div className='form-group child'>
                                    <label>last Name</label>
                                    <input
                                        className='form-control'
                                        type='text'
                                        onChange={(event) => this.handleOnChangeInput(event, 'lastName')}
                                        value={isChangInfor ? lastName : this.props.user.lastName}
                                        //readOnly={!isChangInfor}
                                    />
                                </div>
                                <div className='form-group child'>
                                    <label>Phone Number</label>
                                    <input
                                        className='form-control'
                                        type='text'
                                        onChange={(event) => this.handleOnChangeInput(event, 'phoneNumber')}
                                        value={isChangInfor ? phoneNumber : this.props.user.phonenumber}
                                        //readOnly={!isChangInfor}
                                    />
                                </div>
                                <div className='form-group child'>
                                    <label>Address</label>
                                    <input
                                        className='form-control'
                                        type='text'
                                        onChange={(event) => this.handleOnChangeInput(event, 'address')}
                                        value={isChangInfor ? address : this.props.user.address}
                                        //readOnly={!isChangInfor}
                                    />
                                </div>
                                {isChangInfor &&


                                    <div className='child'>
                                        <p>{errMessageInfor}</p>
                                        <button
                                            className='btn btn-primary my-2'
                                            onClick={() => { this.handleSaveUser() }}
                                        >
                                            Lưu thông tin
                                        </button>
                                    </div>

                                }
                            </div>
                        }
                    </div>
                    :
                    <div className='fs-3 text-center'>Bạn cần đăng nhập</div>
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
