import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';

class About extends Component {

    render() {

        return (
            <div className='section-about '>
                <div className='section-about-header'>
                    Truyền thông nói về BookingCare
                </div>
                <div className='section-about-content'>
                    <div className='content-left'>
                        <iframe width="100%"  src="https://www.youtube.com/embed/abPmZCZZrFA" title="SƠN TÙNG M-TP | ĐỪNG LÀM TRÁI TIM ANH ĐAU | OFFICIAL MUSIC VIDEO" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
                    </div>
                    <div className='content-right'>
                        <p>Việt Nam, tên chính thức là Cộng hòa Xã hội chủ nghĩa Việt Nam, nằm ở Đông Nam Á, giáp Trung Quốc, Lào, Campuchia và Biển Đông. Với diện tích khoảng 331.210 km², đất nước này nổi tiếng với nền văn hóa phong phú, lịch sử lâu đời và cảnh quan thiên nhiên đa dạng. Thủ đô Hà Nội và thành phố lớn nhất là Thành phố Hồ Chí Minh.</p>
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
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(About);
