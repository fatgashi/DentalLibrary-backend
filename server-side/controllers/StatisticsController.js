const UsersModel = require("../models/usersModel");
const Visitor = require("../models/visitorModel");


const StatisticsController = {
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
            return res.status(200).json({ message: 'Registerd' });  // If record exists, don't save again
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

        try {
            const uniqueVisitorCount = await Visitor.find();

            res.status(200).json(uniqueVisitorCount.length);
            
        } catch (error) {
            res.status(500).json({ message: 'Internal server error.' });
        }
    },

    sales: async (req,res) => {

        try {
            const users = await UsersModel.find().populate('purchasedBooks.book');
    
            let totalSales = 0;
    
            users.forEach((user) => {
                user.purchasedBooks.forEach((book) => {
                    totalSales += book.book.price;
                })
            })

            totalSales = totalSales.toFixed(2);
    
            res.status(200).json(totalSales);
            
        } catch (error) {
            res.status(500).json({message: 'Internal server error.'});
        }
    },

    todaySales: async (req,res) => {

        try {
            const today = new Date();
            today.setHours(today.getHours() + 2);
            const startDate = new Date(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate());
            const endDate = new Date(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate() + 1);
            
            startDate.setHours(startDate.getHours() + 2)
            endDate.setHours(endDate.getHours() + 2)

            const aggregationPipeline = [
                {
                  '$match': {
                    'purchasedBooks.purchaseDate': {
                      '$gte': startDate,
                      '$lt': endDate
                    }
                  }
                },
                {
                  '$unwind': '$purchasedBooks'
                },
                {
                  '$lookup': {
                    'from': 'books',  // Replace with the actual name of your Book collection
                    'localField': 'purchasedBooks.book',
                    'foreignField': '_id',
                    'as': 'purchasedBooks.book'
                  }
                },
                {
                  '$unwind': '$purchasedBooks.book'
                },
                {
                  '$match': {
                    'purchasedBooks.purchaseDate': {
                      '$gte': startDate,
                      '$lt': endDate
                    }
                  }
                },
                {
                  '$group': {
                    '_id': '$_id',
                    'purchasedBooks': { '$push': '$purchasedBooks' },
                  }
                }
              ];
    
            const users = await UsersModel.aggregate(aggregationPipeline);
    
            let todaySales = 0;
    
            users.forEach(user => {
                user.purchasedBooks.forEach(books => {
                    todaySales += books.book.price
                })
            })
    
            todaySales = todaySales.toFixed(2);
    
            res.status(200).json(todaySales);
            
        } catch (error) {
            res.status(500).json({message: error.message});
        }
    }
}

module.exports = StatisticsController;
