import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import Slider from 'react-slick';

import specialtyImg from "../../../assets/specialty/co-xuong-khop.jpg";
class HandBook extends Component {

    render() {
        
        return (
            <div className='section-share section-handbook'>
                <div className='section-container'>
                    <div className='section-header'>
                        <span className='title-section'>Cẩm nang</span>
                        <button className='btn-section'>Xem thêm</button>
                    </div>
                    <div className='section-body'>
                        <Slider {...this.props.settings}>
                            <div className='section-customize'>
                                <div className='bg-image section-handbook'></div>
                                <h3>Cơ xương khớp 1</h3>
                            </div>
                            <div className='section-customize'>
                                <div className='bg-image section-handbook'></div>
                                <h3>Cơ xương khớp 2</h3>
                            </div>
                            <div className='section-customize'>
                                <div className='bg-image section-handbook'></div>
                                <h3>Cơ xương khớp 3</h3>
                            </div>
                            <div className='section-customize'>
                                <div className='bg-image section-handbook'></div>
                                <h3>Cơ xương khớp 4</h3>
                            </div>
                            <div className='section-customize'>
                                <div className='bg-image section-handbook'></div>
                                <h3>Cơ xương khớp 5</h3>
                            </div>
                            <div className='section-customize'>
                                <div className='bg-image section-handbook'></div>
                                <h3>Cơ xương khớp 6</h3>
                            </div>
                            <div className='section-customize'>
                                <div className='bg-image section-handbook'></div>
                                <h3>Cơ xương khớp 7</h3>
                            </div>
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

    };
};

const mapDispatchToProps = dispatch => {

};

export default connect(mapStateToProps, mapDispatchToProps)(HandBook);
