// Mock data and API simulation

const mockData = {
    users: [
        {
            id: 1,
            name: "Alex Johnson",
            email: "alex@example.com",
            avatar: "https://i.pravatar.cc/150?img=1",
            role: "Admin",
            status: "Active",
            joinDate: "2024-01-15"
        },
        {
            id: 2,
            name: "Maria Garcia",
            email: "maria@example.com",
            avatar: "https://i.pravatar.cc/150?img=2",
            role: "User",
            status: "Inactive",
            joinDate: "2023-11-20"
        },
        {
            id: 3,
            name: "John Smith",
            email: "john@example.com",
            avatar: "https://i.pravatar.cc/150?img=3",
            role: "Editor",
            status: "Active",
            joinDate: "2024-02-01"
        },
        {
            id: 4,
            name: "Sarah Brown",
            email: "sarah@example.com",
            avatar: "https://i.pravatar.cc/150?img=4",
            role: "User",
            status: "Active",
            joinDate: "2023-10-05"
        },
        {
            id: 5,
            name: "Michael Davis",
            email: "michael@example.com",
            avatar: "https://i.pravatar.cc/150?img=5",
            role: "Admin",
            status: "Active",
            joinDate: "2024-03-10"
        }
    ],

    charts: {
        revenueOverTime: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            data: [2500, 2800, 3200, 3000, 3500, 4000, 3800, 4200, 4500, 4300, 4800, 5000]
        },
        userDistribution: {
            labels: ['Admin', 'Editor', 'User'],
            data: [5, 10, 85] // Percentage
        },
        userGrowth: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            data: [100, 120, 150, 130, 180, 200, 190, 220, 250, 230, 280, 300]
        }
    },

    activityTimeline: [
        {
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
            type: "user_registered",
            message: "<strong>John Doe</strong> registered a new account."
        },
        {
            timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
            type: "profile_update",
            message: "<strong>Jane Smith</strong> updated her profile information."
        },
        {
            timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
            type: "project_created",
            message: "<strong>Alex Johnson</strong> created a new project: 'AI Model Training'."
        },
        {
            timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
            type: "billing_update",
            message: "Subscription plan for <strong>Maria Garcia</strong> was updated."
        }
    ],

    stats: {
        totalUsers: 1234,
        activeUsers: 1050,
        revenue: 12345,
        growthRate: 12
    }
};

// API simulation (using Promises to mimic async operations)
const api = {
    getUsers: () => new Promise(resolve => setTimeout(() => resolve(mockData.users), 500)),
    getRevenueData: () => new Promise(resolve => setTimeout(() => resolve(mockData.charts.revenueOverTime), 500)),
    getUserDistributionData: () => new Promise(resolve => setTimeout(() => resolve(mockData.charts.userDistribution), 500)),
    getActivityTimeline: () => new Promise(resolve => setTimeout(() => resolve(mockData.activityTimeline), 500)),
    getDashboardStats: () => new Promise(resolve => setTimeout(() => resolve(mockData.stats), 500))
};
