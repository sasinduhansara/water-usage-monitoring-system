import { useState, useEffect } from "react";
import { fetchWaterUsage } from "../services/api";

function Dashboard() {
  const [waterData, setWaterData] = useState({
    total: 0,
    daily: 0,
    monthly: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchWaterUsage();

        setWaterData({
          total: data.total || 0,
          daily: data.daily || 0,
          monthly: data.monthly || 0,
        });

        setLastUpdated(new Date().toLocaleTimeString());
        setError(null);
      } catch (err) {
        setError("Failed to fetch water usage data");
      } finally {
        setLoading(false);
      }
    };

    // 🔥 first load
    loadData();

    // 🔥 real-time auto refresh (2 sec)
    const interval = setInterval(loadData, 2000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div style={styles.center}>
        <div style={styles.loading}>Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.center}>
        <div style={styles.error}>{error}</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* HEADER */}
      <div style={styles.header}>
        <h1 style={styles.title}>💧 Water Monitoring System</h1>
        <p style={styles.subtitle}>Real-time IoT Water Usage Dashboard</p>
        <p style={styles.time}>Last Updated: {lastUpdated}</p>
      </div>

      {/* CARDS */}
      <div style={styles.grid}>
        <div style={styles.card}>
          <h2>Total Usage</h2>
          <p style={styles.value}>{waterData.total.toLocaleString()}</p>
          <span style={styles.unit}>Liters</span>
        </div>

        <div style={styles.card}>
          <h2>Daily Usage</h2>
          <p style={styles.value}>{waterData.daily.toLocaleString()}</p>
          <span style={styles.unit}>Liters</span>
        </div>

        <div style={styles.card}>
          <h2>Monthly Usage</h2>
          <p style={styles.value}>{waterData.monthly.toLocaleString()}</p>
          <span style={styles.unit}>Liters</span>
        </div>
      </div>

      {/* ALERT */}
      {waterData.daily > 100 && (
        <div style={styles.alert}>⚠️ Daily Water Limit Exceeded!</div>
      )}
    </div>
  );
}

export default Dashboard;

// ===== STYLES =====
const styles = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
    color: "#fff",
    padding: "30px",
    fontFamily: "Arial",
  },

  header: {
    textAlign: "center",
    marginBottom: "30px",
  },

  title: {
    fontSize: "32px",
    margin: 0,
  },

  subtitle: {
    opacity: 0.8,
    marginTop: "5px",
  },

  time: {
    marginTop: "10px",
    fontSize: "14px",
    opacity: 0.7,
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "20px",
  },

  card: {
    background: "rgba(255,255,255,0.1)",
    padding: "20px",
    borderRadius: "15px",
    textAlign: "center",
    backdropFilter: "blur(10px)",
    boxShadow: "0 8px 20px rgba(0,0,0,0.3)",
    transition: "0.3s",
  },

  value: {
    fontSize: "40px",
    margin: "10px 0",
    fontWeight: "bold",
  },

  unit: {
    opacity: 0.7,
  },

  alert: {
    marginTop: "30px",
    padding: "15px",
    background: "#ff4d4d",
    borderRadius: "10px",
    textAlign: "center",
    fontWeight: "bold",
  },

  center: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    background: "#111",
    color: "#fff",
  },

  loading: {
    fontSize: "20px",
  },

  error: {
    color: "red",
    fontSize: "18px",
  },
};
