import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Nav from './components/Nav/Nav';
import Transaction from './pages/Transaction';
import Home from './pages/Home';
import Footer from './components/Footer/Footer';
import Rocket from './pages/Rocket';
import Account from './pages/Account';

function App() {

  return (
    <>
      <Router>
        <Nav />
        <Routes>
          <Route path="/transaction" element={<Transaction />} />
          <Route path='/' element={<Home />} />
          <Route path='/rocket' element={<Rocket />} />
          <Route path='/account' element={<Account />} />
        </Routes>
        <Footer />
      </Router>
    </>
  );
}

export default App;
