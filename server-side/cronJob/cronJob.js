const Visitor = require("../models/visitorModel");
const cron = require('node-cron');


async function deleteOldVisitorRecords() {
    try {

      await Visitor.deleteMany();
  
      console.log('Old visitor records deleted successfully.');
    } catch (error) {
      console.error('Error deleting old visitor records:', error);
    }
}

cron.schedule('59 23 * * *', async () => {
    console.log('Running the deleteOldVisitorRecords function...');
    await deleteOldVisitorRecords();
  }, {
    scheduled: true,
    timezone: 'Europe/Berlin' // Central European Time (CET; UTC+01:00)
});