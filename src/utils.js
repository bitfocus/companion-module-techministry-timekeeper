const { InstanceStatus } = require('@companion-module/base')

const io = require('socket.io-client');

function updateTimeRemaining() {
	let self = this;

	//loop through all timers and update time remaining
	for (let i = 0; i < self.TIMERS.length; i++) {
		let timerObj = self.TIMERS[i];
		if (timerObj) {
			//console.log(timerObj);
			let timeRemaining = (timerObj.datetime - Date.now());
			if (timeRemaining < 0) {
				timeRemaining = 0;
			}
			timerObj.timeRemaining = timeRemaining;

			let timeRemainingString = formatTime(timeRemaining, self.config.format);
			timerObj.timeRemainingString = timeRemainingString;

			if (self.config.verbose) {
				//self.log('debug', 'Timer: ' + timerObj.label + ' - Time Remaining: ' + timeRemainingString);
			}

			//if it's the last timer, it's the latest timer, so update the variable
			if (i === (self.TIMERS.length - 1)) {
				let variableObj = {};
				variableObj['time_remaining'] = timeRemainingString;
				self.setVariableValues(variableObj);
				self.checkFeedbacks();
			}
		}
	}	
};

function formatTime(datetime, format) {
	//create a friendly time string
	let timeString = '';

	let days = Math.floor(datetime / 86400000);
	let hours = Math.floor(datetime / 3600000);
	let minutes = Math.floor((datetime % 3600000) / 60000);
	let seconds = Math.floor(((datetime % 3600000) % 60000) / 1000);

	switch(format) {
		case 'hh:mm:ss':
			if (days > 0) {
				timeString += days.toString().padStart(2, '0') + ':';
			}
			if (hours >= 0) {
				timeString += hours.toString().padStart(2, '0') + ':';
			}
			if (minutes >= 0) {
				timeString += minutes.toString().padStart(2, '0') + ':';
			}
			if (seconds >= 0) {
				timeString += seconds.toString().padStart(2, '0') + '';
			}
			break;
		case 'mm:ss':
			//need to grab days and hours and add them to minutes
			minutes += (days * 24 * 60) + (hours * 60);
			timeString = minutes.toString().padStart(2, '0') + ':' + seconds.toString().padStart(2, '0');
			break;
		case 'ss':
			//need to grab days, hours, and minutes and add them to seconds
			seconds += (days * 24 * 60 * 60) + (hours * 60 * 60) + (minutes * 60);
			timeString = seconds.toString().padStart(2, '0');
			break;
		case 'HHh MMm SSs':
			if (days > 0) {
				timeString += days + 'd ';
			}
			if (hours > 0) {
				timeString += hours + 'h ';
			}
			if (minutes > 0) {
				timeString += minutes + 'm ';
			}
			if (seconds > 0) {
				timeString += seconds + 's';
			}
			break;
		case 'MMm SSs':
			//need to grab days and hours and add them to minutes
			minutes += (days * 24 * 60) + (hours * 60);
			timeString = minutes + 'm ' + seconds + 's';
			break;
		case 'SSs':
			//need to grab days, hours, and minutes and add them to seconds
			seconds += (days * 24 * 60 * 60) + (hours * 60 * 60) + (minutes * 60);
			timeString = seconds + 's';
			break;
	}

	return timeString;
}

module.exports = {
	initConnection() {
		let self = this;

		if (self.config.host) {
			self.log('info', `Opening connection to TimeKeeper: ${self.config.host}:${self.config.port}`);
	
			self.socket = io.connect('http://' + self.config.host + ':' + self.config.port, {reconnection: true});

			self.socket.on('connect', function() {
				self.connected = true;
				self.log('info', 'Connected to TimeKeeper. Retrieving data.');
				self.updateStatus(InstanceStatus.Ok);

				self.socket.emit('TimeKeeper_GetAllRooms');

				//log current room id
				if (self.config.verbose) {
					self.log('info', 'Current Room ID: ' + self.currentRoomID);
				}

				self.socket.emit('TimeKeeper_JoinRoom', self.currentRoomID);
				self.socket.emit('TimeKeeper_GetTimers', self.currentRoomID);
				self.socket.emit('TimeKeeper_GetMessages', self.currentRoomID);
			});

			self.socket.on('TimeKeeper_Rooms', function(data) {
				self.ROOMS = data;
				//build list of rooms for dropdown
				self.ROOMS_LIST = [
					{ id: 'room-0', label: '(Master Room - room0)' }
				];
				for (let i = 0; i < self.ROOMS.length; i++) {
					let roomObj = {};
					roomObj.id = self.ROOMS[i].id;
					roomObj.label = self.ROOMS[i].name;
					self.ROOMS_LIST.push(roomObj);
				}

				self.configUpdated(self.config);

				self.initActions();
				self.initFeedbacks();
				self.initVariables();
				self.initPresets();

				self.checkFeedbacks();
				self.checkVariables();
			});

			self.socket.on('TimeKeeper_Timers', function(data) {
				self.TIMERS = data;
				//build list of timers for dropdown
				self.TIMERS_LIST = [
					{ id: '0', label: '(Select a Timer)' }
				];
				for (let i = 0; i < self.TIMERS.length; i++) {
					let timerObj = {};
					timerObj.id = self.TIMERS[i].id;

					let timeString = formatTime(self.TIMERS[i].datetime, self.config.format);

					timerObj.label = timeString + ' - ' + self.TIMERS[i].label;
					timerObj.label = self.TIMERS[i].label;
					self.TIMERS_LIST.push(timerObj);
				}

				self.initActions();
				self.initFeedbacks();
				self.initVariables();
				self.initPresets();

				self.checkFeedbacks();
				self.checkVariables();

				self.updateStatus(InstanceStatus.Ok);
			});

			self.socket.on('TimeKeeper_Messages', function(data) {
				self.MESSAGES = data;

				self.checkFeedbacks();
				self.checkVariables();
			});
	
			self.socket.on('disconnect', function() { 
				self.updateStatus(InstanceStatus.ConnectionFailure);
				self.log('error', 'Disconnected from TimeKeeper.');
				self.checkFeedbacks();
				self.checkVariables();
				self.connected = false;
			});

			self.socket.on('error', function(error) {
				self.updateStatus(InstanceStatus.ConnectionFailure);
				self.log('error', 'Error from TimeKeeper: ' + error);
			});
		}
	},

	setupInterval() {
		let self = this;

		if (self.config.verbose) {
			self.log('info', 'Setting up interval to update time remaining.');
		}

		self.INTERVAL = setInterval(updateTimeRemaining.bind(self), 1000);
	},

	sendCommand(cmd, arg1 = null, arg2 = null, arg3 = null) {	
		let self = this;

		if (self.socket !== undefined) {
			if (self.config.verbose) {
				self.log('info', 'Sending: ' + cmd);
			}
	
			if (arg1 !== null) {
				if (arg2 !== null) {
					if (arg3 !== null) {
						self.socket.emit(cmd, arg1, arg2, arg3);
					}
					else {
						self.socket.emit(cmd, arg1, arg2);
					}
				}
				else {
					self.socket.emit(cmd, arg1);
				}
			}
			else {
				self.socket.emit(cmd);
			}
		}
		else {
			debug('Unable to send: Not connected to TimeKeeper.');
	
			if (self.config.verbose) {
				self.log('warn', 'Unable to send: Not connected to TimeKeeper.');
			}
		}
	}
}