import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Layout from './components/Layout';
import Registration from "./components/Registration"; // הוספנו את הקומפוננטה של הרישום
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<Registration />} /> {/* הוספנו את עמוד הרישום */}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
