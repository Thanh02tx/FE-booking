import React, { Component } from 'react';
import { connect } from "react-redux";
import { FormattedMessage } from 'react-intl';
import NumberFormat from 'react-number-format';
import HomeHeader from '../../HomePage/HomeHeader';
import './DetailClinic.scss';
import { getDetailClinicById, getAllCodeSpecialty } from '../../../services/userService';
import DoctorSchedule from '../Doctor/DoctorSchedule';
import DoctorExtraInfor from '../Doctor/DoctorExtraInfor';
import ProfileDoctor from '../Doctor/ProfileDoctor';
import _ from 'lodash';
import { LANGUAGES } from '../../../utils';
class DetailClinic extends Component {
    constructor(props) {
        super(props);
        this.state = {
            arrDoctorId: [],
            dataDetailClinic: {},
            listSpecialty: []

        }
    }
    async componentDidMount() {
        if (this.props.match && this.props.match.params && this.props.match.params.id) {
            let id = this.props.match.params.id;
            let resSpecialty = await getAllCodeSpecialty();

            let res = await getDetailClinicById({
                id: id,
                specialtyId: 'ALL'
            })
           
            if (res && res.errCode === 0 && resSpecialty && resSpecialty.errCode === 0 ) {
                let data = res.data;
                let arrDoctorId = [];
                if (data && !_.isEmpty(res.data)) {
                    let arr = data.doctorClinic;
                    if (arr && arr.length > 0) {
                        arr.map(item => {
                            arrDoctorId.push(item.doctorId)
                        })
                    }
                }
                let dataSpecialty=resSpecialty.data;
                if(dataSpecialty&&dataSpecialty.length>0){
                    dataSpecialty.unshift({
                        id:'ALL',
                        nameVi:'Tất cả chuyên khoa',
                        nameEn:'All Specialty'
                    })
                }
                this.setState({
                    dataDetailClinic: res.data,
                    arrDoctorId: arrDoctorId,
                    listSpecialty:dataSpecialty
                })
            }
        }
    }
    async componentDidUpdate(prevProps, prevState, snaphot) {

    }
    handleOnchangeSelect = async(event) => {
        if (this.props.match && this.props.match.params && this.props.match.params.id) {
            let id = this.props.match.params.id;
            let specialtyId = event.target.value;
            let res = await getDetailClinicById({
                id: id,
                specialtyId: specialtyId
            })
            if (res && res.errCode === 0 ) {
                let data = res.data;
                let arrDoctorId = [];
                if (data && !_.isEmpty(res.data)) {
                    let arr = data.doctorClinic;
                    if (arr && arr.length > 0) {
                        arr.map(item => {
                            arrDoctorId.push(item.doctorId)
                        })
                    }
                }
                
                this.setState({
                    dataDetailClinic: res.data,
                    arrDoctorId: arrDoctorId,
        
                })
            }
        }
        
    }
    render() {
        console.log('ssđ',this.state)
        let { language } = this.props;
        let { arrDoctorId, dataDetailClinic, listSpecialty } = this.state
        return (
            <div className='detail-specialty-container'>
                <HomeHeader />
                <div className='detail-specialty-body '>
                    <div className='bg-description'>
                        <div className='description-specialty container'>
                            {dataDetailClinic && !_.isEmpty(dataDetailClinic)
                                &&
                                <div dangerouslySetInnerHTML={{ __html: dataDetailClinic.descriptionHTML }}></div>
                            }
                        </div>
                    </div>
                    <div className='bg-doctor'>
                        <div className='container'>
                            <div className='search-sp-doctor'>
                                <select onChange={(event) => this.handleOnchangeSelect(event)}>
                                    {listSpecialty && listSpecialty.length > 0 &&
                                        listSpecialty.map((item, index) => {
                                            return (
                                                <option key={index} value={item.id}>
                                                    {language === LANGUAGES.VI ? item.nameVi : item.nameEn}
                                                </option>
                                            )
                                        })
                                    }
                                </select>
                            </div>
                            {arrDoctorId && arrDoctorId.length > 0
                                && arrDoctorId.map((item, index) => {
                                    return (
                                        <div className='each-doctor' key={index}>
                                            <div className='dt-content-left'>
                                                <div>
                                                    <ProfileDoctor
                                                        doctorId={item}
                                                        isShowDescription={true}
                                                        isShowLinkDetail={true}
    
                                                    />
                                                </div>
                                            </div>
                                            <div className='dt-content-right'>
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

export default connect(mapStateToProps, mapDispatchToProps)(DetailClinic);
