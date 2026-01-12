const User = require('../models/user.model');
const Order = require('../models/order.model');
const Workshop = require('../models/workshop.model');
const FranchiseLead = require('../models/franchiseLead.model');
const PDFDocument = require('pdfkit'); // Make sure to run: npm install pdfkit

// Get all users
async function getUsers(req, res) {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
}

// Helper: Fetch Stats Data (Reused for Dashboard & Report)
async function fetchStatsData() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 6);
    lastWeek.setHours(0, 0, 0, 0);

    const [
        totalRevenueAgg, 
        ordersToday, 
        activeWorkshops, 
        franchiseInquiries
    ] = await Promise.all([
        Order.aggregate([
            { $match: { paymentStatus: 'paid' } },
            { $group: { _id: null, total: { $sum: '$totalAmount' } } }
        ]),
        Order.countDocuments({ createdAt: { $gte: today } }),
        Workshop.countDocuments({ status: 'Approved', date: { $gte: today } }),
        FranchiseLead.countDocuments({ status: 'New' })
    ]);

    const totalRevenue = totalRevenueAgg.length > 0 ? totalRevenueAgg[0].total : 0;

    // Weekly Revenue Data
    const revenueChartData = await Order.aggregate([
        {
            $match: {
                paymentStatus: 'paid',
                createdAt: { $gte: lastWeek }
            }
        },
        {
            $group: {
                _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                revenue: { $sum: "$totalAmount" }
            }
        },
        { $sort: { _id: 1 } }
    ]);

    // Format Data
    const formattedChartData = [];
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    for (let i = 0; i < 7; i++) {
        const d = new Date();
        d.setDate(d.getDate() - (6 - i));
        const dateString = d.toISOString().split('T')[0];
        const dayName = days[d.getDay()];

        const found = revenueChartData.find(r => r._id === dateString);
        formattedChartData.push({
            name: dayName,
            revenue: found ? found.revenue : 0,
            date: dateString
        });
    }

    return {
        stats: { totalRevenue, ordersToday, activeWorkshops, franchiseInquiries },
        chartData: formattedChartData
    };
}

// 1. Get Dashboard Stats (JSON)
async function getDashboardStats(req, res) {
    try {
        const data = await fetchStatsData();
        res.status(200).json({
            stats: {
                totalRevenue: data.stats.totalRevenue,
                totalOrdersToday: data.stats.ordersToday,
                activeBookings: data.stats.activeWorkshops,
                artInquiries: data.stats.franchiseInquiries
            },
            chartData: data.chartData
        });
    } catch (error) {
        console.error('Dashboard stats error:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}

// 2. Generate PDF Report
async function generateReport(req, res) {
    try {
        const { stats, chartData } = await fetchStatsData();

        const doc = new PDFDocument();
        const filename = `Business_Report_${new Date().toISOString().split('T')[0]}.pdf`;

        // Set headers
        res.setHeader('Content-disposition', `attachment; filename="${filename}"`);
        res.setHeader('Content-type', 'application/pdf');

        doc.pipe(res);

        // -- PDF CONTENT --
        
        // Header
        doc.fontSize(25).text('Daily Business Report', { align: 'center' });
        doc.moveDown();
        doc.fontSize(12).text(`Date: ${new Date().toLocaleDateString()}`, { align: 'center' });
        doc.moveDown(2);

        // Key Metrics Section
        doc.fontSize(16).text('Key Metrics', { underline: true });
        doc.moveDown();
        
        doc.fontSize(12);
        doc.text(`Total Revenue (All Time): INR ${stats.totalRevenue.toLocaleString()}`);
        doc.moveDown(0.5);
        doc.text(`Orders Today: ${stats.ordersToday}`);
        doc.moveDown(0.5);
        doc.text(`Active Workshops: ${stats.activeWorkshops}`);
        doc.moveDown(0.5);
        doc.text(`New Franchise Inquiries: ${stats.franchiseInquiries}`);
        doc.moveDown(2);

        // Weekly Performance Section
        doc.fontSize(16).text('Weekly Revenue Performance', { underline: true });
        doc.moveDown();

        // Simple Table Header
        const tableTop = doc.y;
        const itemX = 50;
        const priceX = 300;

        doc.font('Helvetica-Bold');
        doc.text('Date', itemX, tableTop);
        doc.text('Revenue (INR)', priceX, tableTop);
        doc.moveDown(0.5);
        
        doc.font('Helvetica');
        let yPosition = doc.y;

        // Table Rows
        chartData.forEach((day) => {
            doc.text(`${day.date} (${day.name})`, itemX, yPosition);
            doc.text(day.revenue.toLocaleString(), priceX, yPosition);
            yPosition += 20;
        });

        // Footer
        doc.moveDown(4);
        doc.fontSize(10).text('Generated automatically by G-Shock Admin System', { align: 'center', color: 'grey' });

        doc.end();

    } catch (error) {
        console.error('Report generation error:', error);
        res.status(500).json({ message: 'Failed to generate report' });
    }
}

module.exports = {
    getUsers,
    getDashboardStats,
    generateReport
};