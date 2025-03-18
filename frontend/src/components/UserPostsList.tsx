import React, { useEffect, useState } from "react";
import Post, { IPost } from './Post';
import apiClient from '../services/axiosInstance';
import { RiEditLine, RiDeleteBinLine, RiArrowLeftLine, RiArrowRightLine } from 'react-icons/ri';
import { Button, Modal, Carousel } from 'react-bootstrap';
import EditPostModal from './EditPostModal';

interface UserPostsListProps {
  userId: string;
}

const UserPostsList: React.FC<UserPostsListProps> = ({ userId }) => {
  const [userPosts, setUserPosts] = useState<IPost[]>([]);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [currentPost, setCurrentPost] = useState<IPost | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [postToDelete, setPostToDelete] = useState<string | null>(null);

  const fetchPosts = async () => {
    if (userId) {
      try {
        const response = await apiClient.get(`/postInteraction/user/${userId}`);
        setUserPosts(response.data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [userId]);

  const confirmDelete = (postId: string) => {
    setPostToDelete(postId);
    setShowDeleteModal(true);
  };

  const deletePost = async () => {
    if (!postToDelete) return;

    try {
      await apiClient.delete(`/post/${postToDelete}`);
      setUserPosts(userPosts.filter((post) => post._id !== postToDelete));
      setShowDeleteModal(false);
      setPostToDelete(null);
    } catch (error) {
      console.error('Error deleting the post:', error);
    }
  };

  const editPost = (postId: string) => {
    const postToEdit = userPosts.find(post => post._id === postId);
    if (postToEdit) {
      setCurrentPost(postToEdit);
      setIsEditModalVisible(true);
    }
  };

  if (userPosts.length === 0) {
    return (
      <div className="bg-white p-5 rounded-lg shadow-sm text-center">
        <p className="text-muted mb-0" style={{ fontSize: '1.1rem' }}>
          Your travel stories will appear here...
        </p>
      </div>
    );
  }

  return (
    <div>
      <Carousel
        interval={null}
        prevIcon={
          <div className="carousel-control-icon">
            <RiArrowLeftLine size={24} />
          </div>
        }
        nextIcon={
          <div className="carousel-control-icon">
            <RiArrowRightLine size={24} />
          </div>
        }
      >
        {userPosts.map((post) => (
          <Carousel.Item key={post._id}>
            <div className="bg-white rounded-lg shadow-sm position-relative">
              <div 
                className="position-absolute end-0 top-0 p-3 d-flex gap-2" 
                style={{ zIndex: 1 }}
              >
                <Button 
                  variant="link" 
                  className="p-1 d-flex align-items-center"
                  style={{ color: "var(--primary-color)" }}
                  onClick={() => editPost(post._id)}
                  title="Edit post"
                >
                  <RiEditLine size={20} />
                </Button>
                <Button 
                  variant="link" 
                  className="p-1 d-flex align-items-center"
                  style={{ color: "var(--primary-color)" }}
                  onClick={() => confirmDelete(post._id)}
                  title="Delete post"
                >
                  <RiDeleteBinLine size={20} />
                </Button>
              </div>
              <Post post={post} />
            </div>
          </Carousel.Item>
        ))}
      </Carousel>
      
      {/* Edit Modal */}
      {currentPost && (
        <EditPostModal
          show={isEditModalVisible}
          handleClose={() => {
            setIsEditModalVisible(false);
            setCurrentPost(null);
          }}
          post={currentPost}
          onPostUpdated={fetchPosts}
        />
      )}

      {/* Delete Confirmation Modal */}
      <Modal 
        show={showDeleteModal} 
        onHide={() => setShowDeleteModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title style={{ color: "var(--text-color)" }}>
            Delete Post
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this travel story? This action cannot be undone.
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
            onClick={deletePost}
          >
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

      <style>
        {`
          .carousel-control-prev,
          .carousel-control-next {
            width: 5%;
            opacity: 1;
          }

          .carousel-control-icon {
            background-color: var(--primary-color);
            border-radius: 50%;
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
          }

          .carousel-control-prev-icon,
          .carousel-control-next-icon {
            display: none;
          }
        `}
      </style>
    </div>
  );
};

export default UserPostsList;