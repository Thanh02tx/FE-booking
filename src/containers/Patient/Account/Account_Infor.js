import React, { Component } from 'react';
import { connect } from "react-redux";
import { FormattedMessage } from 'react-intl';
import { LANGUAGES, path } from '../../../utils';
import NumberFormat from 'react-number-format';
import './Account_Infor.scss'
import HomeHeader from '../../HomePage/HomeHeader';
class Account_Infor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isShowPassword: false,
            password:'',
            newPassword:'',
            confirmPassword:''
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
    render() {
        let { listHandbook } = this.state
        return (
            <div className='account-container'>
                <HomeHeader />
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
                        <button className='btn btn-secondary px-2'>Thông tin tài khoản</button>
                        <button className='btn btn-secondary px-2 mx-2'>Đổi mật khẩu </button>
                    </div>
                    <div className='change-password'>
                    <div className='form-group child content-input'>
                            <label>Password:</label>
                            <div className='custom-input-password'>
                                <input className='form-control' type={this.state.isShowPassword ? 'text' : 'password'} placeholder='Enter your password'
                                    value={this.state.password}
                                    onChange={(event) => this.handleOnChangeInput(event, 'password')}
                                />
                                {/* <span onClick={this.handleShowHidePassword}>
                                    <i className={this.state.isShowPassword ? "fas fa-eye" : "fas fa-eye-slash"}></i>
                                </span> */}
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
                            <button className='btn btn-success my-2'>Xác nhận</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {
        language: state.app.language
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Account_Infor);
