import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Chart from "chart.js/auto";

export default function App() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const [input, setInput] = useState({ username: "", password: "" });
  const [filter, setFilter] = useState("Monthly");
  const [theme, setTheme] = useState("light");

  const users = [
    { username: "admin", password: "admin123", role: "admin" },
    { username: "analyst", password: "analyst123", role: "user" },
  ];

  // Fake login
  const login = (e) => {
    e.preventDefault();
    const found = users.find(
      (u) => u.username === input.username && u.password === input.password
    );
    if (found) {
      localStorage.setItem("user", JSON.stringify(found));
      setUser(found);
    } else alert("Invalid credentials");
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  // === Chart Data ===
  const [data, setData] = useState(generateData());
  function generateData() {
    return {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      sales: Array(6)
        .fill()
        .map(() => Math.floor(Math.random() * 1200 + 300)),
      users: Array(6)
        .fill()
        .map(() => Math.floor(Math.random() * 500 + 100)),
      performance: [70, 85, 60, 95],
    };
  }

  const [stats, setStats] = useState({
    revenue: 0,
    users: 0,
    growth: 0,
    performance: 0,
  });

  const barRef = useRef();
  const lineRef = useRef();
  const doughnutRef = useRef();

  // Initialize charts
  useEffect(() => {
  if (!user) return;

  setStats({
    revenue: data.sales.reduce((a, b) => a + b, 0),
    users: data.users.reduce((a, b) => a + b, 0),
    growth: Math.floor(Math.random() * 40 + 10),
    performance: Math.floor(Math.random() * 100),
  });

  // Destroy existing charts if they exist
  let barChart, lineChart, doughnutChart;
  if (barRef.current?.chart) barRef.current.chart.destroy();
  if (lineRef.current?.chart) lineRef.current.chart.destroy();
  if (doughnutRef.current?.chart) doughnutRef.current.chart.destroy();

  // Create new charts and store them on the ref
  barRef.current.chart = new Chart(barRef.current, {
    type: "bar",
    data: {
      labels: data.labels,
      datasets: [
        {
          label: "Revenue (₹K)",
          data: data.sales,
          backgroundColor: ["#3b82f6", "#06b6d4", "#10b981", "#f59e0b"],
          borderRadius: 6,
        },
      ],
    },
    options: { responsive: true, maintainAspectRatio: false },
  });

  lineRef.current.chart = new Chart(lineRef.current, {
    type: "line",
    data: {
      labels: data.labels,
      datasets: [
        {
          label: "User Growth",
          data: data.users,
          borderColor: "#8b5cf6",
          backgroundColor: "rgba(139,92,246,0.2)",
          fill: true,
          tension: 0.4,
        },
      ],
    },
    options: { responsive: true, maintainAspectRatio: false },
  });

  doughnutRef.current.chart = new Chart(doughnutRef.current, {
    type: "doughnut",
    data: {
      labels: ["Marketing", "Tech", "Sales", "Ops"],
      datasets: [
        {
          data: data.performance,
          backgroundColor: ["#3b82f6", "#f97316", "#10b981", "#ef4444"],
        },
      ],
    },
    options: { responsive: true, maintainAspectRatio: false },
  });

  // Cleanup on unmount
  return () => {
    barRef.current?.chart?.destroy();
    lineRef.current?.chart?.destroy();
    doughnutRef.current?.chart?.destroy();
  };
}, [user, data]);

 
    

 
  // Auto refresh
  useEffect(() => {
    const interval = setInterval(() => setData(generateData()), 7000);
    return () => clearInterval(interval);
  }, []);

  // === Login Screen ===
  if (!user)
    return (
      <div
        style={{
          ...styles.centerPage,
          background: "linear-gradient(135deg,#6366f1,#3b82f6,#06b6d4)",
          color: "white",
        }}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
          style={styles.loginBox}
        >
          <h1>📊 Pro Business Dashboard</h1>
          <p style={{ color: "#94a3b8" }}>Advanced Analytics Interface</p>
          <form onSubmit={login}>
            <input
              placeholder="Username"
              style={styles.input}
              onChange={(e) =>
                setInput({ ...input, username: e.target.value })
              }
            />
            <input
              placeholder="Password"
              type="password"
              style={styles.input}
              onChange={(e) =>
                setInput({ ...input, password: e.target.value })
              }
            />
            <button style={styles.btn}>Login</button>
          </form>
          <p style={{ marginTop: 10, fontSize: 13 }}>
            Try <b>admin/admin123</b> or <b>analyst/analyst123</b>
          </p>
        </motion.div>
      </div>
    );

  // === Dashboard Screen ===
  return (
    <div
      style={{
        ...styles.container,
        backgroundColor: theme === "light" ? "#f8fafc" : "#1e293b",
        color: theme === "light" ? "#111" : "#f1f5f9",
      }}
    >
      {/* HEADER */}
      <header style={styles.header}>
        <h2>Welcome, {user.role.toUpperCase()}</h2>
        <div style={{ display: "flex", gap: 10 }}>
          <select
            style={styles.select}
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option>Daily</option>
            <option>Weekly</option>
            <option>Monthly</option>
          </select>
          <button
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            style={{
              ...styles.btnSmall,
              backgroundColor: theme === "light" ? "#334155" : "#f8fafc",
              color: theme === "light" ? "white" : "#334155",
            }}
          >
            {theme === "light" ? "🌙" : "☀️"}
          </button>
          <button onClick={logout} style={styles.logout}>
            Logout
          </button>
        </div>
      </header>

      {/* KPI CARDS */}
      <div style={styles.cards}>
        <Card title="Revenue" value={`₹${stats.revenue}K`} color="#3b82f6" />
        <Card title="Active Users" value={stats.users} color="#10b981" />
        <Card title="Growth" value={`${stats.growth}%`} color="#f59e0b" />
        <Card title="Performance" value={`${stats.performance}%`} color="#8b5cf6" />
      </div>

      {/* CHARTS */}
      <div style={styles.charts}>
        <ChartBox title="Revenue Overview" refEl={barRef} />
        <ChartBox title="User Growth" refEl={lineRef} />
        <ChartBox title="Department Performance" refEl={doughnutRef} />
      </div>

      {user.role === "admin" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          style={styles.adminSection}
        >
          <h3>Admin Controls</h3>
          <div style={styles.adminActions}>
            <AdminAction label="Manage Accounts" />
            <AdminAction label="View Reports" />
            <AdminAction label="Export Data" />
          </div>
        </motion.div>
      )}

      <footer style={styles.footer}>
        <p>
          ⚙️ Real-time Business Intelligence Dashboard © 2025 — Updated Every 7s
        </p>
      </footer>
    </div>
  );
}

