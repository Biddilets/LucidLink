import React, {Component} from "react";
import {NativeModules} from "react-native";
import RNFS from "react-native-fs";

var g = global;
g.g = g;

g.Log = function(...args) {
	console.log(...args);
};
g.Trace = function(...args) {
	console.trace(...args);
};

g.Assert = function(condition, message) {
	if (condition) return;
	throw new Error(message);
	console.error(message);
};
g.AssertWarn = function(condition, message) {
	if (condition) return;
	console.warn(message);
};

g.JavaBridge = class JavaBridge {
    static get Main() {
        return NativeModules.Main;
    }
}

// polyfills for constants
// ==========

if (Number.MIN_SAFE_INTEGER == null)
	Number.MIN_SAFE_INTEGER = -9007199254740991;
if (Number.MAX_SAFE_INTEGER == null)
	Number.MAX_SAFE_INTEGER = 9007199254740991;

//g.Break = function() { debugger; };
g.Debugger = function() { debugger; }
g.Debugger_True = function() { debugger; return true; }
g.Debugger_If = function(condition) {
    if (condition)
        debugger;
}

// general
// ==========

import {AppRegistry, StyleSheet} from "react-native";

g.E = function(...objExtends) {
    var result = {};
    for (var extend of objExtends)
        result.Extend(extend);
	return result;
	//return StyleSheet.create(result);
}

// object-VDF
// ----------

//Function.prototype._AddGetter_Inline = function VDFSerialize() { return function() { return VDF.CancelSerialize; }; };
Function.prototype.Serialize = function() { return VDF.CancelSerialize; }.AddTags(new VDFSerialize());

g.FinalizeFromVDFOptions = function(options = null) {
    options = options || new VDFLoadOptions();
	options.loadUnknownTypesAsBasicTypes = true;
	return options;
}
g.FromVDF = function(vdf, /*o:*/ declaredTypeName_orOptions, options) {
	if (declaredTypeName_orOptions instanceof VDFLoadOptions)
		return FromVDF(vdf, null, declaredTypeName_orOptions);

	try { return VDF.Deserialize(vdf, declaredTypeName_orOptions, FinalizeFromVDFOptions(options)); }
	/*catch(error) { if (!InUnity()) throw error;
		LogError("Error) " + error + "Stack)" + error.Stack + "\nNewStack) " + new Error().Stack + "\nVDF) " + vdf);
	}/**/ finally {}
}
g.FromVDFInto = function(vdf, obj, /*o:*/ options) {
	try { return VDF.DeserializeInto(vdf, obj, FinalizeFromVDFOptions(options)); }
	/*catch(error) { if (!InUnity()) throw error;
		LogError("Error) " + error + "Stack)" + error.Stack + "\nNewStack) " + new Error().Stack + "\nVDF) " + vdf); }
	/**/ finally {}
}
g.FromVDFToNode = function(vdf, /*o:*/ declaredTypeName_orOptions, options) {
	if (declaredTypeName_orOptions instanceof VDFLoadOptions)
		return FromVDF(vdf, null, declaredTypeName_orOptions);

	try { return VDFLoader.ToVDFNode(vdf, declaredTypeName_orOptions, FinalizeFromVDFOptions(options)); }
	/*catch(error) { if (!InUnity()) throw error;
		LogError("Error) " + error + "Stack)" + error.Stack + "\nNewStack) " + new Error().Stack + "\nVDF) " + vdf);
	}/**/ finally {}
}
g.FromVDFNode = function(node) { // alternative to .ToObject(), which applies default (program) settings
	return node.ToObject(FinalizeFromVDFOptions());
}

