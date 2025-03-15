import TopBar from "../components/TopBar";
import TravelPostForm from "../components/TravelPostForm";

const UploadPost = () => {
  return (
    <div className="bg-white min-h-screen pb-5">
      <TopBar />
      <div style={{ marginTop: "2rem" }}>
        <TravelPostForm />
      </div>
    </div>
  );
};

export default UploadPost;