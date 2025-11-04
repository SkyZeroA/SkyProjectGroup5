import SignIn from './screens/SignIn';
import SignUp from './screens/SignUp';
import Questionnaire from './screens/Questionnaire';
import Dashboard from './screens/Dashboard';
import Stats from './screens/Stats';
import Profile from './screens/Profile';
import About from './screens/About';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import RequireAuth from './components/RequireAuth';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/questionnaire" element={<RequireAuth><Questionnaire /></RequireAuth>} />
        <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
        <Route path="/profile" element={<RequireAuth><Profile /></RequireAuth>} />
        <Route path="/stats" element={<RequireAuth><Stats /></RequireAuth>} />
        <Route path='/about' element={<RequireAuth><About /></RequireAuth>} />
      </Routes>
    </Router>
  );
}

export default App;
