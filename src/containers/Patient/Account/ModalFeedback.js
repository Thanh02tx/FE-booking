import React, { Component } from 'react';
import { connect } from "react-redux";
import { FormattedMessage } from 'react-intl';
import { LANGUAGES } from '../../../utils';
import NumberFormat from 'react-number-format';
import './ModalFeedback.scss';
import { Modal, ModalBody, ModalHeader, Button,ModalFooter } from 'reactstrap';
import { toast } from 'react-toastify';
class ModalFeedback extends Component {
    constructor(props) {
        super(props);
        this.state = {
            doctorRating: 5,
            staffRating: 5,
            waitingTimeRating: 5,
            facilityRating: 5,
            detailFeedback:''
        }
    }
    async componentDidMount() {

    }
    async componentDidUpdate(prevProps, prevState, snaphot) {
        if (!prevProps.isOpenModal && this.props.isOpenModal) {
            this.setState({
                doctorRating: 5,
                staffRating: 5,
                waitingTimeRating: 5,
                facilityRating: 5,
                detailFeedback: ''
            });
        }
    }
    handleClick = (value, name) => {
        this.setState({
            [name]: value,
        });
    };
    getSatisfactionStatus = (status) => {
        let message = {
            stsVi: 'Rất hài lòng',
            stsEn: 'Very satisfied'
        };
        if (status === 4) {
            message = {
                stsVi: 'Hài lòng',
                stsEn: 'Satisfied'
            };
        }
        if (status === 3) {
            message = {
                stsVi: 'Bình thường',
                stsEn: 'Neutral'
            };
        }
        if (status === 2) {
            message = {
                stsVi: 'Không hài lòng',
                stsEn: 'Dissatisfied'
            };
        }
        if (status === 1) { // Lỗi logic: status===2 xuất hiện 2 lần, sửa thành status===1
            message = {
                stsVi: 'Rất không hài lòng',
                stsEn: 'Very dissatisfied'
            };
        }
        return message;
    };
    handleOnchangeInput=(event)=>{
        this.setState({
            detailFeedback:event.target.value
        })
    }
    handleSendFeedback=async()=>{
        await this.props.handlePatientFeedback({
            id:this.props.idHistory,
            doctorRating:this.state.doctorRating,
            staffRating:this.state.staffRating,
            waitingTimeRating:this.state.waitingTimeRating,
            facilityRating:this.state.facilityRating,
            detailFeedback:this.state.detailFeedback
        })
    }
    render() {
        let { isOpenModal ,closeFeedbackModal,language} = this.props;
        let { staffRating, waitingTimeRating, doctorRating, facilityRating,detailFeedback } = this.state
        return (
            <Modal
                isOpen={isOpenModal}
                className="modal-feedback-container"
                size="md"
                centered
            >
                <div className="modal-header">
                    <h5 className="modal-title">Đánh giá</h5>
                    <button
                        type="button"
                        className="close"
                        onClick={closeFeedbackModal}
                        aria-label="Close"
                    >
                        <span aria-hidden="true">x</span>
                    </button>
                </div>
                <ModalBody>
                    <div className='content-modal pl-2'>
                        <div>
                            <div>
                                <label className='m-0'>Bác sĩ</label>
                                <div className="star-rating ">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <span
                                            key={`doctor-${star}`}
                                            className={star <= doctorRating ? 'star filled' : 'star'}
                                            onClick={() => this.handleClick(star, 'doctorRating')}
                                        >
                                            &#9733;
                                        </span>
                                    ))}
                                    <i className='ml-5'>{language===LANGUAGES.VI ? this.getSatisfactionStatus(doctorRating).stsVi: this.getSatisfactionStatus(doctorRating).stsEn}</i>
                                </div>
                            </div>
                            <div>
                                <label className='m-0'>Nhân viên hỗ trợ</label>
                                <div className="star-rating">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <span
                                            key={`staff-${star}`}
                                            className={star <= staffRating ? 'star filled' : 'star'}
                                            onClick={() => this.handleClick(star, 'staffRating')}
                                        >
                                            &#9733; {/* Mã ký tự Unicode cho ngôi sao */}
                                        </span>
                                    ))}
                                    <i className='ml-5'>{language===LANGUAGES.VI ? this.getSatisfactionStatus(staffRating).stsVi: this.getSatisfactionStatus(staffRating).stsEn}</i>
                                </div>
                            </div>
                            <div>
                                <label className='m-0'>Cơ sở vật chất</label>
                                <div className="star-rating">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <span
                                            key={`facility-${star}`}
                                            className={star <= facilityRating ? 'star filled' : 'star'}
                                            onClick={() => this.handleClick(star, 'facilityRating')}
                                        >
                                            &#9733; {/* Mã ký tự Unicode cho ngôi sao */}
                                        </span>
                                    ))}
                                    <i className='ml-5'>{language===LANGUAGES.VI ? this.getSatisfactionStatus(facilityRating).stsVi: this.getSatisfactionStatus(facilityRating).stsEn}</i>
                                </div>
                            </div>
                            <div>
                                <label className='m-0'>Thời gian chờ đợi</label>
                                <div className="star-rating">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <span
                                            key={`waiting-${star}`}
                                            className={star <= waitingTimeRating ? 'star filled' : 'star'}
                                            onClick={() => this.handleClick(star, 'waitingTimeRating')}
                                        >
                                            &#9733; {/* Mã ký tự Unicode cho ngôi sao */}
                                        </span>
                                    ))}
                                    <i className='ml-5'>{language===LANGUAGES.VI ? this.getSatisfactionStatus(waitingTimeRating).stsVi: this.getSatisfactionStatus(waitingTimeRating).stsEn}</i>
                                </div>
                            </div>
                        </div>
                        <div className='form-group '>
                            <label>Phản hồi chi tiết</label>
                            <textarea
                                className="form-control p-0"
                                rows="2" // Thiết lập số dòng mặc định
                                style={{
                                    resize: 'none',// Tùy chọn không cho phép kéo thả thay đổi kích thước
                                }}
                                value={detailFeedback}
                                onChange={(event)=>this.handleOnchangeInput(event)}
                                onInput={(e) => {
                                    e.target.style.height = 'auto'; // Đặt lại chiều cao để tính toán chính xác
                                    e.target.style.height = `${e.target.scrollHeight}px`; // Điều chỉnh chiều cao dựa trên nội dung
                                }}
                            />
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={() => this.handleSendFeedback()}>
                        Send
                    </Button>
                    <Button color="secondary" onClick={closeFeedbackModal}>
                        Cancel
                    </Button>
                </ModalFooter>
            </Modal>
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

export default connect(mapStateToProps, mapDispatchToProps)(ModalFeedback);
