import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Header from './components/Header';
import Footer from './components/Footer';
import Workshop from './pages/Workshop';
import Home from './pages/Home';
import Menu from './pages/Menu';
import Login from './pages/Login';
import Payment from './pages/Payment';

const App = () => {
  return (
    <Router>
      <div className="min-h-screen flex flex-col font-sans bg-cream text-onyx selection:bg-gold selection:text-white">
        <Header />

        <main className="flex-grow pt-[120px]">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/login" element={<Login />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/workshop" element={<Workshop/>}/>
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
};

export default App;