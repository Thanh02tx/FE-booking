import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import './UserManager.scss';
import { getAllUsers, createNewUserService, deleteUserService, editUserService } from '../../services/userService';
import ModalUser from './ModalUser';
import ModalEditUser from './ModalEditUser';
import { emitter } from "../../utils/emitter";
import { toast } from 'react-toastify';
import { LANGUAGES } from '../../utils';
class UserManage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            arrUsersAPi: [],
            arrUsers: [],
            isOpenModalUser: false,
            isOpenModalEditUser: false,
            userEdit: {},
            search: ''
        }
    }

    async componentDidMount() {
        await this.getAllUsersFromReact();
    }
    handleAddNewUser = () => {
        this.setState({
            isOpenModalUser: true,
        })
    }
    toggleUserModal = () => {
        this.setState({
            isOpenModalUser: !this.state.isOpenModalUser,
        })
    }
    toggleUserEditModal = () => {
        this.setState({
            isOpenModalEditUser: !this.state.isOpenModalEditUser,
        })
    }
    getAllUsersFromReact = async () => {
        let response = await getAllUsers('ALL');
        if (response && response.errCode === 0) {
            this.setState({
                arrUsersAPi: response.users,
                arrUsers: response.data

            })
        }
    }
    createNewUser = async (data) => {
        try {
            let response = await createNewUserService(data);
            if (response && response.errCode !== 0) {
                alert(response.errMessage)
            } else {
                toast.success('create new user succeed!')
                await this.getAllUsersFromReact();
                this.setState({
                    isOpenModalUser: false
                })
                emitter.emit('EVENT_CLEAR_MODAl_DATA')
            }

        } catch (e) {
            console.log(e)
        }
    }

    handleDeleteUser = async (user) => {
        try {
            let res = await deleteUserService(user.id);
            if (res && res.errCode === 0) {
                await this.getAllUsersFromReact();
            } else {
                alert(res.errMessage);
            }
        }
        catch (e) {
            console.log(e);
        }
    }
    handleEditUser = async (user) => {
        this.setState({
            isOpenModalEditUser: true,
            userEdit: user,
        })
    }
    doEditUser = async (user) => {
        try {
            let res = await editUserService(user);
            console.log('save user', res)
            if (res && res.errCode === 0) {
                this.setState({
                    isOpenModalEditUser: false
                })
                await this.getAllUsersFromReact();
            }
        }
        catch (e) {
            console.log(e);
        }
    }
    handleOnchangeInput = (event, id) => {
        this.setState({
            [id]: event.target.value
        })
    }
    render() {
        let { search, arrUsers, arrUsersAPi } = this.state;
        let {language}= this.props;
        arrUsers = arrUsersAPi.filter(item =>
            item.email.toLowerCase().includes(search.toLowerCase())
        );
        let seachPlaceholder = language === LANGUAGES.VI ? 'Nhập email để tìm kiếm' : 'Enter email to search'
        return (
            <div className="users-containers container">
                <ModalUser
                    isOpen={this.state.isOpenModalUser}
                    toggleFromParent={this.toggleUserModal}
                    createNewUser={this.createNewUser}
                />
                {
                    this.state.isOpenModalEditUser &&
                    <ModalEditUser
                        isOpen={this.state.isOpenModalEditUser}
                        toggleFromParent={this.toggleUserEditModal}
                        currentUser={this.state.userEdit}
                        editUser={this.doEditUser}

                    />
                }
                <div className='title text-center mb-3'>{language===LANGUAGES.VI?'Quản lý Người dùng':'Manage Users'}</div>
                <div className='d-flex justify-content-between align-items-center'>
                    <input
                        className='form-control search'
                        value={search}
                        onChange={(event) => this.handleOnchangeInput(event, 'search')}
                        placeholder={seachPlaceholder}
                    />
                    <div className='mx-1'>
                        <button className="btn btn-primary px-3" onClick={this.handleAddNewUser}>
                            <i className='fas fa-plus'></i>{language===LANGUAGES.VI?'Thêm người dùng':'Add User'}</button>
                    </div>
                </div>

                <div className='users-table mt-3 mx-1'>
                    <table id="customers">
                        <tbody>
                            <tr>
                                <th>{language===LANGUAGES.VI?'STT':'No.'}</th>
                                <th>Email</th>
                                <th>{language===LANGUAGES.VI?'Tên':'First name'}</th>
                                <th>{language===LANGUAGES.VI?'Họ':'Last name'}</th>
                                <th>{language===LANGUAGES.VI?'Hành động':'Actions'}</th>
                            </tr>

                            {arrUsers && arrUsers.length > 0 ?
                                <>
                                    {arrUsers.map((item, index) => {
                                        return (
                                            <tr>
                                                <td>{index+1}</td>
                                                <td>{item.email}</td>
                                                <td>{item.firstName}</td>
                                                <td>{item.lastName}</td>
                                                <td>
                                                    <button className='btn-edit' onClick={() => this.handleEditUser(item)}><i className='fas fa-pencil-alt'></i></button>
                                                    <button className='btn-delete' onClick={() => this.handleDeleteUser(item)}><i className='fas fa-trash'></i></button>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </>
                                :
                                <tr>
                                    <td colSpan={5} className='text-center'>{language===LANGUAGES.VI?'Không có dữ liệu':'No data'}</td>
                                </tr>
                            }
                        </tbody>


                    </table>
                </div>
            </div>
        );
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

export default connect(mapStateToProps, mapDispatchToProps)(UserManage);
