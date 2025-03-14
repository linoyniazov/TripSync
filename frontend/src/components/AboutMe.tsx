import { useState, useEffect } from 'react';
import { Card, Button, Modal, Form } from 'react-bootstrap';
import { apiClient } from '../utils/apiClient';
import { RiEditLine } from 'react-icons/ri';

interface AboutMeProps {
  userId: string;
  refreshProfile: () => void;
}

interface UserProfile {
  Name: string;
  email: string;
  profilePhoto: string;
  aboutMe: string;
}

const AboutMe = ({ userId, refreshProfile }: AboutMeProps) => {
  const defaultUserProfile = {
    Name: "",
    email: "",
    profilePhoto: "avatar.jpeg",
    aboutMe: "I'm a passionate traveler!",
  };

  const [userProfile, setUserProfile] = useState<UserProfile>(defaultUserProfile);
  const [showEditModal, setShowEditModal] = useState(false);
  const [tempUserProfile, setTempUserProfile] = useState(defaultUserProfile);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    fetchUserProfile(userId);
  }, [userId]);

  const fetchUserProfile = async (userId: string) => {
    try {
      const response = await apiClient.get(`/user/${userId}`);
      if (response.status === 200) {
        const { Name, email, profilePhoto, aboutMe } = response.data.userProfile;
        const updatedProfile = {
          Name: Name || defaultUserProfile.Name,
          email: email || defaultUserProfile.email,
          profilePhoto: profilePhoto || defaultUserProfile.profilePhoto,
          aboutMe: aboutMe || defaultUserProfile.aboutMe,
        };
        setUserProfile(updatedProfile);
        setTempUserProfile(updatedProfile);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const handleSubmit = async () => {
    try {
      let photoUrl = userProfile.profilePhoto;

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
        name: tempUserProfile.Name,
        profilePhoto: photoUrl,
        aboutMe: tempUserProfile.aboutMe,
      });

      if (response.status === 200) {
        setUserProfile({ ...tempUserProfile, profilePhoto: photoUrl });
        setShowEditModal(false);
        refreshProfile();
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setTempUserProfile({ ...tempUserProfile, [e.target.id]: e.target.value });
  };

  return (
    <Card className="shadow-sm">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3 style={{ color: "var(--primary-color)", margin: 0 }}>About Me</h3>
          <Button 
            variant="link" 
            onClick={() => setShowEditModal(true)}
            style={{ color: "var(--primary-color)", padding: 0 }}
          >
            <RiEditLine size={20} />
          </Button>
        </div>
        <div className="text-center">
          <div className="position-relative mb-4">
            <img
              src={userProfile.profilePhoto}
              alt="Profile"
              className="rounded-circle"
              style={{
                width: "120px",
                height: "120px",
                objectFit: "cover",
                border: "3px solid var(--primary-color)"
              }}
            />
          </div>
          <h4 className="mb-2">{userProfile.Name}</h4>
          <p className="text-muted mb-3">{userProfile.email}</p>
          <p className="mb-0">{userProfile.aboutMe}</p>
        </div>
      </Card.Body>

      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title style={{ color: "var(--primary-color)" }}>Edit Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="Name">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={tempUserProfile.Name}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="profilePhoto">
              <Form.Label>Profile Photo</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const files = (e.target as HTMLInputElement).files;
                  if (files) setSelectedFile(files[0]);
                }}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="aboutMe">
              <Form.Label>About Me</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={tempUserProfile.aboutMe}
                onChange={handleChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleSubmit}
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