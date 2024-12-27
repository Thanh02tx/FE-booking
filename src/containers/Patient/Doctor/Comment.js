// Comment.js
import React, { useState } from 'react';
import CommentForm from './CommentForm';
import './Comment.scss';
import { useSelector } from 'react-redux';
import { LANGUAGES } from '../../../utils';
import moment from 'moment';
import { Button, Modal, ModalBody, ModalFooter } from 'reactstrap';

const Comment = ({ comment, onReply }) => {
    const language = useSelector(state => state.app.language);
    const isLoggedIn = useSelector(state => state.user.isLoggedIn);
    const [isReplying, setIsReplying] = useState(false);
    const [isOpenModal, setIsOpenModal] = useState(false);

    const handleReply = () => {
        if (!isLoggedIn) {
            setIsOpenModal(true);
        } else {
            setIsReplying(true);
        }
    };

    const closeModal = () => {
        setIsOpenModal(false);
    };

    return (
        <div style={{ marginLeft: comment.parentId ? '20px' : '0px', marginBottom: '10px' }}>
            <div className="border py-1 px-2 rounded">
                <div>
                    <strong>
                        {comment.User.firstName} {comment.User.lastName}
                    </strong>{" "}
                    {moment(comment.createdAt).format('YYYY-MM-DD')}
                </div>
                <div>{comment.content}</div>
            </div>
            <p onClick={handleReply} className="m-0 text-reply">
                {language === LANGUAGES.VI ? 'Trả lời' : 'Reply'}
            </p>

            {comment.replies && comment.replies.length > 0 && (
                <div style={{ marginLeft: '10px' }}>
                    {comment.replies.map((reply) => (
                        <Comment key={reply.id} comment={reply} onReply={onReply} />
                    ))}
                </div>
            )}
            {isReplying && <CommentForm onSubmit={onReply} parentId={comment.id} />}

            {/* Modal */}
            <Modal isOpen={isOpenModal} size="md" centered>
                <div className="modal-header">
                    <h5 className="modal-title">
                        {language === LANGUAGES.VI ? 'Thông báo' : 'Notification'}
                    </h5>
                    <button
                        type="button"
                        className="close"
                        onClick={closeModal}
                        aria-label="Close"
                    >
                        <span aria-hidden="true">×</span>
                    </button>
                </div>
                <ModalBody>
                    {language === LANGUAGES.VI
                        ? 'Bạn cần đăng nhập để bình luận'
                        : 'You need to log in to comment'}
                </ModalBody>
                <ModalFooter>
                    <Button color="secondary" onClick={closeModal}>
                        {language === LANGUAGES.VI ? 'Đóng' : 'Close'}
                    </Button>
                </ModalFooter>
            </Modal>
        </div>
    );
};

export default Comment;
