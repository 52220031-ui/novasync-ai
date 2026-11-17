import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="bg-gray-100 text-gray-800 min-h-screen">

      <section className="pt-32 pb-16 px-6 text-center">
        <h1 className="text-4xl font-bold text-blue-900">
          Welcome to NovaSync AI
        </h1>

        <p className="mt-4 text-lg">
          Your personal assistant for studying,
          health and daily activities.
        </p>

        <div className="flex justify-center gap-4 mt-6">
          <Link to="/chat"
            className="bg-blue-900 text-white px-6 py-3 rounded">
            Start Chat
          </Link>

          <Link to="/tracker"
            className="bg-blue-900 text-white px-6 py-3 rounded">
            Health Tracker
          </Link>
        </div>
      </section>

      <section className="px-6 pb-16">

        <h2 className="text-3xl font-bold text-center mb-8">
          Our Features
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <div className="bg-white border rounded p-6">
            <h3 className="text-xl font-bold mb-3">
              AI Assistant
            </h3>
            <p>Ask questions and get helpful answers.</p>
          </div>

          <div className="bg-white border rounded p-6">
            <h3 className="text-xl font-bold mb-3">
              Study Planner
            </h3>
            <p>Organize your studies and daily tasks.</p>
          </div>

          <div className="bg-white border rounded p-6">
            <h3 className="text-xl font-bold mb-3">
              Health Tracker
            </h3>
            <p>Track your health and daily habits.</p>
          </div>

        </div>
      </section>

    </div>
  );
}