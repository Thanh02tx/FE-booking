import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from "connected-react-router";
import * as actions from "../../store/actions";
import './Login.scss';
import { FormattedMessage } from 'react-intl';
import { handleLoginApi } from '../../services/userService';
import HomeHeader from '../HomePage/HomeHeader';
import { path } from '../../utils';

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            isShowPassword: false,
            errMessage: '',
            currentIndex: 0,
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


    handleOnChangeUsername = (event) => {
        this.setState({
            username: event.target.value
        });
    }

    handleOnChangePassword = (event) => {
        this.setState({
            password: event.target.value
        });
    }

    handleLogin = async () => {
        this.setState({
            errMessage: ''
        });
        try {
            let data = await handleLoginApi(this.state.username, this.state.password);
            if (data && data.errCode !== 0) {
                this.setState({
                    errMessage: data.message
                });
            }
            if (data && data.errCode === 0) {
                this.props.userLoginSuccess(data.user);
            }
        } catch (e) {
            if (e.response && e.response.data) {
                this.setState({
                    errMessage: e.response.data.message
                });
            }
        }
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
        this.props.history.push(path.REGISTER); 
    }
    handleForgotPassword = () => {
        this.props.history.push(path.FORGOT_PASSWORD); 
    }
    render() {
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
                        <div className='col-md-6 '>
                            <div className='login-content row'>
                                <div className='col-12 text-center text-login'>Login</div>
                                <div className='col-12 form-group login-input'>
                                    <label>Email:</label>
                                    <input type='text' className='form-control' placeholder='Enter your username'
                                        value={this.state.username}
                                        onChange={(event) => this.handleOnChangeUsername(event,)}
                                    />
                                </div>
                                <div className='col-12 form-group login-input'>
                                    <label>Password:</label>
                                    <div className='custom-input-password'>
                                        <input className='form-control' type={this.state.isShowPassword ? 'text' : 'password'} placeholder='Enter your password'
                                            value={this.state.password}
                                            onChange={(event) => this.handleOnChangePassword(event)}
                                            onKeyDown={(event) => this.handleKeyDown(event)} />
                                        <span onClick={this.handleShowHidePassword}>
                                            <i className={this.state.isShowPassword ? "fas fa-eye" : "fas fa-eye-slash"}></i>
                                        </span>
                                    </div>
                                </div>
                                <div className='col-12' style={{ color: 'red' }}> {this.state.errMessage}</div>
                                <div className='col-12 '>
                                    <button className='btn-login' onClick={this.handleLogin}>Login</button>
                                </div>
                                <div className='col-6 '>
                                    <span
                                        className='forgot-password'
                                        onClick={this.handleForgotPassword}
                                    >
                                        Quên mật khẩu
                                    </span>
                                </div>
                                <div className='col-6 text-right'>
                                    <span
                                        className='forgot-password'
                                        onClick={this.handleRegisterClick}
                                    >
                                        Đăng kí
                                    </span>
                                </div>
                                <div className='col-12 text-center'>
                                    <span className='text-other-login mt-3'>Or Login with: </span>
                                </div>
                                <div className='col-12 social-login'>
                                    <i className="fab fa-google-plus-g google"></i>
                                    <i className="fab fa-facebook-f facebook"></i>
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
        lang: state.app.language
    };
};

const mapDispatchToProps = dispatch => {
    return {
        navigate: (path) => dispatch(push(path)),
        userLoginSuccess: (userInfo) => dispatch(actions.userLoginSuccess(userInfo)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
