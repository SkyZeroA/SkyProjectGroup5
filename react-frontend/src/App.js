import SignIn from './screens/SignIn';
import SignUp from './screens/SignUp';
import Questionnaire from './screens/Questionnaire';
import Dashboard from './screens/Dashboard';
import Stats from './screens/Stats';
import Profile from './screens/Profile';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/questionnaire" element={<Questionnaire />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path='/stats' element={<Stats />} />
      </Routes>
    </Router>
  );
}

export default App;
