import { useEffect, useState } from 'react';
import apiClient from '../services/axiosInstance';
import { Card, Spinner } from 'react-bootstrap';
import { RiChat1Line } from 'react-icons/ri';

interface CommentProps {
  postId: string;
}

interface IComment {
  userId: string;
  comment: string;
  username?: string;
}

const Comments = ({ postId }: CommentProps) => {
  const [comments, setComments] = useState<IComment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // שליפה של שם משתמש לפי userId
  const fetchUsername = async (userId: string): Promise<string> => {
    try {
      const token = localStorage.getItem('accessToken');
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      const response = await apiClient.get(`/user/${userId}`, config);
      return response.data.username;
    } catch (error) {
      console.error('Error fetching username:', error);
      return 'Unknown'; // fallback במקרה של כישלון
    }
  };

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
        const response = await apiClient.get(`/postInteraction/postId/${postId}`, config);

        if (response.data && response.data.length > 0) {
          const rawComments = response.data[0].comments || [];

          // שליפה של שמות משתמשים עבור כל תגובה
          const commentsWithUsernames = await Promise.all(
            rawComments.map(async (comment: IComment) => {
              const username = await fetchUsername(comment.userId);
              return { ...comment, username };
            })
          );

          setComments(commentsWithUsernames);
        } else {
          setComments([]);
        }
      } catch (error) {
        console.error('Error fetching comments:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchComments();
  }, [postId]);

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center p-3">
        <Spinner 
          animation="border" 
          size="sm"
          style={{ color: "var(--primary-color)" }}
        />
        <span className="ms-2 text-muted">Loading comments...</span>
      </div>
    );
  }

  if (comments.length === 0) {
    return null;
  }

  const firstTwoComments = comments.slice(0, 2);

  return (
    <div className="mt-3">
      {firstTwoComments.map((comment, index) => (
        <Card 
          key={index} 
          className="mb-2 border-0 bg-light"
          style={{ borderRadius: '12px' }}
        >
          <Card.Body className="py-2 px-3">
            <div className="d-flex align-items-start gap-2">
              <RiChat1Line 
                className="mt-1" 
                style={{ color: "var(--primary-color)", flexShrink: 0 }} 
              />
              <div>
                <span className="fw-semibold" style={{ color: "var(--primary-color)" }}>
                  {comment.username}
                </span>
                <span className="ms-2 text-muted">
                  {comment.comment}
                </span>
              </div>
            </div>
          </Card.Body>
        </Card>
      ))}
    </div>
  );
};

export default Comments;
