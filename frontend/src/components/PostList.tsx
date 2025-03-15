import { useEffect, useState } from 'react';
import Post, { IPost } from './Post';
import apiClient  from '../services/axiosInstance';

const PostsList = () => {
  const [posts, setPosts] = useState<IPost[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await apiClient.get('/post');
        setPosts(response.data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div>
      {posts.map((post) => (
        <div key={post._id} className="mb-5"> 
          <Post post={post} />
        </div>
      ))}
    </div>
  );
};

export default PostsList;