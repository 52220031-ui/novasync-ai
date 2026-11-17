import { Link } from "react-router-dom";
import "./Home.css";

function Home() {
  return (
    <div className="home-page">

      <section className="home-hero">

        <div className="hero-content">
          <span className="hero-label">
            YOUR SMART ASSISTANT
          </span>

          <h1>Make Your Life Smarter with NovaSync AI</h1>

          <p>
            Discover a smarter way to study, manage
            your health and organize your daily life.
          </p>

          <Link to="/chat" className="home-btn">
            Get Started
          </Link>

          <Link to="/services" className="outline-btn">
            Explore Services
          </Link>
        </div>

        <img
          src="https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=900"
          alt="Artificial Intelligence"
        />

      </section>

      <section className="home-features">

        <h2>Explore Our Features</h2>
        <p>Everything you need in one place.</p>

        <div className="feature-cards">

          <div className="feature-card">
            <span>🤖</span>
            <h3>AI Assistant</h3>
            <p>Ask questions and get helpful answers.</p>
            <Link to="/chat">Explore Now →</Link>
          </div>

          <div className="feature-card">
            <span>📚</span>
            <h3>Study Support</h3>
            <p>Discover tools to support your learning.</p>
            <Link to="/services">Explore Now →</Link>
          </div>

          <div className="feature-card">
            <span>💪</span>
            <h3>Health Tracker</h3>
            <p>Track your health and improve your habits.</p>
            <Link to="/tracker">Explore Now →</Link>
          </div>

        </div>
      </section>

      <section className="home-banner">
        <h2>Ready to Get Started?</h2>
        <p>Make every day smarter with NovaSync AI.</p>
        <Link to="/chat" className="home-btn">
          Try NovaSync AI
        </Link>
      </section>

    </div>
  );
}

export default Home;