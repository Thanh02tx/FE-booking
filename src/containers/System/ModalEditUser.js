import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { emitter } from "../../utils/emitter";
import _ from 'lodash';
import { LANGUAGES } from '../../utils';
import { lang } from 'moment';

class ModalEditUser extends Component {

    constructor(props) {
        super(props);
        this.state = {
            id:'',
            email: '',
            password: '',
            firstName: '',
            lastName: '',
            address: '',
        };
    }

    componentDidMount() {
        let user = this.props.currentUser;
        if(user && !_.isEmpty(user)){
            this.setState({
                id:user.id,
                email: user.email,
                password: 'hashccode',
                firstName: user.firstName,
                lastName: user.lastName,
                address: user.address,
            })
        }
        console.log('pops',this.props.currentUser)
    }
    toggle = () => {
        this.props.toggleFromParent();

    }
    handleOnChangeInput = (event, id) => {
        let copyState = { ...this.state };
        copyState[id] = event.target.value;
        this.setState({
            ...copyState
        })
        console.log(copyState)
    }

    checkValidateInput = () => {
        let isValid = true;
        let arrInput = ['email', 'password', 'firstName', 'lastName', 'address'];
        for (let i = 0; i < arrInput.length; i++) {
            if (!this.state[arrInput[i]]) {
                isValid = false;
                alert('Missing parameter:' + arrInput[i]);
                break;
            }

        }
        return isValid;
    }

    handleSaveUser = () => {
        let isValid = this.checkValidateInput();
        if (isValid === true) {
            this.props.editUser(this.state);
        }
    }

    render() {
        let {language}= this.props;
        return (
            <Modal
                isOpen={this.props.isOpen} toggle={this.toggle}
                className={'modal-user-container'}
                size='lg'

            >
                <ModalHeader toggle={this.toggle}>{language===LANGUAGES.VI?'Sửa Người dùng':'Edit User'}</ModalHeader>
                <ModalBody>
                    <div className='modal-user-body'>
                        <div className='input-container'>
                            <label>Email</label>
                            <input type='text' onChange={(event) => { this.handleOnChangeInput(event, "email") }}
                                value={this.state.email} disabled
                            />
                        </div>
                        <div className='input-container'>
                            <label>{language===LANGUAGES.VI?'Mật khẩu':'Password'}</label>
                            <input type='password' onChange={(event) => { this.handleOnChangeInput(event, "password") }}
                                value={this.state.password}  disabled/>
                        </div>
                        <div className='input-container'>
                            <label>{language===LANGUAGES.VI?'Tên':'FirstName'}</label>
                            <input type='text' onChange={(event) => { this.handleOnChangeInput(event, "firstName") }}
                                value={this.state.firstName}
                            />
                        </div>
                        <div className='input-container'>
                            <label>{language===LANGUAGES.VI?'Họ':'Lastname'}</label>
                            <input type='text' onChange={(event) => { this.handleOnChangeInput(event, "lastName") }}
                                value={this.state.lastName}
                            />
                        </div>
                    </div>


                </ModalBody>
                <ModalFooter>
                    <Button color="primary" className='px-3' onClick={() => { this.handleSaveUser() }}>{language===LANGUAGES.VI?'Lưu':'Save'}</Button>
                    <Button color="secondary" className='px-3' onClick={this.toggle}>{language===LANGUAGES.VI?'Đóng':'Close'}</Button>
                </ModalFooter>
            </Modal>
        )
    }

}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        userInfo: state.user.userInfo,
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};


export default connect(mapStateToProps, mapDispatchToProps)(ModalEditUser);
