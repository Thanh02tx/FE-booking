import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import Slider from 'react-slick';
import * as actions from '../../../store/actions';
import { LANGUAGES, path } from '../../../utils';
import { withRouter } from 'react-router';
class OutStandingDoctor extends Component {
    constructor(props) {
        super(props)
        this.state = {
            arrDoctors: []
        }
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.topDoctorsRedux !== this.props.topDoctorsRedux) {
            this.setState({
                arrDoctors: this.props.topDoctorsRedux
            })
        }
    }
    componentDidMount() {
        this.props.loadTopDoctors();
    }
    handleViewDetailDoctor=(doctor)=>{
        this.props.history.push(`/detail-doctor/${doctor.id}`)
    }
    handleAllDoctor=()=>{
        if(this.props.history){
            this.props.history.push(path.OUTSTANDING_DOCTOR)
        }
    }
    render() {
        let arrDoctors = this.state.arrDoctors;
        let {language} = this.props;
        return (

            <div className='section-share section-outstanding-doctor'>
                <div className='section-container'>
                    <div className='section-header'>
                        <span className='title-section'>
                            <FormattedMessage id="homepage.outstanding-doctor"/> 
                        </span>
                        <button 
                            className='btn-section'
                            onClick={()=>this.handleAllDoctor()}
                        >
                            <FormattedMessage id="homepage.more-infor"/>
                        </button>
                    </div>
                    <div className='section-body'>
                        <Slider {...this.props.settings}>
                            {arrDoctors && arrDoctors.length > 0
                                && arrDoctors.map((item, index) => {
                                    let imageBase64='';
                                    if(item.Doctor_Infor.image) {
                                        imageBase64= new Buffer(item.Doctor_Infor.image,'base64').toString('binary');
                                    }
                                    let nameVi=`${item.Doctor_Infor.positionData.valueVi}, ${item.firstName} ${item.lastName}`;
                                    let nameEn=`${item.Doctor_Infor.positionData.valueEn}, ${item.firstName} ${item.lastName}`;
                                    return (
                                        < div className='section-customize' key={index} onClick={()=> this.handleViewDetailDoctor(item)} >
                                            <div className='customize-border'>
                                                <div className='outer-bg'>
                                                    <div className='bg-image section-outstanding-doctor' style={{backgroundImage: `url(${imageBase64})`}}></div>
                                                </div>
                                                <div className='position text-center'>
                                                    <div style={{height:'40px'}} className='mb-1'><p>{language === LANGUAGES.VI ? nameVi: nameEn}</p></div>
                                                    <div>
                                                        {item.Doctor_Infor&&item.Doctor_Infor.Specialty&&language===LANGUAGES.VI?item.Doctor_Infor.Specialty.nameVi:'' }
                                                        {item.Doctor_Infor&&item.Doctor_Infor.Specialty&&language===LANGUAGES.EN?item.Doctor_Infor.Specialty.nameEn:'' }
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}


                        </Slider>
                    </div>

                </div >
            </div >
        );
    }

}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        topDoctorsRedux: state.admin.topDoctors,
        language: state.app.language,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        loadTopDoctors: () => dispatch(actions.fetchTopDoctor()),
    }
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(OutStandingDoctor));
