import React, { Component } from 'react';
import { connect } from "react-redux";
import { Redirect } from 'react-router-dom';
import './DetailDoctor.scss';
import { LANGUAGES } from '../../../utils';
import { getDetailInforDoctor } from '../../../services/userService';
import HomeHeader from "../../HomePage/HomeHeader";
import DoctorSchedule from './DoctorSchedule';
import DoctorExtraInfor from './DoctorExtraInfor';
class DetailDoctor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            detailDoctor: {},
            currentDoctorId: -1

        }
    }
    async componentDidMount() {
        if (this.props.match && this.props.match.params && this.props.match.params.id) {
            let id = this.props.match.params.id;
            this.setState({
                currentDoctorId: id
            })
            let res = await getDetailInforDoctor(id);
            console.log("dd", res)
            if (res && res.errCode === 0) {
                this.setState({
                    detailDoctor: res.data,

                })
            }

        }
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.language !== this.props.language) {

        }
    }
    render() {
        let { detailDoctor } = this.state;
        let { language } = this.props;
        let nameVi = '', nameEn = '';
        if (detailDoctor && detailDoctor.positionData) {
            nameVi = `${detailDoctor.positionData.valueVi}, ${detailDoctor.firstName} ${detailDoctor.lastName}`;
            nameEn = `${detailDoctor.positionData.valueEn}, ${detailDoctor.firstName} ${detailDoctor.lastName}`;
        }
        console.log('sd', detailDoctor)
        return (
            <React.Fragment>
                <HomeHeader isShowBanner={false} />
                <div className='doctor-detail-container'>
                    <div className='intro-doctor'>
                        <div className='content-left'
                            style={{ background: `url(${detailDoctor && detailDoctor.image ? detailDoctor.image : ''})` }}
                        >

                        </div>
                        <div className='content-right'>
                            <div className='up'>
                                {language === LANGUAGES.VI ? nameVi : nameEn}
                            </div>
                            <div className='down'>
                                {detailDoctor && detailDoctor.Doctor_Infor && (
                                    <>
                                    {detailDoctor.Doctor_Infor.descriptionVi && language === LANGUAGES.VI && (
                                            <span>{detailDoctor.Doctor_Infor.descriptionVi} </span>
                                        )
                                    }
                                    {detailDoctor.Doctor_Infor.descriptionEn && language === LANGUAGES.EN && (
                                            <span>{detailDoctor.Doctor_Infor.descriptionEn} </span>
                                        )
                                    }
                                    </>

                                )

                                }
                            </div>
                        </div>
                    </div>
                    <div className='schedule-doctor'>
                        <div className='content-left'>
                            <DoctorSchedule doctorIdFromParent={this.state.currentDoctorId} />
                        </div>
                        <div className='content-right'>
                            <DoctorExtraInfor doctorIdFromParent={this.state.currentDoctorId} />
                        </div>
                    </div>
                    <div className='detail-infor-doctor'>
                        {detailDoctor && detailDoctor.Doctor_Infor && (
                            <>
                                {language === LANGUAGES.VI && detailDoctor.Doctor_Infor.contentHTMLVi && (
                                    <div dangerouslySetInnerHTML={{ __html: detailDoctor.Doctor_Infor.contentHTMLVi }} />
                                )}
                                {language === LANGUAGES.EN && detailDoctor.Doctor_Infor.contentHTMLEn && (
                                    <div dangerouslySetInnerHTML={{ __html: detailDoctor.Doctor_Infor.contentHTMLEn }} />
                                )}
                            </>
                        )}
                    </div>

                    <div className='comment-doctor'>

                    </div>

                </div>
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(DetailDoctor);