// === Reusable Components ===
const Card = ({ title, value, color }) => (
  <motion.div whileHover={{ scale: 1.03 }} style={{ ...styles.card, borderTop: `5px solid ${color}` }}>
    <h4>{title}</h4>
    <p style={{ fontSize: 24, fontWeight: "bold", color }}>{value}</p>
  </motion.div>
);

const ChartBox = ({ title, refEl }) => (
  <div style={styles.chartBox}>
    <h3 style={{ marginBottom: 10 }}>{title}</h3>
    <div style={{ height: "250px" }}>
      <canvas ref={refEl}></canvas>
    </div>
  </div>
);

const AdminAction = ({ label }) => (
  <motion.div whileHover={{ scale: 1.05 }} style={styles.adminAction}>
    {label}
  </motion.div>
);

// === Styles ===
const styles = {
  container: {
    width: "100vw",
    height: "100vh",
    overflowY: "auto",
    padding: "20px 40px",
    boxSizing: "border-box",
    transition: "all 0.3s ease",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logout: {
    backgroundColor: "#ef4444",
    color: "white",
    border: "none",
    borderRadius: 8,
    padding: "8px 14px",
    cursor: "pointer",
  },
  select: {
    padding: 8,
    borderRadius: 8,
    border: "1px solid #ccc",
  },
  btnSmall: {
    border: "none",
    borderRadius: 8,
    padding: "8px 12px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  cards: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 20,
    marginTop: 30,
  },
  card: {
    background: "white",
    padding: 20,
    borderRadius: 10,
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    textAlign: "center",
  },
  charts: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
    gap: 25,
    marginTop: 40,
  },
  chartBox: {
    background: "white",
    padding: 20,
    borderRadius: 10,
    boxShadow: "0 3px 10px rgba(0,0,0,0.1)",
  },
  adminSection: {
    marginTop: 50,
  },
  adminActions: {
    display: "flex",
    gap: 20,
    marginTop: 10,
    flexWrap: "wrap",
  },
  adminAction: {
    background: "#3b82f6",
    color: "white",
    padding: 16,
    borderRadius: 10,
    flex: "1 1 200px",
    textAlign: "center",
    fontWeight: "bold",
    cursor: "pointer",
  },
  footer: {
    marginTop: 50,
    textAlign: "center",
    fontSize: 13,
    opacity: 0.7,
  },
  centerPage: {
    width: "100vw",
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  loginBox: {
    background: "white",
    padding: 40,
    borderRadius: 12,
    width: 320,
    textAlign: "center",
    boxShadow: "0 6px 20px rgba(0,0,0,0.2)",
  },
  input: {
    width: "90%",
    margin: 8,
    padding: 10,
    borderRadius: 6,
    border: "1px solid #ccc",
  },
  btn: {
    width: "95%",
    padding: 10,
    marginTop: 10,
    background: "#3b82f6",
    color: "white",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
  },
};
