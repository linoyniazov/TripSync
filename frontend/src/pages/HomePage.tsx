import TopBar from "../components/TopBar";
import PostsList from "../components/PostList";

const HomePage = () => {
  return (
    <div>
      <TopBar />
      <div style={{ marginTop: "5rem" }}>
        <PostsList />
      </div>
    </div>
  );
};

export default HomePage;