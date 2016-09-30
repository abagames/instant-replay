(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["ir"] = factory();
	else
		root["ir"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports) {

	"use strict";
	exports.options = {
	    frameCount: 180,
	};
	var statusAndEvents;
	var recordingIndex;
	var replayingIndex;
	function startRecord() {
	    statusAndEvents = times(exports.options.frameCount, function () { return null; });
	    recordingIndex = 0;
	    replayingIndex = 0;
	}
	exports.startRecord = startRecord;
	function record(status, events) {
	    statusAndEvents[recordingIndex] = { status: status, events: events };
	    recordingIndex++;
	    if (recordingIndex >= exports.options.frameCount) {
	        recordingIndex = 0;
	    }
	}
	exports.record = record;
	function startReplay() {
	    if (statusAndEvents == null || statusAndEvents[0] == null) {
	        return null;
	    }
	    replayingIndex = recordingIndex + 1;
	    if (replayingIndex >= exports.options.frameCount || statusAndEvents[replayingIndex] == null) {
	        replayingIndex = 0;
	    }
	    return statusAndEvents[replayingIndex].status;
	}
	exports.startReplay = startReplay;
	function getEvents() {
	    if (replayingIndex === recordingIndex) {
	        return null;
	    }
	    var e = statusAndEvents[replayingIndex].events;
	    replayingIndex++;
	    if (replayingIndex >= exports.options.frameCount) {
	        replayingIndex = 0;
	    }
	    return e;
	}
	exports.getEvents = getEvents;
	function times(n, fn) {
	    var v = [];
	    for (var i = 0; i < n; i++) {
	        v.push(fn());
	    }
	    return v;
	}


/***/ }
/******/ ])
});
;