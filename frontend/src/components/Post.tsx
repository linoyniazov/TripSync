import React, { useEffect, useState } from "react";
import { Card, Container, Row, Col, Carousel } from "react-bootstrap";
import  apiClient  from '../services/axiosInstance';
import { RiMapPin2Line } from 'react-icons/ri';
import Comments from './Comments';
import AddComment from './AddComment';
import ShowComments from './ShowComments';

export interface IPost {
  _id: string;
  city: string;
  location: string;
  description: string;
  photos: string[];
  userId: string;
}

interface PostProps {
  post: IPost;
}

const Post: React.FC<PostProps> = ({ post }) => {
  const [userName, setUserName] = useState("");
  const [refreshComments, setRefreshComments] = useState(0);
  

  useEffect(() => {
    const getUserName = async () => {
      const userId = post.userId;
      const token = localStorage.getItem("accessToken");
      const config = token
        ? {
            headers: { Authorization: `Bearer ${token}` },
          }
        : {};
      try {
        const userResponse = await apiClient.get(`/user/${userId}`, config);
        setUserName(userResponse.data.userProfile.Name);
      } catch (error) {
        console.error("Failed to fetch user name:", error);
      }
    };

    if (post.userId) {
      getUserName();
    }
  }, [post.userId]);

  const handleCommentAdded = () => {
    setRefreshComments(prev => prev + 1);
  };

  return (
    <Container>
      <Row className="justify-content-center">
        <Col lg={8} xl={6}>
          <Card className="mb-4 shadow-sm">
            <Carousel interval={null}>
              {post.photos.map((photo, index) => (
                <Carousel.Item key={index}>
                  <img
                    className="d-block w-100"
                    src={photo}
                    alt={`Travel photo ${index + 1}`}
                    style={{ height: '400px', objectFit: 'cover' }}
                  />
                </Carousel.Item>
              ))}
            </Carousel>
            <Card.Body>
              <div className="d-flex align-items-center mb-3">
                <img
                  src={`https://ui-avatars.com/api/?name=${userName}&background=14b8a6&color=ffffff`}
                  alt={userName}
                  className="rounded-circle"
                  style={{ width: '40px', height: '40px' }}
                />
                <div className="ms-3">
                  <h5 className="mb-0" style={{ color: "var(--primary-color)" }}>
                    {userName}
                  </h5>
                  <div className="d-flex align-items-center text-muted">
                    <RiMapPin2Line className="me-1" />
                    {post.location}
                  </div>
                </div>
              </div>

              <h4 className="mb-3">My trip to {post.city}</h4>
              <Card.Text className="mb-4">{post.description}</Card.Text>

              <div className="border-top pt-3">
                <div className="d-flex gap-3">
                  <AddComment postId={post._id} onCommentAdded={handleCommentAdded} />
                  <ShowComments postId={post._id} />
                </div>
                <Comments key={refreshComments} postId={post._id} />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Post;