g.FinalizeToVDFOptions = function(options = null) {
    options = options || new VDFSaveOptions();
	return options;
}
/*function ToVDF(obj, /*o:*#/ declaredTypeName_orOptions, options_orNothing) {
	try { return VDF.Serialize(obj, declaredTypeName_orOptions, options_orNothing); }
	/*catch(error) { if (!InUnity()) throw error; else LogError("Error) " + error + "Stack)" + error.stack + "\nNewStack) " + new Error().stack + "\nObj) " + obj); }
	//catch(error) { if (!InUnity()) { debugger; throw error; } else LogError("Error) " + error + "Stack)" + error.stack + "\nNewStack) " + new Error().stack + "\nObj) " + obj); }
}*/
g.ToVDF = function(obj, /*o:*/ markRootType, typeMarking, options) {
	markRootType = markRootType != null ? markRootType : true; // maybe temp; have JS side assume the root-type should be marked
	typeMarking = typeMarking || VDFTypeMarking.Internal;

	try {
		options = FinalizeToVDFOptions(options);
		options.typeMarking = typeMarking;
		return VDF.Serialize(obj, !markRootType && obj != null ? obj.GetTypeName() : null, options);
	}
	/*catch(error) {
		if (!InUnity()) throw error;
		LogError("Error) " + error + "Stack)" + error.Stack + "\nNewStack) " + new Error().Stack + "\nObj) " + obj);
	}/**/ finally {}
}
g.ToVDFNode = function(obj, /*o:*/ declaredTypeName_orOptions, options_orNothing) {
	try {
	    return VDFSaver.ToVDFNode(obj, declaredTypeName_orOptions, options_orNothing);
	}
	/*catch (error) { if (!InUnity()) throw error;
		LogError("Error) " + error + "Stack)" + error.Stack + "\nNewStack) " + new Error().Stack + "\nObj) " + obj);
	}/**/ finally {}
}

// tags
// ==========

g.T = function(typeOrTypeName) {
    return (target, name, descriptor)=> {
        //target.prototype[name].AddTags(new VDFPostDeserialize());
        //Prop(target, name, typeOrTypeName);
        //target.p(name, typeOrTypeName);
        var propInfo = VDFTypeInfo.Get(target.constructor).GetProp(name);
        propInfo.typeName = typeOrTypeName instanceof Function ? typeOrTypeName.name : typeOrTypeName;
    };
};
g.P = function(...args) {
    return function Temp1(target, name, descriptor) {
        var propInfo = VDFTypeInfo.Get(target.constructor).GetProp(name);
        propInfo.AddTags(new VDFProp(...args));
    };
};
g.D = function(...args) {
    return (target, name, descriptor)=> {
        var propInfo = VDFTypeInfo.Get(target.constructor).GetProp(name);
        propInfo.AddTags(new DefaultValue(...args));
    };
};

g._IgnoreStartData = function() {
    return (target, name, descriptor)=>target[name].AddTags(new IgnoreStartData());
};

g._NoAttach = function(...args) {
    return (target, name, descriptor)=> {
        var propInfo = VDFTypeInfo.Get(target.constructor).GetProp(name);
        propInfo.AddTags(new NoAttach(...args));
    };
};
g._ByPath = function(...args) {
    return (target, name, descriptor)=> {
        var propInfo = VDFTypeInfo.Get(target.constructor).GetProp(name);
        propInfo.AddTags(new ByPath(...args));
    };
};
g._ByPathStr = function(...args) {
	return (target, name, descriptor)=> {
		var propInfo = VDFTypeInfo.Get(target.constructor).GetProp(name);
	    propInfo.AddTags(new ByPathStr(...args));
	};
};
g._ByName = function(...args) {
    return (target, name, descriptor)=> {
        var propInfo = VDFTypeInfo.Get(target.constructor).GetProp(name);
        propInfo.AddTags(new ByName(...args));
    };
};

g._VDFDeserializeProp = function(...args) {
    return (target, name, descriptor)=>target[name].AddTags(new VDFDeserializeProp(...args));
};
g._VDFSerializeProp = function(...args) {
    return (target, name, descriptor)=>target[name].AddTags(new VDFSerializeProp(...args));
};

g._VDFPreDeserialize = function(...args) {
    return (target, name, descriptor)=>target[name].AddTags(new VDFPreDeserialize(...args));
};
g._VDFDeserialize = function(...args) {
    return (target, name, descriptor)=>target[name].AddTags(new VDFDeserialize(...args));
};
g._VDFPostDeserialize = function(...args) {
    return (target, name, descriptor)=>target[name].AddTags(new VDFPostDeserialize(...args));
};

g._VDFPreSerialize = function(...args) {
    return (target, name, descriptor)=>target[name].AddTags(new VDFPreSerialize(...args));
};
g._VDFSerialize = function(...args) {
    return (target, name, descriptor)=>target[name].AddTags(new VDFSerialize(...args));
};
g._VDFPostSerialize = function(...args) {
    return (target, name, descriptor)=>target[name].AddTags(new VDFPostSerialize(...args));
};

