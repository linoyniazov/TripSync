import { useEffect, useState } from 'react';
import Post, { IPost } from './Post';
import apiClient from '../services/axiosInstance';
import { Button, Spinner } from 'react-bootstrap';
import { RiArrowLeftLine, RiArrowRightLine } from 'react-icons/ri';

const PostsList = () => {
  const [posts, setPosts] = useState<IPost[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const postsPerPage = 3;

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const fetchPosts = async (page: number) => {
    setIsLoading(true);
    try {
      const response = await apiClient.get(`/post?page=${page}&limit=${postsPerPage}`);
      if (response.data.length < postsPerPage) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }
      setPosts(response.data);
      scrollToTop();
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(currentPage);
  }, [currentPage]);

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (hasMore) {
      setCurrentPage(prev => prev + 1);
    }
  };

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
        <Spinner 
          animation="border" 
          role="status"
          style={{ color: "var(--primary-color)" }}
        >
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <div>
      {/* Posts */}
      {posts.map((post) => (
        <div key={post._id} className="mb-5">
          <Post post={post} />
        </div>
      ))}

      {/* Pagination Controls */}
      <div className="d-flex justify-content-center gap-3 mt-4 mb-5">
        <Button
          variant="outline-primary"
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          className="d-flex align-items-center gap-2 rounded-pill px-4"
          style={{
            borderColor: "var(--primary-color)",
            color: currentPage === 1 ? "#cbd5e1" : "var(--primary-color)"
          }}
        >
          <RiArrowLeftLine size={20} />
          <span>Previous</span>
        </Button>

        <Button
          variant="outline-primary"
          onClick={handleNextPage}
          disabled={!hasMore}
          className="d-flex align-items-center gap-2 rounded-pill px-4"
          style={{
            borderColor: "var(--primary-color)",
            color: !hasMore ? "#cbd5e1" : "var(--primary-color)"
          }}
        >
          <span>Next</span>
          <RiArrowRightLine size={20} />
        </Button>
      </div>
    </div>
  );
};

export default PostsList;