
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from "connected-react-router";
import * as actions from "../../store/actions";
import './Register.scss';
import { FormattedMessage } from 'react-intl';
import { handleLoginApi } from '../../services/userService';
import HomeHeader from '../HomePage/HomeHeader';
import { getAllCodeService, checkUserByEmail, sendMailOtp, createNewUserService } from '../../services/userService';
import Select from 'react-select';
import { LANGUAGES } from '../../utils';
import { toast } from 'react-toastify';
class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listGender: [],
            firstName: '',
            lastName: '',
            phoneNumber: '',
            email: '',
            address: '',
            gender: '',
            password: '',
            otp: '',
            otpcheck: '',

            confirmPassword: '',
            errMessage: '',
            isSignUp: true,
            isShowPassword: false,
            currentIndex: 0,
            images: [
                'https://th.bing.com/th/id/OIP.Zue-bL8wSMPXFHE_LSGlpgHaJu?w=143&h=187&c=7&r=0&o=5&dpr=1.4&pid=1.7',
                'https://th.bing.com/th/id/OIP.bhFafTC6FKECib5E-_e74gHaHa?w=187&h=187&c=7&r=0&o=5&dpr=1.4&pid=1.7',
                'https://th.bing.com/th/id/OIP.3yWV5ktCflQu4Eobl5BluQHaPf?w=115&h=187&c=7&r=0&o=5&dpr=1.4&pid=1.7'
            ],
        };
    }

    async componentDidMount() {
        this.startCarousel();
        await this.buildDataGender()
    }

    buildDataGender = async () => {
        let res = await getAllCodeService("GENDER");
        if (res && res.errCode === 0) {
            let list = res.data;
            let result = [];
            list.map((item, index) => {
                let object = {}
                object.label = LANGUAGES.VI === this.props.language ? item.valueVi : item.valueEn
                object.value = item.keyMap
                result.push(object)
            })
            this.setState({
                listGender: result
            })
        }
    }
    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.language != prevProps.language) {
            await this.buildDataGender()
        }
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


    handleOnChangeInput = (event, id) => {
        let copyState = { ...this.state }
        copyState[id] = event.target.value
        this.setState({
            ...copyState
        });
    }
    handleSelectedGender = (selected) => {
        this.setState({
            gender: selected
        })
    }

    handleSignUp = async () => {
        console.log('sfsa', this.state)
        this.setState({
            errMessage: ''
        });
        if (!this.state.email || !this.state.firstName || !this.state.lastName
            || !this.state.phoneNumber || !this.state.gender || !this.state.address
            || !this.state.password || !this.state.confirmPassword) {
            this.setState({
                errMessage: this.props.language === LANGUAGES.VI ? 'Bạn cần nhập đầy đủ thông tin' : 'You need to enter all required information'
            })
        } else {
            if (this.state.password != this.state.confirmPassword) {
                this.setState({
                    errMessage: this.props.language === LANGUAGES.VI ? 'Mật khẩu không khớp' : 'Passwords do not match.'
                })
            } else {
                let checkUser = await checkUserByEmail(this.state.email);
                if (checkUser && checkUser.errCode === 0 && checkUser.check) {
                    let res = await sendMailOtp({
                        email: this.state.email,
                        language: this.props.language
                    })
                    if (res && res.errCode === 0) {
                        this.setState({
                            otpcheck: res.data,
                            isSignUp: false
                        })
                    }
                    // sau 2p k nhập otp sẽ  .... code đoạn này
                    setTimeout(() => {
                        this.setState({
                            otp: '',
                            otpcheck: '',
                            isSignUp: true,
                            errMessage: this.props.language === LANGUAGES.VI ? 'Mã OTP đã hết hiệu lực' : 'The OTP code has expired'
                        });
                    }, 120000);
                }
                else {
                    this.setState({
                        errMessage: this.props.language === LANGUAGES.VI ? 'Email này đã được đăng ký. Vui lòng sử dụng email khác.' : 'This email is already registered. Please use a different email.'
                    })
                }


            }

        }

    }
    handleConfirm = async () => {
        if (this.state.otp == this.state.otpcheck) {

            let res=await createNewUserService({
                email: this.state.email,
                password: this.state.password,
                firstName: this.state.firstName,
                lastName: this.state.lastName,
                address: this.state.address,
                phonenumber: this.state.phoneNumber,
                gender: this.state.gender.value,
                roleId: 'R3',
                positionId: '',
                avatar: ''
            })
            if(res&&res.errCode===0){
                toast.success("create new user succed")
                this.handleLoginClick()
            }else {
                toast.error("error")
            }
        }
        else {
            this.setState({
                otp: '',
                otpcheck: '',
                isSignUp: true
            })
        }
    }
    handleShowHidePassword = () => {
        this.setState({
            isShowPassword: !this.state.isShowPassword
        });
    }


    handleLoginClick = () => {
        this.props.history.push('/login');
    }
    handleForgotPassword = () => {

    }


    render() {
        let { isSignUp } = this.state;
        return (
            <div className="register-background">
                <HomeHeader
                    isShowBanner={false}
                />
                <div className='register-container'>
                    <div className='form-register row'>
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

                            <div className='register-content row'>
                                <div className='col-12 text-center text-login'>Register</div>
                                <div className='col-sm-6 form-group content-input'>
                                    <label>FirstName:</label>
                                    <input

                                        value={this.state.firstName}
                                        className='form-control' placeholder='Eff'
                                        onChange={(event) => this.handleOnChangeInput(event, 'firstName')}
                                    />
                                </div>
                                <div className='col-sm-6 form-group content-input'>
                                    <label>LastName:</label>
                                    <input

                                        className='form-control' placeholder='Eff'
                                        value={this.state.lastName}
                                        onChange={(event) => this.handleOnChangeInput(event, 'lastName')}

                                    />
                                </div>
                                <div className='col-sm-6 form-group content-input'>
                                    <label>Email:</label>
                                    <input
                                        className='form-control'
                                        onChange={(event) => this.handleOnChangeInput(event, 'email')}
                                        value={this.state.email}
                                    />
                                </div>
                                <div className='col-sm-6 form-group content-input'>
                                    <label>PhoneNumber:</label>
                                    <input
                                        className='form-control'
                                        placeholder='Eff'
                                        value={this.state.phoneNumber}
                                        onChange={(event) => this.handleOnChangeInput(event, 'phoneNumber')}
                                    />
                                </div>
                                <div className='col-sm-6 form-group content-input'>
                                    <label>Sex:</label>
                                    <Select
                                        value={this.state.gender}
                                        onChange={this.handleSelectedGender}
                                        options={this.state.listGender}
                                    />
                                </div>
                                <div className='col-sm-6 form-group content-input'>
                                    <label>Địa chỉ:</label>
                                    <input

                                        className='form-control' placeholder='Enter your username'
                                        value={this.state.address}
                                        onChange={(event) => this.handleOnChangeInput(event, 'address')}

                                    />
                                </div>

                                <div className='col-sm-6 form-group content-input'>
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

                                <div className='col-sm-6 form-group content-input'>
                                    <label>Password:</label>
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
                                {!isSignUp &&
                                    <div className='col-12 form-group content-input'>
                                        <label>OTP(có giá trị trong 120s):</label>
                                        <input
                                            className='form-control'
                                            placeholder='Eff'
                                            value={this.state.otp}
                                            onChange={(event) => this.handleOnChangeInput(event, 'otp')}
                                        />
                                    </div>
                                }
                                <div className='col-12' style={{ color: 'red' }}> {this.state.errMessage}</div>
                                <div className='col-12 '>
                                    {isSignUp ?
                                        <button className='btn-login' onClick={this.handleSignUp}>Sign Up</button>
                                        :
                                        <button className='btn-login' onClick={this.handleConfirm} >Confrim</button>
                                    }
                                </div>
                                <div className='col-6 '>
                                    <span
                                        // className='forgot-password'
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

export default connect(mapStateToProps, mapDispatchToProps)(Register);
