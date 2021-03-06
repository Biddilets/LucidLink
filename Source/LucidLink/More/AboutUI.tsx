import {Text} from "react-native";
import {BaseComponent as Component, Panel} from "../../Frame/ReactGlobals";
import {colors, styles} from "../../Frame/Styles";

export default class AboutUI extends Component<any, any> {
	render() {
		return (
			<Panel style={{flex: 1, flexDirection: "column", backgroundColor: colors.background}}>
				<Text style={styles.text}>{`
Author: Stephen Wicklund (Venryx)
License: MIT (open source)
GitHub repository: https://github.com/Venryx/LucidLink
				`.trim()}</Text>
			</Panel>
		);
	}
}