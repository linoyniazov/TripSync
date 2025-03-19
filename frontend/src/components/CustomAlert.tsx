import React from 'react';
import { Alert } from 'react-bootstrap';

interface CustomAlertProps {
  type: 'success' | 'danger';
  message: string;
  margin?: string;
}

const CustomAlert: React.FC<CustomAlertProps> = ({ type, message, margin = '0' }) => {
  return (
    <Alert variant={type} style={{ margin }}>
      {message}
    </Alert>
  );
};

export default CustomAlert;