// timer stuff
// ==========

function WaitXThenRun(waitTime, func) { setTimeout(func, waitTime); }
function Sleep(ms) {
	var startTime = new Date().getTime();
	while (new Date().getTime() - startTime < ms)
	{}
}
function WaitXThenRun_Multiple(waitTime, func, count = -1) {
	var countDone = 0;
	var timerID = setInterval(function() {
		func();
		countDone++;
		if (count != -1 && countDone >= count)
			clearInterval(timerID);
	}, waitTime);

	var controller = {};
	controller.Stop = function() { clearInterval(timerID); }
	return controller;
}

// interval is in seconds (can be decimal)
class Timer {
	constructor(interval, func, maxCallCount = -1) {
	    this.interval = interval;
	    this.func = func;
	    this.maxCallCount = maxCallCount;
	}

	timerID = -1;
	get IsRunning() { return this.timerID != -1; }

	callCount = 0;
	Start() {
		this.timerID = setInterval(()=> {
			this.func();
			this.callCount++;
			if (this.maxCallCount != -1 && this.callCount >= this.maxCallCount)
				this.Stop();
		}, this.interval * 1000);
	}
	Stop() {
		clearInterval(this.timerID);
		this.timerID = -1;
	}
}
class TimerMS extends Timer {
    constructor(interval_decimal, func, maxCallCount = -1) {
        super(interval_decimal / 1000, func, maxCallCount);
    }
}

var funcLastScheduledRunTimes = {};
g.BufferFuncToBeRun = function(key, minInterval, func) {
    var lastScheduledRunTime = funcLastScheduledRunTimes[key] || 0;
    var now = new Date().getTime();
    var timeSinceLast = now - lastScheduledRunTime;
    if (timeSinceLast >= minInterval) { // if we've waited enough since last run, run right now
        func();
        funcLastScheduledRunTimes[key] = now;
    } else if (timeSinceLast > 0) { // else, if we don't yet have a future-run scheduled, schedule one now
        var intervalEndTime = lastScheduledRunTime + minInterval;
        var timeTillIntervalEnd = intervalEndTime - now;
        WaitXThenRun(timeTillIntervalEnd, func);
		funcLastScheduledRunTimes[key] = intervalEndTime;
    }
}

// file stuff
// ==========

g.VFile = class VFile {
	static get MainBundlePath() { return RNFS.MainBundlePath; }
	static get CachesDirectoryPath() { return RNFS.CachesDirectoryPath; }
	static get DocumentDirectoryPath() { return RNFS.DocumentDirectoryPath; }
	static get ExternalDirectoryPath() { return RNFS.ExternalDirectoryPath; }
	static get ExternalStorageDirectoryPath() { return RNFS.ExternalStorageDirectoryPath; }
	static get TemporaryDirectoryPath() { return RNFS.TemporaryDirectoryPath; }
	static get LibraryDirectoryPath() { return RNFS.LibraryDirectoryPath; }
	static get PicturesDirectoryPath() { return RNFS.PicturesDirectoryPath; }

	static CreateFolderAsync(folderPath) {
		//return RNFS.mkdir(filePath);
		return new Promise((resolve, reject)=> {
			RNFS.mkdir(folderPath).then(()=> {
				resolve();
			})
			.catch(error=> {
				//console.log(error.message, error.code);
				//throw error;
				reject(error);
			});
		});
	}
	static WriteAllTextAsync(filePath, text, encoding = "utf8") {
		//return RNFS.writeFile(filePath, text);
		return new Promise((resolve, reject)=> {
			RNFS.writeFile(filePath, text, encoding).then(()=> {
				resolve();
			})
			.catch(error=> {
				reject(error);
			});
		});
	}

	static ReadAllTextAsync(filePath, defaultText = undefined, encoding = "utf8") {
		//return RNFS.readFile(filePath);

		return new Promise((resolve, reject)=> {
			RNFS.readFile(filePath, encoding).then(text=> {
				resolve(text);
			})
			.catch(error=> {
				if (error.toString().contains("ENOENT: no such file or directory, open ") && defaultText !== undefined)
					return resolve(defaultText);
				reject(error);
			});
		});
	}
	/*static ReadAllText(filePath) {
		return await VFile.ReadAllTextAsync(filePath);
	}*/
}