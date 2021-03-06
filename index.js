require('dotenv').config();
const io = require('socket.io')(process.env.PORT || 5000, {
	cors: {
		origin: process.env.FRONTEND_URL,
	},
});

io.on('connection', (socket) => {
	const id = socket.handshake.query.id;
	socket.join(id);
	console.log(id);
	socket.on('send-message', ({ recipients, text }) => {
		console.log(text);
		recipients.forEach((recipient) => {
			const newRecipients = recipients.filter((r) => r !== recipient);
			newRecipients.push(id);
			socket.broadcast.to(recipient).emit('receive-message', {
				recipients: newRecipients,
				sender: id,
				text,
			});
		});
	});
});
