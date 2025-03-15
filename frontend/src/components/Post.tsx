import React, { useEffect, useState } from "react";
import { Card, Container, Row, Col, Carousel } from "react-bootstrap";
import apiClient  from '../services/axiosInstance';

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
                    alt={`Slide ${index}`}
                  />
                </Carousel.Item>
              ))}
            </Carousel>
            <Card.Body>
              <Card.Subtitle className="mb-2 text-muted">
                {`By ${userName}`}
              </Card.Subtitle>
              <Card.Title>
                <Row>
                  <Col>{`My trip to ${post.city}`}</Col>
                </Row>
              </Card.Title>
              <Card.Text>{post.description}</Card.Text>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <i className="fas fa-map-marker-alt text-muted me-2"></i>
                  {post.location}
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Post;