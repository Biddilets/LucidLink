import NumberPickerDialog from "react-native-numberpicker-dialog";
import Chart from "react-native-chart";

export default class PatternsUI extends BaseComponent { 
	render() {
		var node = LL.settings;
		return (
			<Panel style={{flex: 1, backgroundColor: colors.background}}>
				<Column style={{marginTop: 10, flex: 1}}>
					<Row style={{height: 35}}>
						<Text style={{marginLeft: 10, marginTop: 5, marginRight: 10}}>Preview chart value range: </Text>
						<VButton text={node.previewChartRangeX.toString()} style={{width: 100, height: 32}}
							onPress={()=> {
								var values = [-1];
								for (let val = 0; val < 100; val += 10)
									values.push(val);
								for (let val = 100; val < 1000; val += 100)
									values.push(val);
								for (let val = 1000; val <= 10000; val += 1000)
									values.push(val);
								NumberPickerDialog.show({
									selectedValueIndex: values.indexOf(node.previewChartRangeX),
									values: values.Select(a=>a.toString()),
									positiveButtonLabel: "Ok", negativeButtonLabel: "Cancel",
									message: "Select value-range (horizontal) to display in the pattern-previews below.",
									title: "Preview chart value range - x (horizontal)",
								}).then(id=> {
									if (id == -1) return;
									let val = values[id];
									node.previewChartRangeX = val;
									this.forceUpdate();
								});
							}}/>

						<Text style={{marginLeft: 10, marginTop: 5, marginRight: 10}}> by </Text>
						<VButton text={node.previewChartRangeY.toString()} style={{width: 100, height: 32}}
							onPress={()=> {
								var values = [-1];
								for (let val = 0; val < 100; val += 10)
									values.push(val);
								for (let val = 100; val < 1000; val += 100)
									values.push(val);
								for (let val = 1000; val <= 10000; val += 1000)
									values.push(val);
								NumberPickerDialog.show({
									selectedValueIndex: values.indexOf(node.previewChartRangeY),
									values: values.Select(a=>a.toString()),
									positiveButtonLabel: "Ok", negativeButtonLabel: "Cancel",
									message: "Select value-range (vertical) to display in the pattern-previews below.",
									title: "Preview chart value range - y (vertical)",
								}).then(id=> {
									if (id == -1) return;
									let val = values[id];
									node.previewChartRangeY = val;
									this.forceUpdate();
								});
							}}/>
					</Row>


					{node.patterns.map((pattern, index)=> {
						var points = pattern.points;
						if (points.length == 0)
							points = [[[0, 0]]];
						return (
							<Row key={index} height={35 + (pattern.textEditor ? 35 : 0) + 100}>
								<Column>
									<Row height={35}>
										<TextInput style={{flex: 1, paddingTop: 0, paddingBottom: 0, height: 35}}
											editable={true} value={pattern.name}
											onChangeText={text=>(pattern.name = text) | this.forceUpdate()}/>
										<Text style={{marginTop: 5}}>Text editor</Text>
										<Switch value={pattern.textEditor}
											onValueChange={value=>(pattern.textEditor = value) | this.forceUpdate()}/>
										<VButton text="X" style={{alignItems: "flex-end", marginLeft: 5, width: 28, height: 28}} textStyle={{marginBottom: 3}}
											onPress={()=>node.patterns.Remove(pattern) | this.forceUpdate()}/>
									</Row>
									{pattern.textEditor && 
										<Row height={35}>
											<TextInput style={{flex: 1, paddingTop: 0, paddingBottom: 0, height: 35}}
												editable={true} defaultValue={ToJSON(pattern.points)}
												onChangeText={text=> {
													try {
														pattern.points = FromJSON(text);
													} catch (ex) {
														V.Toast("Invalid points JSON");
													}
													this.forceUpdate()
												}}/>
										</Row>}
									<Row height={100} style={{backgroundColor: "#FFFFFF55"}}>
										<Chart style={{width: Dimensions.get("window").width - 30, height: 80}}
											minX={-node.previewChartRangeX / 2} maxX={node.previewChartRangeX / 2} legendStepsX={11}
											minY={-node.previewChartRangeY / 2} maxY={node.previewChartRangeY / 2} legendStepsY={5}
											type="line" color={["#e1cd00"]} data={[points]}/>
									</Row>
								</Column>
							</Row>
						);
					})}
					<Row height={45}>
						<VButton onPress={()=>this.CreatePattern()} text="Create" style={{width: 100, height: 40}}/>
					</Row>
					<View style={{flex: 111222}}/>
				</Column>
            </Panel>
		);
	}

	CreatePattern() {
		LL.settings.patterns.push({name: "none", points: []});
		this.forceUpdate();
	}
}