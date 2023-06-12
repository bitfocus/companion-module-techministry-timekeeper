const { combineRgb } = require('@companion-module/base')

module.exports = {
	initFeedbacks: function () {
		let self = this;
		
		let feedbacks = {};

		const foregroundColorWhite = combineRgb(255, 255, 255) // White
		const backgroundColorRed = combineRgb(255, 0, 0) // Red

		feedbacks.timer_joinedroom_expired = {
			type: 'boolean',
			name: 'Most Recent Timer from Joined Room has Expired',
			description: 'If the most recent timer from the room you joined has expired, change the style of the bank',
			defaultStyle: {
				color: foregroundColorWhite,
				bgcolor: backgroundColorRed,
			},
			options: [],
			callback: function (feedback) {
				let opt = feedback.options;

				let timerObj = self.TIMERS[self.TIMERS.length - 1];

				if (timerObj) {
					let timeRemaining = (Date.now() - timerObj.datetime);
					if (timeRemaining <= 0) {
						return true;
					}
					else {
						//check to see if the timer has expired based on the expires value
						//take the datetime, subtract the expires, and then check THAT time
						let timeRemaining = (Date.now() - (timerObj.datetime - timerObj.expires));
						if (timeRemaining <= 0) {
							return true;
						}
					}
				}
				return false;
			}
		};

		feedbacks.timer_selected_expired = {
			type: 'boolean',
			name: 'Selectd Timer has Expired',
			description: 'If the selected timer has expired, change the style of the bank',
			defaultStyle: {
				color: foregroundColorWhite,
				bgcolor: backgroundColorRed,
			},
			options: [
				{
					type: 'dropdown',
					label: 'Timer',
					id: 'timer',
					default: self.TIMERS_LIST[0].id,
					choices: self.TIMERS_LIST
				}
			],
			callback: function (feedback) {
				let opt = feedback.options;

				let timerObj = self.TIMERS.find(timer => timer.id === opt.timer);

				if (timerObj) {
					let timeRemaining = (Date.now() - timerObj.datetime);
					if (timeRemaining <= 0) {
						return true;
					}
					else {
						//check to see if the timer has expired based on the expires value
						//take the datetime, subtract the expires, and then check THAT time
						let timeRemaining = (Date.now() - (timerObj.datetime - timerObj.expires));
						if (timeRemaining <= 0) {
							return true;
						}
					}
				}
				return false;
			}
		};

		this.setFeedbackDefinitions(feedbacks);
	}
}