import React, { Component } from 'react';
import { connect } from "react-redux";
import { FormattedMessage } from 'react-intl';
import NumberFormat from 'react-number-format';
import HomeHeader from '../../HomePage/HomeHeader';
import './DetailSpecialty.scss';
import { getDetailSpecialtyById, getAllCodeService } from '../../../services/userService';
import DoctorSchedule from '../Doctor/DoctorSchedule';
import DoctorExtraInfor from '../Doctor/DoctorExtraInfor';
import ProfileDoctor from '../Doctor/ProfileDoctor';
import _ from 'lodash';
import { LANGUAGES, path } from '../../../utils';
class DetailSpecialty extends Component {
    constructor(props) {
        super(props);
        this.state = {
            arrDoctorId: [],
            dataDetailSpecialty: {},
            listProvince: [],
            hidden_des:true

        }
    }
    async componentDidMount() {
        if (this.props.match && this.props.match.params && this.props.match.params.id) {
            let id = this.props.match.params.id;
            
            let resProvince = await getAllCodeService('PROVINCE');
            let res = await getDetailSpecialtyById({
                id: id,
                location: 'ALL'
            })
            if (res && res.errCode === 0 && resProvince && resProvince.errCode === 0) {
                let data = res.data;
                let arrDoctorId = [];
                if (data && !_.isEmpty(res.data)) {
                    let arr = data.doctorSpecialty;
                    if (arr && arr.length > 0) {
                        arr.map(item => {
                            arrDoctorId.push(item.doctorId)
                        })
                    }
                }
                let dataProvince=resProvince.data;
                if(dataProvince&&dataProvince.length>0){
                    dataProvince.unshift({
                        createAt:'null',
                        keyMap:"ALL",
                        type:"PROVINCE",
                        valueEn:"All",
                        valueVi:"Toàn quốc"
                    })
                }
                this.setState({
                    dataDetailSpecialty: res.data,
                    arrDoctorId: arrDoctorId,
                    listProvince:dataProvince
                })
            }
        }
    }
    async componentDidUpdate(prevProps, prevState, snaphot) {

    }
    handleOnchangeSelect = async(event) => {
        if (this.props.match && this.props.match.params && this.props.match.params.id) {
            let id = this.props.match.params.id;
            let location = event.target.value;
            let res = await getDetailSpecialtyById({
                id: id,
                location: location
            })
            if (res && res.errCode === 0 ) {
                let data = res.data;
                let arrDoctorId = [];
                if (data && !_.isEmpty(res.data)) {
                    let arr = data.doctorSpecialty;
                    if (arr && arr.length > 0) {
                        arr.map(item => {
                            arrDoctorId.push(item.doctorId)
                        })
                    }
                }
                
                this.setState({
                    dataDetailSpecialty: res.data,
                    arrDoctorId: arrDoctorId,
        
                })
            }
        }
        console.log('ssđ',this.state)
    }
    handleUnHiddenDes=()=>{
        this.setState({
            hidden_des: ! this.state.hidden_des
        })
    }
    returnHome=()=>{
        this.props.history.push(path.HOMEPAGE);
    }
    returnAllSpecialty=()=>{
        this.props.history.push(path.ALL_SPECIALTY);
    }
    render() {
        let { language } = this.props;
        let { arrDoctorId, dataDetailSpecialty, listProvince } = this.state
        return (
            <div className='detail-specialty-container'>
                <HomeHeader />
                <div className='detail-specialty-body '>
                    <div className='bg-description'>
                        <div className='description-specialty container'
                            style={{
                                height: this.state.hidden_des===true ? '150px' : 'auto',
                                overflow: 'hidden',
                                whiteSpace: 'nowrap',
                                textOverflow: 'ellipsis'
                            }}
                        >   
                            <p>
                                <i
                                    className="fas fa-home"
                                    onClick={()=>this.returnHome()}
                                >
                                </i>
                                <span 
                                    onClick={()=>this.returnAllSpecialty()}
                                > /Khám chuyên khoa</span>
                            </p>
                            {dataDetailSpecialty && !_.isEmpty(dataDetailSpecialty)
                                &&(
                                    <>  
                                        {dataDetailSpecialty.descriptionHTMLVi && language===LANGUAGES.VI &&
                                            <div dangerouslySetInnerHTML={{ __html: dataDetailSpecialty.descriptionHTMLVi }}></div>
                                        }
                                        {dataDetailSpecialty.descriptionHTMLEn && language===LANGUAGES.EN &&
                                            <div dangerouslySetInnerHTML={{ __html: dataDetailSpecialty.descriptionHTMLEn }}></div>
                                        }
                                    </>
                                )
                                
                            }
                            
                        </div>
                        <div style={{color: 'blue',  cursor: 'pointer',
                            textAlign: 'center',
                         }} 
                            onClick={()=>this.handleUnHiddenDes()}>
                                {this.state.hidden_des===true?<FormattedMessage id='patient.detail-specialty.more-infor'/>:<FormattedMessage id='patient.detail-specialty.hide'/>}
                        </div>
                    </div>
                    <div className='bg-doctor'>
                        <div className='container'>
                            <div className='search-sp-doctor'>
                                <select onChange={(event) => this.handleOnchangeSelect(event)}>
                                    {listProvince && listProvince.length > 0 &&
                                        listProvince.map((item, index) => {
                                            return (
                                                <option key={index} value={item.keyMap}>
                                                    {language === LANGUAGES.VI ? item.valueVi : item.valueEn}
                                                </option>
                                            )
                                        })
                                    }
                                </select>
                            </div>
                            {arrDoctorId && arrDoctorId.length > 0
                                && arrDoctorId.map((item, index) => {
                                    return (
                                        <div className='each-doctor d-flex row' key={index}>
                                            <div className='dt-content-left col-md-6'>
                                                <div>
                                                    <ProfileDoctor
                                                        doctorId={item}
                                                        isShowDescription={true}
                                                        isShowLinkDetail={true}
    
                                                    />
                                                </div>
                                            </div>
                                            <div className='dt-content-right col-md-6'>
                                                <div className='doctor-schedule'>
                                                    <DoctorSchedule
                                                        doctorIdFromParent={item}

                                                    />

                                                </div>
                                                <div className='doctor-extra-infor'>
                                                    <DoctorExtraInfor
                                                        doctorIdFromParent={item}
                                                    />
                                                </div>

                                            </div>

                                        </div>

                                    )
                                })
                            }
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

export default connect(mapStateToProps, mapDispatchToProps)(DetailSpecialty);
