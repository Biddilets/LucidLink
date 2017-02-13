import {JavaBridge, Global} from "../../Frame/Globals";
import {EEGProcessor} from "../../Frame/Patterns/EEGProcessor";
import {BaseComponent as Component, Column, Panel, Row, VButton, BaseProps} from "../../Frame/ReactGlobals";
import {colors, styles} from "../../Frame/Styles";
import {Vector2i} from "../../Frame/Graphics/VectorStructs";
import {Observer, observer} from "mobx-react/native";
import Drawer from "react-native-drawer";
import {MKRangeSlider} from "react-native-material-kit";
import DialogAndroid from "react-native-dialogs";
import {Text, Switch, View} from "react-native";
import {LL} from "../../LucidLink";
import Node from "../../Packages/VTree/Node";
import {VSwitch, VSwitch_Auto} from "../../Packages/ReactNativeComponents/VSwitch";
import OptionsPanel from "./SPMonitor/OptionsPanel";
import {P} from "../../Packages/VDF/VDFTypeInfo";

@Global
export class SPMonitor extends Node {
	@O @P() connect = true;
	@O @P() monitor = true;
	@O @P() process = true;
}

@observer
export class SPMonitorUI extends Component<BaseProps, {}> {
	sidePanel = null;
	ToggleSidePanelOpen() {
		if (this.sidePanel._open)
			this.sidePanel.close();
		else
			this.sidePanel.open();
	}

	render() {
		var node = LL.tools.spMonitor;
		var bridge = LL.spBridge;
		
		const drawerStyles = {
			drawer: {shadowColor: "#000000", shadowOpacity: .8, shadowRadius: 3},
			main: {paddingLeft: 3},
		};
		
		return (
			<Drawer ref={comp=>this.sidePanel = comp}
					content={<OptionsPanel parent={this}/>}
					type="overlay" openDrawerOffset={0.7} panCloseMask={0.7} tapToClose={true}
					closedDrawerOffset={-3} styles={drawerStyles}>
				<Column style={{flex: 1, backgroundColor: colors.background}}>
					<Row style={{padding: 3, height: 56, backgroundColor: "#303030"}}>
						<VButton text="Options" style={{width: 100}} onPress={this.ToggleSidePanelOpen}/>
						<Panel style={{flex: 1}}/>

						{["unknown", "disconnected", "needs_update"].Contains(bridge.status) && node.connect &&
							<Text style={{height: 50, top: 10, textAlignVertical: "top"}}>Searching for S+ device...</Text>}
						{bridge.status == "connecting" &&
							<Text style={{height: 50, top: 10, textAlignVertical: "top"}}>Connecting...</Text>}
						{bridge.status == "connected" &&
							<Text style={{height: 50, top: 10, textAlignVertical: "top"}}>Connected</Text>}
						<VSwitch_Auto mt={8} path={()=>node.p.connect}/>
						<VSwitch_Auto text="Monitor" ml={5} mt={8} path={()=>node.p.monitor}/>
						<VSwitch_Auto text="Process" ml={5} mt={8} path={()=>node.p.process}/>
					</Row>
					<Panel style={{marginTop: -7, flex: 1}}>
						<GraphUI/>
					</Panel>
				</Column>
			</Drawer>
		);
	}
}

var didFirstRender = false;
class GraphUI extends Component<{}, {}> {
    render() {
        return (
			<View style={{flex: 1, backgroundColor: colors.background}}
				accessible={true} accessibilityLabel="chart holder"/>
        );
    }

	/*PostRender() {
		if (!didFirstRender) {
			didFirstRender = true;
			JavaBridge.Main.AddChart();
			/*DeviceEventEmitter.addListener("PostAddChart", args=> {
				// do one more render, to fix positioning
				this.forceUpdate();
			});*#/
		} else {
			JavaBridge.Main.UpdateChartBounds();
		}
	}*/
}