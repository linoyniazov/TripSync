import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import  apiClient  from '../services/axiosInstance';
import { RiAddLine, RiChat1Line } from 'react-icons/ri';
import { AxiosError } from 'axios';

interface AddCommentProps {
  postId: string;
  onCommentAdded: () => void;
}

const AddComment: React.FC<AddCommentProps> = ({ postId, onCommentAdded }) => {
  const [showModal, setShowModal] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleClose = () => {
    setShowModal(false);
    setError('');
    setCommentText('');
  };
  
  const handleShow = () => setShowModal(true);

  const submitComment = async () => {
    if (!commentText.trim()) {
      setError('Please enter a comment');
      return;
    }

    setIsSubmitting(true);
    setError('');
    
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('accessToken');
    
    if (!userId || !token) {
      setError('You must be logged in to post a comment.');
      setIsSubmitting(false);
      return;
    }

    try {
      const commentData = {
        postId,
        userId,
        comment: commentText.trim()
      };
      
      const response = await apiClient.post('/postInteraction/comment', commentData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log('Comment Response:', response.data);

      if (response.status === 200) {
        onCommentAdded();
        handleClose();
      } else {
        throw new Error('Failed to post comment');
      }

    } catch (error: unknown) {
      console.error('Error posting comment:', error);
      if (error instanceof AxiosError) {
        setError(error.response?.data?.message || 'Failed to post comment. Please try again later.');
      } else {
        setError('Failed to post comment. Please try again later.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Button
        variant="link"
        className="d-flex align-items-center gap-2 text-decoration-none"
        style={{ color: "var(--primary-color)" }}
        onClick={handleShow}
      >
        <RiAddLine size={20} />
        <span>Add Comment</span>
      </Button>

      <Modal 
        show={showModal} 
        onHide={handleClose}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title className="d-flex align-items-center gap-2">
            <RiChat1Line style={{ color: "var(--primary-color)" }} />
            <span>Add a Comment</span>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}
          <Form>
            <Form.Group controlId="comment">
              <Form.Label>Share your thoughts</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                disabled={isSubmitting}
                placeholder="Write your comment here..."
                className="rounded-lg"
                style={{
                  resize: 'none',
                  border: '1px solid var(--primary-color)',
                  boxShadow: 'none'
                }}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant="outline-secondary" 
            onClick={handleClose} 
            disabled={isSubmitting}
            className="rounded-lg"
          >
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={submitComment} 
            disabled={isSubmitting}
            className="rounded-lg"
            style={{
              backgroundColor: "var(--primary-color)",
              borderColor: "var(--primary-color)"
            }}
          >
            {isSubmitting ? 'Submitting...' : 'Post Comment'}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AddComment;