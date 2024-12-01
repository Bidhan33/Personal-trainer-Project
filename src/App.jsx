import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container, CssBaseline } from '@mui/material';
import CustomerList from './pages/customersList';
import Calender from './pages/calendar';
import SearchAppBar from './components/searchAppBar';
import TrainingList from './pages/trainingsList';
import Statistics from './pages/statistics';

function App() {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = (query) => {
    setSearchQuery(query);
  };

  return (
    <Router>
      <Container maxWidth="xl">
        <CssBaseline />
        <SearchAppBar onSearchChange={handleSearchChange} />
        <Routes>
          <Route path="/" element={<CustomerList searchQuery={searchQuery} />} />
          <Route path="/trainings" element={<TrainingList />} />
          <Route path="/calendar" element={<Calender />} />
          <Route path="/statistics" element={<Statistics />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;
