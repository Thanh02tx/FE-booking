import React, { Component } from "react";
import { connect } from "react-redux";
import { push } from "connected-react-router";
import * as actions from "../../store/actions";
import "./Register.scss";
import { FormattedMessage } from "react-intl";
import { handleregisterApi } from "../../services/userService";

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowPassword: false,
    };
    this.imageRef = React.createRef();
  }

  handleShowHidePassword = () => {
    this.setState({
      isShowPassword: !this.state.isShowPassword,
    });
  };

  handleLoginClick = () => {
    this.props.history.push("/login"); // Chuyển hướng tới trang đăng ký
  };

  handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      this.setState({ image: imageUrl });
    }
  };

  render() {
    return (
      <div className="register-background">
        <div className="register-container mx-auto">
          <div className="register-content row">
            <div className="col-12 text-center text-register">Regiter</div>
            <div className="col-12 form-group register-input">
              <label>Username:</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter your username"
              />
            </div>
            <div className="col-12 form-group register-input">
              <label>Password:</label>
              <div className="custom-input-password">
                <input
                  className="form-control"
                  type={this.state.isShowPassword ? "text" : "password"}
                  placeholder="Enter your password"
                />
                <span onClick={this.handleShowHidePassword}>
                  <i
                    className={
                      this.state.isShowPassword
                        ? "fas fa-eye"
                        : "fas fa-eye-slash"
                    }
                  ></i>
                </span>
              </div>
            </div>
            <div className="col-12 form-group register-input">
              <label>Confirm Password:</label>
              <div className="custom-input-password">
                <input
                  className="form-control"
                  type={this.state.isShowPassword ? "text" : "password"}
                  placeholder="Enter your password"
                />
                <span onClick={this.handleShowHidePassword}>
                  <i
                    className={
                      this.state.isShowPassword
                        ? "fas fa-eye"
                        : "fas fa-eye-slash"
                    }
                  ></i>
                </span>
              </div>
            </div>
            <div className="col-12" style={{ color: "red" }}>
              {" "}
              {this.state.errMessage}
            </div>
            <div className="col-6 form-group register-input">
              <label>First Name:</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter your first name"
              />
            </div>
            <div className="col-6 form-group register-input">
              <label>Last Name:</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter your last name"
              />
            </div>
            <div className="col-12 form-group register-input">
              <label>Address:</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter your address"
              />
            </div>
            <div className="col-12 form-group register-input">
              <label>Phonenumber:</label>
              <input
                type="number"
                className="form-control"
                placeholder="Enter your phonumber"
              />
            </div>
            <div className="col-12 form-group register-input">
              <label for="gender">Gender?</label>
              <div>
                <input
                  type="radio"
                  id="male"
                  name="gender"
                  value="male"
                  class="input-radio"
                />
                <label for="male" class="input-radio">
                  Male
                </label>
              </div>
              <div>
                <input
                  type="radio"
                  id="female"
                  name="gender"
                  value="female"
                  class="input-radio"
                />
                <label for="female" class="input-radio">
                  Female
                </label>
              </div>
            </div>

            <div className="col-12 form-group register-input">
              <label>Image:</label>
              <br />
              <input
                type="file"
                id="imageInput"
                ref={this.imageRef}
                onChange={this.handleImageChange}
                accept="image/*"
              />
              {this.state.image && (
                <img src={this.state.image} alt="Selected" 
                id="imagePreview"/>
              )}
            </div>

            <div className="col-12">
              <button className="btn-register" onClick={this.handleLogin}>
                Register
              </button>
            </div>
            <div className="col-12 text-right">
              Bạn đã có tài khoản?
              <button onClick={this.handleLoginClick}>Đăng nhập</button>
            </div>
            {/* <div className="col-12 text-center">
              <span className="text-other-register mt-3">Or register with: </span>
            </div>
            <div className="col-12 social-register">
              <i className="fab fa-google-plus-g google"></i>
              <i className="fab fa-facebook-f facebook"></i>
            </div> */}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    // userData: state.user.userData,
    // isAuthenticated: state.auth.isAuthenticated,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    // navigate: (path) => dispatch(push(path)),
    // userregisterSuccess: (userInfo) =>
    //   dispatch(actions.userLoginSuccess(userInfo)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Register);
