import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { Link } from "react-router-dom";
import "./VerticalNav.scss";
import { connect } from 'react-redux';
import { LANGUAGES, USER_ROLE } from "../../utils";
import * as actions from "../../store/actions";

class VerticalNav extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openMenu: null, // Lưu trạng thái menu đang mở
    };
  }

  toggleMenu = (index) => {
    this.setState((prevState) => ({
      openMenu: prevState.openMenu === index ? null : index, // Đóng/mở menu
    }));
  };

  handleChangeLanguage = (language) => {
    this.props.changeLanguageAppRedux(language);
  };

  render() {
    const { openMenu } = this.state;
    const { processLogout, language, userInfo, menuApp } = this.props; // menuApp từ props

    return (
      <div className="vertical-nav">
        <div className='languages'>
          <span 
            className={language === LANGUAGES.VI ? "language-vi active" : "language-vi"} 
            onClick={() => this.handleChangeLanguage(LANGUAGES.VI)}
          >
            VN
          </span>
          <span 
            className={language === LANGUAGES.EN ? "language-en active" : "language-en"} 
            onClick={() => this.handleChangeLanguage(LANGUAGES.EN)}
          >
            EN
          </span>
        </div>

        <div className='welcome'>
          <FormattedMessage id="homeheader.welcome" />
          {userInfo && userInfo.firstName ? userInfo.firstName : ''}
        </div>

        {/* Sử dụng menuApp từ props */}
        {menuApp.map((item, index) => (
          <div key={index} className="menu-item">
            {item.menus ? (
              <>
                <div
                  className={`menu-header ${openMenu === index ? "open" : ""}`}
                  onClick={() => this.toggleMenu(index)}
                >
                  <span>
                    <FormattedMessage id={item.name} />
                    <span> <i
                        className={
                          openMenu === index
                            ? "fas fa-caret-down"
                            : "fas fa-caret-right"
                        }
                      ></i>
                    </span>
                  </span>
                </div>
                {openMenu === index && (
                  <ul className="menu-sub">
                    {item.menus.map((subItem, subIndex) => (
                      <li key={subIndex} className="menu-link">
                        <Link to={subItem.link}>
                          <FormattedMessage id={subItem.name} />
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </>
            ) : (
              <Link to={item.link} className="menu-header single-link">
                <FormattedMessage id={item.name} />
              </Link>
            )}
          </div>
        ))}

        <p className="btn btn-logout" onClick={processLogout} title='Log out'>
          <i className="fas fa-sign-out-alt"></i>
        </p>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.user.isLoggedIn,
    language: state.app.language,
    userInfo: state.user.userInfo,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    processLogout: () => dispatch(actions.processLogout()),
    changeLanguageAppRedux: (language) => dispatch(actions.changeLanguageApp(language)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(VerticalNav);
