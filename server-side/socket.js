const Message = require('./models/messageModel');

const socketIO = (io) => {
    io.on('connection', (socket) => {
        // When a user connects, you can perform actions here.
        console.log("A user Connected");
        socket.on('getPastMessages', async (userId) => {
          try {
            // Query the database to retrieve past messages
            const pastMessages = await Message.find({
              $or: [
                { senderId: userId },
                { receiverId: userId },
              ],
            }).sort({ timestamp: 1 }).populate('senderId'); // Sort by timestamp to get messages in chronological order
        
            // Emit the past messages to the user
            socket.emit('pastMessages', pastMessages);
          } catch (error) {
            console.error('Error retrieving past messages:', error);
          }
        });
    
        socket.on('message', async (data) => {
          try {
            const { senderId, receiverId, content } = data;
      
            // Save the message to the database
            const message = new Message({
              senderId,
              receiverId,
              content,
              timestamp: new Date(),
              read: false,
            });
            await message.save();
      
            // Emit the message to the receiver
            socket.to(receiverId).emit('message', message);
      
            // Confirm successful message send to the sender
            socket.emit('messageSent', message);
          } catch (error) {
            console.error('Error sending message:', error);
          }
        });

        socket.on('joinRoom', (userId) => {
          socket.join(userId);
        });
      
        socket.on('disconnect', () => {
          console.log('A user disconnected');
        });
    });
}

module.exports = socketIO