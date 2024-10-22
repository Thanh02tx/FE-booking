import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import Slider from 'react-slick';
import { getAllHandbook } from '../../../services/userService';
import specialtyImg from "../../../assets/specialty/co-xuong-khop.jpg";
import { LANGUAGES } from '../../../utils';
import { withRouter } from 'react-router';
class HandBook extends Component {
    constructor(props) {
        super(props)
        this.state = {
            listHandbook: []
        }
    }
    async componentDidMount() {
        let res = await getAllHandbook()
        if (res && res.errCode === 0) {
            this.setState({
                listHandbook: res.data
            })
        }
    }
    handleViewDetailHandbook=(handbook)=>{
        if(this.props.history){
            this.props.history.push(`/detail-handbook/${handbook.id}`)
        }
    }
    render() {
        let { listHandbook } = this.state
        let { language } = this.props
        return (
            <div className='section-share section-handbook'>
                <div className='section-container'>
                    <div className='section-header'>
                        <span className='title-section'>Cẩm nang</span>
                        <button className='btn-section'>Xem thêm</button>
                    </div>
                    <div className='section-body'>
                        <Slider {...this.props.settings}>
                            {listHandbook.length > 0 &&
                                listHandbook.map((item, index) => {
                                    return (
                                        
                                        <div className='section-customize' key={`handbook-${index}`}
                                            onClick={()=>this.handleViewDetailHandbook(item)}
                                        >
                                            <div className='bg-image section-medical-facility ' style={{backgroundImage:`url(${item.image})`}}></div>
                                            <div className='section-name'>{item.nameVi}</div>
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
    return {

    }
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(HandBook));
