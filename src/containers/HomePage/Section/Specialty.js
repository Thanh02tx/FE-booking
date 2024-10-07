import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import Slider from 'react-slick';
import { LANGUAGES } from '../../../utils';
import { withRouter } from 'react-router';
import { getAllSpecialty } from '../../../services/userService';
import specialtyImg from "../../../assets/specialty/co-xuong-khop.jpg";
class Specialty extends Component {
    constructor(props) {
        super(props)
        this.state = ({
            dataSpecialty: []
        })
    }
    async componentDidMount() {
        let res = await getAllSpecialty();
        if (res && res.errCode === 0) {
            this.setState({
                dataSpecialty: res.data ? res.data : []
            })
        }
    }
    handleViewDetailSpecialty=(item)=>{
        if(this.props.history){
            this.props.history.push(`/detail-specialty/${item.id}`)
        }
    }
    render() {
        let { dataSpecialty } = this.state;
        let {language} = this.props;
        return (


            <div className='section-share section-specialty'>
                <div className='section-container'>
                    <div className='section-header'>
                        <span className='title-section'><FormattedMessage id ='homepage.specialty-popular'/></span>
                        <button className='btn-section'><FormattedMessage id ='homepage.more-infor'/></button>
                    </div>
                    <div className='section-body'>
                        <Slider {...this.props.settings}>
                            {dataSpecialty && dataSpecialty.length > 0 &&
                                dataSpecialty.map((item,index)=> {
                                    return (
                                        <div className='section-customize specialty-child' key = {index}
                                            onClick={()=>this.handleViewDetailSpecialty(item)}
                                        >
                                            <div className='bg-image section-specialty'
                                            style={{backgroundImage:`url(${item.image})`}}
                                            ></div>
                                            <div className='section-name'>{language===LANGUAGES.VI? item.nameVi:item.nameEn}</div>
                                        </div>
                                    )
                                })

                            }
                           
                        </Slider>
                    </div>

                </div>
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        language: state.app.language
    };
};

const mapDispatchToProps = dispatch => {

};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Specialty));
