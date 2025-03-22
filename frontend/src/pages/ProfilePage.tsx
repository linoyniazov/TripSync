import { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import { RiAddCircleLine } from "react-icons/ri";
import AboutMe from "../components/AboutMe";
import TopBar from "../components/TopBar";
import { useNavigate } from "react-router-dom";
import UserPostsList from "../components/UserPostsList";
import apiClient from "../services/axiosInstance";

const ProfilePage = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId") || "";
  const [refreshKey, setRefreshKey] = useState(0);
  const [userData, setUserData] = useState<{ profileImage?: string }>({});
  console.log(userData);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await apiClient.get(`/user/${userId}`);
        setUserData(response.data);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
  }, [userId]);

  const handleNavigate = () => {
    navigate("/uploadPost");
  };

  const refreshProfile = () => {
    setRefreshKey((oldKey) => oldKey + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-cyan-50">
      <TopBar />
      <Container className="py-5">
        <Row className="g-4">
          {/* Profile Section */}
          <Col lg={4}>
            <div className="sticky-top" style={{ top: '2rem' }}>
              <AboutMe userId={userId} refreshProfile={refreshProfile} />
            </div>
          </Col>

          {/* Posts Section */}
          <Col lg={8}>
            <div className="bg-white rounded-xl shadow-lg p-4 mb-4">
              <div className="d-flex justify-content-between align-items-center">
                <h3 
                  className="mb-0 fw-bold"
                  style={{ 
                    background: 'linear-gradient(to right, #14b8a6, #06b6d4)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}
                >
                  My Travel Stories
                </h3>
                <Button
                  variant="outline-primary"
                  onClick={handleNavigate}
                  className="d-flex align-items-center gap-2 rounded-pill px-4 py-2 border-2 shadow-sm"
                  style={{
                    borderColor: "var(--primary-color)",
                    color: "var(--primary-color)",
                    transition: "all 0.3s ease"
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = "var(--primary-color)";
                    e.currentTarget.style.color = "white";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.color = "var(--primary-color)";
                  }}
                >
                  <RiAddCircleLine size={20} />
                  <span>New Story</span>
                </Button>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-4">
              <UserPostsList userId={userId} key={refreshKey} />
            </div>
          </Col>
        </Row>
      </Container>

      <style>
        {`
          .sticky-top {
            z-index: 10;
          }
          
          @media (max-width: 991px) {
            .sticky-top {
              position: relative !important;
              top: 0 !important;
            }
          }

          .rounded-xl {
            border-radius: 1rem;
          }

          .shadow-lg {
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1),
                        0 8px 10px -6px rgba(0, 0, 0, 0.1);
          }
        `}
      </style>
    </div>
  );
};

export default ProfilePage;