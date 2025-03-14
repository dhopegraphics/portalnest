"use strict";

// Grading chats
const performanceCtx = document
  .getElementById("performanceChart")
  .getContext("2d");
const gradeCtx = document.getElementById("gradeChart").getContext("2d");
const pieCtx = document.getElementById("pieChart").getContext("2d");

new Chart(performanceCtx, {
  type: "line",
  data: {
    labels: ["Jan", "Feb", "Mar", "Apr", "May"],
    datasets: [
      {
        label: "Performance",
        data: [75, 80, 82, 78, 81],
        borderColor: "#4c6ef5",
        fill: false,
        tension: 0.4,
      },
    ],
  },
  options: {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  },
});

new Chart(gradeCtx, {
  type: "doughnut",
  data: {
    labels: ["A", "B", "C", "D", "F"],
    datasets: [
      {
        data: [40, 25, 20, 10, 5],
        backgroundColor: [
          "#4c6ef5",
          "#5c7cfa",
          "#748ffc",
          "#91a7ff",
          "#bac8ff",
        ],
      },
    ],
  },
});

new Chart(pieCtx, {
  type: "pie",
  data: {
    labels: ["Red", "Blue", "Yellow"],
    datasets: [
      {
        label: "My First Dataset",
        data: [300, 50, 100],
        backgroundColor: [
          "rgb(255, 99, 132)",
          "rgb(54, 162, 235)",
          "rgb(255, 205, 86)",
        ],
        hoverOffset: 4,
      },
    ],
  },
});
