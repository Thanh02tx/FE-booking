// CommentForm.js
import React, { useState } from 'react';
import './Comment.scss'
import { useSelector } from 'react-redux';
import { LANGUAGES } from '../../../utils';
import { Button, Modal, ModalBody, ModalFooter } from 'reactstrap';
const CommentForm = ({ onSubmit, parentId }) => {
  const language = useSelector(state => state.app.language);
  const isLoggedIn = useSelector(state => state.user.isLoggedIn);
  const [isOpenModal, setIsOpenModal] = useState(false);

  const [content, setContent] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      setIsOpenModal(true);
    }else{
      if (content.trim()) {
        onSubmit(content, parentId);
        setContent('');
      }
    }
    
  };
  const closeModal = () => {
    setIsOpenModal(false);
  };

  return (
    <>
      <form onSubmit={handleSubmit} style={{ marginTop: '10px' }}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Viết bình luận..."
          rows="3"
          style={{ width: '100%', marginBottom: '5px' }}
        />
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button type="submit" style={{ padding: '2px 10px' }}>
            {language === LANGUAGES.VI ? 'Gửi' : 'Post'}
          </button>
        </div>
      </form>
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
    </>
  );
};

export default CommentForm;
