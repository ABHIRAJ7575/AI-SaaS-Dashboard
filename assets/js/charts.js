// Chart rendering logic using Chart.js

document.addEventListener('DOMContentLoaded', () => {
    // Render Revenue Over Time Chart
    const revenueCtx = document.getElementById('revenueChart');
    if (revenueCtx) {
        // Ensure the api object from data.js is available
        if (typeof api !== 'undefined' && typeof api.getRevenueData === 'function') {
            api.getRevenueData().then(data => {
                new Chart(revenueCtx, {
                    type: 'line',
                    data: {
                        labels: data.labels,
                        datasets: [{
                            label: 'Revenue ($)',
                            data: data.data,
                            backgroundColor: 'rgba(139, 92, 246, 0.2)', // Violet accent
                            borderColor: 'rgba(139, 92, 246, 1)',
                            borderWidth: 2,
                            fill: true,
                            tension: 0.4 // Smooth curves
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                            y: {
                                beginAtZero: true,
                                grid: {
                                    color: 'rgba(255, 255, 255, 0.1)'
                                },
                                ticks: {
                                    color: 'var(--color-text-secondary)'
                                }
                            },
                            x: {
                                grid: {
                                    color: 'rgba(255, 255, 255, 0.1)'
                                },
                                ticks: {
                                    color: 'var(--color-text-secondary)'
                                }
                            }
                        },
                        plugins: {
                            legend: {
                                labels: {
                                    color: 'var(--color-text-primary)'
                                }
                            },
                            tooltip: {
                                backgroundColor: 'var(--color-secondary-bg)',
                                titleColor: 'var(--color-text-primary)',
                                bodyColor: 'var(--color-text-secondary)',
                                borderColor: 'rgba(255, 255, 255, 0.2)',
                                borderWidth: 1
                            }
                        }
                    }
                });
            }).catch(error => console.error("Error fetching revenue data:", error));
        } else {
            console.error("API object or getRevenueData function not found. Ensure data.js is loaded correctly.");
        }
    }

    // Render User Distribution Chart
    const userCtx = document.getElementById('userChart');
    if (userCtx) {
        // Ensure the api object from data.js is available
        if (typeof api !== 'undefined' && typeof api.getUserDistributionData === 'function') {
            api.getUserDistributionData().then(data => {
                new Chart(userCtx, {
                    type: 'doughnut',
                    data: {
                        labels: data.labels,
                        datasets: [{
                            label: 'User Distribution',
                            data: data.data,
                            backgroundColor: [
                                'rgba(139, 92, 246, 0.8)', // Admin - Neon Violet
                                'rgba(59, 130, 246, 0.8)', // Editor - Electric Blue
                                'rgba(16, 185, 129, 0.8)'  // User - Emerald
                            ],
                            borderColor: 'var(--color-secondary-bg)',
                            borderWidth: 1
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                position: 'right',
                                labels: {
                                    color: 'var(--color-text-primary)'
                                }
                            },
                            tooltip: {
                                backgroundColor: 'var(--color-secondary-bg)',
                                titleColor: 'var(--color-text-primary)',
                                bodyColor: 'var(--color-text-secondary)',
                                borderColor: 'rgba(255, 255, 255, 0.2)',
                                borderWidth: 1
                            }
                        }
                    }
                });
            }).catch(error => console.error("Error fetching user distribution data:", error));
        } else {
            console.error("API object or getUserDistributionData function not found. Ensure data.js is loaded correctly.");
        }
    }
});
