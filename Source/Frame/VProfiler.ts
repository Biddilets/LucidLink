import BlockRunInfo from "./VProfiler/BlockRunInfo";
//import {Timer} from "Frame/Globals.js";

// (data is never cleared from this class, since it's meant to track total run-time of a 'section' of code)
export class Profiler_AllFrames {
	static rootBlockRunInfo: BlockRunInfo;
	static get CurrentBlock() { return Profiler_AllFrames.rootBlockRunInfo.GetCurrentDescendant(); }

	static ResetRootBlockRunInfo() { Profiler_AllFrames.rootBlockRunInfo = new BlockRunInfo(null, "Root", true, 0); }

	// for use by AssemblyPostProcessor code
	static EndCurrentBlock() {
		Profiler_AllFrames.CurrentBlock.End();
	}
}
Profiler_AllFrames.ResetRootBlockRunInfo();

export function ProfileMethod(...args) {
	return Profiler_AllFrames.CurrentBlock.StartMethod(...args);
}