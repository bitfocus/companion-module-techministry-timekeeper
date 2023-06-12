// techministry-timekeeper

const { InstanceBase, InstanceStatus, Regex, runEntrypoint } = require('@companion-module/base')
const UpgradeScripts = require('./src/upgrades')

const config = require('./src/config')
const actions = require('./src/actions')
const feedbacks = require('./src/feedbacks')
const variables = require('./src/variables')
const presets = require('./src/presets')

const utils = require('./src/utils')

class timekeeperInstance extends InstanceBase {
	constructor(internal) {
		super(internal)

		// Assign the methods from the listed files to this class
		Object.assign(this, {
			...config,
			...actions,
			...feedbacks,
			...variables,
			...presets,
			...utils
		})

		this.socket = null;

		this.ROOMS = [];
		this.TIMERS = [];
		this.MESSAGES = [];

		this.ROOMS_LIST = [
			{ id: 'room-0', label: '(Select a Room)' }
		];

		this.TIMERS_LIST = [
			{ id: '0', label: '(Select a Timer)' }
		];		

		this.oldRoomID = 'room-0';
		this.currentRoomID = 'room-0';
		this.connected = false;

		this.INTERVAL = null;
	}

	async destroy() {
		if (this.socket) {
			this.socket.close(); 
			this.socket = null;
		}

		this.connected = false;

		clearInterval(this.INTERVAL);
	}

	async init(config) {
		this.connected = false;
		this.updateStatus(InstanceStatus.Connecting)
		this.configUpdated(config)
	}

	async configUpdated(config) {
		this.config = config

		if (this.config.verbose) {
			this.log('info', 'Verbose mode enabled. Log entries will contain detailed information.');
		}
	
		this.updateStatus(InstanceStatus.Connecting)

		this.oldRoomID = this.currentRoomID;
		this.currentRoomID = this.config.roomfilter;

		if (!this.connected) {
			this.initConnection();
		}
		else {
			//if room ID changed, leave old room and join new room
			if (this.oldRoomID !== this.currentRoomID) {
				if (this.config.verbose) {
					this.log('info', 'Room ID changed. Leaving old room and joining new room.');
				}

				this.socket.emit('TimeKeeper_LeaveRoom', this.oldRoomID);

				self.socket.emit('TimeKeeper_GetAllRooms');

				this.socket.emit('TimeKeeper_JoinRoom', this.currentRoomID);
				this.socket.emit('TimeKeeper_GetTimers', this.currentRoomID);
				this.socket.emit('TimeKeeper_GetMessages', this.currentRoomID);
			}
		}
	
		this.initActions();
		this.initFeedbacks();
		this.initVariables();
		this.initPresets();
	
		this.checkFeedbacks();
		this.checkVariables();

		this.setupInterval();
	}
}

runEntrypoint(timekeeperInstance, UpgradeScripts)