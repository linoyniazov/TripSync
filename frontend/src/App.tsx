import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Layout from './components/Layout';
import ProfilePage from './pages/ProfilePage';
// import UploadPost from './pages/UploadPost';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/profile" element={<ProfilePage />} />
          {/* <Route path="/uploadPost" element={<UploadPost />} /> */}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;