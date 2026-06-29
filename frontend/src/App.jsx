import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Chatbot from './pages/Chatbot';
import NetworkAnalysis from './pages/NetworkAnalysis';
import HotspotPrediction from './pages/HotspotPrediction';
import OffenderProfile from './pages/OffenderProfile';
import CaseSummary from './pages/CaseSummary';
import { LanguageProvider } from './context/LanguageContext';

function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/chatbot" element={<Chatbot />} />
          <Route path="/network" element={<NetworkAnalysis />} />
          <Route path="/hotspots" element={<HotspotPrediction />} />
          <Route path="/offender" element={<OffenderProfile />} />
          <Route path="/summary" element={<CaseSummary />} />
        </Routes>
      </BrowserRouter>
    </LanguageProvider>
  );
}

export default App;

