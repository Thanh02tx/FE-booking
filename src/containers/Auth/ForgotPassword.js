import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from "connected-react-router";
import * as actions from "../../store/actions";
import './ForgotPassword.scss';
import { FormattedMessage } from 'react-intl';
import { sendMailOtp, checkUserByEmail, resetPassword } from '../../services/userService';
import HomeHeader from '../HomePage/HomeHeader';
import { LANGUAGES } from '../../utils';
import { toast } from 'react-toastify';

class ForgotPassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            confirmPassword: '',
            otp: '',
            otpcheck: '',
            isShowPassword: false,
            errMessage: '',
            currentIndex: 0,
            isShowOtp: false,
            isShowConfirm: false,
            images: [
                'https://th.bing.com/th/id/OIP.Zue-bL8wSMPXFHE_LSGlpgHaJu?w=143&h=187&c=7&r=0&o=5&dpr=1.4&pid=1.7',
                'https://th.bing.com/th/id/OIP.bhFafTC6FKECib5E-_e74gHaHa?w=187&h=187&c=7&r=0&o=5&dpr=1.4&pid=1.7',
                'https://th.bing.com/th/id/OIP.3yWV5ktCflQu4Eobl5BluQHaPf?w=115&h=187&c=7&r=0&o=5&dpr=1.4&pid=1.7'
            ],
        };
    }

    componentDidMount() {
        this.startCarousel();
    }

    componentWillUnmount() {
        this.stopCarousel();
    }

    startCarousel = () => {
        this.carouselInterval = setInterval(() => {
            this.setState(prevState => ({
                currentIndex: (prevState.currentIndex + 1) % prevState.images.length
            }));
        }, 5000); // 5000ms = 5s
    }

    stopCarousel = () => {
        clearInterval(this.carouselInterval);
    }

    handleIndicatorClick = (index) => {
        this.setState({ currentIndex: index });
    }

    handlePrevClick = () => {
        this.setState(prevState => ({
            currentIndex: (prevState.currentIndex - 1 + prevState.images.length) % prevState.images.length
        }));
    }

    handleNextClick = () => {
        this.setState(prevState => ({
            currentIndex: (prevState.currentIndex + 1) % prevState.images.length
        }));
    }


    handleOnChangeText = (event, id) => {
        let copyState = {
            ...this.state
        }
        copyState[id] = event.target.value
        this.setState({
            ...copyState
        });
    }

    handleShowHidePassword = () => {
        this.setState({
            isShowPassword: !this.state.isShowPassword
        });
    }

    handleKeyDown = (event) => {
        if (event.key === 'Enter' || event.keyCode === 13) {
            this.handleLogin();
        }
    }

    handleRegisterClick = () => {
        this.props.history.push('/register');
    }
    handleForgotPassword = async () => {
        this.setState({
            errMessage: ""
        })
        let userCheck = await checkUserByEmail(this.state.email)

        if (userCheck && userCheck.errCode === 0 && !userCheck.check) {
            this.setState({
                isShowOtp:true
            },async()=>{
                let res = await sendMailOtp({
                    email: this.state.email,
                    language: this.props.language
                })
                if (res && res.errCode === 0) {
                    this.setState({
                        otpcheck: res.data,
                    })
                }
                this.timeoutId = setTimeout(() => {
                    this.setState({
                        otp: '',
                        otpcheck: '',
                        isShowOtp: true,
                        errMessage: this.props.language === LANGUAGES.VI ? 
                            'Mã OTP đã hết hiệu lực' : 
                            'The OTP code has expired'
                    });
                }, 120000);
            })
            
        } else {
            this.setState({
                errMessage: this.props.language === LANGUAGES.VI ? 'Email này chưa được đăng ký tài khoản. Vui lòng kiểm tra lại '
                    : 'This email is not registered. Please check again'
            })
        }
    }
    handleConfrim = () => {
        let { otp, otpcheck } = this.state;
        if (otpcheck != '' && otpcheck == otp) {
            if (this.timeoutId) {
                clearTimeout(this.timeoutId);
                this.timeoutId = null; 
            }
            this.setState({
                isShowOtp:false,
                isShowConfirm: true
            })
        }
    }
    handleNewPassword = async () => {
        let { password, confirmPassword, email } = this.state;
        if (password === confirmPassword) {
            let res = await resetPassword({
                email: email,
                password: password
            })
            if (res && res.errCode === 0) {
                toast.success('reset password succed')
                this.setState({
                    otp: '',
                    email: '',
                    password: '',
                    confirmPassword: '',
                    isShowOtp: false,
                    isShowConfirm: false,
                })
            } else {
                toast.error("error")
            }
        }
        else {
            this.setState({
                errMessage: this.props.language === LANGUAGES.VI ? 'Mật khẩu không khớp' : 'Passwords do not match'
            })
        }
    }
    handleLoginClick=()=>{
        this.props.history.push('/login');
    }
    render() {
        let { isShowOtp, isShowConfirm } = this.state
        return (
            <div className="login-background">
                <HomeHeader
                    isShowBanner={false}
                />
                <div className='login-container'>
                    <div className='form-login row'>
                        <div className='col-md-6 list-img'>
                            <div id="carouselExampleIndicators" className="carousel slide" data-ride="carousel">
                                <ol className="carousel-indicators">
                                    {this.state.images.map((_, index) => (
                                        <li
                                            key={index}
                                            data-target="#carouselExampleIndicators"
                                            data-slide-to={index}
                                            className={this.state.currentIndex === index ? 'active' : ''}
                                            onClick={() => this.handleIndicatorClick(index)} // Thêm sự kiện onClick
                                        ></li>
                                    ))}
                                </ol>
                                <div className="carousel-inner">
                                    {this.state.images.map((image, index) => (
                                        <div key={index} style={{ backgroundImage: `url(${image})` }} className={`carousel-item ${this.state.currentIndex === index ? 'active' : ''}`}>
                                            {/* <img className="d-block w-100" src={image} alt={`Slide ${index + 1}`} /> */}
                                        </div>
                                    ))}
                                </div>
                                {/* Thêm sự kiện onClick cho nút điều khiển trước */}
                                <a className="carousel-control-prev" href="#carouselExampleIndicators" role="button" onClick={this.handlePrevClick}>
                                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                                    <span className="sr-only visually-hidden">Previous</span>
                                </a>
                                {/* Thêm sự kiện onClick cho nút điều khiển tiếp theo */}
                                <a className="carousel-control-next" href="#carouselExampleIndicators" role="button" onClick={this.handleNextClick}>
                                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                                    <span className="sr-only visually-hidden">Next</span>
                                </a>
                            </div>
                        </div>
                        <div className='col-md-6  '>
                            <div className='login-content row'>
                                <div className='col-12 text-center text-login'>Forgot Password</div>
                                <div className='col-12 form-group login-input'>
                                    <label>Email:</label>
                                    <input type='text' className='form-control' placeholder='Enter your username'
                                        value={this.state.email}
                                        onChange={(event) => this.handleOnChangeText(event, 'email')}
                                    />
                                </div>
                                {isShowOtp &&
                                    <div className='col-12 form-group login-input'>
                                        <label>OTP(có hiệu lực trong 120s):</label>
                                        <input type='text' className='form-control' placeholder='Enter your username'
                                            value={this.state.otp}
                                            onChange={(event) => this.handleOnChangeText(event, 'otp')}
                                        />
                                    </div>
                                }
                                {isShowConfirm &&
                                    <>
                                        <div className='col-12 form-group login-input'>
                                            <label>Password:</label>
                                            <div className='custom-input-password'>
                                                <input
                                                    className='form-control'
                                                    type={this.state.isShowPassword ? 'text' : 'password'}
                                                    placeholder='Enter your password'
                                                    value={this.state.password}
                                                    onChange={(event) => this.handleOnChangeText(event, 'password')}
                                                />
                                                <span onClick={this.handleShowHidePassword}>
                                                    <i className={this.state.isShowPassword ? "fas fa-eye" : "fas fa-eye-slash"}></i>
                                                </span>
                                            </div>
                                        </div>
                                        <div className='col-12 form-group login-input'>
                                            <label>Confirm Password:</label>
                                            <div className='custom-input-password'>
                                                <input
                                                    className='form-control'
                                                    type={this.state.isShowPassword ? 'text' : 'password'}
                                                    placeholder='Enter your password'
                                                    value={this.state.confirmPassword}
                                                    onChange={(event) => this.handleOnChangeText(event, 'confirmPassword')}
                                                />
                                                <span onClick={this.handleShowHidePassword}>
                                                    <i className={this.state.isShowPassword ? "fas fa-eye" : "fas fa-eye-slash"}></i>
                                                </span>
                                            </div>
                                        </div>
                                    </>
                                }
                                <div className='col-12' style={{ color: 'red' }}> {this.state.errMessage}</div>
                                <div className='col-12 '>
                                    {isShowConfirm ?
                                        <button className='btn-login' onClick={this.handleNewPassword}>Đặt lại mật khẩu</button>
                                        : <>
                                            {isShowOtp ?
                                                <button className='btn-login' onClick={this.handleConfrim}>Xác Nhận</button>
                                                :
                                                <button className='btn-login' onClick={this.handleForgotPassword}>Quên Mật khẩu</button>
                                            }
                                        </>
                                    }
                                </div>
                                <div className='col-6 '>
                                    <span
                                        className='forgot-password'
                                        onClick={this.handleLoginClick}
                                    >
                                        Đăng nhập
                                    </span>
                                </div>
                            </div>
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
        navigate: (path) => dispatch(push(path)),
        userLoginSuccess: (userInfo) => dispatch(actions.userLoginSuccess(userInfo)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ForgotPassword);
