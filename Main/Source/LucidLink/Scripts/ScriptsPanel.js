var SortableListView = require("react-native-sortable-listview");

@Bind
class ScriptEntryUI extends BaseComponent {
	render() {
		var {script} = this.props;
		return (
			<TouchableHighlight {...this.props.sortHandlers} underlayColor="#EEE" delayLongPress={300}
					style={{backgroundColor: "#F8F8F8", borderBottomWidth: 1, borderColor: "#EEE"}}
					onPress={()=>LL.scripts.ui.SelectScript(script)}>
				<View style={{height: 40, paddingLeft: 10, paddingRight: 10, flexDirection: "row"}}>
					<Text style={{paddingTop: 10}}>{script.file.Name}</Text>
					<View style={{flex: 1}}/>
					<Switch value={script.enabled}
						onValueChange={value=>(script.enabled = value) | this.forceUpdate()}/>
					{script.editable
						? <VButton text="X"
							style={{alignItems: "flex-end", marginLeft: 5, marginTop: 6, width: 28, height: 28}}
							textStyle={{marginBottom: 3}} onPress={()=>script.Delete()}/>
						: <View style={{marginLeft: 5, width: 28, height: 28}}/>}
					</View>
			</TouchableHighlight>
		);
	}
}

@Bind
export default class ScriptsPanel extends BaseComponent {
	render() {
		var {parent, scripts} = this.props;

		var scripts_map = scripts.ToMap(a=>a.file.Name, a=>a);
		var scriptNames_ordered = scripts.OrderBy(a=>a.index).Select(a=>a.file.Name);

		return (
			<View style={{flex: 1, flexDirection: "column", backgroundColor: "#CCC"}}>
				<Text style={{padding: 5, fontSize: 15}}>Scripts (drag to reorder; place dependencies first)</Text>
				<View style={{flex: 1}}>
					<SortableListView data={scripts_map} order={scriptNames_ordered}
						renderRow={script=><ScriptEntryUI parent={this} script={script}/>}
						onRowMoved={e=> {
							var movedScriptName = scriptNames_ordered.splice(e.from, 1)[0];
							scriptNames_ordered.Insert(e.to, movedScriptName);
							for (var i = 0; i < scripts.length; i++) {
								let scriptAtIndex_name = scriptNames_ordered[i];
								let script = scripts.First(a=>a.file.Name == scriptAtIndex_name);
								script.index = i;
							}
							this.forceUpdate();
						}}/>
					<VButton text="Add" style={{position: "absolute", top: (scripts.length * (40 + 1)) + 5, width: 100}}
						onPress={this.AddScript}/>
				</View>
			</View>
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
		var script = new Script(file, `Log("Hello world!");`);
		script.index = LL.scripts.scripts.length;
		LL.scripts.scripts.push(script);

		script.Save();

		this.forceUpdate();
	}
}