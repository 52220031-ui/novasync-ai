import { Link } from "react-router-dom";

function About() {
  return (
    <div className="about-page">

      <section className="about-header">
        <h1>About NovaSync AI</h1>
        <p>Where intelligence meets wellbeing.</p>
      </section>

      <section className="about-content">

        <img
          src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=900"
          alt="Students working together"
        />

        <div className="about-info">
          <h2>Who We Are</h2>

          <p>
            NovaSync AI is a smart academic and health
            assistant designed to help students improve
            their productivity and daily habits.
          </p>

          <p>
            Our platform combines study support, health
            tracking and an interactive chat in one place.
          </p>

          <Link to="/services" className="about-btn">
            Discover Our Services
          </Link>
        </div>

      </section>

      <section className="about-values">

        <h2>What We Believe In</h2>

        <div className="about-cards">

          <div className="about-card">
            <span>🎯</span>
            <h3>Our Mission</h3>
            <p>
              Help students improve their academic
              performance and wellbeing.
            </p>
          </div>

          <div className="about-card">
            <span>💡</span>
            <h3>Our Vision</h3>
            <p>
              Make smart technology accessible
              to every student.
            </p>
          </div>

          <div className="about-card">
            <span>🤝</span>
            <h3>Our Values</h3>
            <p>
              Simplicity, accessibility, privacy
              and honesty.
            </p>
          </div>

        </div>

      </section>

      <section className="about-technologies">
        <h2>Built With</h2>

        <div className="technology-list">
          <span>React</span>
          <span>JavaScript</span>
          <span>CSS</span>
          <span>Vite</span>
          <span>React Router</span>
        </div>
      </section>

    </div>
  );
}

export default About;