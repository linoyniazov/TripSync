import React, { useState } from 'react';
import { Container, Form, Button, Card, Row, Col } from 'react-bootstrap';
import TopBar from "../components/TopBar";
import { FaMapMarkerAlt, FaCalendarAlt, FaCamera, FaPlane, FaClock, FaUtensils } from 'react-icons/fa';
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
  title: string;
  activities: string[];
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

  const parsePlanText = (planText: string): DayPlan[] => {
    const days: DayPlan[] = [];
    const lines = planText.split('\n');
    let currentDay: DayPlan | null = null;

    lines.forEach(line => {
      const dayMatch = line.match(/Day \d+:/);
      if (dayMatch) {
        if (currentDay) {
          days.push(currentDay);
        }
        const dayNumber = parseInt(line.match(/\d+/)?.[0] || '0');
        currentDay = {
          day: dayNumber,
          title: line.substring(line.indexOf(':') + 1).trim(),
          activities: []
        };
      } else if (currentDay && line.trim()) {
        // Check if line starts with a bullet point or similar
        const activity = line.replace(/^[•\-*]\s*/, '').trim();
        if (activity) {
          currentDay.activities.push(activity);
        }
      }
    });

    if (currentDay) {
      days.push(currentDay);
    }

    return days;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response: AxiosResponse = await apiClient.post('/ai/generate-plan', formData);
      const planText = response?.data?.plan || '';
      const parsedPlan = parsePlanText(planText);
      setTravelPlan(parsedPlan);
      setShowPlan(true);
    } catch (error) {
      console.error(error);
      alert('Failed to generate plan. Please try again.');
    }
  };

  const renderPlanCard = (dayPlan: DayPlan) => (
    <Card key={dayPlan.day} className="mb-4 shadow-sm border-0 overflow-hidden">
      <Card.Header 
        className="py-3"
        style={{ 
          background: 'linear-gradient(to right, #14b8a6, #06b6d4)',
          color: 'white',
          border: 'none'
        }}
      >
        <div className="d-flex align-items-center">
          <FaClock className="me-2" />
          <h4 className="mb-0 fw-bold">Day {dayPlan.day}</h4>
        </div>
        <p className="mb-0 mt-1 ms-4 text-white-50">{dayPlan.title}</p>
      </Card.Header>
      <Card.Body className="p-4">
        <div className="activities">
          {dayPlan.activities.map((activity, index) => (
            <div 
              key={index} 
              className="activity-item d-flex align-items-start mb-3"
            >
              <div 
                className="activity-icon me-3 mt-1"
                style={{ color: 'var(--primary-color)' }}
              >
                {activity.toLowerCase().includes('fly') || activity.toLowerCase().includes('airport') ? (
                  <FaPlane />
                ) : activity.toLowerCase().includes('dinner') || activity.toLowerCase().includes('lunch') || activity.toLowerCase().includes('breakfast') ? (
                  <FaUtensils />
                ) : (
                  <FaMapMarkerAlt />
                )}
              </div>
              <div className="activity-content">
                <p className="mb-0">{activity}</p>
              </div>
            </div>
          ))}
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
                            backgroundColor: formData.interests.includes(interest) ? "var(--primary-color)" : "transparent",
                            borderColor: "var(--primary-color)",
                            color: formData.interests.includes(interest) ? "white" : "var(--primary-color)"
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

            {travelPlan.map(renderPlanCard)}
          </>
        )}
      </Container>
    </div>
  );
};

export default TravelAIPage;