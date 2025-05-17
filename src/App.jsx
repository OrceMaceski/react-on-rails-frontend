import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Footer from './components/Footer';
import Home from './components/Home';
import About from './components/About';
import Login from './components/Login';
import Signup from './components/Signup';
import Posts from './components/posts/Posts';
import CreatePost from './components/posts/CreatePost';
import EditPost from './components/posts/EditPost';
import PostDetails from './components/posts/PostDetails';
import { useAuth } from './contexts/AuthContext';
import { Navigate } from 'react-router-dom';

function App() {
  const { isAuthenticated, loading } = useAuth();

  // Protected route component
  const ProtectedRoute = ({ children }) => {
    if (loading) {
      return <div>Loading...</div>; // Show a loading spinner or message
    }

    if (!isAuthenticated) {
      return <Navigate to="/login" />;
    }

    return children;
  };

  if (loading) {
    return <div>Loading...</div>; // Show a loading spinner or message while checking auth
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <Hero />
      <main className="container mx-auto px-4 py-6 flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/posts"
            element={
              <ProtectedRoute>
                <Posts />
              </ProtectedRoute>
            }
          />
          <Route
            path="/posts/new"
            element={
              <ProtectedRoute>
                <CreatePost />
              </ProtectedRoute>
            }
          />
          <Route
            path="/posts/:id"
            element={
              <ProtectedRoute>
                <PostDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/posts/:id/edit"
            element={
              <ProtectedRoute>
                <EditPost />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;