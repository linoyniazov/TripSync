import React, { useState } from 'react';
import { Container, Form, Button, Card, Row, Col } from 'react-bootstrap';
import TopBar from "../components/TopBar";
import { FaMapMarkerAlt, FaCalendarAlt, FaHotel, FaUtensils, FaCamera } from 'react-icons/fa';
import apiClient from '../services/axiosInstance';
import { AxiosResponse } from 'axios';

interface TravelPlanForm {
  country: string;
  duration: number;
  cities: string;
  budget: number;
  interests: string[];
}

interface DayPlan {
  day: number;
  activities: string[];
  meals: string[];
  accommodation: string;
}

const TravelAIPage = () => {
  const [formData, setFormData] = useState<TravelPlanForm>({
    country: '',
    duration: 7,
    cities: '',
    budget: 1000,
    interests: []
  });

  const [showPlan, setShowPlan] = useState(false);
  const [travelPlan, setTravelPlan] = useState<DayPlan[]>([]);
  const [generatedPlan, setGeneratedPlan] = useState<string>('');

  const interestOptions = [
    'Culture & History',
    'Food & Cuisine',
    'Nature & Outdoors',
    'Shopping',
    'Adventure Sports',
    'Photography',
    'Local Experience',
    'Nightlife',
    'Art & Museums',
    'Beach & Relaxation'
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleInterestChange = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  console.log("apiClient baseURL:", apiClient.defaults.baseURL);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let response = undefined as AxiosResponse | undefined;
    
    try {
      console.log("Request URL:", response?.config?.url);
      response = await apiClient.post('/ai/generate-plan', formData);
      setGeneratedPlan(response?.data?.plan || '');
      console.log('Generated Plan:', response?.data?.plan);
      
      // If we get a successful response, show the plan
      if (response?.data?.plan) {
        setShowPlan(true);
        // Convert the API response to our DayPlan format
        // This is a placeholder - adjust according to your actual API response format
        const mockPlan = generateMockPlan();
        setTravelPlan(mockPlan);
      }
    } catch (error) {
      console.error(error);
      alert('Failed to generate plan. Please try again.');
    }
  };

  const generateMockPlan = () => {
    const plan: DayPlan[] = Array.from({ length: formData.duration }, (_, i) => ({
      day: i + 1,
      activities: [
        `Morning: Visit ${formData.cities.split(',')[0]} local market`,
        'Afternoon: Cultural tour of historic sites',
        'Evening: Sunset photography session'
      ],
      meals: [
        'Breakfast: Local café',
        'Lunch: Traditional restaurant',
        'Dinner: Rooftop dining experience'
      ],
      accommodation: 'Boutique Hotel in City Center'
    }));
    return plan;
  };

  const renderPlanCard = (dayPlan: DayPlan) => (
    <Card className="mb-4 shadow-sm">
      <Card.Header className="bg-white border-bottom" style={{ color: "var(--primary-color)" }}>
        <h4 className="mb-0">Day {dayPlan.day}</h4>
      </Card.Header>
      <Card.Body>
        <div className="mb-4">
          <div className="d-flex align-items-center mb-2">
            <FaMapMarkerAlt className="me-2" style={{ color: "var(--primary-color)" }} />
            <h5 className="mb-0">Activities</h5>
          </div>
          <ul className="list-unstyled ps-4">
            {dayPlan.activities.map((activity, index) => (
              <li key={index} className="mb-2">{activity}</li>
            ))}
          </ul>
        </div>

        <div className="mb-4">
          <div className="d-flex align-items-center mb-2">
            <FaUtensils className="me-2" style={{ color: "var(--primary-color)" }} />
            <h5 className="mb-0">Meals</h5>
          </div>
          <ul className="list-unstyled ps-4">
            {dayPlan.meals.map((meal, index) => (
              <li key={index} className="mb-2">{meal}</li>
            ))}
          </ul>
        </div>

        <div>
          <div className="d-flex align-items-center mb-2">
            <FaHotel className="me-2" style={{ color: "var(--primary-color)" }} />
            <h5 className="mb-0">Accommodation</h5>
          </div>
          <p className="ps-4 mb-0">{dayPlan.accommodation}</p>
        </div>
      </Card.Body>
    </Card>
  );

  return (
    <div className="bg-white min-h-screen pb-5">
      <TopBar />
      <Container className="py-5">
        {!showPlan ? (
          <Card className="shadow-sm">
            <Card.Body className="p-4">
              <h2 className="mb-4" style={{ color: "var(--primary-color)" }}>
                Plan Your Perfect Trip with AI
              </h2>
              <p className="text-muted mb-4">
                Tell us about your dream vacation, and our AI will create a personalized travel plan for you.
              </p>
              
              <Form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <Form.Group className="mb-3">
                    <Form.Label>Where would you like to go?</Form.Label>
                    <Form.Control
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      placeholder="Enter country name"
                      className="rounded-lg"
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>How many days are you planning to stay?</Form.Label>
                    <Form.Control
                      type="number"
                      name="duration"
                      value={formData.duration}
                      onChange={handleChange}
                      min="1"
                      className="rounded-lg"
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Which cities would you like to visit?</Form.Label>
                    <Form.Control
                      as="textarea"
                      name="cities"
                      value={formData.cities}
                      onChange={handleChange}
                      placeholder="Enter cities separated by commas"
                      className="rounded-lg"
                      rows={2}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>What's your budget? (USD)</Form.Label>
                    <Form.Control
                      type="number"
                      name="budget"
                      value={formData.budget}
                      onChange={handleChange}
                      min="0"
                      step="100"
                      className="rounded-lg"
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label>What are your interests?</Form.Label>
                    <div className="d-flex flex-wrap gap-2">
                      {interestOptions.map((interest) => (
                        <Button
                          key={interest}
                          variant={formData.interests.includes(interest) ? "primary" : "outline-primary"}
                          onClick={() => handleInterestChange(interest)}
                          className="rounded-pill"
                          style={{
                            backgroundColor: formData.interests.includes(interest) 
                              ? "var(--primary-color)" 
                              : "transparent",
                            borderColor: "var(--primary-color)",
                            color: formData.interests.includes(interest) 
                              ? "white" 
                              : "var(--primary-color)"
                          }}
                        >
                          {interest}
                        </Button>
                      ))}
                    </div>
                  </Form.Group>
                </div>

                <div className="d-flex justify-content-end">
                  <Button
                    type="submit"
                    style={{
                      backgroundColor: "var(--primary-color)",
                      borderColor: "var(--primary-color)"
                    }}
                    className="rounded-lg px-4"
                  >
                    Generate Travel Plan
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        ) : (
          <>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2 style={{ color: "var(--primary-color)" }}>
                Your Travel Plan for {formData.country}
              </h2>
              <Button
                variant="outline-primary"
                onClick={() => setShowPlan(false)}
                style={{ borderColor: "var(--primary-color)", color: "var(--primary-color)" }}
                className="rounded-lg"
              >
                Create New Plan
              </Button>
            </div>

            <Card className="mb-4 shadow-sm">
              <Card.Body>
                <Row>
                  <Col md={3} className="border-end">
                    <div className="d-flex align-items-center mb-3">
                      <FaMapMarkerAlt className="me-2" style={{ color: "var(--primary-color)" }} />
                      <h5 className="mb-0">Destination</h5>
                    </div>
                    <p className="text-muted">{formData.country}</p>
                  </Col>
                  <Col md={3} className="border-end">
                    <div className="d-flex align-items-center mb-3">
                      <FaCalendarAlt className="me-2" style={{ color: "var(--primary-color)" }} />
                      <h5 className="mb-0">Duration</h5>
                    </div>
                    <p className="text-muted">{formData.duration} days</p>
                  </Col>
                  <Col md={3} className="border-end">
                    <div className="d-flex align-items-center mb-3">
                      <FaCamera className="me-2" style={{ color: "var(--primary-color)" }} />
                      <h5 className="mb-0">Interests</h5>
                    </div>
                    <p className="text-muted">{formData.interests.join(', ')}</p>
                  </Col>
                  <Col md={3}>
                    <div className="d-flex align-items-center mb-3">
                      <FaMapMarkerAlt className="me-2" style={{ color: "var(--primary-color)" }} />
                      <h5 className="mb-0">Cities</h5>
                    </div>
                    <p className="text-muted">{formData.cities}</p>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            {/* Display the raw AI response if available */}
            {generatedPlan && (
              <Card className="mb-4 shadow-sm">
                <Card.Body>
                  <Card.Title>AI Generated Plan</Card.Title>
                  <Card.Text style={{ whiteSpace: 'pre-wrap' }}>{generatedPlan}</Card.Text>
                </Card.Body>
              </Card>
            )}

            {/* Display the formatted day plans */}
            {travelPlan.map((dayPlan) => renderPlanCard(dayPlan))}
          </>
        )}
      </Container>
    </div>
  );
};

export default TravelAIPage;