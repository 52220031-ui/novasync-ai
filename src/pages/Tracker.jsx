import { useState, useEffect } from "react";
import {
  loadHealth,
  saveHealth,
  getDay,
  dayTotals,
  todayKey,
  uid
} from "../utils/health.js";

function Tracker() {
  const [data, setData] = useState(loadHealth);
  const [date, setDate] = useState(todayKey());
  const [category, setCategory] = useState("meals");
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");

  const day = getDay(data, date);
  const totals = dayTotals(day);

  useEffect(() => {
    saveHealth(data);
  }, [data]);

  function updateDay(newDay) {
    setData({ ...data, [date]: newDay });
  }

  function addEntry(e) {
    e.preventDefault();

    if (!name.trim() || Number(amount) <= 0) return;

    const entry = {
      id: uid(),
      name: name.trim()
    };

    if (category === "meals") {
      entry.calories = Number(amount);
      entry.type = "Snack";
    } else if (category === "workouts") {
      entry.minutes = Number(amount);
      entry.type = "Cardio";
      entry.intensity = "Medium";
    } else {
      entry.minutes = Number(amount);
      entry.category = "Other";
    }

    updateDay({
      ...day,
      [category]: [...day[category], entry]
    });

    setName("");
    setAmount("");
  }

  function deleteEntry(id) {
    updateDay({
      ...day,
      [category]: day[category].filter(
        (item) => item.id !== id
      )
    });
  }

  return (
    <div className="tracker-page">

      <section className="tracker-header">
        <h1>Health Tracker</h1>
        <p>Track your daily habits and stay healthy.</p>

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </section>

      <div className="tracker-stats">

        <div className="tracker-card">
          <span>🔥</span>
          <h2>{totals.calories}</h2>
          <p>Calories (kcal)</p>
        </div>

        <div className="tracker-card">
          <span>💪</span>
          <h2>{totals.exercise}</h2>
          <p>Exercise (min)</p>
        </div>

        <div className="tracker-card">
          <span>💧</span>
          <h2>{day.water}</h2>
          <p>Water (glasses)</p>
        </div>

        <div className="tracker-card">
          <span>🌙</span>
          <h2>{day.sleep || 0}</h2>
          <p>Sleep (hours)</p>
        </div>

      </div>

      <div className="tracker-content">

        <div className="tracker-form">
          <h2>Add Daily Activity</h2>

          <form onSubmit={addEntry}>

            <label>Category</label>

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="meals">Meals</option>
              <option value="workouts">Exercise</option>
              <option value="activities">Activities</option>
            </select>

            <label>Name</label>

            <input
              type="text"
              placeholder="Enter name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <label>
              {category === "meals" ? "Calories" : "Minutes"}
            </label>

            <input
              type="number"
              value={amount}
              min="1"
              onChange={(e) => setAmount(e.target.value)}
              required
            />

            <button type="submit">Add Entry</button>

          </form>
        </div>

        <div className="tracker-wellness">
          <h2>Daily Wellness</h2>

          <label>Water (glasses)</label>

          <input
            type="number"
            min="0"
            max="20"
            value={day.water}
            onChange={(e) =>
              updateDay({
                ...day,
                water: Math.min(20, Math.max(0, Number(e.target.value)))
              })
            }
          />

          <label>Sleep (hours)</label>

          <input
            type="number"
            min="0"
            max="24"
            step="0.5"
            value={day.sleep}
            onChange={(e) => {
              const value = e.target.value;

              if (value === "" || (Number(value) >= 0 && Number(value) <= 24)) {
                updateDay({ ...day, sleep: value });
              }
            }}
          />

          <label>Mood</label>

          <select
            value={day.mood}
            onChange={(e) =>
              updateDay({ ...day, mood: e.target.value })
            }
          >
            <option value="">Select Mood</option>
            <option>Great</option>
            <option>Good</option>
            <option>Okay</option>
            <option>Tired</option>
            <option>Stressed</option>
          </select>

        </div>
      </div>

      <section className="tracker-history">

        <h2>Daily Records</h2>

        {day[category].length === 0 && (
          <p>No records added yet.</p>
        )}

        {day[category].map((item) => (
          <div className="tracker-record" key={item.id}>

            <h3>{item.name}</h3>

            <p>
              {category === "meals"
                ? item.calories + " kcal"
                : item.minutes + " min"}
            </p>

            <button onClick={() => deleteEntry(item.id)}>
              Delete
            </button>

          </div>
        ))}

      </section>
    </div>
  );
}

export default Tracker;