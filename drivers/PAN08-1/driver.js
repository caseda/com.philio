"use strict";
const path = require('path');
const ZwaveDriver = require('homey-zwavedriver');
// Product Name:    In Wall roller shutter controller PAN08-1
// Brand Name:    Philio
// Product Line:    Philio Z-Wave Product
// Product Code:    PAN08-1
// Product Version:    1.1

module.exports = new ZwaveDriver(path.basename(__dirname), {
	capabilities: {
		windowcoverings_state: {
			command_class: 'COMMAND_CLASS_SWITCH_BINARY',
			command_get: 'SWITCH_BINARY_GET',
			command_set: 'SWITCH_BINARY_SET',
			command_set_parser: (value) => ({
				'Switch Value': (value > 0) ? 'on/enable' : 'off/disable',
			}),
			command_report: 'SWITCH_BINARY_REPORT',
			command_report_parser: (report, node) => {
				switch (report.Value) {
					case 'on/enable':
					return 'up';
					case 'off/disable':
					return 'down';
					default:
					return 'idle';
				}
			},
		},
		dim: {
			command_class: 'COMMAND_CLASS_SWITCH_MULTILEVEL',
			command_get: 'SWITCH_MULTILEVEL_GET',
			command_set: 'SWITCH_MULTILEVEL_SET',
			command_set_parser: (value, node) => {
				if (value >= 1) {
					value = 0.99;
				}
				return {
				'Value': value * 100,
				'Dimming Duration': 'Factory default',
				};
			},
			command_report: 'SWITCH_MULTILEVEL_REPORT',
			command_report_parser: (report, node) => {
			},
		},
		measure_power: {
			command_class: 'COMMAND_CLASS_METER',
			command_get: 'METER_GET',
			command_get_parser: () => ({
				Properties1: {
					Scale: 2
				}
			}),
			command_report: 'METER_REPORT',
			command_report_parser: report => {
				if (report.hasOwnProperty('Properties2') &&
					report.Properties2.hasOwnProperty('Scale bits 10') &&
					report.Properties2['Scale bits 10'] === 2) {
					return report['Meter Value (Parsed)'];
				}
				return null;
			}
		},
	},
	settings: {
		"modeSelection": {
			"index": 1,
			"size": 1
		},
		"edgePulseedgeToggleMode": {
			"index": 2,
			"size": 1
		},
		"restoreSwitchStateMode": {
			"index": 3,
			"size": 1
		},
		"autoOffTimer": {
			"index": 4,
			"size": 2
		},
		"rfOffCommand ": {
			"index": 5,
			"size": 1
		},
		"existenceEndpoint3 ": {
			"index": 6,
			"size": 1
		}
	}
});
