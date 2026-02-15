import { Routes, Route, useLocation } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import ToastContainer from './components/ToastContainer';
import ConfirmDialog from './components/ConfirmDialog';
import Chatbot from './components/Chatbot'; // <--- Import here

// ... imports for pages ...
import Workshop from './pages/Workshop';
import Home from './pages/Home';
import Menu from './pages/Menu';
import Login from './pages/Login';
import Payment from './pages/Payment';
import PaymentSuccess from './pages/PaymentSuccess';
import Franchise from './pages/Franchise';
import FranchiseLanding from './pages/FranchiseLanding';
import Art from './pages/Art';
import ArtProduct from './pages/ArtProduct'; 
import Admin from './pages/Admin';
import About from './pages/About'
import Why from './pages/Why';
import FlavorStrength from './pages/FlavourStrength';
import WhyRobusta from './pages/WhyRobusta';
import Profile from './pages/Profile';
import Artist from './pages/Artist';
import OurStory from './pages/OurStory';
import VisitCafe from "./pages/VisitCafe";
import IntroLoader from "./IntroLoader";
import BrewAI from './pages/BrewAI';
const App = () => {
  const location = useLocation();
  const isAuthPage = location.pathname.startsWith('/login') || location.pathname.startsWith('/admin');
const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    // Show intro animation for 2.3 seconds on every page load
    const timer = setTimeout(() => {
      setShowIntro(false);
    }, 2300); // animation duration
    return () => clearTimeout(timer);
  }, []);
  

  return (
    <div className="min-h-screen flex flex-col font-sans bg-cream text-[#3E2723] selection:bg-gold selection:text-white">
      <IntroLoader show={showIntro} />
      <ToastContainer />
      <ConfirmDialog />
      {!isAuthPage && <Header />}
  {!showIntro && (
        <main className="flex-grow ">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/login/*" element={<Login />} />
            <Route path="/admin/*" element={<Admin />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/payment-success" element={<PaymentSuccess />} />
            <Route path="/workshop" element={<Workshop/>}/>
            <Route path="/franchise" element={<Franchise />} />
            <Route path="/franchise-landing" element={<FranchiseLanding />} />
            <Route path="/art" element={<Art/>}/>
            <Route path="/art/:id" element={<ArtProduct/>}/> 
            <Route path="/about" element={<About/>}/>
            <Route path="/why" element={<Why/>}/>
            <Route path="/flavor" element={<FlavorStrength/>}/>
            <Route path="/whyrob" element={<WhyRobusta/>}/>
            <Route path="/profile" element={<Profile/>}/>
            <Route path="/artist/:id" element={<Artist/>}/>
            <Route path="/ourstory" element={<OurStory/>}/>
            <Route path="/visit-cafe" element={<VisitCafe />} />
            <Route path="/brew-ai" element={<BrewAI />} />
          </Routes>
        </main>
  )}
      {/* Conditionally hide Footer & Chatbot */}
      {!isAuthPage && (
        <>
          <Chatbot /> {/* <--- Add Component here */}
          <Footer />
        </>
      )}
    </div>
  );
};

export default App;