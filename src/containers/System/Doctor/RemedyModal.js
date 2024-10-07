import React, { Component } from 'react';
import { connect } from "react-redux";
import './RemedyModal.scss';
import { toast } from 'react-toastify';
import moment from 'moment';
import * as actions from '../../../store/actions';
import { Modal, Button, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { CommonUtils } from '../../../utils';
class RemedyModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email:'',
            imgBase64:''
        }
    }
    async componentDidMount() {
        if(this.props.dataModal){
            this.setState({
                email:this.props.dataModal.email
            })
        }
    }

    async componentDidUpdate(prevProps, prevState, snaphot) {
        if(prevProps.dataModal!== this.props.dataModal){
            this.setState({
                email:this.props.dataModal.email
            })
        }

    }
    handleOnchangeEmail=(event)=>{
        this.setState({
            email: event.target.value
        })
    }
    handleOnchangeImage= async(event)=>{
        let data = event.target.files;
        let file = data[0];
        if(file){
            let base64 = await CommonUtils.getBase64(file);
            this.setState({
                imgBase64:base64
            })
        }
    }
    handleSendRemedy=()=>{
        this.props.sendRemedy(this.state)
    }
    render() {
        let { isOpenModal, dataModal,sendRemedy, closeRemedyModal } = this.props
        return (
            <Modal
                isOpen={isOpenModal}
                className='booking-modal-container'
                size='lg'
                centered
            >
                <div className='modal-header'>
                    <h5 className='modal-title'>Gửi hoá đơn khám bệnh thành công</h5>
                    <button type='button' className='close'onClick={closeRemedyModal} aria-label='Close'>
                        <span aria-hidden='true'>x</span>
                    </button>
                </div>
                <ModalBody>
                    <div className='row'>
                        <div className='col-6 form-group'>

                            <label>Email bệnh nhân</label>
                            <input className='form-control' 
                                type='email' 
                                value={this.state.email} 
                                onChange={(event)=>this.handleOnchangeEmail(event)}
                            />
                        </div>
                        <div className='col-6 form-group'>

                            <label>Chọn file đơn thuốc</label>
                            <input className='form-control' 
                                type='file' 
                                onChange={(event)=>this.handleOnchangeImage(event)}
                            />
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button color='primary' onClick={()=>this.handleSendRemedy()}>Send</Button>
                    <Button color='secondary' onClick={closeRemedyModal}>Cancel</Button>
                </ModalFooter>

            </Modal>
        );
    }

}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        genders: state.admin.genders,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getGender: () => dispatch(actions.fetchGenderStart())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(RemedyModal);
