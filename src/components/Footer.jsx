import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-blue-900 text-white text-center py-6 mt-10">

      <h2 className="text-xl font-bold">
        NovaSync AI
      </h2>

      <p className="my-3">
        Your Academic and Wellness Assistant
      </p>

      <div className="flex justify-center gap-5">
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/services">Services</Link>
        <Link to="/contact">Contact</Link>
      </div>

      <p className="mt-5 text-sm">
        © 2026 NovaSync AI - All Rights Reserved
      </p>

    </footer>
  );
}