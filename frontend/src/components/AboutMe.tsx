import { useState, useEffect } from "react";
import { Card, Button, Modal, Form } from "react-bootstrap";
import apiClient from "../services/axiosInstance";
import { RiEditLine, RiMailLine } from "react-icons/ri";

interface AboutMeProps {
  userId: string;
  refreshProfile: () => void;
}

interface UserProfile {
  username: string;
  email: string;
  profileImage: string;
  bio: string;
}

const AboutMe = ({ userId, refreshProfile }: AboutMeProps) => {
  const DEFAULT_AVATAR = "http://localhost:5000/public/avatar.jpeg";

  const defaultUserProfile: UserProfile = {
    username: "",
    email: "",
    profileImage: DEFAULT_AVATAR,
    bio: "I'm a passionate traveler!",
  };

  const [userProfile, setUserProfile] = useState<UserProfile>(defaultUserProfile);
  const [showEditModal, setShowEditModal] = useState(false);
  const [tempUserProfile, setTempUserProfile] = useState(defaultUserProfile);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    fetchUserProfile(userId);
  }, [userId]);

  const fetchUserProfile = async (userId: string) => {
    if (!userId) {
      console.error("❌ userId is missing! (check localStorage)");
      return;
    }

    try {
      const response = await apiClient.get(`/user/${userId}`);
      console.log("✅ Server Response:", response.data);

      if (!response.data || !response.data.username) {
        console.error("❌ Invalid response format:", response.data);
        return;
      }

      const profileData = {
        username: response.data.username || defaultUserProfile.username,
        email: response.data.email || defaultUserProfile.email,
        profileImage:
          response.data.profileImage && response.data.profileImage !== "null"
            ? response.data.profileImage
            : DEFAULT_AVATAR,
        bio: response.data.bio || defaultUserProfile.bio,
      };

      setUserProfile(profileData);
      setTempUserProfile(profileData);
    } catch (error) {
      console.error("❌ Error fetching user profile:", error);
    }
  };

  const handleSubmit = async () => {
    try {
      let photoUrl = userProfile.profileImage || DEFAULT_AVATAR;

      if (selectedFile) {
        const formData = new FormData();
        formData.append("file", selectedFile);
        const uploadResponse = await apiClient.post("/file", formData, {
          headers: { "Content-type": "multipart/form-data" },
        });
        if (uploadResponse.status === 200) {
          photoUrl = uploadResponse.data.url;
        }
      }

      const response = await apiClient.patch(`/user/${userId}`, {
        username: tempUserProfile.username,
        profileImage: photoUrl || DEFAULT_AVATAR,
        bio: tempUserProfile.bio,
      });

      if (response.status === 200) {
        setUserProfile({ ...tempUserProfile, profileImage: photoUrl || DEFAULT_AVATAR });
        setShowEditModal(false);
        refreshProfile();
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setTempUserProfile({ ...tempUserProfile, [e.target.id]: e.target.value });
  };

  return (
    <Card className="border-0 shadow-lg rounded-xl overflow-hidden bg-white">
      {/* Cover Image */}
      <div 
        className="position-relative"
        style={{ 
          height: '140px',
          background: 'linear-gradient(135deg, #14b8a6 0%, #06b6d4 100%)',
        }}
      >
        <h3 
          className="position-absolute bottom-0 start-0 m-3 text-white mb-3"
          style={{ fontSize: '1.5rem', fontWeight: '600' }}
        >
          About Me
        </h3>
        <Button
          variant="light"
          onClick={() => setShowEditModal(true)}
          className="position-absolute top-0 end-0 m-3 d-flex align-items-center gap-2 shadow-sm"
          style={{ 
            borderRadius: '20px',
            padding: '8px 16px',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
          }}
        >
          <RiEditLine size={16} />
          <span>Edit Profile</span>
        </Button>
      </div>

      {/* Profile Image */}
      <div className="text-center" style={{ marginTop: '-50px' }}>
        <div className="position-relative d-inline-block">
          <img
            src={userProfile.profileImage || DEFAULT_AVATAR}
            alt="Profile"
            className="rounded-circle border-4 border-white shadow-sm"
            style={{
              width: "100px",
              height: "100px",
              objectFit: "cover",
            }}
          />
        </div>
      </div>

      <Card.Body className="pt-3">
        {/* User Info */}
        <div className="text-center mb-4">
          <h3 className="mb-1 fw-bold" style={{ color: "#2d3748" }}>
            {userProfile.username}
          </h3>
          <p className="text-muted mb-4" style={{ fontSize: '0.95rem' }}>
            {userProfile.bio}
          </p>
        </div>

        {/* Contact Info */}
        <div className="d-flex flex-column gap-2 border-top pt-4">
          <div className="d-flex align-items-center gap-2">
            <RiMailLine className="text-primary" />
            <span className="text-muted">{userProfile.email}</span>
          </div>
        </div>
      </Card.Body>

      {/* Edit Modal */}
      <Modal 
        show={showEditModal} 
        onHide={() => setShowEditModal(false)} 
        centered
        className="rounded-4"
      >
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title style={{ color: "var(--primary-color)" }}>
            Edit Profile
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="pt-2">
          <Form>
            <Form.Group className="mb-3" controlId="username">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                value={tempUserProfile.username}
                onChange={handleChange}
                className="rounded-lg border-2"
                placeholder="Enter your username"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="profileImage">
              <Form.Label>Profile Image</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const files = (e.target as HTMLInputElement).files;
                  if (files) setSelectedFile(files[0]);
                }}
                className="rounded-lg border-2"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="bio">
              <Form.Label>Bio</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={tempUserProfile.bio}
                onChange={handleChange}
                className="rounded-lg border-2"
                placeholder="Tell us about yourself..."
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer className="border-0 pt-0">
          <Button 
            variant="outline-secondary" 
            onClick={() => setShowEditModal(false)}
            className="rounded-pill px-4"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            className="rounded-pill px-4"
            style={{
              backgroundColor: "var(--primary-color)",
              borderColor: "var(--primary-color)"
            }}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </Card>
  );
};

export default AboutMe;