// Hasanat
import React, { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

// Subcomponents
const PatientLogs = () => {
  const [logs, setLogs] = useState([
    { date: '2023-09-20', log: 'John Doe was administered oxygen therapy. Oxygen level improved from 88% to 95%.' },
    { date: '2023-09-19', log: 'Heart rate spiked during morning check-up, stabilized after medication.' },
    { date: '2023-09-18', log: 'Patient complained of dizziness. Oxygen level was at 87%, further treatment recommended.' },
  ]);
  const [newLog, setNewLog] = useState('');
  const [filter, setFilter] = useState('All');

  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext('2d');

      // Destroy existing chart if it exists
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      // Create new chart
      chartInstance.current = new Chart(ctx, {
        type: 'line',
        data: {
          labels: ['09/17', '09/18', '09/19', '09/20'],
          datasets: [{
            label: 'Oxygen Level (%)',
            data: [92, 87, 95, 98],
            borderColor: '#36a2eb',
            backgroundColor: '#4bc0c0',
            fill: true,
          }]
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    }

    // Cleanup function
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, []);

  const handleAddLog = () => {
    if (newLog.trim() !== '') {
      const currentDate = new Date().toISOString().slice(0, 10);
      setLogs([{ date: currentDate, log: newLog }, ...logs]);
      setNewLog('');
    }
  };

  const filteredLogs = logs.filter(log => filter === 'All' || log.date === filter);

  return (
    <div style={styles.componentContainer}>
      <h2 style={styles.componentTitle}>Patient Logs</h2>
      <div style={styles.logContainer}>
        <div style={styles.logList}>
          <div style={styles.filters}>
            <button onClick={() => setFilter('All')} style={filter === 'All' ? styles.activeFilter : styles.filterButton}>All</button>
            {logs.map(log => (
              <button key={log.date} onClick={() => setFilter(log.date)} style={filter === log.date ? styles.activeFilter : styles.filterButton}>
                {log.date}
              </button>
            ))}
          </div>
          <ul style={styles.logItems}>
            {filteredLogs.map((log, index) => (
              <li key={index} style={styles.logItem}>
                <strong>{log.date}</strong>
                <p>{log.log}</p>
              </li>
            ))}
          </ul>
        </div>
        <div style={styles.newLog}>
          <textarea
            value={newLog}
            onChange={(e) => setNewLog(e.target.value)}
            placeholder="Add a new log entry..."
            style={styles.textarea}
          ></textarea>
          <button onClick={handleAddLog} style={styles.addLogButton}>Add Log</button>
        </div>
      </div>
      <div style={styles.chartContainer}>
        <h3>Oxygen Level Trend</h3>
        <canvas ref={chartRef}></canvas>
      </div>
    </div>
  );
};

const MedicationManagement = () => {
  const medications = [
    { id: 1, name: 'Amoxicillin', dose: '500mg', frequency: 'Three times a day', description: 'Used to treat bacterial infections.' },
    { id: 2, name: 'Ibuprofen', dose: '200mg', frequency: 'Every 6 hours as needed', description: 'Used for pain relief, fever reduction, and anti-inflammation.' },
    { id: 3, name: 'Metformin', dose: '1000mg', frequency: 'Twice a day', description: 'Used to improve blood sugar control in people with type 2 diabetes.' },
  ];

  return (
    <div style={styles.componentContainer}>
      <h2 style={styles.componentTitle}>Medication Management</h2>
      <div style={styles.medicationContainer}>
        <div style={styles.medicationList}>
          {medications.map(medication => (
            <div key={medication.id} style={styles.medicationItem}>
              <h3>{medication.name}</h3>
              <p>Dose: <span style={styles.dose}>{medication.dose}</span></p>
              <p>Frequency: {medication.frequency}</p>
            </div>
          ))}
        </div>
        <div style={styles.medicationDetails}>
          <h3>Medication Details</h3>
          {medications.map(medication => (
            <div key={medication.id} style={styles.medicationDetail}>
              <h4>{medication.name}</h4>
              <p>{medication.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const Appointments = () => {
  const [isVisible, setIsVisible] = useState(false);
  const appointments = [
    { id: 1, patientName: "John Doe", date: "2024-10-05", time: "09:00 AM", status: "Confirmed", doctor: "Dr. Smith" },
    { id: 2, patientName: "Jane Smith", date: "2024-10-06", time: "10:30 AM", status: "Pending", doctor: "Dr. Allen" },
    { id: 3, patientName: "Emily White", date: "2024-10-07", time: "01:00 PM", status: "Cancelled", doctor: "Dr. Morris" }
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={styles.componentContainer}>
      <h2 style={styles.componentTitle}>Appointments and Schedules</h2>
      <div style={styles.tableContainer}>
        <table style={{...styles.table, opacity: isVisible ? 1 : 0}}>
          <thead>
            <tr>
              <th>Patient</th>
              <th>Doctor</th>
              <th>Date</th>
              <th>Time</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map(appointment => (
              <tr key={appointment.id}>
                <td>{appointment.patientName}</td>
                <td>{appointment.doctor}</td>
                <td>{appointment.date}</td>
                <td>{appointment.time}</td>
                <td style={styles[appointment.status.toLowerCase()]}>{appointment.status}</td>
                <td>
                  <button style={styles.button}>View</button>
                  <button style={styles.button}>Cancel</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const PatientOverview = () => {
  const [selectedPatient, setSelectedPatient] = useState(null);
  const lineChartRef = useRef(null);
  const barChartRef = useRef(null);
  const lineChartInstance = useRef(null);
  const barChartInstance = useRef(null);

  const patients = [
    { id: 1, name: 'John Doe', oxygenLevel: 98, heartRate: 72, status: 'Stable' },
    { id: 2, name: 'Jane Smith', oxygenLevel: 92, heartRate: 78, status: 'Attention' },
    { id: 3, name: 'Robert Johnson', oxygenLevel: 95, heartRate: 85, status: 'Stable' },
  ];

  useEffect(() => {
    if (lineChartRef.current && barChartRef.current) {
      // Destroy existing charts if they exist
      if (lineChartInstance.current) {
        lineChartInstance.current.destroy();
      }
      if (barChartInstance.current) {
        barChartInstance.current.destroy();
      }

      // Create new charts
      lineChartInstance.current = new Chart(lineChartRef.current.getContext('2d'), {
        type: 'line',
        data: {
          labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5'],
          datasets: [{
            label: 'Oxygen Level',
            data: [95, 97, 94, 98, 96],
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
          }]
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });

      barChartInstance.current = new Chart(barChartRef.current.getContext('2d'), {
        type: 'bar',
        data: {
          labels: patients.map(p => p.name),
          datasets: [{
            label: 'Heart Rate',
            data: patients.map(p => p.heartRate),
            backgroundColor: 'rgba(255, 99, 132, 0.5)'
          }]
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    }

    // Cleanup function
    return () => {
      if (lineChartInstance.current) {
        lineChartInstance.current.destroy();
      }
      if (barChartInstance.current) {
        barChartInstance.current.destroy();
      }
    };
  }, []);

  return (
    <div style={styles.componentContainer}>
      <h2 style={styles.componentTitle}>Patient Overview</h2>
      <table style={styles.patientTable}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Oxygen Level</th>
            <th>Heart Rate</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((patient) => (
            <tr
              key={patient.id}
              style={styles[patient.status.toLowerCase()]}
              onClick={() => setSelectedPatient(selectedPatient === patient.id ? null : patient.id)}
            >
              <td>{patient.name}</td>
              <td>{patient.oxygenLevel}%</td>
              <td>{patient.heartRate} bpm</td>
              <td>{patient.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={styles.chartsContainer}>
        <div style={styles.chart}>
          <h3>Oxygen Levels Trend</h3>
          <canvas ref={lineChartRef}></canvas>
        </div>
        <div style={styles.chart}>
          <h3>Heart Rates Overview</h3>
          <canvas ref={barChartRef}></canvas>
        </div>
      </div>
    </div>
  );
};

const RealTimeAlerts = () => {
  const [filter, setFilter] = useState('All');
  const [sortOrder, setSortOrder] = useState('Newest');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  const alerts = [
    { id: 1, type: 'Critical', message: 'John Doe\'s oxygen level dropped below 85%', time: 'Just now', acknowledged: false },
    { id: 2, type: 'Warning', message: 'Jane Smith\'s heart rate spiked to 110 bpm', time: '2 mins ago', acknowledged: false },
    { id: 3, type: 'Info', message: 'Routine checkup scheduled for Robert Johnson', time: '5 mins ago', acknowledged: false },
  ];

  useEffect(() => {
    if (chartRef.current) {
      // Destroy existing chart if it exists
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      // Create new chart
      chartInstance.current = new Chart(chartRef.current.getContext('2d'), {
        type: 'line',
        data: {
          labels: ['10 mins ago', '20 mins ago', '30 mins ago', '40 mins ago'],
          datasets: [
            {
              label: 'Critical Alerts',
              data: [2, 3, 5, 6],
              borderColor: '#ff6384',
              backgroundColor: '#ff6384',
              fill: false,
            },
            {
              label: 'Warning Alerts',
              data: [1, 2, 2, 4],
              borderColor: '#ffce56',
              backgroundColor: '#ffce56',
              fill: false,
            },
          ]
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    }

    // Cleanup function
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, []);

  const filteredAlerts = alerts.filter((alert) => {
    if (filter === 'All') return true;
    return alert.type === filter;
  }).sort((a, b) => {
    if (sortOrder === 'Newest') {
      return new Date(b.time) - new Date(a.time);
    } else {
      return new Date(a.time) - new Date(b.time);
    }
  });

  return (
    <div style={styles.componentContainer}>
      <h2 style={styles.componentTitle}>Real-Time Alerts</h2>
      <div style={styles.alertControls}>
        <div style={styles.filters}>
          <button onClick={() => setFilter('All')} style={filter === 'All' ? styles.activeFilter : styles.filterButton}>All</button>
          <button onClick={() => setFilter('Critical')} style={filter === 'Critical' ? {...styles.activeFilter, ...styles.criticalButton} : styles.filterButton}>Critical</button>
          <button onClick={() => setFilter('Warning')} style={filter === 'Warning' ? {...styles.activeFilter, ...styles.warningButton} : styles.filterButton}>Warning</button>
          <button onClick={() => setFilter('Info')} style={filter === 'Info' ? {...styles.activeFilter, ...styles.infoButton} : styles.filterButton}>Info</button>
        </div>
        <div style={styles.sortAndSound}>
          <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} style={styles.sortSelect}>
            <option value="Newest">Newest</option>
            <option value="Oldest">Oldest</option>
          </select>
          <button onClick={() => setSoundEnabled(!soundEnabled)} style={styles.soundToggle}>
            {soundEnabled ? '🔊 Sound On' : '🔇 Sound Off'}
          </button>
        </div>
      </div>
      <ul style={styles.alertList}>
        {filteredAlerts.map((alert) => (
          <li key={alert.id} style={{...styles.alertItem, ...styles[alert.type.toLowerCase()]}}>
            <div style={styles.alertContent}>
              <p style={styles.alertMessage}>{alert.message}</p>
              <span style={styles.alertTime}>{alert.time}</span>
            </div>
          </li>
        ))}
      </ul>
      <div style={styles.chartContainer}>
        <h3>Alert Trends</h3>
        <canvas ref={chartRef}></canvas>
      </div>
    </div>
  );
};

const StaffPortal = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderActiveComponent = () => {
    switch (activeTab) {
      case 'patientLogs':
        return <PatientLogs />;
      case 'medication':
        return <MedicationManagement />;
      case 'appointments':
        return <Appointments />;
      case 'patientOverview':
        return <PatientOverview />;
      case 'alerts':
        return <RealTimeAlerts />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div style={styles.portalContainer}>
      <div style={styles.sidebar}>
        <h1 style={styles.title}>Staff Portal</h1>
        <ul style={styles.menu}>
          <li style={styles.menuItem} onClick={() => setActiveTab('dashboard')}>Dashboard</li>
          <li style={styles.menuItem} onClick={() => setActiveTab('patientLogs')}>Patient Logs</li>
          <li style={styles.menuItem} onClick={() => setActiveTab('medication')}>Medication</li>
          <li style={styles.menuItem} onClick={() => setActiveTab('appointments')}>Appointments</li>
          <li style={styles.menuItem} onClick={() => setActiveTab('patientOverview')}>Patient Overview</li>
          <li style={styles.menuItem} onClick={() => setActiveTab('alerts')}>Real-Time Alerts</li>
        </ul>
      </div>
      <div style={styles.content}>
        {renderActiveComponent()}
      </div>
    </div>
  );
};

const Dashboard = () => {
  const attendanceChartRef = useRef(null);
  const departmentChartRef = useRef(null);
  const attendanceChartInstance = useRef(null);
  const departmentChartInstance = useRef(null);

  useEffect(() => {
    if (attendanceChartRef.current && departmentChartRef.current) {
      // Destroy existing charts if they exist
      if (attendanceChartInstance.current) {
        attendanceChartInstance.current.destroy();
      }
      if (departmentChartInstance.current) {
        departmentChartInstance.current.destroy();
      }

      // Create new charts
      attendanceChartInstance.current = new Chart(attendanceChartRef.current.getContext('2d'), {
        type: 'line',
        data: {
          labels: ['January', 'February', 'March', 'April', 'May'],
          datasets: [
            {
              label: 'Attendance',
              data: [95, 90, 88, 92, 96],
              borderColor: 'rgba(255, 99, 132, 1)',
              backgroundColor: 'rgba(255, 99, 132, 0.2)',
              fill: true,
            },
          ],
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });

      departmentChartInstance.current = new Chart(departmentChartRef.current.getContext('2d'), {
        type: 'pie',
        data: {
          labels: ['HR', 'Finance', 'IT', 'Operations'],
          datasets: [
            {
              label: 'Staff by Department',
              data: [10, 15, 20, 5],
              backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
            },
          ],
        },
        options: {
          responsive: true,
        },
      });
    }

    // Cleanup function
    return () => {
      if (attendanceChartInstance.current) {
        attendanceChartInstance.current.destroy();
      }
      if (departmentChartInstance.current) {
        departmentChartInstance.current.destroy();
      }
    };
  }, []);

  return (
    <div>
      <h1 style={styles.pageTitle}>Welcome, Dr. Smith</h1>
      <div style={styles.chartsWrapper}>
        <div style={styles.chartContainerSmall}>
          <canvas ref={attendanceChartRef}></canvas>
        </div>
        <div style={styles.chartContainerSmall}>
          <canvas ref={departmentChartRef}></canvas>
        </div>
      </div>
      <div style={styles.profileCard}>
        <h2>Your Profile</h2>
        <p>Name: Dr. John Smith</p>
        <p>Department: Cardiology</p>
        <p>Years of Experience: 15</p>
        <button style={styles.viewButton}>View Full Profile</button>
      </div>
    </div>
  );
};

const styles = {
  portalContainer: {
    display: 'flex',
    height: '100vh',
    fontFamily: "'Poppins', sans-serif",
    backgroundColor: '#f0f0f0',
  },
  sidebar: {
    width: '20%',
    backgroundColor: '#333',
    color: 'white',
    padding: '2rem',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: '2rem',
    textAlign: 'center',
    marginBottom: '2rem',
  },
  menu: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  menuItem: {
    padding: '1rem',
    cursor: 'pointer',
    color: '#f0f0f0',
    transition: 'background-color 0.3s',
  },
  content: {
    width: '80%',
    padding: '2rem',
    overflowY: 'auto',
  },
  pageTitle: {
    fontSize: '2.5rem',
    color: '#333',
    marginBottom: '2rem',
  },
  chartsWrapper: {
    display: 'flex',
    gap: '2rem',
    justifyContent: 'space-between',
    marginBottom: '2rem',
  },
  chartContainerSmall: {
    width: '45%',
    height: '250px',
  },
  profileCard: {
    backgroundColor: 'white',
    borderRadius: '10px',
    padding: '2rem',
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
  },
  viewButton: {
    backgroundColor: '#333',
    color: 'white',
    padding: '1rem 2rem',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginTop: '1rem',
  },
  componentContainer: {
    backgroundColor: 'white',
    borderRadius: '10px',
    padding: '2rem',
    marginBottom: '2rem',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  componentTitle: {
    fontSize: '1.8rem',
    color: '#333',
    marginBottom: '1.5rem',
  },
  logContainer: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  logList: {
    width: '60%',
  },
  filters: {
    display: 'flex',
    gap: '0.5rem',
    marginBottom: '1rem',
  },
  filterButton: {
    padding: '0.5rem 1rem',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    backgroundColor: '#f0f0f0',
  },
  activeFilter: {
    backgroundColor: '#333',
    color: 'white',
  },
  logItems: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  logItem: {
    marginBottom: '1rem',
    padding: '1rem',
    backgroundColor: '#f9f9f9',
    borderRadius: '5px',
  },
  newLog: {
    width: '35%',
  },
  textarea: {
    width: '100%',
    height: '100px',
    marginBottom: '1rem',
    padding: '0.5rem',
    borderRadius: '5px',
    border: '1px solid #ddd',
  },
  addLogButton: {
    padding: '0.5rem 1rem',
    backgroundColor: '#333',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  chartContainer: {
    marginTop: '2rem',
  },
  medicationContainer: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  medicationList: {
    width: '45%',
  },
  medicationItem: {
    marginBottom: '1rem',
    padding: '1rem',
    backgroundColor: '#f9f9f9',
    borderRadius: '5px',
  },
  dose: {
    fontWeight: 'bold',
    color: '#007bff',
  },
  medicationDetails: {
    width: '45%',
  },
  medicationDetail: {
    marginBottom: '1rem',
    padding: '1rem',
    backgroundColor: '#f9f9f9',
    borderRadius: '5px',
  },
  tableContainer: {
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    transition: 'opacity 0.5s ease-in-out',
  },
  confirmed: { color: '#27AE60' },
  pending: { color: '#F39C12' },
  cancelled: { color: '#C0392B' },
  button: {
    backgroundColor: '#3498DB',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    padding: '0.5rem 1rem',
    cursor: 'pointer',
    marginRight: '0.5rem',
  },
  patientTable: {
    width: '100%',
    borderCollapse: 'collapse',
    marginBottom: '2rem',
  },
  stable: { backgroundColor: '#eaffea' },
  attention: { backgroundColor: '#fff3cd' },
  critical: { backgroundColor: '#f8d7da' },
  chartsContainer: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  chart: {
    width: '48%',
  },
  alertControls: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '1rem',
  },
  sortAndSound: {
    display: 'flex',
    alignItems: 'center',
  },
  sortSelect: {
    marginRight: '1rem',
    padding: '0.5rem',
  },
  soundToggle: {
    padding: '0.5rem 1rem',
    backgroundColor: '#f0f0f0',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  alertList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  alertItem: {
    padding: '1rem',
    marginBottom: '0.5rem',
    borderRadius: '5px',
  },
  criticalButton: { backgroundColor: '#ff6384' },
  warningButton: { backgroundColor: '#ffce56' },
  infoButton: { backgroundColor: '#36a2eb' },
  alertContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  alertMessage: {
    margin: 0,
  },
  alertTime: {
    fontSize: '0.8rem',
    color: '#666',
  },
};

export default StaffPortal;