const Visitor = require("../models/visitorModel");


const VisitorsController = {
    recordVisitors: async (req,res) => {
        try {
            const { ipAddress } = req.body;
            const today = new Date();
            today.setUTCHours(0, 0, 0, 0);  // Set the time to the beginning of the day

            // Check if a record with this IP address exists for today
            const existingRecord = await Visitor.findOne({
            ipAddress,
            timestamp: { $gte: today },  // Check if createdAt is greater than or equal to today
            });

            if (existingRecord) {
            return;  // If record exists, don't save again
            }

            const visitor = new Visitor({
                ipAddress,  // contains the client's IP address
                timestamp: Date.now()
            });
            await visitor.save();
            res.status(200).json({ message: 'Visit recorded successfully.' });
          } catch (error) {
            res.status(500).json({ message: error.message });
          }
    },
    visitorCount: async (req,res) => {
        const today = new Date();
        const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const endOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
        try {
            const uniqueVisitorCount = await Visitor.distinct('ipAddress', {
                timestamp: { $gte: startOfToday, $lt: endOfToday }
              });

            res.status(200).json(uniqueVisitorCount.length);
            
        } catch (error) {
            res.status(500).json({ message: 'Internal server error.' });
        }
    }
}

module.exports = VisitorsController;