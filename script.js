const API_URL = "https://fedskillstest.coalitiontechnologies.workers.dev";
const AUTH_HEADER = "Basic [ENCRYPTED AUTH KEY]"; // Replace with your actual key

// Mock data for fallback testing
const mockData = [
  {
    name: "Jessica Taylor",
    gender: "Female",
    age: 28,
    profile_picture: "https://fedskillstest.ct.digital/4.png",
    phone_number: "(415) 555-1234",
    insurance_type: "Sunrise Health Assurance",
    diagnosis_history: [
      {
        month: "March",
        year: 2024,
        blood_pressure: {
          systolic: { value: 160, levels: "Higher than Average" },
          diastolic: { value: 78, levels: "Lower than Average" },
        },
      },
      {
        month: "April",
        year: 2024,
        blood_pressure: {
          systolic: { value: 150, levels: "High" },
          diastolic: { value: 80, levels: "Normal" },
        },
      },
    ],
  },
];

// Fetch data from the API
async function fetchPatientData() {
  try {
    const response = await fetch(API_URL, {
      method: "GET",
      headers: {
        Authorization: AUTH_HEADER,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }

    const data = await response.json();
    console.log("Fetched Data:", data);

    const jessicaData = data.find((patient) => patient.name === "Jessica Taylor");

    if (jessicaData) {
      displayPatientInfo(jessicaData);
      renderBloodPressureChart(jessicaData.diagnosis_history);
    } else {
      console.error("Jessica Taylor not found in the data.");
    }
  } catch (error) {
    console.error("Error fetching data, using mock data instead:", error);
    useMockData();
  }
}

// Display basic patient information
function displayPatientInfo(patient) {
  const patientInfoDiv = document.getElementById("patient-info");
  patientInfoDiv.innerHTML = `
    <img src="${patient.profile_picture}" alt="Profile Picture" style="width: 100px; border-radius: 50%;">
    <p><strong>Name:</strong> ${patient.name}</p>
    <p><strong>Age:</strong> ${patient.age}</p>
    <p><strong>Gender:</strong> ${patient.gender}</p>
    <p><strong>Phone:</strong> ${patient.phone_number}</p>
    <p><strong>Insurance:</strong> ${patient.insurance_type}</p>
  `;
}

// Render blood pressure graph using Chart.js
function renderBloodPressureChart(diagnosisHistory) {
  const ctx = document.getElementById("bloodPressureChart").getContext("2d");

  const labels = diagnosisHistory.map((entry) => `${entry.month} ${entry.year}`);
  const systolic = diagnosisHistory.map((entry) => entry.blood_pressure.systolic.value);
  const diastolic = diagnosisHistory.map((entry) => entry.blood_pressure.diastolic.value);

  new Chart(ctx, {
    type: "line",
    data: {
      labels: labels, // X-axis labels (months and years)
      datasets: [
        {
          label: "Systolic Pressure",
          data: systolic, // Y-axis data for systolic
          borderColor: "red",
          backgroundColor: "rgba(255, 0, 0, 0.2)",
          fill: true,
          tension: 0.3, // Smooth curve
        },
        {
          label: "Diastolic Pressure",
          data: diastolic, // Y-axis data for diastolic
          borderColor: "blue",
          backgroundColor: "rgba(0, 0, 255, 0.2)",
          fill: true,
          tension: 0.3, // Smooth curve
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "top",
        },
        title: {
          display: true,
          text: "Blood Pressure Over Time",
        },
      },
      scales: {
        x: {
          title: {
            display: true,
            text: "Time (Months)",
          },
        },
        y: {
          title: {
            display: true,
            text: "Blood Pressure (mmHg)",
          },
          beginAtZero: true,
        },
      },
    },
  });
}

// Use mock data if API fails
function useMockData() {
  const jessicaData = mockData[0];
  displayPatientInfo(jessicaData);
  renderBloodPressureChart(jessicaData.diagnosis_history);
}

// Initialize the app
fetchPatientData();
