import "../styles/DashBoard.css";
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const DashBoard = () => {
  const { BACKENDURL } = useContext(AppContext);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    expired: 0,
    revenue: 0,
  });
  const [recentMembers, setRecentMembers] = useState([]);
  const [expiringSoon, setExpiringSoon] = useState([]);
  const [monthlyRegistrations, setMonthlyRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("Token");

      const res1 = await axios.get(`${BACKENDURL}/members/fetchAllMembers`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const members = res1.data;
      const today = new Date();
      const upcoming = new Date();
      upcoming.setDate(today.getDate() + 14);

      const active = members.filter((m) => m.active).length;
      const expired = members.filter(
        (m) => new Date(m.membershipEndDate) < today
      ).length;
      const expiring = members.filter(
        (m) =>
          new Date(m.membershipEndDate) >= today &&
          new Date(m.membershipEndDate) <= upcoming
      );

      let totalRevenue = 0;
      members.forEach((m) => {
        if (m.active) {
          switch (m.membershipType) {
            case "monthly":
              totalRevenue += 3500;
              break;
            case "quarterly":
              totalRevenue += 6000;
              break;
            case "halfyearly":
              totalRevenue += 10000;
              break;
            case "annual":
              totalRevenue += 15000;
              break;
            default:
              break;
          }
        }
      });

      const revenueInINR = totalRevenue * 75;

      setStats({
        total: members.length,
        active,
        expired,
        revenue: revenueInINR,
      });

      setRecentMembers(members.slice(-5).reverse());
      setExpiringSoon(expiring);

      const registrationsByMonth = [];
      for (let i = 0; i < 12; i++) {
        const monthStart = new Date(today.getFullYear(), i, 1);
        const monthEnd = new Date(today.getFullYear(), i + 1, 0);
        const count = members.filter(
          (m) =>
            new Date(m.membershipStartDate) >= monthStart &&
            new Date(m.membershipStartDate) <= monthEnd
        ).length;
        registrationsByMonth.push(count);
      }
      setMonthlyRegistrations(registrationsByMonth);
    } catch (err) {
      console.error("Error fetching dashboard data", err);
      setError("Failed to load dashboard data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const chartData = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        label: "New Registrations",
        data: monthlyRegistrations,
        fill: false,
        borderColor: "#d32f2f", // Red accent for the chart
        tension: 0.1,
      },
    ],
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(value);
  };

  if (loading) {
    return <div className="loading-screen">Loading Dashboard...</div>;
  }

  if (error) {
    return (
      <div className="error-screen">
        <h2>{error}</h2>
        <button onClick={fetchDashboardData}>Retry</button>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">DASHBOARD</h2>

      <div className="stats-cards">
        <div className="stat-card">
          <h4>Total Members</h4>
          <p>{stats.total}</p>
        </div>
        <div className="stat-card">
          <h4>Active Members</h4>
          <p>{stats.active}</p>
        </div>
        <div className="stat-card">
          <h4>Expired Memberships</h4>
          <p>{stats.expired}</p>
        </div>
        <div className="stat-card">
          <h4>Total Revenue</h4>
          <p>{formatCurrency(stats.revenue)}</p>
        </div>
      </div>

      <div className="section">
        <h3>Recent Registrations</h3>
        <ul className="list">
          {recentMembers.map((m) => (
            <li key={m.id}>
              {m.fullName} — {m.membershipType}
            </li>
          ))}
        </ul>
      </div>

      <div className="section">
        <h3>Monthly Registrations</h3>
        <Line data={chartData} />
      </div>
    </div>
  );
};

export default DashBoard;
