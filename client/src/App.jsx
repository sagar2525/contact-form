import React, { useState } from 'react';
import ContactForm from './components/ContactForm';
import SubmissionsList from './components/SubmissionsList';
import Login from './components/Login';
import './index.css';

function App() {
  // State to toggle between the 'Contact Form' view and 'Admin Panel' view
  const [view, setView] = useState('form');

  // State to check if the admin is logged in
  // Default is false (not logged in)
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Function to switch to Admin view
  const handleAdminClick = () => {
    setView('admin');
  };

  // Function called when login is successful in Login component
  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  // Helper function to decide which component to show
  const renderContent = () => {
    if (view === 'form') {
      return <ContactForm />;
    }

    // If trying to access Admin view:
    // Check if user is authenticated first
    if (!isAuthenticated) {
      return <Login onLogin={handleLogin} />;
    }

    // If authenticated, show the list
    return <SubmissionsList />;
  };

  return (
    <div className="app-container">
      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="nav-brand">Contact App</div>
        <div className="nav-links">
          <button
            className={`nav-btn ${view === 'form' ? 'active' : ''}`}
            onClick={() => setView('form')}
          >
            Form
          </button>
          <button
            className={`nav-btn ${view === 'admin' ? 'active' : ''}`}
            onClick={handleAdminClick}
          >
            Admin
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="main-content">
        {renderContent()}
      </main>
    </div>
  );
}

export default App;
