import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Feed from "./pages/Feed";
import Home from "./pages/Home";
import { PostProvider } from "./context/PostContext";

function App() {
  return (
    <PostProvider>
      <Router>
        <nav className="sticky top-0 z-50 bg-blue-600 text-white p-4 shadow">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <Link to="/" className="text-2xl font-bold">Socialbook</Link>
            <div className="flex gap-6">
              <Link to="/" className="hover:bg-blue-700 px-3 py-1 rounded">Home</Link>
              <Link to="/feed" className="hover:bg-blue-700 px-3 py-1 rounded">Feed</Link>
            </div>
          </div>
        </nav>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/feed" element={<Feed />} />
        </Routes>
      </Router>
    </PostProvider>
  );
}

export default App;
