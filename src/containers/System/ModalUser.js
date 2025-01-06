import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { emitter } from "../../utils/emitter";
import { getAllCodeService } from '../../services/userService';
import {LANGUAGES}from '../../utils';
import Select from 'react-select';
import { injectIntl } from 'react-intl';
class ModalUser extends Component {

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            firstName: '',
            lastName: '',
            listRole: '',
            listRoleServer:'',
            role: ''
        };
        this.listenToEmitter();
    }

    listenToEmitter() {
        emitter.on('EVENT_CLEAR_MODAL_DATA', () => {
            this.setState({
                email: '',
                password: '',
                firstName: '',
                lastName: '',
                role:''
            })
        })
    }

    async componentDidMount() {
        let res = await getAllCodeService('ROLE');
        if (res && res.errCode === 0) {
            this.setState({
                listRoleServer: res.data
            },()=>{
                this.setState({
                    listRole: this.buildDataAllcode(this.state.listRoleServer)
                })
            })
            
        }
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
        let arrInput = ['email', 'password', 'firstName', 'lastName','role',];
        for (let i = 0; i < arrInput.length; i++) {
            if (!this.state[arrInput[i]]) {
                isValid = false;
                alert('Missing parameter:' + arrInput[i]);
                break;
            }

        }
        return isValid;
    }
    buildDataAllcode = (data) => {
        let language = this.props.language;
        let result = [];
        if (data && data.length > 0) {
            data.map(item => {
                let object = {};
                object.label = language === LANGUAGES.VI ? item.valueVi : item.valueEn;
                object.value = item.keyMap;
                result.push(object)
            })
        }
        return result;
    }
    handleAddNewUser = () => {
        console.log('ssd',this.state)
        let isValid = this.checkValidateInput();
        if (isValid === true) {
            this.props.createNewUser({
                email:this.state.email,
                password:this.state.password,
                firstName:this.state.firstName,
                lastName:this.state.lastName,
                roleId:this.state.role.value
            });
        }
    }
    handleChangeSelect =  (selectedOption) => {
        this.setState({
            role:selectedOption
        })
    }
    render() {
        let {language,intl} = this.props
        let title = language===LANGUAGES.VI? "Thêm người dùng":'Add new user'
        let firstNamePlaceHolder = intl.formatMessage({ id: 'manage-user.first-name' });
        let lastNamePlaceHolder = intl.formatMessage({ id: 'manage-user.last-name' });
        let passwordPlaceHolder = intl.formatMessage({ id: 'manage-user.password' });
        return (
            <Modal
                isOpen={this.props.isOpen} toggle={this.toggle}
                className={'modal-user-container'}
                size='lg'

            >
                <ModalHeader toggle={this.toggle}>{title}</ModalHeader>
                <ModalBody>
                    <div className='modal-user-body'>
                        <div className='input-container'>
                            <label>Email</label>
                            <input type='text' onChange={(event) => { this.handleOnChangeInput(event, "email") }}
                                value={this.state.email}
                                placeholder='Email'
                            />
                        </div>
                        <div className='input-container'>
                            <label><FormattedMessage id="manage-user.password" /></label>
                            <input type='text' onChange={(event) => { this.handleOnChangeInput(event, "password") }}
                                value={this.state.password} 
                                placeholder={passwordPlaceHolder}
                            />
                        </div>
                        <div className='input-container'>
                            <label><FormattedMessage id="manage-user.first-name" /></label>
                            <input type='text' onChange={(event) => { this.handleOnChangeInput(event, "firstName") }}
                                value={this.state.firstName}
                                placeholder={firstNamePlaceHolder}
                            />
                        </div>
                        <div className='input-container'>
                            <label><FormattedMessage id="manage-user.last-name" /></label>
                            <input type='text' onChange={(event) => { this.handleOnChangeInput(event, "lastName") }}
                                value={this.state.lastName}
                                placeholder={lastNamePlaceHolder}
                            />
                        </div>
                        <div className='input-container'>
                            <label>Vai trò</label>
                            <Select
                                value={this.state.role}
                                onChange={this.handleChangeSelect}
                                options={this.state.listRole}
                            />
                        </div>
                    </div>


                </ModalBody>
                <ModalFooter>
                    <Button color="primary" className='px-3' onClick={() => { this.handleAddNewUser() }}>Thêm mới</Button>
                    <Button color="secondary" className='px-3' onClick={this.toggle}>Huỷ</Button>
                </ModalFooter>
            </Modal>
        )
    }

}

const mapStateToProps = state => {
    return {
        language: state.app.language,
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};


export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(ModalUser));
