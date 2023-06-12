module.exports = {
	initActions: function () {
		let self = this;
		let actions = {};

		let dt = new Date();

		actions.add_time = {
			name: 'Add Time to Most Recent Timer of Joined Room',
			options: [
				{
					type: 'number',
					label: 'Time to Add (in seconds)',
					id: 'seconds',
					default: 30,
					min: 1,
					max: 3600,
					range: false,
					required: true,
				},
				{
					type: 'textinput',
					label: 'Update Label',
					id: 'label',
					default: '',
				}
			],
			callback: async (event) => {
				let opt = event.options;
				let seconds = opt.seconds;

				//get last timer in array
				let timerObj = self.TIMERS[self.TIMERS.length - 1];

				if (timerObj) {
					timerObj.datetime = timerObj.datetime + (seconds * 1000);
					//if label text is different, update it
					if (opt.label !== timerObj.label) {
						timerObj.label = opt.label;
					}
					self.sendCommand('TimeKeeper_UpdateTimer', timerObj.id, timerObj);
				}
				else {
					//no timers, so create one
					let timerObj = {};				
					timerObj.datetime = Date.now() + (opt.seconds * 1000);
					timerObj.label = opt.label;
					timerObj.expireMillis = 0;
					timerObj.publishMillis = 604800000;
					timerObj.roomID = self.currentRoomID;
					self.sendCommand('TimeKeeper_AddTimer', timerObj);
				}
			}
		};

		actions.add_time_selected = {
			name: 'Add Time to Selected Timer',
			options: [
				{
					type: 'dropdown',
					label: 'Timer',
					id: 'timer',
					default: self.TIMERS_LIST[0].id,
					choices: self.TIMERS_LIST
				},
				{
					type: 'number',
					label: 'Time to Add (in seconds)',
					id: 'seconds',
					default: 30,
					min: 1,
					max: 3600,
					range: false,
					required: true,
				},
				{
					type: 'textinput',
					label: 'Update Label',
					id: 'label',
					default: '',
				}
			],
			callback: async (event) => {
				let opt = event.options;

				//get timer in array
				let timerObj = self.TIMERS.find(timer => timer.id === opt.timer);
				
				if (timerObj) {
					timerObj.datetime = timerObj.datetime + (opt.seconds * 1000);
					//if label text is different, update it
					if (opt.label !== timerObj.label) {
						timerObj.label = opt.label;
					}
					self.sendCommand('TimeKeeper_UpdateTimer', timerObj.id, timerObj);
				}
				else {
					//the timer is no longer there, so throw an error
					self.log('error', `Timer ${opt.timer} no longer exists. It probably expired.`);
				}
			}
		};

		actions.create_countdown_joined = {
			name: 'Create Countdown in Joined Room',
			options: [
				{
					type: 'number',
					label: 'Time (in seconds)',
					id: 'seconds',
					default: 30,
					min: 1,
					max: 3600,
					range: false,
					required: true,
				},
				{
					type: 'textinput',
					label: 'Countdown Label',
					id: 'label',
					default: '',
				}
			],
			callback: async (event) => {
				let opt = event.options;

				let timerObj = {};				
				timerObj.datetime = Date.now() + (opt.seconds * 1000);
				timerObj.label = opt.label;
				timerObj.expireMillis = 0;
				timerObj.publishMillis = 604800000;
				timerObj.roomID = self.currentRoomID;
				self.sendCommand('TimeKeeper_AddTimer', timerObj);
			}
		};

		actions.create_countdown_selected = {
			name: 'Create Countdown in Selected Room',
			options: [
				{
					type: 'dropdown',
					label: 'Room',
					id: 'room',
					default: self.ROOMS_LIST[0].id,
					choices: self.ROOMS_LIST
				},
				{
					type: 'number',
					label: 'Time (in seconds)',
					id: 'seconds',
					default: 30,
					min: 1,
					max: 3600,
					range: false,
					required: true,
				},
				{
					type: 'textinput',
					label: 'Countdown Label',
					id: 'label',
					default: '',
				}
			],
			callback: async (event) => {
				let opt = event.options;
				
				let timerObj = {};
				timerObj.datetime = Date.now() + (opt.seconds * 1000);
				timerObj.label = opt.label;
				timerObj.expireMillis = 0;
				timerObj.publishMillis = 604800000;
				timerObj.roomID = opt.room;
				self.sendCommand('TimeKeeper_AddTimer', timerObj);
			}
		};

		actions.create_timer_joined = {
			name: 'Create Timer in Joined Room',
			options: [
				{
					type: 'textinput',
					label: 'Timer Label',
					id: 'label',
					default: '',
				},
				{
					type: 'number',
					label: 'Year',
					id: 'year',
					default: dt.getFullYear(),
					min: dt.getFullYear(),
					max: 2100,
					range: false,
				},
				{
					type: 'dropdown',
					label: 'Month',
					id: 'month',
					default: dt.getMonth(),
					choices: [
						{ id: 0, label: 'January' },
						{ id: 1, label: 'February' },
						{ id: 2, label: 'March' },
						{ id: 3, label: 'April' },
						{ id: 4, label: 'May' },
						{ id: 5, label: 'June' },
						{ id: 6, label: 'July' },
						{ id: 7, label: 'August' },
						{ id: 8, label: 'September' },
						{ id: 9, label: 'October' },
						{ id: 10, label: 'November' },
						{ id: 11, label: 'December' },
					]
				},
				{
					type: 'number',
					label: 'Day',
					id: 'day',
					default: dt.getDate(),
					min: 1,
					max: 31,
					range: false,
				},
				{
					type: 'number',
					label: 'Hour',
					id: 'hour',
					default: dt.getHours() + 1,
					min: 1,
					max: 24,
					range: false,
				},
				{
					type: 'number',
					label: 'Minutes',
					id: 'minutes',
					default: dt.getMinutes(),
					min: 0,
					max: 59,
					range: false,
				},
				{
					type: 'number',
					label: 'Seconds',
					id: 'seconds',
					default: dt.getSeconds(),
					min: 0,
					max: 59,
					range: false,
				},
				{
					type: 'dropdown',
					label: 'Expires',
					description: 'When timer should turn red',
					id: 'expires',
					default: 0,
					choices: [
						{ id: 0, label: 'Immediately' },
						{ id: 30000, label: '30 Seconds' },
						{ id: 60000, label: '1 Minute' },
						{ id: 120000, label: '2 Minutes' },
						{ id: 300000, label: '5 Minutes' },
						{ id: 600000, label: '10 Minutes' },
						{ id: 900000, label: '15 Minutes' },
						{ id: 1800000, label: '30 Minutes' },
						{ id: 3600000, label: '1 Hour' },
						{ id: 7200000, label: '2 Hours' },
						{ id: 10800000, label: '3 Hours' },
					]
				},
				{
					type: 'dropdown',
					label: 'Publish',
					description: 'When timer should show up',
					id: 'publish',
					default: 604800000,
					choices: [
						{ id: 0, label: 'Never' },
						{ id: 30000, label: '30 Seconds' },
						{ id: 60000, label: '1 Minute' },
						{ id: 120000, label: '2 Minutes' },
						{ id: 300000, label: '5 Minutes' },
						{ id: 600000, label: '10 Minutes' },
						{ id: 900000, label: '15 Minutes' },
						{ id: 1800000, label: '30 Minutes' },
						{ id: 3600000, label: '1 Hour' },
						{ id: 7200000, label: '2 Hours' },
						{ id: 10800000, label: '3 Hours' },
						{ id: 21600000, label: '6 Hours' },
						{ id: 43200000, label: '12 Hours' },
						{ id: 86400000, label: '24 Hours' },
						{ id: 172800000, label: '2 Days' },
						{ id: 259200000, label: '3 Days' },
						{ id: 604800000, label: '1 Week' },
					]
				}
			],
			callback: async (event) => {
				let opt = event.options;
				let builtDate = new Date(opt.year, opt.month, opt.day, opt.hour, opt.minutes, opt.seconds);

				let timerObj = {};
				timerObj.datetime = builtDate.getTime();
				timerObj.label = opt.label;
				timerObj.expireMillis = opt.expires;
				timerObj.publishMillis = opt.publish;
				timerObj.roomID = self.currentRoomID;
				self.sendCommand('TimeKeeper_AddTimer', timerObj);
			}
		};

		actions.create_timer_selected = {
			name: 'Create Timer in Selected Room',
			options: [
				{
					type: 'dropdown',
					label: 'Room',
					id: 'room',
					default: self.ROOMS_LIST[0].id,
					choices: self.ROOMS_LIST
				},
				{
					type: 'textinput',
					label: 'Timer Label',
					id: 'label',
					default: '',
				},
				{
					type: 'number',
					label: 'Year',
					id: 'year',
					default: dt.getFullYear(),
					min: dt.getFullYear(),
					max: 2100,
					range: false,
				},
				{
					type: 'dropdown',
					label: 'Month',
					id: 'month',
					default: dt.getMonth(),
					choices: [
						{ id: 0, label: 'January' },
						{ id: 1, label: 'February' },
						{ id: 2, label: 'March' },
						{ id: 3, label: 'April' },
						{ id: 4, label: 'May' },
						{ id: 5, label: 'June' },
						{ id: 6, label: 'July' },
						{ id: 7, label: 'August' },
						{ id: 8, label: 'September' },
						{ id: 9, label: 'October' },
						{ id: 10, label: 'November' },
						{ id: 11, label: 'December' },
					]
				},
				{
					type: 'number',
					label: 'Day',
					id: 'day',
					default: dt.getDate(),
					min: 1,
					max: 31,
					range: false,
				},
				{
					type: 'number',
					label: 'Hour',
					id: 'hour',
					default: dt.getHours() + 1,
					min: 1,
					max: 24,
					range: false,
				},
				{
					type: 'number',
					label: 'Minutes',
					id: 'minutes',
					default: dt.getMinutes(),
					min: 0,
					max: 59,
					range: false,
				},
				{
					type: 'number',
					label: 'Seconds',
					id: 'seconds',
					default: dt.getSeconds(),
					min: 0,
					max: 59,
					range: false,
				},
				{
					type: 'dropdown',
					label: 'Expires',
					description: 'When timer should turn red',
					id: 'expires',
					default: 0,
					choices: [
						{ id: 0, label: 'Immediately' },
						{ id: 30000, label: '30 Seconds' },
						{ id: 60000, label: '1 Minute' },
						{ id: 120000, label: '2 Minutes' },
						{ id: 300000, label: '5 Minutes' },
						{ id: 600000, label: '10 Minutes' },
						{ id: 900000, label: '15 Minutes' },
						{ id: 1800000, label: '30 Minutes' },
						{ id: 3600000, label: '1 Hour' },
						{ id: 7200000, label: '2 Hours' },
						{ id: 10800000, label: '3 Hours' },
					]
				},
				{
					type: 'dropdown',
					label: 'Publish',
					description: 'When timer should show up',
					id: 'publish',
					default: 604800000,
					choices: [
						{ id: 0, label: 'Never' },
						{ id: 30000, label: '30 Seconds' },
						{ id: 60000, label: '1 Minute' },
						{ id: 120000, label: '2 Minutes' },
						{ id: 300000, label: '5 Minutes' },
						{ id: 600000, label: '10 Minutes' },
						{ id: 900000, label: '15 Minutes' },
						{ id: 1800000, label: '30 Minutes' },
						{ id: 3600000, label: '1 Hour' },
						{ id: 7200000, label: '2 Hours' },
						{ id: 10800000, label: '3 Hours' },
						{ id: 21600000, label: '6 Hours' },
						{ id: 43200000, label: '12 Hours' },
						{ id: 86400000, label: '24 Hours' },
						{ id: 172800000, label: '2 Days' },
						{ id: 259200000, label: '3 Days' },
						{ id: 604800000, label: '1 Week' },
					]
				}
			],
			callback: async (event) => {
				let opt = event.options;
				let builtDate = new Date(opt.year, opt.month, opt.day, opt.hour, opt.minutes, opt.seconds);

				let timerObj = {};
				timerObj.datetime = builtDate.getTime();
				timerObj.label = opt.label;
				timerObj.expireMillis = opt.expires;
				timerObj.publishMillis = opt.publish;
				timerObj.roomID = self.currentRoomID;
				self.sendCommand('TimeKeeper_AddTimer', timerObj);
			}
		};

		actions.create_message_joined = {
			name: 'Send Message Now to Joined Room',
			options: [
				{
					type: 'textinput',
					label: 'Message',
					id: 'message',
					default: '',
				},
				{
					type: 'dropdown',
					label: 'Expires',
					description: 'When message should turn red',
					id: 'expires',
					default: 0,
					choices: [
						{ id: 0, label: 'Immediately' },
						{ id: 30000, label: '30 Seconds' },
						{ id: 60000, label: '1 Minute' },
						{ id: 120000, label: '2 Minutes' },
						{ id: 300000, label: '5 Minutes' },
						{ id: 600000, label: '10 Minutes' },
						{ id: 900000, label: '15 Minutes' },
						{ id: 1800000, label: '30 Minutes' },
						{ id: 3600000, label: '1 Hour' },
						{ id: 7200000, label: '2 Hours' },
						{ id: 10800000, label: '3 Hours' },
					]
				},
				{
					type: 'dropdown',
					label: 'Publish',
					description: 'When message should show up',
					id: 'publish',
					default: 604800000,
					choices: [
						{ id: 0, label: 'Never' },
						{ id: 30000, label: '30 Seconds' },
						{ id: 60000, label: '1 Minute' },
						{ id: 120000, label: '2 Minutes' },
						{ id: 300000, label: '5 Minutes' },
						{ id: 600000, label: '10 Minutes' },
						{ id: 900000, label: '15 Minutes' },
						{ id: 1800000, label: '30 Minutes' },
						{ id: 3600000, label: '1 Hour' },
						{ id: 7200000, label: '2 Hours' },
						{ id: 10800000, label: '3 Hours' },
						{ id: 21600000, label: '6 Hours' },
						{ id: 43200000, label: '12 Hours' },
						{ id: 86400000, label: '24 Hours' },
						{ id: 172800000, label: '2 Days' },
						{ id: 259200000, label: '3 Days' },
						{ id: 604800000, label: '1 Week' },
					]
				}
			],
			callback: async (event) => {
				let opt = event.options;
				let seconds = opt.seconds;
				
				let messageObj = {};
				messageObj.datetime = Date.now() + (seconds * 1000);
				messageObj.message = opt.message;
				messageObj.expireMillis = opt.expires;
				messageObj.publishMillis = opt.publish;
				messageObj.roomID = self.currentRoomID;
				self.sendCommand('TimeKeeper_AddMessage', messageObj);
			}
		};

		actions.create_message_selected = {
			name: 'Send Message Now to Selected Room',
			options: [
				{
					type: 'dropdown',
					label: 'Room',
					id: 'room',
					default: self.ROOMS_LIST[0].id,
					choices: self.ROOMS_LIST
				},
				{
					type: 'textinput',
					label: 'Message',
					id: 'message',
					default: '',
				},
				{
					type: 'dropdown',
					label: 'Expires',
					description: 'When message should turn red',
					id: 'expires',
					default: 0,
					choices: [
						{ id: 0, label: 'Immediately' },
						{ id: 30000, label: '30 Seconds' },
						{ id: 60000, label: '1 Minute' },
						{ id: 120000, label: '2 Minutes' },
						{ id: 300000, label: '5 Minutes' },
						{ id: 600000, label: '10 Minutes' },
						{ id: 900000, label: '15 Minutes' },
						{ id: 1800000, label: '30 Minutes' },
						{ id: 3600000, label: '1 Hour' },
						{ id: 7200000, label: '2 Hours' },
						{ id: 10800000, label: '3 Hours' },
					]
				},
				{
					type: 'dropdown',
					label: 'Publish',
					description: 'When message should show up',
					id: 'publish',
					default: 604800000,
					choices: [
						{ id: 0, label: 'Never' },
						{ id: 30000, label: '30 Seconds' },
						{ id: 60000, label: '1 Minute' },
						{ id: 120000, label: '2 Minutes' },
						{ id: 300000, label: '5 Minutes' },
						{ id: 600000, label: '10 Minutes' },
						{ id: 900000, label: '15 Minutes' },
						{ id: 1800000, label: '30 Minutes' },
						{ id: 3600000, label: '1 Hour' },
						{ id: 7200000, label: '2 Hours' },
						{ id: 10800000, label: '3 Hours' },
						{ id: 21600000, label: '6 Hours' },
						{ id: 43200000, label: '12 Hours' },
						{ id: 86400000, label: '24 Hours' },
						{ id: 172800000, label: '2 Days' },
						{ id: 259200000, label: '3 Days' },
						{ id: 604800000, label: '1 Week' },
					]
				}
			],
			callback: async (event) => {
				let opt = event.options;
				
				let messageObj = {};
				messageObj.datetime = Date.now() + (seconds * 1000);
				messageObj.message = opt.message;
				messageObj.expireMillis = opt.expires;
				messageObj.publishMillis = opt.publish;
				messageObj.roomID = opt.room;
				self.sendCommand('TimeKeeper_AddMessage', messageObj);
			}
		};
		
		this.setActionDefinitions(actions);
	}
}