const Message = require('./models/messageModel');
const User = require('./models/usersModel');

const socketIO = (io) => {
    io.on('connection', (socket) => {
      
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

        socket.on('getAdminConversations', async () => {
          try {
            const adminUserId = '64b93f1a2c51344e99712479'; // Replace 'admin' with the actual admin user's ObjectId
      
            // Query the database to find unique users who have communicated with the admin
            const users = await Message.distinct('senderId', {
              receiverId: adminUserId,
            });
      
            // Find the index of the admin user's ID in the list
            const filteredUsers = users.filter((userId) => !userId.equals(adminUserId));

            const userObjects = await User.find({ _id: { $in: filteredUsers } });

            const conversations = [];

      // Retrieve the last message for each user
            for (const user of userObjects) {
              const lastMessage = await Message.findOne({
                $or: [
                  { senderId: adminUserId, receiverId: user._id },
                  { senderId: user._id, receiverId: adminUserId },
                ],
              })
                .sort({ timestamp: -1 }) // Sort by timestamp in descending order to get the last message
                .limit(1);

                const unreadMessages = await Message.countDocuments({
                  senderId: user._id,
                  receiverId: adminUserId,
                  read: false,
                });

              if (lastMessage) {
                conversations.push({
                  userId: user._id,
                  name: user.name,
                  surname: user.surname,
                  lastMessage: lastMessage.content,
                  lastMessageTimestamp: lastMessage.timestamp,
                  unreadMessages: unreadMessages,
                });
              }
            }

            conversations.sort((a, b) => b.lastMessageTimestamp - a.lastMessageTimestamp);

      
            // Emit the list of user IDs excluding the admin back to the client
            socket.emit('adminConversations', conversations);
          } catch (error) {
            console.error('Error retrieving users who wrote to admin:', error);
            // Handle errors and possibly emit an error event to the client
          }
        });

        socket.on('getAdminUserMessages', async (selectedUserId) => {
          try {
            // Query the database to retrieve messages exchanged between admin and the selected user
            const adminUserId = '64b93f1a2c51344e99712479'; // Assuming you have an admin user or you can retrieve the admin's ID
            const pastMessages = await Message.find({
              $or: [
                { senderId: adminUserId, receiverId: selectedUserId },
                { senderId: selectedUserId, receiverId: adminUserId },
              ],
            }).sort({ timestamp: 1 });

            for (const message of pastMessages) {
              if (message.receiverId.equals(adminUserId) && !message.read) {
                message.read = true;
                await message.save(); 
              }
            }
        
            // Emit the messages back to the admin client
            socket.emit('adminUserMessages', pastMessages);
          } catch (error) {
            console.error('Error retrieving admin user messages:', error);
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