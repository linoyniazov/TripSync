import { useState } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import { RiAddCircleLine } from "react-icons/ri";
import TopBar from "../components/TopBar";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId") || "";
  const [refreshKey, setRefreshKey] = useState(0);

  const handleNavigate = () => {
    navigate("/uploadPost");
  };

  const refreshProfile = () => {
    setRefreshKey(oldKey => oldKey + 1);
  };

  return (
    <div className="bg-white min-h-screen">
      <TopBar />
      <Container style={{ marginTop: "30px", paddingBottom: "50px" }}>
        <Row>
          <Col md={4}>
            {/* About Me section */}
            <div className="bg-white p-4 rounded shadow-sm mb-4">
              <h3 style={{ color: "var(--primary-color)" }}>About Me</h3>
              <div className="text-center my-4">
                <img
                  src={`https://ui-avatars.com/api/?name=User&background=14b8a6&color=ffffff`}
                  alt="Profile"
                  className="rounded-circle"
                  style={{ width: "120px", height: "120px" }}
                />
                <h4 className="mt-3">User Name</h4>
                <p className="text-muted">Travel Enthusiast</p>
              </div>
              <div className="mt-4">
                <p>Share your story with fellow travelers...</p>
              </div>
            </div>
          </Col>
          <Col md={8}>
            {/* Right Container for Posts */}
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h3 style={{ color: "var(--primary-color)" }}>My Travel Stories</h3>
              <Button
                variant="outline-primary"
                style={{
                  borderRadius: "20px",
                  padding: "8px 20px",
                  borderColor: "var(--primary-color)",
                  color: "var(--primary-color)",
                }}
                onClick={handleNavigate}
              >
                <RiAddCircleLine size={20} />
                <span className="ms-2">Write New Post</span>
              </Button>
            </div>
            
            {/* Placeholder for posts */}
            <div className="bg-white p-4 rounded shadow-sm text-center">
              <p className="text-muted mb-0">Your travel stories will appear here...</p>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ProfilePage;