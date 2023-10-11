const Visitor = require("../models/visitorModel");
const cron = require('node-cron');


async function deleteOldVisitorRecords() {
    try {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);  // Get date for yesterday
  
      // Delete records older than yesterday
      await Visitor.deleteMany({ timestamp: { $lt: yesterday } });
  
      console.log('Old visitor records deleted successfully.');
    } catch (error) {
      console.error('Error deleting old visitor records:', error);
    }
}

cron.schedule('1 0 * * *', async () => {
    console.log('Running the deleteOldVisitorRecords function...');
    await deleteOldVisitorRecords();
  }, {
    scheduled: true,
    timezone: 'Europe/Berlin' // Central European Time (CET; UTC+01:00)
});