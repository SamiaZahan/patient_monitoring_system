export const styles = `
  .dashboard-container {
    display: flex;
    height: 100vh;
    font-family: Arial, sans-serif;
    background-color: #f0f2f5;
    position: relative;
  }

  .sidebar {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    width: 250px;
    background-color: white;
    box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
    transform: translateX(-100%);
    transition: transform 0.3s ease-in-out;
    z-index: 1000;
  }

  .sidebar-open {
    transform: translateX(0);
  }

  .overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 999;
  }

  .main-content {
    flex: 1;
    padding: 20px;
    overflow-y: auto;
  }

  .header {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
  }

  .menu-button {
    font-size: 24px;
    margin-right: 15px;
    background: none;
    border: none;
    cursor: pointer;
  }

  .page-title {
    font-size: 24px;
    color: #333;
  }

  .content-wrapper {
    display: flex;
    flex-wrap: wrap;
    margin: 0 -10px;
  }

  .card-section {
    width: 100%;
    padding: 0 10px;
  }

  .card-wrapper {
    display: flex;
    flex-wrap: wrap;
    margin: 0 -10px;
  }

  .card {
    width: 100%;
    padding: 0 10px;
    margin-bottom: 20px;
  }

  .card-content {
    background-color: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    height: 100%;
  }

  .card-header {
    display: flex;
    align-items: center;
    margin-bottom: 15px;
  }

  .card-icon {
    margin-right: 10px;
    font-size: 20px;
  }

  .card-title {
    font-size: 18px;
    font-weight: bold;
  }

  .chart-section {
    width: 100%;
    padding: 0 10px;
  }

  .chart-wrapper {
    margin-bottom: 20px;
  }

  .chart {
    background-color: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .chart-canvas {
    height: 300px;
  }

  @media (min-width: 768px) {
    .main-content {
      padding: 30px;
    }

    .card {
      width: 50%;
    }
  }

  @media (min-width: 1024px) {
    .card-section {
      width: 66.67%;
    }

    .chart-section {
      width: 33.33%;
    }
  }

  @media (min-width: 1280px) {
    .menu-button {
      display: none;
    }

    .sidebar {
      transform: translateX(0);
    }

    .main-content {
      margin-left: 250px;
    }
  }
`;