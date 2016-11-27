import LibMuse from "react-native-libmuse";

@Bind class MuseBridge {
	static initialized = false;
	static Init() {
		LibMuse.AddListener_OnChangeMuseList(MuseBridge.OnChangeMuseList);
		LibMuse.AddListener_OnChangeMuseConnectStatus(MuseBridge.OnChangeMuseConnectStatus);
		LibMuse.AddListener_OnReceiveMuseDataPacket(MuseBridge.OnReceiveMuseDataPacket);
		LibMuse.Init();
		MuseBridge.initialized = true;
		Log("muse link", `LibMuse initialized.`);
	}
	async IfInEmulator_ReplaceLibMuseFuncsWithStubs() {
		var inEmulator = await JavaBridge.Main.IsInEmulator();
		if (inEmulator) {
			for (var key in LibMuse) {
				var value = LibMuse[key];
				if (value instanceof Function)
					libMuse[key] = ()=>{};
			}
		}
	}

	static museList = [];
	static StopSearch() {
		LibMuse.StopSearch();
	}
	static StartSearch(stopThenStart = true) {
		if (stopThenStart)
			LibMuse.RestartSearch();
		else
			LibMuse.StartSearch();
	}
	static OnChangeMuseList(museList) {
		MuseBridge.museList = museList;
		Log("muse link", `Muse list changed: ${ToJSON(museList)}`);

		if (museList.length && MuseBridge.currentMuse == null && LL.monitor.connect)
			MuseBridge.Connect();

		if (LL.monitor.ui) LL.monitor.ui.forceUpdate();
	}

	static currentMuse = null;
	static Connect() {
		LibMuse.Connect(0); // always try to connect to first muse
	}
	static Disconnect() {
		LibMuse.Disconnect();
	}
	static status = "disconnected";
	static OnChangeMuseConnectStatus(status) {
		Log("muse link", `Muse connection status changed: ${status}`);
		if (status == "connected") {
			Log("muse link", "LibMuse connected.");
			MuseBridge.currentMuse = MuseBridge.museList[0];
		}
		else if (status == "disconnected") {
			Log("muse link", "LibMuse disconnected.");
			MuseBridge.currentMuse = null;
			// since we're disconnected now, restart listening (assuming "connect" is enabled)
			if (LL.monitor.connect)
				MuseBridge.StartSearch();
		}
		MuseBridge.status = status;
		if (LL.monitor.ui) LL.monitor.ui.forceUpdate();
	}
	
	// where eg. [0][1] (channel, x-pos/index) is [1,9] (x-pos, y-pos)
	static channelPoints = Array(6).fill([]);
	static lastX = -1;
	static maxX = 100;

	static OnReceiveMuseDataPacket(type, column) {
		var currentX = MuseBridge.lastX + 1;
		if (currentX > MuseBridge.maxX)
			currentX = 0;

		for (var channel = 0; channel < 6; channel++)
			MuseBridge.channelPoints[channel][currentX] = [currentX, column[channel]];

		MuseBridge.lastX = currentX;
		//Log("muse link", `Type: ${type} Data: ${ToJSON(data)}`);

		// for the moment, assume 60 packets per second (get the actual number at some point)
		var patternMatchInterval_inPackets = patternMatchInterval * 60;
		if (currentX % LL.settings.patternMatchInterval_inPackets == 0 && LL.monitor.patternMatch) {
			//Sketchy.shapeContextMatch
			// todo // break point
		}
	}
}
g.MuseBridge = MuseBridge;
export default MuseBridge;