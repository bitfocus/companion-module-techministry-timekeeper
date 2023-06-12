const { Regex } = require('@companion-module/base')

module.exports = {
	getConfigFields() {
		let self = this;

		return [
			{
				type: 'static-text',
				id: 'info',
				label: 'Information',
				width: 12,
				value: `
					<div class="alert alert-warning">
						<div>
							<strong>Please read and understand the following before using this module:</strong>
							<br>
							This module connects to a free program called TimeKeeper which will provide the timer data to Companion.
							<br><br>
							<strong>Install Instructions:</strong>
							<br><br>
							<ul>
								<li><a href="https://github.com/josephdadams/timekeeper" target="_new" class="btn btn-warning mr-1">Download TimeKeeper here</a></li>
								<li>Install the application on your computer and run it.</li>
								<li>It uses Port 4000 by default. If this port is already in use in your system, you will need to change it.</li>
								<li>Configure this module with the Host IP Address and Port in use. The IP Address should be the IP of the computer running TimeKeeper.</li>
								<li>If it is the same computer that is running Companion, you can use IP "127.0.0.1".</li>
								<li>* After the module has connected to the server, you can return to this config page to filter the actions and variables to a specific TimeKeeper Room.</li>
							</ul>
						</div>
					</div>
				`
			},
			{
				type: 'textinput',
				id: 'host',
				label: 'IP Address',
				width: 3,
				default: '127.0.0.1',
				regex: Regex.IP
			},
			{
				type: 'textinput',
				id: 'port',
				label: 'Port',
				width: 3,
				default: 4000,
				regex: Regex.Port
			},
			{
				type: 'dropdown',
				id: 'roomfilter',
				label: 'Room Filter',
				width: 6,
				default: 'room-0',
				choices: this.ROOMS_LIST,
				/*isVisible: function (options) {
					if (self.ROOMS.length > 1) {
						return true;
					}
					else {
						return false;
					}
				}*/
			},
			{
				type: 'dropdown',
				id: 'format',
				label: 'Time Format',
				width: 6,
				default: 'hh:mm:ss',
				choices: [
					{ id: 'hh:mm:ss', label: 'hh:mm:ss' },
					{ id: 'mm:ss', label: 'mm:ss' },
					{ id: 'ss', label: 'ss' },
					{ id: 'HHh MMm SSs', label: 'HHh MMm SSs' },
					{ id: 'MMm SSs', label: 'MMm SSs' },
					{ id: 'SSs', label: 'SSs' },
				]
			},
			{
				type: 'static-text',
				id: 'dummy1',
				width: 12,
				label: ' ',
				value: ' ',
			},
			{
				type: 'static-text',
				id: 'info2',
				label: 'Verbose Logging',
				width: 12,
				value: `
					<div class="alert alert-info">
						Enabling this option will put more detail in the log, which can be useful for troubleshooting purposes.
					</div>
				`
			},
			{
				type: 'checkbox',
				id: 'verbose',
				label: 'Enable Verbose Logging',
				default: false
			},
		]
	}
}