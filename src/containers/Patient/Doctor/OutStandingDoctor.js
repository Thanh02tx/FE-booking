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
                item.Doctor_Infor.image = Buffer.from(item.Doctor_Infor.image, 'base64').toString('binary');
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
                            <span> /{language===LANGUAGES.VI?'Bác sĩ nổi bật':'Outstanding Doctor'}</span>
                        </p>
                    </div>
                    <div className='content'>
                        {listDoctor.length > 0 && listDoctor.map((item, index) => {
                            let nameVi = `${item.Doctor_Infor.positionData.valueVi}, ${item.lastName} ${item.firstName}`;
                            let nameEn = `${item.Doctor_Infor.positionData.valueEn}, ${item.firstName} ${item.lastName}`;
                            return (
                                <div 
                                    key={`doctor-${index}`} 
                                    className='d-flex content-doctor'
                                    onClick={()=>this.handleClickDoctor(item.id)}
                                >
                                    <div className='bg-img' style={{ backgroundImage: `url(${item.Doctor_Infor.image})` }} >

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
