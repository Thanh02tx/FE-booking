import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from "connected-react-router";
import * as actions from "../../store/actions";
import './Login.scss';
import { FormattedMessage } from 'react-intl';
import { handleLoginApi } from '../../services/userService';
import { Link } from 'react-router-dom/cjs/react-router-dom';
import { path } from '../../utils';
class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {
           
        }
    }
    render() {
        return (
            <div className="login-background">
                
                hello
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        lang: state.app.language
    };
};

const mapDispatchToProps = dispatch => {
    return {
        navigate: (path) => dispatch(push(path)),
        // // userLoginFail: () => dispatch(actions.userLoginFail()),
        // userLoginSuccess: (userInfo) => dispatch(actions.userLoginSuccess(userInfo)),

    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Register);
