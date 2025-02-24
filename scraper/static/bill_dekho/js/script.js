document.addEventListener("DOMContentLoaded", function () {
    const ctx = document.getElementById("electricityChart").getContext("2d");
    const loadingContainer = document.getElementById("loadingContainer");
    const loadingGif = document.getElementById("loadingGif");
    const loadingMessage = document.getElementById("loadingMessage");
    const chartCanvas = document.getElementById("electricityChart");
    const consumerIdInput = document.getElementById("consumerIdInput");
    const fetchBtn = document.getElementById("fetchBtn");
    const formContainer = document.getElementById("forminput");
    const consumerDisplay = document.getElementById("consumerDisplay");
    const resetBtn = document.getElementById("resetBtn");

    let electricityChart;

    if (localStorage.getItem("cachedConsumerId")) {
        consumerIdInput.value = localStorage.getItem("cachedConsumerId");
    }

    async function fetchDataAndUpdateChart() {
        const consumerId = consumerIdInput.value.trim();

        if (!consumerId) {
            alert("Please enter a valid Consumer ID.");
            return;
        }

        localStorage.setItem("cachedConsumerId", consumerId);

        // Hide the input form, show Consumer ID and Reset Button
        formContainer.style.display = "none";
        consumerDisplay.textContent = `Consumer ID: ${consumerId}`;
        consumerDisplay.style.display = "block";
        resetBtn.style.display = "block";

        try {
            loadingContainer.style.display = "flex";
            loadingGif.style.display = "block"; // Ensure the loading GIF is shown
            loadingMessage.textContent = "Fetching data...";
            chartCanvas.style.display = "none";

            const response = await fetch(`/data?consumer_id=${consumerId}`);

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();

            if (data.error) {
                throw new Error(data.error);
            }

            const labels = data.dates;
            const dailyCosts = data.daily_cost;

            if (!labels || labels.length === 0 || !dailyCosts || dailyCosts.length === 0) {
                throw new Error("No data available.");
            }

            const averageCost = dailyCosts.reduce((sum, value) => sum + value, 0) / dailyCosts.length;
            const avgCostRounded = averageCost.toFixed(2);

            if (!electricityChart) {
                electricityChart = new Chart(ctx, {
                    type: "bar",
                    data: {
                        labels: labels,
                        datasets: [
                            {
                                label: "Daily Electricity Cost (₹)",
                                data: dailyCosts,
                                borderColor: "blue",
                                backgroundColor: "rgba(0, 0, 255, 0.6)", // Slightly opaque blue bars
                                borderWidth: 2,
                            },
                            {
                                label: `Average Cost: ₹${avgCostRounded}`,
                                data: new Array(labels.length).fill(averageCost),
                                type: "line", // Set as a line chart
                                borderColor: "red",
                                borderWidth: 2,
                                borderDash: [10, 5], // Dotted line
                                fill: false, // No area fill
                                pointRadius: 0, // No dots
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
                electricityChart.data.labels = labels;
                electricityChart.data.datasets[0].data = dailyCosts;
                electricityChart.data.datasets[1].data = new Array(labels.length).fill(averageCost);
                electricityChart.data.datasets[1].label = `Average Cost: ₹${avgCostRounded}`;
                electricityChart.update();
            }

            loadingContainer.style.display = "none";
            chartCanvas.style.display = "block";
        } catch (error) {
            console.error("Error fetching data:", error);
            loadingMessage.textContent = `Error: ${error.message}`;
            loadingGif.style.display = "none";
        }
    }

    function resetForm() {
        const confirmReset = confirm("Are you sure you want to reset? This will clear all data.");
        if (!confirmReset) return;

        localStorage.removeItem("cachedConsumerId");

        consumerIdInput.value = "";  // Clear input field
        formContainer.style.display = "block";  // Show input form
        consumerDisplay.style.display = "none"; // Hide consumer display
        resetBtn.style.display = "none"; // Hide reset button
        chartCanvas.style.display = "none"; // Hide the chart
    }

    fetchBtn.addEventListener("click", fetchDataAndUpdateChart);
    resetBtn.addEventListener("click", resetForm);
});
