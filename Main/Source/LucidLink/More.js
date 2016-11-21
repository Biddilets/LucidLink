import React, {Component} from "react";
import {Dimensions, StyleSheet,
	View, Button, Text, TextInput} from "react-native";
import RNFS from "react-native-fs";
import Moment from "moment";
var ScrollableTabView = require("react-native-scrollable-tab-view");
//var {JavaBridge, BaseComponent, VFile} = require("./Globals");

import LogsUI from "./More/LogsUI";
import ConsoleUI from "./More/ConsoleUI";
import AboutUI from "./More/AboutUI";

g.LogEntry = class LogEntry {
	constructor(type, message, time) {
		this.type = type.toLowerCase();
		this.message = message;
		this.time = time;
	}
	toString(showMoreInfo = true) {
		/*var dateStr = this.time.toString();
		var dateStartPos = dateStr.IndexOf_X(3, " ") + 1;
		dateStr = dateStr.substring(dateStartPos, dateStr.indexOf(" ", dateStartPos));*/
		if (showMoreInfo) {
			var dateStr = Moment(this.time).format("YYYY-M-D HH:mm:ss")			
			return `[${dateStr}, ${this.type}] ${this.message}`;
		}
		var dateStr = Moment(this.time).format("HH:mm:ss")			
		return `[${dateStr}] ${this.message}`;
	}
}

g.More = class More extends Node {
	// logs
	@P() showLogs_general = true;
	@P() showLogs_keyboard = true;
	@P() showLogs_custom1 = true;
	@P() showLogs_custom2 = true;
	@P() showLogs_custom3 = true;

	@P() showMoreInfo = false;
	@P() autoScroll = true;
	@P() maxLogCount = 100;

	logEntries = [];
	AddLogEntry(entry) {
		this.logEntries.push(entry);
		if (this.maxLogCount != -1 && this.logEntries.length > this.maxLogCount)
			this.logEntries.splice(0, this.logEntries.length - this.maxLogCount);
		if (this.logsUI && this.logsUI.props.active)
			this.logsUI.forceUpdate();
	}

	
	logsUI = null;

	// console
	@P() jsCode = "";
}

export class MoreUI extends BaseComponent {
	constructor(props) {
		super(props);
		this.state = {activeTab: 0};
	}

	render() {
		var {active} = this.props;
		var {activeTab, scriptTexts} = this.state;
		var node = LL.more;
		return (
			<ScrollableTabView style={{flex: 1}} onChangeTab={data=>this.setState({activeTab: data.i})}>
				<LogsUI tabLabel="Logs" active={active && activeTab == 0}/>
				<ConsoleUI tabLabel="Console" text={node.jsCode} onChangeText={text=>(node.jsCode = text) | this.forceUpdate()}/>
				<AboutUI tabLabel="About"/>
			</ScrollableTabView>
		);
	}

	SelectAudioFileForEntry(entry) {
		// todo
	}

	AddAudioFile() {
		// todo
	}
}