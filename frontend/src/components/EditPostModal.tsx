import { ChangeEvent, useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { apiClient } from '../utils/apiClient';

interface IPost {
  _id: string;
  city: string;
  description: string;
  location: string;
  photos: string[];
}

interface EditPostModalProps {
  show: boolean;
  handleClose: () => void;
  post: IPost;
  onPostUpdated: () => void;
}

const EditPostModal = ({ show, handleClose, post, onPostUpdated }: EditPostModalProps) => {
  const [editedPost, setEditedPost] = useState({
    city: post.city,
    description: post.description,
    location: post.location,
    photos: post.photos,
  });
  const [newPhotos, setNewPhotos] = useState<File[]>([]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditedPost({ ...editedPost, [name]: value });
  };

  const handlePhotoChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setNewPhotos(Array.from(e.target.files));
    }
  };

  const uploadPhoto = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    try {
      const response = await apiClient.post('/file', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.url;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  };

  const handleSubmit = async () => {
    let updatedPhotoUrls = editedPost.photos;
    if (newPhotos.length > 0) {
      try {
        const uploadedUrls = await Promise.all(newPhotos.map(uploadPhoto));
        updatedPhotoUrls = uploadedUrls;
      } catch (error) {
        console.error('Error uploading new photos:', error);
        return;
      }
    }

    const updatedPostData = {
      ...editedPost,
      photos: updatedPhotoUrls,
    };

    try {
      await apiClient.patch(`/post/${post._id}`, updatedPostData);
      console.log('Post updated successfully');
      onPostUpdated();
      handleClose();
    } catch (error) {
      console.error('Error updating the post:', error);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title style={{ color: "var(--primary-color)" }}>Edit Travel Story</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>City</Form.Label>
            <Form.Control
              type="text"
              name="city"
              value={editedPost.city}
              onChange={handleChange}
              placeholder="Enter city name"
              className="rounded-lg border-gray-300 focus:border-teal-500 focus:ring focus:ring-teal-200 focus:ring-opacity-50"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Your Story</Form.Label>
            <Form.Control
              as="textarea"
              name="description"
              rows={4}
              value={editedPost.description}
              onChange={handleChange}
              placeholder="Share your travel experience..."
              className="rounded-lg border-gray-300 focus:border-teal-500 focus:ring focus:ring-teal-200 focus:ring-opacity-50"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Location</Form.Label>
            <Form.Select
              name="location"
              value={editedPost.location}
              onChange={handleChange}
              className="rounded-lg border-gray-300 focus:border-teal-500 focus:ring focus:ring-teal-200 focus:ring-opacity-50"
            >
              <option value="">Select Region</option>
              <option value="South America">South America</option>
              <option value="North America">North America</option>
              <option value="Europe">Europe</option>
              <option value="Africa">Africa</option>
              <option value="Asia">Asia</option>
              <option value="Oceania">Oceania</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Photos</Form.Label>
            <Form.Control
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              multiple
              className="rounded-lg border-gray-300 focus:border-teal-500 focus:ring focus:ring-teal-200 focus:ring-opacity-50"
            />
            <Form.Text className="text-muted">
              Select new photos to replace the existing ones
            </Form.Text>
          </Form.Group>

          {editedPost.photos.length > 0 && (
            <div className="mb-3">
              <p className="mb-2">Current Photos:</p>
              <div className="d-flex gap-2 flex-wrap">
                {editedPost.photos.map((photo: string, index: number) => (
                  <img
                    key={index}
                    src={photo}
                    alt={`Travel photo ${index + 1}`}
                    style={{
                      width: '100px',
                      height: '100px',
                      objectFit: 'cover',
                      borderRadius: '8px'
                    }}
                  />
                ))}
              </div>
            </div>
          )}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="outline-secondary"
          onClick={handleClose}
          className="rounded-lg"
        >
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={handleSubmit}
          style={{
            backgroundColor: "var(--primary-color)",
            borderColor: "var(--primary-color)"
          }}
          className="rounded-lg"
        >
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditPostModal;