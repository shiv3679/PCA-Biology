import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import TheoryOverview from './pages/TheoryOverview';
import TheoryTopic from './pages/TheoryTopic';

export default function App() {
  return (
    <div className="flex flex-col min-h-full">
      <Navbar />

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/theory" element={<TheoryOverview />} />
          <Route path="/theory/:slug" element={<TheoryTopic />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}
