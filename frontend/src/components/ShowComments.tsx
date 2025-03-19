import React, { useState, useEffect, useCallback } from 'react';
import { Modal, Button, Spinner, Card, Form } from 'react-bootstrap';
import apiClient from '../services/axiosInstance';
import { RiChat1Line, RiMessage2Line, RiEditLine, RiDeleteBinLine } from 'react-icons/ri';

interface IComment {
  _id: string;
  userId: string;
  comment: string;
  username?: string;
}

interface ShowCommentsProps {
  postId: string;
}

const ShowComments: React.FC<ShowCommentsProps> = ({ postId }) => {
  const [comments, setComments] = useState<IComment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [commentsCount, setCommentsCount] = useState(0);
  const [editingComment, setEditingComment] = useState<IComment | null>(null);
  const [editedText, setEditedText] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState<IComment | null>(null);
  
  const currentUserId = localStorage.getItem('userId');

  const fetchUsername = async (userId: string): Promise<string> => {
    try {
      const token = localStorage.getItem('accessToken');
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      const response = await apiClient.get(`/user/${userId}`, config);
      return response.data.username;
    } catch (error) {
      console.error('Error fetching username:', error);
      return 'Unknown';
    }
  };

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
        
        // Fetch usernames for all comments
        const commentsWithUsernames = await Promise.all(
          commentsData.map(async (comment: IComment) => {
            const username = await fetchUsername(comment.userId);
            return { ...comment, username };
          })
        );
        
        setComments(commentsWithUsernames);
        setCommentsCount(commentsWithUsernames.length);
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

  const handleEdit = (comment: IComment) => {
    setEditingComment(comment);
    setEditedText(comment.comment);
  };

  const handleCancelEdit = () => {
    setEditingComment(null);
    setEditedText('');
  };

  const handleSaveEdit = async () => {
    if (!editingComment || !editedText.trim()) return;

    try {
      const token = localStorage.getItem('accessToken');
      await apiClient.patch('/postInteraction/comment', {
        commentId: editingComment._id,
        postId: postId,
        userId: editingComment.userId,
        newComment: editedText
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      await fetchComments();
      setEditingComment(null);
      setEditedText('');
    } catch (error) {
      console.error('Error updating comment:', error);
    }
  };

  const handleDeleteClick = (comment: IComment) => {
    setCommentToDelete(comment);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!commentToDelete) return;

    try {
      const token = localStorage.getItem('accessToken');
      await apiClient.delete('/postInteraction/comment', {
        headers: { Authorization: `Bearer ${token}` },
        data: {
          commentId: commentToDelete._id,
          postId: postId,
          userId: commentToDelete.userId
        }
      });

      await fetchComments();
      setShowDeleteModal(false);
      setCommentToDelete(null);
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
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

      {/* Main Comments Modal */}
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
              {comments.map((comment) => (
                <Card 
                  key={comment._id} 
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
                          {(comment.username || 'U').charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-grow-1">
                        <div className="d-flex justify-content-between align-items-start">
                          <h6 className="mb-1" style={{ color: "var(--primary-color)" }}>
                            {comment.username || 'Unknown User'}
                          </h6>
                          {currentUserId === comment.userId && (
                            <div className="d-flex gap-2">
                              <Button
                                variant="link"
                                className="p-0 text-muted"
                                onClick={() => handleEdit(comment)}
                              >
                                <RiEditLine size={18} />
                              </Button>
                              <Button
                                variant="link"
                                className="p-0 text-danger"
                                onClick={() => handleDeleteClick(comment)}
                              >
                                <RiDeleteBinLine size={18} />
                              </Button>
                            </div>
                          )}
                        </div>
                        {editingComment?._id === comment._id ? (
                          <div className="mt-2">
                            <Form.Control
                              as="textarea"
                              value={editedText}
                              onChange={(e) => setEditedText(e.target.value)}
                              className="mb-2"
                              rows={2}
                            />
                            <div className="d-flex gap-2 justify-content-end">
                              <Button
                                variant="outline-secondary"
                                size="sm"
                                onClick={handleCancelEdit}
                              >
                                Cancel
                              </Button>
                              <Button
                                variant="primary"
                                size="sm"
                                onClick={handleSaveEdit}
                                style={{
                                  backgroundColor: "var(--primary-color)",
                                  borderColor: "var(--primary-color)"
                                }}
                              >
                                Save
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <p className="mb-0 text-muted">
                            {comment.comment}
                          </p>
                        )}
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

      {/* Delete Confirmation Modal */}
      <Modal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        centered
        size="sm"
      >
        <Modal.Header closeButton>
          <Modal.Title>Delete Comment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this comment?
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="outline-secondary"
            onClick={() => setShowDeleteModal(false)}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleConfirmDelete}
          >
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ShowComments;