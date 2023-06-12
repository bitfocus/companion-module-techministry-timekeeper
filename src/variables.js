module.exports = {
	initVariables: function () {
		let variables = [];

		variables.push({ name: 'Total Rooms', variableId: 'total_rooms' });
		variables.push({ name: 'Current Room Joined', variableId: 'current_room_joined' });
		variables.push({ name: 'Total Timers in Room', variableId: 'total_timers' });
		variables.push({ name: 'Room Joined Latest Timer Time Remaining', variableId: 'time_remaining' });
		variables.push({ name: 'Room Joined Latest Timer Label', variableId: 'timer_label' });
		variables.push({ name: 'Room Joined Latest Timer ID', variableId: 'timer_id' });
		variables.push({ name: 'Room Joined Latest Message', variableId: 'message' });

		this.setVariableDefinitions(variables);
	},

	checkVariables: function () {
		let self = this;

		try {
			let variableObj = {};

			variableObj['total_rooms'] = self.ROOMS.length;

			//look up room name by room id
			let roomName = '';
			let roomObj = self.ROOMS.find(room => room.id === self.currentRoomID);
			if (roomObj) {
				roomName = roomObj.name;
			}
			variableObj['current_room_joined'] = roomName;

			variableObj['total_timers'] = self.TIMERS.length;
			//get last timer in array
			let timerObj = self.TIMERS[self.TIMERS.length - 1];
			if (timerObj) {
				variableObj['timer_label'] = timerObj.label;
				variableObj['timer_id'] = timerObj.id;
			}
			else {
				//probably no timers
				variableObj['timer_remaining'] = '';
				variableObj['timer_label'] = '';
				variableObj['timer_id'] = '';
			}

			//get last message in array
			let messageObj = self.MESSAGES[self.MESSAGES.length - 1];
			if (messageObj) {
				variableObj['message'] = messageObj.message;
			}
			else {
				//probably no messages
				variableObj['message'] = '';
			}

			self.setVariableValues(variableObj);
		}
		catch(error) {
			self.log('error', 'Error setting Variables: ' + String(error));
		}
	}
}