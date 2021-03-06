import {FromVDF, ToVDF, Global} from "../Frame/Globals";
import {BaseComponent} from "../Frame/ReactGlobals";
import ScrollableTabView from "react-native-scrollable-tab-view";
import DialogAndroid from "react-native-dialogs";
import Node from "../Packages/VTree/Node";
import GeneralUI from "./Settings/GeneralUI";
import AudiosUI from "./Settings/AudiosUI";
import {LL} from "../LucidLink";
import {P, T} from "../Packages/VDF/VDFTypeInfo";
import {_Enum, Enum} from "../Frame/General/Enums";

/*export enum Gender {
	Male,
	Female
}*/
@_Enum export class Gender extends Enum { static V: Gender;
	Male = this
	Female = this
}

@Global
export class Settings extends Node {	
	// general
	@O @P() applyScriptsOnLaunch = false;
	@O @P() blockUnusedKeys = false;
	//@P() captureSpecialKeys = false;
	@O @P() keepDeviceAwake = true;
	@O @P() age = 20;
	@O @P() gender = Gender.V.Male;
	@O @P() sessionSaveInterval = 5;

	// audio
	@T("List(AudioFileEntry)") @P(true, true) audioFiles = [] as AudioFileEntry[];

	ui = null;
}

@Global
export class AudioFileEntry {
	@P() name = null as string;
	@P() path = null as string;
}

export class SettingsUI extends BaseComponent<any, any> {
	constructor(props) {
		super(props);
		LL.settings.ui = this;
	}	
	render() {
		return (
			<ScrollableTabView style={{flex: 1}}>
				<GeneralUI tabLabel="General"/>
				<AudiosUI tabLabel="Audios"/>
			</ScrollableTabView>
		);
	}
}