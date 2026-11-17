import { useState } from "react";

function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();

    setSuccess(true);

    setName("");
    setEmail("");
    setSubject("");
    setMessage("");
  }

  return (
    <div className="contact-page">

      <section className="contact-header">
        <h1>Contact Us</h1>
        <p>We would love to hear from you.</p>
      </section>

      <div className="contact-container">

        <div className="contact-info">

          <h2>Get In Touch</h2>

          <p>
            Have a question or suggestion?
            Feel free to contact our team.
          </p>

          <div className="contact-card">
            <span>📧</span>
            <h3>Email</h3>
            <p>contact@novasync.ai</p>
          </div>

          <div className="contact-card">
            <span>📍</span>
            <h3>Location</h3>
            <p>Lebanon</p>
          </div>

          <div className="contact-card">
            <span>🕒</span>
            <h3>Working Hours</h3>
            <p>Monday - Friday</p>
            <p>9:00 AM - 5:00 PM</p>
          </div>

        </div>

        <div className="contact-form">

          <h2>Send Us a Message</h2>

          <form onSubmit={handleSubmit}>

            <label>Full Name</label>
            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <label>Email Address</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label>Subject</label>
            <input
              type="text"
              placeholder="Enter subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
            />

            <label>Message</label>
            <textarea
              placeholder="Write your message..."
              rows="5"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />

            <button type="submit">
              Send Message
            </button>

            {success && (
              <p className="success-message">
                Demo form submitted successfully!
              </p>
            )}

          </form>

        </div>
      </div>
    </div>
  );
}

export default Contact;