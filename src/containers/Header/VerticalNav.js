import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { Link } from "react-router-dom";
import "./VerticalNav.scss";
import { connect } from "react-redux";
import { LANGUAGES } from "../../utils";
import * as actions from "../../store/actions";

class VerticalNav extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeIndex: null, // Trạng thái lưu mục đang được chọn
    };
  }

  // Hàm xử lý khi click vào menu item
  handleMenuClick = (index) => {
    this.setState({
      activeIndex: index, // Cập nhật mục đã chọn
    });
  };

  render() {
    const { processLogout, language, userInfo, menuApp } = this.props;
    const { activeIndex } = this.state; // Lấy trạng thái activeIndex từ state

    return (
      <div className="vertical-nav">
        {/* Chuyển đổi ngôn ngữ */}
        <div className="languages">
          <span
            className={`language-vi ${language === LANGUAGES.VI ? "active" : ""}`}
            onClick={() => this.props.changeLanguageAppRedux(LANGUAGES.VI)}
          >
            VN
          </span>
          <span
            className={`language-en ${language === LANGUAGES.EN ? "active" : ""}`}
            onClick={() => this.props.changeLanguageAppRedux(LANGUAGES.EN)}
          >
            EN
          </span>
        </div>

        {/* Hiển thị lời chào */}
        <div className="welcome">
          <FormattedMessage id="homeheader.welcome" />
          {userInfo?.firstName || ""}
        </div>

        {/* Hiển thị menuApp */}
        <div className="menu-list">
          {menuApp.map((item, index) => (
            <div key={index} className="menu-item">
              <Link
                to={item.link}
                className={`menu-link ${activeIndex === index ? "active" : ""}`}
                onClick={() => this.handleMenuClick(index)} // Xử lý khi click vào mục
              >
                <FormattedMessage id={item.name} />
              </Link>
            </div>
          ))}
        </div>

        {/* Nút đăng xuất */}
        <p className="btn btn-logout" onClick={processLogout} title="Log out">
          <i className="fas fa-sign-out-alt"></i>
        </p>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  isLoggedIn: state.user.isLoggedIn,
  language: state.app.language,
  userInfo: state.user.userInfo,
});

const mapDispatchToProps = (dispatch) => ({
  processLogout: () => dispatch(actions.processLogout()),
  changeLanguageAppRedux: (language) => dispatch(actions.changeLanguageApp(language)),
});

export default connect(mapStateToProps, mapDispatchToProps)(VerticalNav);
