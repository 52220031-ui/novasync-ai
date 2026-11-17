import { Link, NavLink } from 'react-router-dom';

export default function Navbar() {
  return (
    <header className="fixed top-0 left-0 w-full bg-blue-900 text-white z-50">
      <nav className="flex flex-wrap items-center justify-between px-6 py-4">

        <Link to="/" className="text-xl font-bold">
          NovaSync AI
        </Link>

        <div className="flex flex-wrap gap-5">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/about">About</NavLink>
          <NavLink to="/services">Services</NavLink>
          <NavLink to="/tracker">Tracker</NavLink>
          <NavLink to="/chat">AI Chat</NavLink>
          <NavLink to="/contact">Contact</NavLink>
        </div>

      </nav>
    </header>
  );
}