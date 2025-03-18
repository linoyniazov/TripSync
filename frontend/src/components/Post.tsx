import React, { useEffect, useState } from "react";
import { Card, Container, Row, Col, Button } from "react-bootstrap";
import apiClient from "../services/axiosInstance";
import { RiMapPin2Line, RiHeart3Line, RiHeart3Fill } from "react-icons/ri";
import Comments from "./Comments";
import AddComment from "./AddComment";
import ShowComments from "./ShowComments";

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
  const [likesCount, setLikesCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

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

    const getLikesCount = async () => {
      try {
        const response = await apiClient.get(
          `/postInteraction/likes/${post._id}`
        );
        setLikesCount(response.data.likesCount);
      } catch (error) {
        console.error("Failed to fetch likes count:", error);
      }
    };

    if (post.userId) {
      getUserName();
      getLikesCount();
    }
  }, [post.userId, post._id]);

  const handleLikeClick = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      if (!isLiked) {
        await apiClient.post(
          "/postInteraction/like",
          { postId: post._id },
          config
        );
        setLikesCount((prev) => prev + 1);
      } else {
        await apiClient.delete("/postInteraction/like", {
          data: { postId: post._id },
          headers: config.headers,
        });
        setLikesCount((prev) => prev - 1);
      }
      setIsLiked(!isLiked);
    } catch (error) {
      console.error("Failed to update like:", error);
    }
  };

  const handleCommentAdded = () => {
    setRefreshComments((prev) => prev + 1);
  };

  return (
    <Container>
      <Row className="justify-content-center">
        <Col lg={8} xl={6}>
          <Card className="mb-4 shadow-sm">
            <img
              className="w-100"
              src={post.photos[0]}
              alt={`Travel photo of ${post.city}`}
              style={{ height: "400px", objectFit: "cover" }}
            />
            <Card.Body>
              <div className="d-flex align-items-center mb-3">
                <img
                  src={`https://ui-avatars.com/api/?name=${userName}&background=14b8a6&color=ffffff`}
                  alt={userName}
                  className="rounded-circle"
                  style={{ width: "40px", height: "40px" }}
                />
                <div className="ms-3">
                  <h5
                    className="mb-0"
                    style={{ color: "var(--primary-color)" }}
                  >
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
                <div className="d-flex align-items-center gap-3 mb-3">
                  <Button
                    variant="outline-danger"
                    className="d-flex align-items-center gap-2"
                    onClick={handleLikeClick}
                  >
                    {isLiked ? <RiHeart3Fill /> : <RiHeart3Line />}
                    <span>{likesCount} Likes</span>
                  </Button>
                  <AddComment
                    postId={post._id}
                    onCommentAdded={handleCommentAdded}
                  />
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
