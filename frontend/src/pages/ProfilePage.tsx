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
  console.log("🔍 userId from localStorage:", userId);
  const [refreshKey, setRefreshKey] = useState(0);
  const [userData, setUserData] = useState<{ profileImage?: string }>({});

  useEffect(() => {
    // ❇️ שליפת נתוני המשתמש כולל תמונה
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
    <div className="bg-white min-h-screen pb-5">
      <TopBar />
      <Container style={{ marginTop: "30px" }}>
        <Row>
          <Col md={4} className="text-center">
            {/* ✅ הצגת תמונת פרופיל */}
            <AboutMe userId={userId} refreshProfile={refreshProfile} />
          </Col>
          <Col md={8}>
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
            <UserPostsList userId={userId} key={refreshKey} />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ProfilePage;
