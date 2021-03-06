import {colors} from "../../Frame/Styles";
import {BaseComponent as Component, Panel, VButton, Column} from "../../Frame/ReactGlobals";
import {Script} from "./Script";
var SortableListView = require("react-native-sortable-listview");
import {TouchableHighlight, Text, Switch} from "react-native";
import {LL} from "../../LucidLink";
import {observer} from "mobx-react/native";

@observer
class ScriptEntryUI extends Component<{script: Script}, {}> {
	render() {
		var {script} = this.props;
		return (
			<TouchableHighlight underlayColor="#EEE" delayLongPress={300}
					style={{backgroundColor: colors.background_lighter, borderBottomWidth: 1, borderColor: colors.background_light}}
					onPress={()=>LL.scripts.selectedScript = script}>
				<Panel style={{height: 40, paddingLeft: 10, paddingRight: 10, flexDirection: "row"}}>
					<Text style={{paddingTop: 10}}>{script.file.Name}</Text>
					<Panel style={{flex: 1}}/>
					<Switch value={script.enabled}
						onValueChange={value=>script.enabled = value}/>
					{script.editable
						? <VButton text="X"
							style={{alignItems: "flex-end", marginLeft: 5, marginTop: 6, width: 28, height: 28}}
							textStyle={{marginBottom: 3}} onPress={()=>script.Delete()}/>
						: <Panel style={{marginLeft: 5, width: 28, height: 28}}/>}
				</Panel>
			</TouchableHighlight>
		);
	}
}

@observer
export default class ScriptsPanel extends Component<any, any> {
	render() {
		var {scripts} = this.props;

		var scripts_map = scripts.ToMap(a=>a.file.Name, a=>a);
		var scriptNames_ordered = scripts.OrderBy(a=>a.index).Select(a=>a.file.Name);

		return (
			<Column style={{flex: 1, backgroundColor: colors.background_light}}>
				<Text style={{padding: 5, fontSize: 15}}>Scripts (drag to reorder; place dependencies first)</Text>
				<Panel style={{flex: 1}}>
					<SortableListView data={scripts_map} order={scriptNames_ordered}
						renderRow={script=><ScriptEntryUI script={script}/>}
						onRowMoved={e=> {
							var movedEntryName = scriptNames_ordered.splice(e.from, 1)[0];
							scriptNames_ordered.Insert(e.to, movedEntryName);
							for (var i = 0; i < scripts.length; i++) {
								let scriptAtIndex_name = scriptNames_ordered[i];
								let script = scripts.First(a=>a.file.Name == scriptAtIndex_name);
								script.index = i;
							}
						}}/>
					<VButton text="Add" style={{position: "absolute", top: (scripts.length * (40 + 1)) + 5, width: 100}}
						onPress={this.AddScript}/>
				</Panel>
			</Column>
		)
	}
	async AddScript() {
		var fileName;
		for (var i = 2; i < 100; i++) {
			fileName = `Custom script ${i}.js`;
			if (!LL.scripts.scripts.Any(a=>a.file.Name == fileName))
				break;
		}

		var file = LL.RootFolder.GetFolder("Scripts").GetFile(fileName);
		var script = new Script(file, `Toast("Hello world!");`);
		script.index = LL.scripts.scripts.length;
		LL.scripts.scripts.push(script);

		script.Save();
	}
}