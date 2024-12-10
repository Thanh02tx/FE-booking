import React, { Component } from 'react';
import { connect } from "react-redux";
import { FormattedMessage } from 'react-intl';
import HomeHeader from '../HomePage/HomeHeader';
import './VerifyEmail.scss';
import { LANGUAGES } from '../../utils';
import { postVerifyBookAppointment } from '../../services/userService';
class VerifyEmail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            statusVerify: false,
            errCode: ''

        }
    }
    async componentDidMount() {
        if (this.props.location && this.props.location.search) {
            let urlParams = new URLSearchParams(this.props.location.search);
            let token = urlParams.get('token');
            let scheduleId = urlParams.get('scheduleId');
            let res = await postVerifyBookAppointment({
                token: token,
                scheduleId: scheduleId
            })
            if (res && (res.errCode === 0||res.errCode===2)) {
                this.setState({
                    statusVerify: true,
                    errCode: res.errCode
                })
            } else {
                this.setState({
                    statusVerify: true,
                    errCode: res & res.errCode ? res.errCode : -1
                })
            }
        }
    }
    async componentDidUpdate(prevProps, prevState, snaphot) {

    }

    render() {
        let { statusVerify, errCode } = this.state
        let { language } = this.props;
        console.log('sfs',errCode)
        return (
            <>
                <HomeHeader />
                <div className='verify-email-container'>
                    {statusVerify === false ?
                        <div>Loading data...</div> :
                        <div>
                            {errCode === 0 ?

                                <div className='infor-booking'>
                                    {language === LANGUAGES.VI ? 'Xác nhận lịch hẹn thành công!' : 'Appointment confirmed successfully!'}
                                </div>
                                :
                                <div>
                                    {errCode === 2 ?
                                        <div className='infor-booking'>
                                            {language === LANGUAGES.VI ? 'Lịch hẹn đã được xác nhận!' : 'The appointment has already been confirmed!'}
                                        </div>
                                        :
                                        <div className='infor-booking'>
                                            {language === LANGUAGES.VI ? 'Lịch hẹn không tồn tại!' : 'The appointment does not exist!'}
                                        </div>
                                    }
                                </div>
                            }
                        </div>
                    }
                </div>
            </>
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

export default connect(mapStateToProps, mapDispatchToProps)(VerifyEmail);
