document.addEventListener("DOMContentLoaded", function () {
    const ctx = document.getElementById("electricityChart").getContext("2d");
    const loadingContainer = document.getElementById("loadingContainer");
    const loadingGif = document.getElementById("loadingGif");
    const loadingMessage = document.getElementById("loadingMessage");
    const chartCanvas = document.getElementById("electricityChart");
    let electricityChart;
    let isFirstLoad = true; // To control when the loading GIF is shown

    function fetchDataAndUpdateChart() {
        if (isFirstLoad) {
            // Show loading elements on the first load
            loadingContainer.style.display = "flex";
            loadingGif.style.display = "block";
            loadingMessage.textContent = "Fetching data...";
            chartCanvas.style.display = "none";
        }

        fetch("/data")
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                if (data.error) {
                    throw new Error(data.error);
                }

                const labels = data.dates;
                const dailyCosts = data.daily_cost;

                // Check if data is available
                if (!labels || labels.length === 0 || !dailyCosts || dailyCosts.length === 0) {
                    throw new Error("No data available.");
                }

                // Calculate average cost
                const averageCost = dailyCosts.reduce((sum, value) => sum + value, 0) / dailyCosts.length;
                const avgCostRounded = averageCost.toFixed(2);

                if (!electricityChart) {
                    // First time: Create the chart
                    electricityChart = new Chart(ctx, {
                        type: "line",
                        data: {
                            labels: labels,
                            datasets: [
                                {
                                    label: "Daily Electricity Cost (₹)",
                                    data: dailyCosts,
                                    borderColor: "blue",
                                    backgroundColor: "rgba(0, 0, 255, 0.1)",
                                    borderWidth: 2,
                                    fill: true,
                                    pointRadius: 5,
                                },
                                {
                                    label: `Average Cost: ₹${avgCostRounded}`,
                                    data: new Array(labels.length).fill(averageCost),
                                    borderColor: "red",
                                    borderWidth: 2,
                                    borderDash: [10, 5],
                                    fill: false,
                                    pointRadius: 0,
                                },
                            ],
                        },
                        options: {
                            responsive: true,
                            maintainAspectRatio: false,
                            scales: {
                                x: { title: { display: true, text: "Date" } },
                                y: { title: { display: true, text: "Cost (₹)" }, beginAtZero: true },
                            },
                            plugins: {
                                legend: {
                                    position: "top",
                                    labels: { padding: 10 },
                                },
                            },
                        },
                    });
                } else {
                    // Just update the existing chart data
                    electricityChart.data.labels = labels;
                    electricityChart.data.datasets[0].data = dailyCosts;
                    electricityChart.data.datasets[1].data = new Array(labels.length).fill(averageCost);
                    electricityChart.data.datasets[1].label = `Average Cost: ₹${avgCostRounded}`;
                    electricityChart.update(); // Efficiently update the chart
                }

                // Hide loading elements after first load
                if (isFirstLoad) {
                    loadingContainer.style.display = "none";
                    chartCanvas.style.display = "block";
                    isFirstLoad = false;
                }
            })
            .catch(error => {
                console.error("Error fetching data:", error);
                loadingMessage.textContent = `Error: ${error.message}`;
                loadingGif.style.display = "none"; // Hide loading animation on error
                isFirstLoad = true; // Reset loading state if error occurs
            });
    }

    // Initial data fetch
    fetchDataAndUpdateChart();

    // Auto-refresh every 10 seconds
    setInterval(fetchDataAndUpdateChart, 10000);

    // Refresh button event listener
    document.getElementById("refreshBtn").addEventListener("click", fetchDataAndUpdateChart);
});
