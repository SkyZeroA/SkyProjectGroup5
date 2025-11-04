import SignIn from './screens/SignIn';
import SignUp from './screens/SignUp';
import Questionnaire from './screens/Questionnaire';
import Dashboard from './screens/Dashboard';
import Stats from './screens/Stats';
import Profile from './screens/Profile';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useEffect, useState } from 'react';


function App() {
  const [colorblind, setColorblind] = useState(false);
  
  useEffect(() => {
    document.documentElement.classList.toggle("colorblind", colorblind);
  }, [colorblind]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignIn colorblind={colorblind} setColorblind={setColorblind} />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/questionnaire" element={<Questionnaire />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile colorblind={colorblind} setColorblind={setColorblind} />} />
        <Route path='/stats' element={<Stats colorblind={colorblind}/>} />
      </Routes>
    </Router>
  );
}

export default App;
