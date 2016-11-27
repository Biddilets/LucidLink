import NumberPickerDialog from "react-native-numberpicker-dialog";

export default class GeneralUI extends BaseComponent { 
	render() {
		var node = LL.settings;
		return (
			<Panel style={{flex: 1, backgroundColor: colors.background}}>
				<Row style={{flex: 1, flexDirection: "column"}}>
					<RowLR height={25}>
						<Text>Apply scripts on launch</Text>
						<Switch value={node.applyScriptsOnLaunch}
							onValueChange={value=>{
								node.applyScriptsOnLaunch = value;
								this.forceUpdate();
							}}/>
					</RowLR>
					<RowLR height={25}>
						<Text>Block unused keys</Text>
						<Switch value={node.blockUnusedKeys}
							onValueChange={value=>{
								node.blockUnusedKeys = value;
								LL.PushBasicDataToJava();
								this.forceUpdate();
							}}/>
					</RowLR>
					<Row>
						<Text style={{marginLeft: 10, marginTop: 5, marginRight: 10}}>Pattern match interval</Text>
						<VButton text={node.patternMatchInterval.toFixed(1)} style={{width: 100, height: 32}}
							onPress={()=> {
								var values = [];
								for (let val = .1; val < 1; val += .1)
									values.push(val);
								for (let val = 1; val <= 10; val += .5)
									values.push(val);
								NumberPickerDialog.show({
									selectedValueIndex: values.indexOf(node.patternMatchInterval),
									values: values.Select(a=>a.toFixed(1)),
									positiveButtonLabel: "Ok", negativeButtonLabel: "Cancel",
									message: "Select interval/repeat-time (in seconds) at which to check for eeg-pattern matches.",
									title: "Pattern match interval",
								}).then(id=> {
									if (id == -1) return;
									let val = values[id];
									node.patternMatchInterval = val;
									this.forceUpdate();
								});
							}}/>
					</Row>
				</Row>
            </Panel>
		);
	}
}