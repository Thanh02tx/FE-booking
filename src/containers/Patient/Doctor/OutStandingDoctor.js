import React, { Component } from 'react';
import { connect } from "react-redux";
import { FormattedMessage } from 'react-intl';
import { LANGUAGES, path } from '../../../utils';
import NumberFormat from 'react-number-format';
import './OutStandingDoctor.scss'
import HomeHeader from '../../HomePage/HomeHeader';
import { getTopDoctorHomeService } from '../../../services/userService';
import { lang } from 'moment';
class OutStandingDoctor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listDoctor: []
        }
    }
    async componentDidMount() {
        let res = await getTopDoctorHomeService(15);
        if (res && res.errCode === 0) {
            let list = res.data.map(item => {
                item.image = new Buffer(item.image, 'base64').toString('binary');
                return item;
            });

            this.setState({
                listDoctor: list
            })
        }
    }
    async componentDidUpdate(prevProps, prevState, snaphot) {

    }
    handleClickDoctor = (id) => {
        this.props.history.push(path.DETAIL_DOCTOR.replace(':id', id));
    }
    returnHome = () => {
        this.props.history.push(path.HOMEPAGE)
    }
    render() {
        let { listDoctor } = this.state
        let { language } = this.props
        return (
            <div className='all-doctor-container'>
                <HomeHeader />
                <div className='container'>
                    <div>
                        <p>
                            <i
                                className="fas fa-home"
                                onClick={() => this.returnHome()}
                            ></i>
                            <span> /Bác sĩ nổi bật</span>
                        </p>
                    </div>
                    <div className='content'>
                        {listDoctor.length > 0 && listDoctor.map((item, index) => {
                            let nameVi = `${item.positionData.valueVi}, ${item.firstName} ${item.lastName}`;
                            let nameEn = `${item.positionData.valueEn}, ${item.firstName} ${item.lastName}`;
                            return (
                                <div 
                                    key={`doctor-${index}`} 
                                    className='d-flex content-doctor'
                                    onClick={()=>this.handleClickDoctor(item.id)}
                                >
                                    <div className='bg-img' style={{ backgroundImage: `url(${item.image})` }} >

                                    </div>
                                    <div className='d-flex align-items-center'>
                                        <div>
                                            <p className='m-0 dt-name'>{language === LANGUAGES.VI ? nameVi : nameEn}</p>
                                            <p className='m-0 dt-spe'>
                                                {item.Doctor_Infor && item.Doctor_Infor.Specialty && language === LANGUAGES.VI ? item.Doctor_Infor.Specialty.nameVi : ''}
                                                {item.Doctor_Infor && item.Doctor_Infor.Specialty && language === LANGUAGES.EN ? item.Doctor_Infor.Specialty.nameEn : ''}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                    {/* <div className='row'>
                        {listHandbook.length>0 && listHandbook.map((item,index)=>{
                            return(
                                <div 
                                    key={`spe-${index}`}
                                    className='col-xl-3 col-md-4 col-6 pb-3'
                                    onClick={()=>this.handleClickHandbook(item.id)}
                                >
                                    <div className='img' style={{ backgroundImage: `url(${item.image})` }}></div>
                                    <div className='text-center'>{item.nameVi}</div>
                                </div>
                            )
                        })
                        }
                    </div> */}
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

export default connect(mapStateToProps, mapDispatchToProps)(OutStandingDoctor);
