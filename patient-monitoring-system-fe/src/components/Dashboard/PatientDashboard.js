// haider
import React, { useEffect, useState, useRef } from 'react';
import Chart from 'chart.js/auto';
import { styles } from './PatientDashboardStyle';

const dummyUserData = {
  username: "John Doe"
};

const dummyWellnessTips = [
  "Drink 8 glasses of water daily",
  "Take a 30-minute walk every day",
  "Practice mindfulness for 10 minutes each morning"
];

const dummyHealthStatus = "Your health is in good condition. Keep up the good work!";

export default function Component() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [wellnessTips, setWellnessTips] = useState([]);
  const [healthStatus, setHealthStatus] = useState("");
  const [userData, setUserData] = useState({});

  const lineChartRef = useRef(null);
  const doughnutChartRef = useRef(null);

  useEffect(() => {
    setUserData(dummyUserData);
    setWellnessTips(dummyWellnessTips);
    setHealthStatus(dummyHealthStatus);
  }, []);

  useEffect(() => {
    if (lineChartRef.current) {
      const ctx = lineChartRef.current.getContext('2d');
      let lineChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: Array.from({ length: 1000 }, (_, i) => i),
          datasets: [
            {
              label: 'Dataset 1',
              data: Array.from({ length: 1000 }, () => Math.random() * 100),
              borderColor: 'rgb(255, 99, 132)',
              borderWidth: 1,
            },
            {
              label: 'Dataset 2',
              data: Array.from({ length: 1000 }, () => Math.random() * 100),
              borderColor: 'rgb(54, 162, 235)',
              borderWidth: 1,
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          animation: {
            duration: 2000,
          },
          scales: {
            x: {
              type: 'linear',
              beginAtZero: true
            },
            y: {
              beginAtZero: true
            }
          },
          plugins: {
            legend: {
              display: false
            }
          },
          interaction: {
            intersect: false
          }
        }
      });

      return () => {
        lineChart.destroy();
      };
    }
  }, []);

  useEffect(() => {
    if (doughnutChartRef.current) {
      const ctx = doughnutChartRef.current.getContext('2d');
      let doughnutChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Red', 'Orange', 'Yellow', 'Green', 'Blue'],
          datasets: [{
            label: 'Dataset 1',
            data: [25, 20, 30, 15, 10],
            backgroundColor: ['red', 'orange', 'yellow', 'green', 'blue'],
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          animation: {
            duration: 3000,
            animateRotate: true,
            animateScale: true
          },
          plugins: {
            legend: {
              position: 'top',
            },
            title: {
              display: true,
              text: 'Chart.js Doughnut Chart'
            }
          }
        }
      });

      return () => {
        doughnutChart.destroy();
      };
    }
  }, []);

  const closeSidebar = () => {
    if (sidebarOpen) setSidebarOpen(false);
  };

  const doctorRecommendations = "Continue with your current medication and light exercises.";
  const appointments = [
    { date: '2023-10-15', time: '10:00 AM', doctor: 'Dr. Smith' },
    { date: '2023-11-01', time: '2:00 PM', doctor: 'Dr. Johnson' },
  ];
  const medicationReminders = [
    { medication: 'Aspirin', time: '8:00 AM' },
    { medication: 'Vitamin D', time: '12:00 PM' },
  ];

  return (
    <>
      <style>{styles}</style>
      <div className="dashboard-container">
        <div className={`sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
          {/* Sidebar content */}
        </div>

        {sidebarOpen && <div className="overlay" onClick={closeSidebar}></div>}

        <div className="main-content">
          <div className="header">
            <button
              className="menu-button"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              ☰
            </button>
            <h2 className="page-title">Welcome Back {userData?.username}!</h2>
          </div>

          <div className="content-wrapper">
            <div className="card-section">
              <div className="card-wrapper">
                <div className="card">
                  <div className="card-content">
                    <div className="card-header">
                      <span className="card-icon" style={{color: '#3b82f6'}}>❤️</span>
                      <h3 className="card-title">Health Status</h3>
                    </div>
                    <p>{healthStatus || "Loading..."}</p>
                  </div>
                </div>
                <div className="card">
                  <div className="card-content">
                    <div className="card-header">
                      <span className="card-icon" style={{color: '#eab308'}}>💡</span>
                      <h3 className="card-title">Doctor's Recommendations</h3>
                    </div>
                    <p>{doctorRecommendations}</p>
                  </div>
                </div>
                <div className="card">
                  <div className="card-content">
                    <div className="card-header">
                      <span className="card-icon" style={{color: '#22c55e'}}>📅</span>
                      <h3 className="card-title">Upcoming Appointments</h3>
                    </div>
                    <ul style={{listStyleType: 'disc', paddingLeft: '20px'}}>
                      {appointments.map((appointment, index) => (
                        <li key={index} style={{marginBottom: '10px'}}>
                          {appointment.date} at {appointment.time} with {appointment.doctor}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="card">
                  <div className="card-content">
                    <div className="card-header">
                      <span className="card-icon" style={{color: '#ef4444'}}>💊</span>
                      <h3 className="card-title">Medication Reminders</h3>
                    </div>
                    <ul style={{listStyleType: 'disc', paddingLeft: '20px'}}>
                      {medicationReminders.map((reminder, index) => (
                        <li key={index} style={{marginBottom: '10px'}}>
                          Take {reminder.medication} at {reminder.time}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="card">
                  <div className="card-content">
                    <div className="card-header">
                      <span className="card-icon" style={{color: '#a855f7'}}>🌿</span>
                      <h3 className="card-title">Daily Wellness Tips</h3>
                    </div>
                    {wellnessTips?.length === 0 ? (
                      <p>Loading...</p>
                    ) : (
                      <ul style={{listStyleType: 'disc', paddingLeft: '20px'}}>
                        {wellnessTips.map((tip, index) => (
                          <li key={index} style={{marginBottom: '10px'}}>{tip}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="chart-section">
              <div className="chart-wrapper">
                <div className="chart">
                  <div className="chart-canvas">
                    <canvas ref={lineChartRef}></canvas>
                  </div>
                </div>
              </div>
              <div className="chart-wrapper">
                <div className="chart">
                  <div className="chart-canvas">
                    <canvas ref={doughnutChartRef}></canvas>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}