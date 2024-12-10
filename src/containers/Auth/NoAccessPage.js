import React, { Component } from 'react';
import { connect } from "react-redux";
class NoAccessPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }
    async componentDidMount() {

    }
    async componentDidUpdate(prevProps, prevState, snaphot) {

    }

    render() {

        return (
            <div>
                <h1>403 - Forbidden</h1>
                <p>You do not have permission to access this page.</p>
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

export default connect(mapStateToProps, mapDispatchToProps)(NoAccessPage);
