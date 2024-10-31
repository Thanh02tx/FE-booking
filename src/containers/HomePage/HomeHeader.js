import React, { Component } from 'react';
import { connect } from 'react-redux';
import './HomeHeader.scss';
import * as actions from "../../store/actions";
import { FormattedMessage } from 'react-intl';
import { LANGUAGES } from "../../utils";
import { changeLanguageApp } from '../../store/actions/appActions';
import { withRouter } from 'react-router';
import { getAllSpecialty } from '../../services/userService';
import { injectIntl } from 'react-intl';
class HomeHeader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listSpecialty: [],
            searchQuery: '',
            showListSearch: false, // Thêm state để kiểm soát việc hiển thị danh sách
        };
    }

    componentDidMount() {
        this.buildDataSpecialty();
    }

    buildDataSpecialty = async () => {
        let res = await getAllSpecialty();
        if (res && res.errCode === 0) {
            let list = res.data;
            let result = [];
            list.forEach((item) => {
                let object = {};
                object.label = this.props.language === LANGUAGES.VI ? item.nameVi : item.nameEn;
                object.value = item.id;
                object.image = item.image;
                result.push(object);
            });
            this.setState({
                listSpecialty: result
            });
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.language !== this.props.language) {
            this.buildDataSpecialty();
        }
    }

    changeLanguage = (language) => {
        this.props.changeLanguageAppRedux(language);
    }

    returnToHome = () => {
        if (this.props.history) {
            this.props.history.push(`/home`);
        }
    }

    handleLoginRedirect = () => {
        this.props.history.push('/login');
    };

    handleSearchChange = (event) => {
        this.setState({ searchQuery: event.target.value });
    }

    // Hiển thị danh sách khi nhấp vào ô input
    handleInputFocus = () => {
        this.setState({ showListSearch: true });
    }

    // Ẩn danh sách khi nhấp ra ngoài
    handleInputBlur = () => {
        // Chỉ ẩn danh sách nếu không click vào danh sách
        setTimeout(() => {
            this.setState({ showListSearch: false });
        }, 200); // Đợi một chút trước khi ẩn danh sách
    }

    // Loại bỏ dấu tiếng Việt
    removeVietnameseTones = (str) => {
        return str
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/đ/g, "d")
            .replace(/Đ/g, "D");
    };

    // Tính số từ trùng khớp giữa từ khóa tìm kiếm và tên chuyên khoa
    calculateMatchScore = (searchWords, specialtyLabel) => {
        const specialtyWords = this.removeVietnameseTones(specialtyLabel).toLowerCase().split(" ");
        let matchCount = 0;

        searchWords.forEach(searchWord => {
            specialtyWords.forEach(specialtyWord => {
                if (specialtyWord.includes(searchWord)) {
                    matchCount++;
                }
            });
        });

        return matchCount;
    }

    handleClickSpecialty = (id) => {
        if (this.props.history) {
            this.props.history.push(`/detail-specialty/${id}`);
            this.setState({ showListSearch: false }); // Ẩn danh sách sau khi click
        }
    }

    render() {
        let { processLogout, isLoggedIn, language, userInfo, intl } = this.props;
        let { searchQuery, listSpecialty, showListSearch } = this.state;

        // Xử lý tìm kiếm và sắp xếp kết quả theo độ trùng khớp
        let searchWords = this.removeVietnameseTones(searchQuery).toLowerCase().trim().split(" ").filter(Boolean);
        let filteredSpecialties = listSpecialty
            .map(specialty => ({
                ...specialty,
                matchScore: this.calculateMatchScore(searchWords, specialty.label) // Tính điểm trùng khớp
            }))
            .filter(specialty => specialty.matchScore > 0) // Lọc các chuyên khoa có điểm trùng khớp
            .sort((a, b) => b.matchScore - a.matchScore); // Sắp xếp chuyên khoa theo điểm trùng khớp
        let placeholder = intl.formatMessage({ id: 'banner.find-specialty' });
        return (
            <React.Fragment>
                <div className='home-header-container'>
                    <div className='home-header-content'>
                        <div className='left-content d-flex'>
                            <div className='navbar' ><i className="fas fa-bars"></i></div>
                            <div className='header-logo' onClick={this.returnToHome}></div>
                        </div>
                        <div className='center-content'>
                            <div className='child-content'>
                                <div><b><FormattedMessage id="homeheader.specialty" /></b></div>
                                <div className='subs-title'><FormattedMessage id="homeheader.searchdoctor" /></div>
                            </div>
                            <div className='child-content'>
                                <div><b><FormattedMessage id="homeheader.health-facility" /></b></div>
                                <div className='subs-title'><FormattedMessage id="homeheader.select-room" /></div>
                            </div>
                            <div className='child-content'>
                                <div><b><FormattedMessage id="homeheader.doctor" /></b></div>
                                <div className='subs-title'><FormattedMessage id="homeheader.select-doctor" /></div>
                            </div>
                        </div>
                        <div className='right-content'>
                            {isLoggedIn &&
                                <div className='user'>
                                    {language === LANGUAGES.VI ?
                                        `Xin chào, ${userInfo.firstName} ${userInfo.lastName}`
                                        :
                                        `Hello, ${userInfo.lastName} ${userInfo.firstName}`
                                    }
                                </div>
                            }
                            <div className={language === LANGUAGES.VI ? 'language-vi active' : 'language-vi'}>
                                <span onClick={() => { this.changeLanguage(LANGUAGES.VI) }}>VN</span>
                            </div>
                            <div className={language === LANGUAGES.EN ? 'language-en active' : 'language-en'}>
                                <span onClick={() => { this.changeLanguage(LANGUAGES.EN) }}>EN</span>
                            </div>
                            {isLoggedIn ?
                                <div className="btn btn-logout mr-2" onClick={processLogout} title='Log out'>
                                    <i className="fas fa-sign-out-alt"></i>
                                </div>
                                :
                                <div className="btn btn-login mr-2" onClick={this.handleLoginRedirect} title='Log in'>
                                    <i className="fas fa-sign-in-alt"></i>
                                </div>
                            }
                        </div>
                    </div>
                </div>
                {this.props.isShowBanner &&
                    <div className='home-header-banner'>
                        <div className='content-up'>
                            <div className='title1'><FormattedMessage id="banner.healthcare-paltform" /></div>
                            <div className='title2'><FormattedMessage id="banner.comprehensive-healthcare" /></div>
                            <div className='content'>
                                <div className='search'>
                                    <i className='fas fa-search'></i>
                                    <input
                                        type='text'
                                        placeholder={placeholder}
                                        value={searchQuery}
                                        onChange={this.handleSearchChange}
                                        onFocus={this.handleInputFocus} // Hiển thị danh sách khi focus
                                        onBlur={this.handleInputBlur} // Ẩn danh sách khi blur
                                    />
                                </div>
                                {showListSearch && ( // Chỉ hiển thị list-search khi showListSearch là true
                                    <div className='list-search'>
                                        <ul>
                                            {filteredSpecialties.length > 0 ? (
                                                filteredSpecialties.map((specialty) => (
                                                    <li key={specialty.value}
                                                        onClick={() => this.handleClickSpecialty(specialty.value)}
                                                    >
                                                        <div className='option-child bg-light'>
                                                            <div className='d-flex'>
                                                                <div className='item-image' style={{ backgroundImage: `url(${specialty.image})` }}></div>
                                                                <div className='item-name'>{specialty.label}</div>
                                                            </div>
                                                        </div>
                                                    </li>
                                                ))
                                            ) : (
                                                <li>
                                                    <div
                                                        className='no-results bg-light option-child'
                                                    >
                                                        {language === LANGUAGES.VI ? 'Không tìm thấy chuyên khoa nào.' : 'No specialties found.'}
                                                    </div>
                                                </li>
                                            )}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                }
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        language: state.app.language,
        userInfo: state.user.userInfo,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        changeLanguageAppRedux: (language) => dispatch(changeLanguageApp(language)),
        processLogout: () => dispatch(actions.processLogout()),
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(injectIntl(HomeHeader)));
