import React, { Component } from 'react';
import { connect } from 'react-redux';
import './HomeHeader.scss';
import * as actions from "../../store/actions";
import { FormattedMessage } from 'react-intl';
import { LANGUAGES } from "../../utils";
import { changeLanguageApp } from '../../store/actions/appActions';
import { withRouter } from 'react-router';
class HomeHeader extends Component {
    changeLanguage = (language) => {
        this.props.changeLanguageAppRedux(language)
    }
    returnToHome = () => {
        if (this.props.history) {
            this.props.history.push(`/home`)
        }
    }
    handleLoginRedirect = () => {
        this.props.history.push('/login');
    };
    render() {
        const { processLogout, isLoggedIn, language, userInfo } = this.props;

        return (
            <React.Fragment>
                <div className='home-header-container'>
                    <div className='home-header-content'>
                        <div className='left-content'>
                            <i className="fas fa-bars"></i>
                            <div className='header-logo' onClick={() => this.returnToHome()}>

                            </div>
                        </div>
                        <div className='center-content'>
                            <div className='child-content'>
                                <div><b><FormattedMessage id="homeheader.specialty" /></b></div>
                                <div className='subs-title'><FormattedMessage id="homeheader.searchdoctor" /></div>
                            </div>
                            <div className='child-content'>
                                <div><b><FormattedMessage id="homeheader.health-facility" /></b></div>
                                <div className='subs-title'><FormattedMessage id="homeheader.select-room" /></div>
                            </div>
                            <div className='child-content'>
                                <div><b><FormattedMessage id="homeheader.doctor" /></b></div>
                                <div className='subs-title'><FormattedMessage id="homeheader.select-doctor" /></div>
                            </div>
                            {/* <div className='child-content'>
                                <div><b><FormattedMessage id="homeheader.fee" /></b></div>
                                <div className='subs-title'><FormattedMessage id="homeheader.check-health" /></div>
                            </div> */}
                        </div>
                        <div className='right-content'>
                            {/* <div className='support'>
                                <i className='fas fa-question-circle'></i>
                                <FormattedMessage id="homeheader.support" />
                            </div> */}
                            {isLoggedIn &&
                                <div>
                                    {language === LANGUAGES.VI ?
                                        `Xin chào,${userInfo.firstName} ${userInfo.lastName}`
                                        :
                                        `Xin chào,${userInfo.lastName} ${userInfo.firstName}`
                                    }
                                </div>
                            }
                            <div
                                className={language === LANGUAGES.VI ? 'language-vi active' : 'language-vi'}
                            >
                                <span
                                    onClick={() => { this.changeLanguage(LANGUAGES.VI) }}
                                >
                                    VN
                                </span>
                            </div>
                            <div className={language === LANGUAGES.EN ? 'language-en active' : 'language-en'}><span onClick={() => { this.changeLanguage(LANGUAGES.EN) }}>EN</span></div>
                            {isLoggedIn ?
                                <div
                                    className="btn btn-logout "
                                    onClick={processLogout} title='Log out'
                                >
                                    <i className="fas fa-sign-out-alt"></i>
                                </div>
                                :

                                <div
                                    className="btn btn-login "
                                    onClick={this.handleLoginRedirect} title='Log in'
                                >
                                    <i className="fas fa-sign-in-alt"></i>
                                </div>
                            }
                        </div>

                    </div>
                </div>
                {this.props.isShowBanner === true &&
                    <div className='home-header-banner'>
                        <div className='content-up'>
                            <div className='title1'><FormattedMessage id="banner.healthcare-paltform" /></div>
                            <div className='title2'><FormattedMessage id="banner.comprehensive-healthcare" /></div>
                            <div className='search'>
                                <i className='fas fa-search'></i>
                                <input type='text' placeholder="Tìm chuyên khoa" />
                            </div>
                        </div>
                        <div className='content-down'>
                            <div className='options'>
                                <div className='option-child'>
                                    <div className='icon-child'><i className='fas fa-hospital'></i></div>
                                    <div className='text-child'><FormattedMessage id="banner.specialist-consultation" /></div>
                                </div>
                                <div className='option-child'>
                                    <div className='icon-child'><i className='fas fa-mobile-alt'></i></div>
                                    <div className='text-child'><FormattedMessage id="banner.remote-consultation" /></div>
                                </div>
                                <div className='option-child'>
                                    <div className='icon-child'><i className='fas fa-procedures'></i></div>
                                    <div className='text-child'> <FormattedMessage id="banner.general-checkup" /></div>
                                </div>
                                <div className='option-child'>
                                    <div className='icon-child'><i className="fas fa-flask"></i></div>
                                    <div className='text-child'><FormattedMessage id="banner.medical-testing" /></div>
                                </div>
                                <div className='option-child'>
                                    <div className='icon-child'><i className="fas fa-hospital-alt"></i></div>
                                    <div className='text-child'><FormattedMessage id="banner.mantal-health" /></div>
                                </div>
                                <div className='option-child'>
                                    <div className='icon-child'><i className="fas fa-smile"></i></div>
                                    <div className='text-child'><FormattedMessage id="banner.dental-checkup" /></div>
                                </div>
                            </div>
                        </div>

                    </div>
                }
            </React.Fragment>
        );
    }

}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        language: state.app.language,
        userInfo: state.user.userInfo,

    };
};

const mapDispatchToProps = dispatch => {
    return {
        changeLanguageAppRedux: (language) => dispatch(changeLanguageApp(language)),
        processLogout: () => dispatch(actions.processLogout()),
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(HomeHeader));
