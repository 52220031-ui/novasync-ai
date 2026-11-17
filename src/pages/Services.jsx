import { Link } from "react-router-dom";

function Services() {
  const services = [
    {
      id: 1,
      icon: "🤖",
      name: "AI Assistant",
      description: "Get help with studying, coding and daily questions.",
      features: [
        "Instant answers",
        "Study support",
        "Coding assistance"
      ],
      path: "/chat"
    },
    {
      id: 2,
      icon: "💪",
      name: "Health Tracker",
      description: "Manage your health and improve your daily habits.",
      features: [
        "Track calories",
        "Track exercise",
        "Monitor daily activities"
      ],
      path: "/tracker"
    },
    {
      id: 3,
      icon: "📚",
      name: "Study Planner",
      description: "Get help planning your studies and organizing your time.",
      features: [
        "Study suggestions",
        "Time management",
        "Exam preparation"
      ],
      path: "/chat"
    }
  ];

  return (
    <div className="services-page">

      <section className="services-header">
        <h1>Our Services</h1>
        <p>Smart solutions for a better daily life.</p>
      </section>

      <div className="services-cards">

        {services.map((service) => (
          <div className="service-card" key={service.id}>

            <span className="service-icon">
              {service.icon}
            </span>

            <h2>{service.name}</h2>

            <p>{service.description}</p>

            <ul>
              {service.features.map((feature, index) => (
                <li key={index}>✓ {feature}</li>
              ))}
            </ul>

            <Link to={service.path} className="service-btn">
              Get Started
            </Link>

          </div>
        ))}

      </div>

      <section className="services-banner">
        <h2>Need More Information?</h2>
        <p>We are here to help you.</p>

        <Link to="/contact" className="service-btn">
          Contact Us
        </Link>
      </section>

    </div>
  );
}

export default Services;