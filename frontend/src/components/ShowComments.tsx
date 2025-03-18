import React, { useState, useEffect, useCallback } from 'react';
import { Modal, Button, Spinner, Card } from 'react-bootstrap';
import  apiClient  from '../services/axiosInstance';
import { RiChat1Line, RiMessage2Line } from 'react-icons/ri';

interface IComment {
  userId: string;
  comment: string;
}

interface ShowCommentsProps {
  postId: string;
}

const ShowComments: React.FC<ShowCommentsProps> = ({ postId }) => {
  const [comments, setComments] = useState<IComment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [commentsCount, setCommentsCount] = useState(0);

  const fetchComments = useCallback(async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const config = token ? {
        headers: { Authorization: `Bearer ${token}` }
      } : {};
      const response = await apiClient.get(`/postInteraction/postId/${postId}`, config);
      console.log('API response:', response.data);
      if (response.data && response.data.length > 0) {
        const commentsData = response.data[0].comments || [];
        setComments(commentsData);
        setCommentsCount(commentsData.length);
      } else {
        setComments([]);
        setCommentsCount(0);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setIsLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    // Fetch comments count initially
    fetchComments();
  }, [fetchComments]);

  useEffect(() => {
    if (showModal) {
      fetchComments();
    }
  }, [showModal, fetchComments]);

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  return (
    <>
      <Button
        variant="link"
        className="d-flex align-items-center gap-2 text-decoration-none"
        style={{ color: "var(--primary-color)" }}
        onClick={toggleModal}
      >
        <RiMessage2Line size={20} />
        <span>View Comments ({commentsCount})</span>
      </Button>

      <Modal 
        show={showModal} 
        onHide={toggleModal}
        centered
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title className="d-flex align-items-center gap-2">
            <RiChat1Line style={{ color: "var(--primary-color)" }} />
            <span>Comments ({commentsCount})</span>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          {isLoading ? (
            <div className="text-center p-4">
              <Spinner 
                animation="border" 
                style={{ color: "var(--primary-color)" }} 
              />
              <p className="mt-2 text-muted">Loading comments...</p>
            </div>
          ) : comments.length === 0 ? (
            <div className="text-center p-4 text-muted">
              <RiChat1Line size={40} className="mb-2" style={{ color: "var(--primary-color)" }} />
              <p>No comments yet. Be the first to comment!</p>
            </div>
          ) : (
            <div className="comment-list">
              {comments.map((comment, index) => (
                <Card 
                  key={index} 
                  className="mb-3 border-0 bg-light"
                  style={{ borderRadius: '12px' }}
                >
                  <Card.Body className="p-3">
                    <div className="d-flex align-items-start gap-3">
                      <div 
                        className="rounded-circle p-2"
                        style={{ 
                          backgroundColor: "var(--primary-color)",
                          width: "40px",
                          height: "40px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center"
                        }}
                      >
                        <span className="text-white fw-bold">
                          {comment.userId.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <h6 className="mb-1" style={{ color: "var(--primary-color)" }}>
                          {comment.userId}
                        </h6>
                        <p className="mb-0 text-muted">
                          {comment.comment}
                        </p>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              ))}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant="outline-secondary" 
            onClick={toggleModal}
            className="rounded-lg px-4"
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ShowComments;
