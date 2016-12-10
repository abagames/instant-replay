(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["sample"] = factory();
	else
		root["sample"] = factory();
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
/******/ 	__webpack_require__.p = "/libs/";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(1);
	__webpack_require__(3);
	__webpack_require__(4);
	module.exports = __webpack_require__(8);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var LZString = __webpack_require__(2);
	exports.options = {
	    frameCount: 180,
	    isRecordingEventsAsString: false,
	    maxUrlLength: 2000
	};
	var statuses;
	var events;
	var recordingIndex;
	var replayingIndex;
	function setOptions(_options) {
	    forOwn(_options, function (v, k) {
	        exports.options[k] = v;
	    });
	}
	exports.setOptions = setOptions;
	function forOwn(obj, func) {
	    for (var p in obj) {
	        func(obj[p], p);
	    }
	}
	function startRecord() {
	    initStatusesAndEvents();
	    recordingIndex = replayingIndex = 0;
	}
	exports.startRecord = startRecord;
	function initStatusesAndEvents() {
	    statuses = [];
	    events = [];
	    if (exports.options.frameCount > 0) {
	        for (var i = 0; i < exports.options.frameCount; i++) {
	            statuses.push(null);
	            events.push(null);
	        }
	    }
	}
	function record(status, _events) {
	    statuses[recordingIndex] = status;
	    events[recordingIndex] = _events;
	    recordingIndex++;
	    if (recordingIndex >= exports.options.frameCount) {
	        recordingIndex = 0;
	    }
	}
	exports.record = record;
	function recordInitialStatus(status) {
	    statuses.push(status);
	}
	exports.recordInitialStatus = recordInitialStatus;
	function recordEvents(_events) {
	    events.push(_events);
	}
	exports.recordEvents = recordEvents;
	function startReplay() {
	    if (events == null || events[0] == null) {
	        return false;
	    }
	    calcStartingReplayIndex();
	    return statuses[replayingIndex];
	}
	exports.startReplay = startReplay;
	function calcStartingReplayIndex() {
	    if (exports.options.frameCount > 0) {
	        replayingIndex = recordingIndex + 1;
	        if (replayingIndex >= exports.options.frameCount || events[replayingIndex] == null) {
	            replayingIndex = 0;
	        }
	    }
	    else {
	        replayingIndex = 0;
	    }
	}
	function getEvents() {
	    return exports.options.frameCount > 0 ? getEventsFrameCount() : getEventsAllFrames();
	}
	exports.getEvents = getEvents;
	function getEventsFrameCount() {
	    if (replayingIndex === recordingIndex) {
	        return false;
	    }
	    var e = events[replayingIndex];
	    replayingIndex++;
	    if (replayingIndex >= exports.options.frameCount) {
	        replayingIndex = 0;
	    }
	    return e;
	}
	function getEventsAllFrames() {
	    if (replayingIndex >= events.length) {
	        return false;
	    }
	    var e = events[replayingIndex];
	    replayingIndex++;
	    return e;
	}
	function objectToArray(object, propertyNames) {
	    var array = [];
	    for (var i = 0; i < propertyNames.length; i++) {
	        var ps = propertyNames[i].split('.');
	        var o = object;
	        for (var j = 0; j < ps.length; j++) {
	            o = o[ps[j]];
	        }
	        array.push(o);
	    }
	    return array;
	}
	exports.objectToArray = objectToArray;
	function arrayToObject(array, propertyNames, object) {
	    if (object === void 0) { object = {}; }
	    for (var i = 0; i < propertyNames.length; i++) {
	        var ps = propertyNames[i].split('.');
	        var o = object;
	        for (var j = 0; j < ps.length; j++) {
	            if (j < ps.length - 1) {
	                if (o[ps[j]] == null) {
	                    o[ps[j]] = {};
	                }
	                o = o[ps[j]];
	            }
	            else {
	                o[ps[j]] = array[i];
	            }
	        }
	    }
	    return object;
	}
	exports.arrayToObject = arrayToObject;
	function saveAsUrl() {
	    if (events == null || events[0] == null) {
	        return false;
	    }
	    var baseUrl = window.location.href.split('?')[0];
	    calcStartingReplayIndex();
	    var data = { st: statuses[replayingIndex] };
	    if (exports.options.frameCount > 0) {
	        data.idx = recordingIndex;
	    }
	    if (!exports.options.isRecordingEventsAsString) {
	        data.ev = events;
	    }
	    else {
	        data.esl = events[0].length;
	    }
	    var encDataStr = LZString.compressToEncodedURIComponent(JSON.stringify(data));
	    var url = baseUrl + "?d=" + encDataStr;
	    if (exports.options.isRecordingEventsAsString) {
	        var eventsDataStr = LZString.compressToEncodedURIComponent(events.join(''));
	        url += "&e=" + eventsDataStr;
	    }
	    if (url.length > exports.options.maxUrlLength) {
	        console.log('too long to record. url length: ' + url.length);
	        try {
	            window.history.replaceState({}, '', baseUrl);
	        }
	        catch (e) { }
	        return false;
	    }
	    try {
	        window.history.replaceState({}, '', url);
	    }
	    catch (e) {
	        console.log(e);
	        return false;
	    }
	}
	exports.saveAsUrl = saveAsUrl;
	function loadFromUrl() {
	    var query = window.location.search.substring(1);
	    if (query == null) {
	        return false;
	    }
	    var params = query.split('&');
	    var encDataStr;
	    var eventsDataStr;
	    for (var i = 0; i < params.length; i++) {
	        var param = params[i];
	        var pair = param.split('=');
	        if (pair[0] === 'd') {
	            encDataStr = pair[1];
	        }
	        if (pair[0] === 'e') {
	            eventsDataStr = pair[1];
	        }
	    }
	    if (encDataStr == null) {
	        return false;
	    }
	    try {
	        var data = JSON.parse(LZString.decompressFromEncodedURIComponent(encDataStr));
	        initStatusesAndEvents();
	        if (exports.options.frameCount > 0) {
	            recordingIndex = data.idx;
	        }
	        if (data.ev != null) {
	            events = data.ev;
	        }
	        if (eventsDataStr != null) {
	            var eventsStr = LZString.decompressFromEncodedURIComponent(eventsDataStr);
	            events = eventsStr.match(new RegExp(".{1," + data.esl + "}", 'g'));
	        }
	        calcStartingReplayIndex();
	        statuses[replayingIndex] = data.st;
	        return true;
	    }
	    catch (e) {
	        console.log(e);
	        return false;
	    }
	}
	exports.loadFromUrl = loadFromUrl;


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;// Copyright (c) 2013 Pieroxy <pieroxy@pieroxy.net>
	// This work is free. You can redistribute it and/or modify it
	// under the terms of the WTFPL, Version 2
	// For more information see LICENSE.txt or http://www.wtfpl.net/
	//
	// For more information, the home page:
	// http://pieroxy.net/blog/pages/lz-string/testing.html
	//
	// LZ-based compression algorithm, version 1.4.4
	var LZString = (function() {

	// private property
	var f = String.fromCharCode;
	var keyStrBase64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
	var keyStrUriSafe = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-$";
	var baseReverseDic = {};

	function getBaseValue(alphabet, character) {
	  if (!baseReverseDic[alphabet]) {
	    baseReverseDic[alphabet] = {};
	    for (var i=0 ; i<alphabet.length ; i++) {
	      baseReverseDic[alphabet][alphabet.charAt(i)] = i;
	    }
	  }
	  return baseReverseDic[alphabet][character];
	}

	var LZString = {
	  compressToBase64 : function (input) {
	    if (input == null) return "";
	    var res = LZString._compress(input, 6, function(a){return keyStrBase64.charAt(a);});
	    switch (res.length % 4) { // To produce valid Base64
	    default: // When could this happen ?
	    case 0 : return res;
	    case 1 : return res+"===";
	    case 2 : return res+"==";
	    case 3 : return res+"=";
	    }
	  },

	  decompressFromBase64 : function (input) {
	    if (input == null) return "";
	    if (input == "") return null;
	    return LZString._decompress(input.length, 32, function(index) { return getBaseValue(keyStrBase64, input.charAt(index)); });
	  },

	  compressToUTF16 : function (input) {
	    if (input == null) return "";
	    return LZString._compress(input, 15, function(a){return f(a+32);}) + " ";
	  },

	  decompressFromUTF16: function (compressed) {
	    if (compressed == null) return "";
	    if (compressed == "") return null;
	    return LZString._decompress(compressed.length, 16384, function(index) { return compressed.charCodeAt(index) - 32; });
	  },

	  //compress into uint8array (UCS-2 big endian format)
	  compressToUint8Array: function (uncompressed) {
	    var compressed = LZString.compress(uncompressed);
	    var buf=new Uint8Array(compressed.length*2); // 2 bytes per character

	    for (var i=0, TotalLen=compressed.length; i<TotalLen; i++) {
	      var current_value = compressed.charCodeAt(i);
	      buf[i*2] = current_value >>> 8;
	      buf[i*2+1] = current_value % 256;
	    }
	    return buf;
	  },

	  //decompress from uint8array (UCS-2 big endian format)
	  decompressFromUint8Array:function (compressed) {
	    if (compressed===null || compressed===undefined){
	        return LZString.decompress(compressed);
	    } else {
	        var buf=new Array(compressed.length/2); // 2 bytes per character
	        for (var i=0, TotalLen=buf.length; i<TotalLen; i++) {
	          buf[i]=compressed[i*2]*256+compressed[i*2+1];
	        }

	        var result = [];
	        buf.forEach(function (c) {
	          result.push(f(c));
	        });
	        return LZString.decompress(result.join(''));

	    }

	  },


	  //compress into a string that is already URI encoded
	  compressToEncodedURIComponent: function (input) {
	    if (input == null) return "";
	    return LZString._compress(input, 6, function(a){return keyStrUriSafe.charAt(a);});
	  },

	  //decompress from an output of compressToEncodedURIComponent
	  decompressFromEncodedURIComponent:function (input) {
	    if (input == null) return "";
	    if (input == "") return null;
	    input = input.replace(/ /g, "+");
	    return LZString._decompress(input.length, 32, function(index) { return getBaseValue(keyStrUriSafe, input.charAt(index)); });
	  },

	  compress: function (uncompressed) {
	    return LZString._compress(uncompressed, 16, function(a){return f(a);});
	  },
	  _compress: function (uncompressed, bitsPerChar, getCharFromInt) {
	    if (uncompressed == null) return "";
	    var i, value,
	        context_dictionary= {},
	        context_dictionaryToCreate= {},
	        context_c="",
	        context_wc="",
	        context_w="",
	        context_enlargeIn= 2, // Compensate for the first entry which should not count
	        context_dictSize= 3,
	        context_numBits= 2,
	        context_data=[],
	        context_data_val=0,
	        context_data_position=0,
	        ii;

	    for (ii = 0; ii < uncompressed.length; ii += 1) {
	      context_c = uncompressed.charAt(ii);
	      if (!Object.prototype.hasOwnProperty.call(context_dictionary,context_c)) {
	        context_dictionary[context_c] = context_dictSize++;
	        context_dictionaryToCreate[context_c] = true;
	      }

	      context_wc = context_w + context_c;
	      if (Object.prototype.hasOwnProperty.call(context_dictionary,context_wc)) {
	        context_w = context_wc;
	      } else {
	        if (Object.prototype.hasOwnProperty.call(context_dictionaryToCreate,context_w)) {
	          if (context_w.charCodeAt(0)<256) {
	            for (i=0 ; i<context_numBits ; i++) {
	              context_data_val = (context_data_val << 1);
	              if (context_data_position == bitsPerChar-1) {
	                context_data_position = 0;
	                context_data.push(getCharFromInt(context_data_val));
	                context_data_val = 0;
	              } else {
	                context_data_position++;
	              }
	            }
	            value = context_w.charCodeAt(0);
	            for (i=0 ; i<8 ; i++) {
	              context_data_val = (context_data_val << 1) | (value&1);
	              if (context_data_position == bitsPerChar-1) {
	                context_data_position = 0;
	                context_data.push(getCharFromInt(context_data_val));
	                context_data_val = 0;
	              } else {
	                context_data_position++;
	              }
	              value = value >> 1;
	            }
	          } else {
	            value = 1;
	            for (i=0 ; i<context_numBits ; i++) {
	              context_data_val = (context_data_val << 1) | value;
	              if (context_data_position ==bitsPerChar-1) {
	                context_data_position = 0;
	                context_data.push(getCharFromInt(context_data_val));
	                context_data_val = 0;
	              } else {
	                context_data_position++;
	              }
	              value = 0;
	            }
	            value = context_w.charCodeAt(0);
	            for (i=0 ; i<16 ; i++) {
	              context_data_val = (context_data_val << 1) | (value&1);
	              if (context_data_position == bitsPerChar-1) {
	                context_data_position = 0;
	                context_data.push(getCharFromInt(context_data_val));
	                context_data_val = 0;
	              } else {
	                context_data_position++;
	              }
	              value = value >> 1;
	            }
	          }
	          context_enlargeIn--;
	          if (context_enlargeIn == 0) {
	            context_enlargeIn = Math.pow(2, context_numBits);
	            context_numBits++;
	          }
	          delete context_dictionaryToCreate[context_w];
	        } else {
	          value = context_dictionary[context_w];
	          for (i=0 ; i<context_numBits ; i++) {
	            context_data_val = (context_data_val << 1) | (value&1);
	            if (context_data_position == bitsPerChar-1) {
	              context_data_position = 0;
	              context_data.push(getCharFromInt(context_data_val));
	              context_data_val = 0;
	            } else {
	              context_data_position++;
	            }
	            value = value >> 1;
	          }


	        }
	        context_enlargeIn--;
	        if (context_enlargeIn == 0) {
	          context_enlargeIn = Math.pow(2, context_numBits);
	          context_numBits++;
	        }
	        // Add wc to the dictionary.
	        context_dictionary[context_wc] = context_dictSize++;
	        context_w = String(context_c);
	      }
	    }

	    // Output the code for w.
	    if (context_w !== "") {
	      if (Object.prototype.hasOwnProperty.call(context_dictionaryToCreate,context_w)) {
	        if (context_w.charCodeAt(0)<256) {
	          for (i=0 ; i<context_numBits ; i++) {
	            context_data_val = (context_data_val << 1);
	            if (context_data_position == bitsPerChar-1) {
	              context_data_position = 0;
	              context_data.push(getCharFromInt(context_data_val));
	              context_data_val = 0;
	            } else {
	              context_data_position++;
	            }
	          }
	          value = context_w.charCodeAt(0);
	          for (i=0 ; i<8 ; i++) {
	            context_data_val = (context_data_val << 1) | (value&1);
	            if (context_data_position == bitsPerChar-1) {
	              context_data_position = 0;
	              context_data.push(getCharFromInt(context_data_val));
	              context_data_val = 0;
	            } else {
	              context_data_position++;
	            }
	            value = value >> 1;
	          }
	        } else {
	          value = 1;
	          for (i=0 ; i<context_numBits ; i++) {
	            context_data_val = (context_data_val << 1) | value;
	            if (context_data_position == bitsPerChar-1) {
	              context_data_position = 0;
	              context_data.push(getCharFromInt(context_data_val));
	              context_data_val = 0;
	            } else {
	              context_data_position++;
	            }
	            value = 0;
	          }
	          value = context_w.charCodeAt(0);
	          for (i=0 ; i<16 ; i++) {
	            context_data_val = (context_data_val << 1) | (value&1);
	            if (context_data_position == bitsPerChar-1) {
	              context_data_position = 0;
	              context_data.push(getCharFromInt(context_data_val));
	              context_data_val = 0;
	            } else {
	              context_data_position++;
	            }
	            value = value >> 1;
	          }
	        }
	        context_enlargeIn--;
	        if (context_enlargeIn == 0) {
	          context_enlargeIn = Math.pow(2, context_numBits);
	          context_numBits++;
	        }
	        delete context_dictionaryToCreate[context_w];
	      } else {
	        value = context_dictionary[context_w];
	        for (i=0 ; i<context_numBits ; i++) {
	          context_data_val = (context_data_val << 1) | (value&1);
	          if (context_data_position == bitsPerChar-1) {
	            context_data_position = 0;
	            context_data.push(getCharFromInt(context_data_val));
	            context_data_val = 0;
	          } else {
	            context_data_position++;
	          }
	          value = value >> 1;
	        }


	      }
	      context_enlargeIn--;
	      if (context_enlargeIn == 0) {
	        context_enlargeIn = Math.pow(2, context_numBits);
	        context_numBits++;
	      }
	    }

	    // Mark the end of the stream
	    value = 2;
	    for (i=0 ; i<context_numBits ; i++) {
	      context_data_val = (context_data_val << 1) | (value&1);
	      if (context_data_position == bitsPerChar-1) {
	        context_data_position = 0;
	        context_data.push(getCharFromInt(context_data_val));
	        context_data_val = 0;
	      } else {
	        context_data_position++;
	      }
	      value = value >> 1;
	    }

	    // Flush the last char
	    while (true) {
	      context_data_val = (context_data_val << 1);
	      if (context_data_position == bitsPerChar-1) {
	        context_data.push(getCharFromInt(context_data_val));
	        break;
	      }
	      else context_data_position++;
	    }
	    return context_data.join('');
	  },

	  decompress: function (compressed) {
	    if (compressed == null) return "";
	    if (compressed == "") return null;
	    return LZString._decompress(compressed.length, 32768, function(index) { return compressed.charCodeAt(index); });
	  },

	  _decompress: function (length, resetValue, getNextValue) {
	    var dictionary = [],
	        next,
	        enlargeIn = 4,
	        dictSize = 4,
	        numBits = 3,
	        entry = "",
	        result = [],
	        i,
	        w,
	        bits, resb, maxpower, power,
	        c,
	        data = {val:getNextValue(0), position:resetValue, index:1};

	    for (i = 0; i < 3; i += 1) {
	      dictionary[i] = i;
	    }

	    bits = 0;
	    maxpower = Math.pow(2,2);
	    power=1;
	    while (power!=maxpower) {
	      resb = data.val & data.position;
	      data.position >>= 1;
	      if (data.position == 0) {
	        data.position = resetValue;
	        data.val = getNextValue(data.index++);
	      }
	      bits |= (resb>0 ? 1 : 0) * power;
	      power <<= 1;
	    }

	    switch (next = bits) {
	      case 0:
	          bits = 0;
	          maxpower = Math.pow(2,8);
	          power=1;
	          while (power!=maxpower) {
	            resb = data.val & data.position;
	            data.position >>= 1;
	            if (data.position == 0) {
	              data.position = resetValue;
	              data.val = getNextValue(data.index++);
	            }
	            bits |= (resb>0 ? 1 : 0) * power;
	            power <<= 1;
	          }
	        c = f(bits);
	        break;
	      case 1:
	          bits = 0;
	          maxpower = Math.pow(2,16);
	          power=1;
	          while (power!=maxpower) {
	            resb = data.val & data.position;
	            data.position >>= 1;
	            if (data.position == 0) {
	              data.position = resetValue;
	              data.val = getNextValue(data.index++);
	            }
	            bits |= (resb>0 ? 1 : 0) * power;
	            power <<= 1;
	          }
	        c = f(bits);
	        break;
	      case 2:
	        return "";
	    }
	    dictionary[3] = c;
	    w = c;
	    result.push(c);
	    while (true) {
	      if (data.index > length) {
	        return "";
	      }

	      bits = 0;
	      maxpower = Math.pow(2,numBits);
	      power=1;
	      while (power!=maxpower) {
	        resb = data.val & data.position;
	        data.position >>= 1;
	        if (data.position == 0) {
	          data.position = resetValue;
	          data.val = getNextValue(data.index++);
	        }
	        bits |= (resb>0 ? 1 : 0) * power;
	        power <<= 1;
	      }

	      switch (c = bits) {
	        case 0:
	          bits = 0;
	          maxpower = Math.pow(2,8);
	          power=1;
	          while (power!=maxpower) {
	            resb = data.val & data.position;
	            data.position >>= 1;
	            if (data.position == 0) {
	              data.position = resetValue;
	              data.val = getNextValue(data.index++);
	            }
	            bits |= (resb>0 ? 1 : 0) * power;
	            power <<= 1;
	          }

	          dictionary[dictSize++] = f(bits);
	          c = dictSize-1;
	          enlargeIn--;
	          break;
	        case 1:
	          bits = 0;
	          maxpower = Math.pow(2,16);
	          power=1;
	          while (power!=maxpower) {
	            resb = data.val & data.position;
	            data.position >>= 1;
	            if (data.position == 0) {
	              data.position = resetValue;
	              data.val = getNextValue(data.index++);
	            }
	            bits |= (resb>0 ? 1 : 0) * power;
	            power <<= 1;
	          }
	          dictionary[dictSize++] = f(bits);
	          c = dictSize-1;
	          enlargeIn--;
	          break;
	        case 2:
	          return result.join('');
	      }

	      if (enlargeIn == 0) {
	        enlargeIn = Math.pow(2, numBits);
	        numBits++;
	      }

	      if (dictionary[c]) {
	        entry = dictionary[c];
	      } else {
	        if (c === dictSize) {
	          entry = w + w.charAt(0);
	        } else {
	          return null;
	        }
	      }
	      result.push(entry);

	      // Add w+entry[0] to the dictionary.
	      dictionary[dictSize++] = w + entry.charAt(0);
	      enlargeIn--;

	      w = entry;

	      if (enlargeIn == 0) {
	        enlargeIn = Math.pow(2, numBits);
	        numBits++;
	      }

	    }
	  }
	};
	  return LZString;
	})();

	if (true) {
	  !(__WEBPACK_AMD_DEFINE_RESULT__ = function () { return LZString; }.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	} else if( typeof module !== 'undefined' && module != null ) {
	  module.exports = LZString
	}


/***/ },
/* 3 */
/***/ function(module, exports) {

	"use strict";
	function initSeedUi(onSeedChanged) {
	    var p = document.createElement('p');
	    p.innerHTML = '<button id="change">change</button>' +
	        'random seed: <input type="number" id="seed" value="0"></input>' +
	        '<button id="set">set</button>';
	    document.getElementsByTagName('body')[0].appendChild(p);
	    var changeElm = document.getElementById('change');
	    var seedElm = document.getElementById('seed');
	    var setElm = document.getElementById('set');
	    changeElm.onclick = function () {
	        seedElm.value = Math.floor(Math.random() * 9999999).toString();
	        onSeedChanging();
	    };
	    setElm.onclick = onSeedChanging;
	    function onSeedChanging() {
	        onSeedChanged(Number(seedElm.value));
	    }
	}
	exports.initSeedUi = initSeedUi;
	function enableShowingErrors() {
	    var pre = document.createElement('pre');
	    document.getElementsByTagName('body')[0].appendChild(pre);
	    window.addEventListener('error', function (error) {
	        var message = [error.filename, '@', error.lineno, ':\n', error.message].join('');
	        pre.textContent += '\n' + message;
	        return false;
	    });
	}
	exports.enableShowingErrors = enableShowingErrors;


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var sss = __webpack_require__(5);
	var pag = __webpack_require__(6);
	var ppe = __webpack_require__(7);
	var ir = __webpack_require__(1);
	var text = __webpack_require__(8);
	var rotationNum = 16;
	var pixelWidth = 128;
	var actors = [];
	var player = null;
	var ticks = 0;
	var score = 0;
	var scene;
	var random;
	var canvas;
	var context;
	var bloomCanvas;
	var bloomContext;
	var overlayCanvas;
	var overlayContext;
	var cursorPos = { x: pixelWidth / 2, y: pixelWidth / 2 };
	var frameCursorPos = { x: pixelWidth / 2, y: pixelWidth / 2 };
	var isClicked = false;
	var Scene;
	(function (Scene) {
	    Scene[Scene["title"] = 0] = "title";
	    Scene[Scene["game"] = 1] = "game";
	    Scene[Scene["gameover"] = 2] = "gameover";
	    Scene[Scene["replay"] = 3] = "replay";
	})(Scene || (Scene = {}));
	;
	window.onload = function () {
	    //debug.enableShowingErrors()
	    //debug.initSeedUi(onSeedChanged);
	    initCanvases();
	    random = new Random();
	    sss.init();
	    pag.defaultOptions.isMirrorY = true;
	    pag.defaultOptions.rotationNum = rotationNum;
	    pag.defaultOptions.scale = 2;
	    ppe.options.canvas = canvas;
	    overlayContext.fillStyle = 'white';
	    text.init(overlayContext);
	    onSeedChanged(6008729);
	    initCursorEvents();
	    /*ir.setOptions({
	      frameCount: -1,
	      isRecordingEventsAsString: true
	    });*/
	    if (ir.loadFromUrl() === true) {
	        beginReplay();
	    }
	    else {
	        beginTitle();
	    }
	    update();
	};
	function beginGame() {
	    scene = Scene.game;
	    sss.playBgm();
	    ir.startRecord();
	    if (ir.options.frameCount <= 0) {
	        ir.recordInitialStatus(random.getStatus());
	    }
	    initGameStatus();
	}
	function initGameStatus() {
	    score = ticks = 0;
	    actors = [];
	    setPlayer();
	}
	function endGame() {
	    if (scene === Scene.gameover || scene === Scene.replay) {
	        return;
	    }
	    scene = Scene.gameover;
	    ticks = 0;
	    sss.stopBgm();
	    ir.saveAsUrl();
	}
	function beginTitle() {
	    scene = Scene.title;
	    ticks = 0;
	}
	function beginReplay() {
	    var status = ir.startReplay();
	    if (status !== false) {
	        if (ir.options.frameCount > 0) {
	            setStatus(status);
	        }
	        else {
	            random.setStatus(status);
	            initGameStatus();
	        }
	        scene = Scene.replay;
	    }
	    else {
	        beginTitle();
	    }
	}
	function update() {
	    requestAnimationFrame(update);
	    frameCursorPos.x = cursorPos.x;
	    frameCursorPos.y = cursorPos.y;
	    context.clearRect(0, 0, 128, 128);
	    bloomContext.clearRect(0, 0, 64, 64);
	    overlayContext.clearRect(0, 0, 128, 128);
	    handleScene();
	    sss.update();
	    if (random.get01() < 0.015 * Math.sqrt(ticks * 0.01 + 1)) {
	        setLaser();
	        addScore();
	    }
	    ppe.update();
	    drawBloomParticles();
	    actors.sort(function (a, b) { return a.priority - b.priority; });
	    forEach(actors, function (a) {
	        a.update();
	        drawPixels(a);
	    });
	    for (var i = 0; i < actors.length;) {
	        if (actors[i].isAlive === false) {
	            actors.splice(i, 1);
	        }
	        else {
	            i++;
	        }
	    }
	    text.draw("" + score, 1, 1);
	    ticks++;
	}
	function handleScene() {
	    if (scene !== Scene.game && isClicked) {
	        beginGame();
	    }
	    isClicked = false;
	    if (scene === Scene.game) {
	        var events = ir.options.isRecordingEventsAsString ?
	            ('00' + frameCursorPos.x).slice(-3) + ('00' + frameCursorPos.y).slice(-3) :
	            [frameCursorPos.x, frameCursorPos.y];
	        if (ir.options.frameCount > 0) {
	            ir.record(getStatus(), events);
	        }
	        else {
	            ir.recordEvents(events);
	        }
	    }
	    if (scene === Scene.gameover) {
	        text.draw('GAME OVER', 40, 60);
	        if (ticks >= 60) {
	            beginTitle();
	        }
	    }
	    if (scene === Scene.title) {
	        text.draw('INSTANT REPLAY', 30, 50);
	        text.draw('SAMPLE GAME', 40, 80);
	        if (ticks >= 120) {
	            beginReplay();
	        }
	    }
	    if (scene === Scene.replay) {
	        text.draw('REPLAY', 50, 70);
	        var events = ir.getEvents();
	        if (events !== false) {
	            if (ir.options.isRecordingEventsAsString) {
	                frameCursorPos.x = Number(events.substr(0, 3));
	                frameCursorPos.y = Number(events.substr(3, 3));
	            }
	            else {
	                frameCursorPos.x = events[0];
	                frameCursorPos.y = events[1];
	            }
	        }
	        else {
	            beginTitle();
	        }
	    }
	}
	function drawBloomParticles() {
	    var pts = ppe.getParticles();
	    for (var i = 0; i < pts.length; i++) {
	        var p = pts[i];
	        var r = Math.floor(Math.sqrt(p.color.r) * 255);
	        var g = Math.floor(Math.sqrt(p.color.g) * 255);
	        var b = Math.floor(Math.sqrt(p.color.b) * 255);
	        var a = Math.max(p.color.r, p.color.g, p.color.b) / 3;
	        bloomContext.fillStyle = "rgba(" + r + "," + g + "," + b + ", " + a + ")";
	        bloomContext.fillRect((p.pos.x - p.size) / 2, (p.pos.y - p.size) / 2, p.size, p.size);
	    }
	}
	function setPlayer(status) {
	    if (status === void 0) { status = null; }
	    var propNames = ['type', 'pos.x', 'pos.y', 'ppos.x', 'ppos.y', 'angle'];
	    if (status == null) {
	        player = { type: 'p' };
	        player.pos = { x: pixelWidth / 2, y: pixelWidth / 2 };
	        player.ppos = { x: pixelWidth / 2, y: pixelWidth / 2 };
	        player.angle = -Math.PI / 2;
	    }
	    else {
	        player = ir.arrayToObject(status, propNames);
	    }
	    player.pixels = pag.generate([
	        ' x',
	        'xxxx'
	    ]);
	    player.update = function () {
	        this.pos.x = frameCursorPos.x;
	        this.pos.y = frameCursorPos.y;
	        var ox = this.pos.x - this.ppos.x;
	        var oy = this.pos.y - this.ppos.y;
	        if (Math.sqrt(ox * ox + oy * oy) > 1) {
	            this.angle = Math.atan2(oy, ox);
	        }
	        this.ppos.x = this.pos.x;
	        this.ppos.y = this.pos.y;
	        ppe.emit('j1', this.pos.x, this.pos.y, this.angle + Math.PI);
	    };
	    player.destroy = function () {
	        ppe.emit('e1', this.pos.x, this.pos.y, 0, 3, 3);
	        if (scene === Scene.game) {
	            sss.play('u1', 4);
	        }
	        player.isAlive = false;
	        endGame();
	    };
	    player.getStatus = function () {
	        return ir.objectToArray(this, propNames);
	    };
	    player.priority = 0;
	    actors.push(player);
	}
	;
	function setLaser(status) {
	    if (status === void 0) { status = null; }
	    var propNames = ['type', 'isVertical', 'pos', 'ticks'];
	    var laser;
	    if (status == null) {
	        laser = { type: 'l' };
	        laser.isVertical = random.get01() > 0.5;
	        laser.pos = Math.floor(random.get01() * pixelWidth);
	        laser.ticks = 0;
	    }
	    else {
	        laser = ir.arrayToObject(status, propNames);
	    }
	    laser.update = function () {
	        var w = 0;
	        var br = 0;
	        if (this.ticks < 20) {
	            w = 2 + laser.ticks * 0.2;
	            br = this.ticks / 50;
	        }
	        else if (this.ticks < 30) {
	            w = 20 - (this.ticks - 20);
	            br = 1 - (this.ticks - 20) / 20;
	        }
	        var rg = Math.floor(50 + br * 200);
	        var b = Math.floor(200 + br * 50);
	        context.fillStyle = "rgb(" + rg + "," + rg + "," + b + ")";
	        if (this.isVertical) {
	            context.fillRect(this.pos - w / 2, 0, w, pixelWidth);
	        }
	        else {
	            context.fillRect(0, this.pos - w / 2, pixelWidth, w);
	        }
	        if (this.ticks === 20) {
	            if (scene === Scene.game) {
	                sss.play('l1');
	                sss.play('s1');
	            }
	            var a = Math.floor(Math.random() * 2) * Math.PI;
	            if (this.isVertical) {
	                a += Math.PI / 2;
	            }
	            for (var i = 0; i < 18; i++) {
	                var x = void 0, y = void 0;
	                if (this.isVertical) {
	                    x = this.pos;
	                    y = (i - 1) * pixelWidth / 16;
	                }
	                else {
	                    x = (i - 1) * pixelWidth / 16;
	                    y = this.pos;
	                }
	                ppe.emit('m1', x, y, a, 1, 0.5, 0.7);
	            }
	        }
	        if (player != null && player.isAlive !== false) {
	            var pp = this.isVertical ? player.pos.x : player.pos.y;
	            var lw = this.ticks === 20 ? w * 0.4 : w * 1.5;
	            if (Math.abs(this.pos - pp) < lw) {
	                if (this.ticks === 20) {
	                    player.destroy();
	                }
	                else {
	                    addScore();
	                }
	            }
	        }
	        laser.ticks++;
	        if (laser.ticks > 30) {
	            laser.isAlive = false;
	        }
	    };
	    laser.getStatus = function () {
	        return ir.objectToArray(this, propNames);
	    };
	    laser.priority = 1;
	    actors.push(laser);
	}
	function addScore() {
	    if (scene === Scene.game || scene === Scene.replay) {
	        score++;
	    }
	}
	function drawPixels(actor) {
	    if (!actor.hasOwnProperty('pixels')) {
	        return;
	    }
	    var a = actor.angle;
	    if (a < 0) {
	        a = Math.PI * 2 - Math.abs(a % (Math.PI * 2));
	    }
	    var pxs = actor.pixels[Math.round(a / (Math.PI * 2 / rotationNum)) % rotationNum];
	    var pw = pxs.length;
	    var ph = pxs[0].length;
	    var sbx = Math.floor(actor.pos.x - pw / 2);
	    var sby = Math.floor(actor.pos.y - ph / 2);
	    for (var y = 0, sy = sby; y < ph; y++, sy++) {
	        for (var x = 0, sx = sbx; x < pw; x++, sx++) {
	            var px = pxs[x][y];
	            if (!px.isEmpty) {
	                context.fillStyle = px.style;
	                context.fillRect(sx, sy, 1, 1);
	            }
	        }
	    }
	}
	function getStatus() {
	    return [ticks, score, random.getStatus(), getActorsStatus()];
	}
	function setStatus(status) {
	    ticks = status[0];
	    score = status[1];
	    random.setStatus(status[2]);
	    setActorsStatus(status[3]);
	}
	function getActorsStatus() {
	    var state = [];
	    forEach(actors, function (a) {
	        state.push(a.getStatus());
	    });
	    return state;
	}
	function setActorsStatus(state) {
	    actors = [];
	    forEach(state, function (s) {
	        if (s[0] === 'p') {
	            setPlayer(s);
	        }
	        else {
	            setLaser(s);
	        }
	    });
	}
	function onSeedChanged(seed) {
	    pag.setSeed(seed);
	    sss.reset();
	    sss.setSeed(seed);
	    ppe.setSeed(seed);
	    ppe.reset();
	    if (scene === Scene.game) {
	        sss.playBgm();
	    }
	}
	function initCanvases() {
	    canvas = document.getElementById('main');
	    canvas.width = canvas.height = pixelWidth;
	    ppe.options.canvas = canvas;
	    context = canvas.getContext('2d');
	    bloomCanvas = document.getElementById('bloom');
	    bloomCanvas.width = bloomCanvas.height = pixelWidth / 2;
	    bloomContext = bloomCanvas.getContext('2d');
	    overlayCanvas = document.getElementById('overlay');
	    overlayCanvas.width = canvas.height = pixelWidth;
	    overlayContext = overlayCanvas.getContext('2d');
	}
	function initCursorEvents() {
	    document.onmousedown = function (e) {
	        onMouseTouchDown(e.pageX, e.pageY);
	    };
	    document.ontouchstart = function (e) {
	        onMouseTouchDown(e.touches[0].pageX, e.touches[0].pageY);
	    };
	    document.onmousemove = function (e) {
	        onMouseTouchMove(e.pageX, e.pageY);
	    };
	    document.ontouchmove = function (e) {
	        e.preventDefault();
	        onMouseTouchMove(e.touches[0].pageX, e.touches[0].pageY);
	    };
	    document.onmouseup = function (e) {
	        onMouseTouchUp(e);
	    };
	    document.ontouchend = function (e) {
	        onMouseTouchUp(e);
	    };
	}
	function onMouseTouchDown(x, y) {
	    setCursorPos(x, y);
	    sss.playEmpty();
	    isClicked = true;
	}
	function onMouseTouchMove(x, y) {
	    setCursorPos(x, y);
	}
	function setCursorPos(x, y) {
	    cursorPos.x = clamp(Math.round(((x - canvas.offsetLeft) / canvas.clientWidth + 0.5) * pixelWidth), 0, pixelWidth - 1);
	    cursorPos.y = clamp(Math.round(((y - canvas.offsetTop) / canvas.clientHeight + 0.5) * pixelWidth), 0, pixelWidth - 1);
	}
	function onMouseTouchUp(e) {
	}
	function forEach(array, func) {
	    for (var i = 0; i < array.length; i++) {
	        func(array[i]);
	    }
	}
	function clamp(v, min, max) {
	    if (v < min) {
	        return min;
	    }
	    else if (v > max) {
	        return max;
	    }
	    else {
	        return v;
	    }
	}
	var Random = (function () {
	    function Random() {
	        this.propNames = ['x', 'y', 'z', 'w'];
	        this.setSeed();
	        this.get01 = this.get01.bind(this);
	    }
	    Random.prototype.setSeed = function (v) {
	        if (v === void 0) { v = -0x7fffffff; }
	        if (v === -0x7fffffff) {
	            v = Math.floor(Math.random() * 0x7fffffff);
	        }
	        this.x = v = 1812433253 * (v ^ (v >> 30));
	        this.y = v = 1812433253 * (v ^ (v >> 30)) + 1;
	        this.z = v = 1812433253 * (v ^ (v >> 30)) + 2;
	        this.w = v = 1812433253 * (v ^ (v >> 30)) + 3;
	        return this;
	    };
	    Random.prototype.getInt = function () {
	        var t = this.x ^ (this.x << 11);
	        this.x = this.y;
	        this.y = this.z;
	        this.z = this.w;
	        this.w = (this.w ^ (this.w >> 19)) ^ (t ^ (t >> 8));
	        return this.w;
	    };
	    Random.prototype.get01 = function () {
	        return this.getInt() / 0x7fffffff;
	    };
	    Random.prototype.getStatus = function () {
	        return ir.objectToArray(this, this.propNames);
	    };
	    Random.prototype.setStatus = function (status) {
	        ir.arrayToObject(status, this.propNames, this);
	    };
	    return Random;
	}());


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	(function webpackUniversalModuleDefinition(root, factory) {
		if(true)
			module.exports = factory();
		else if(typeof define === 'function' && define.amd)
			define([], factory);
		else if(typeof exports === 'object')
			exports["sss"] = factory();
		else
			root["sss"] = factory();
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

		module.exports = __webpack_require__(2);


	/***/ },
	/* 1 */,
	/* 2 */
	/***/ function(module, exports, __webpack_require__) {

		"use strict";
		var __extends = (this && this.__extends) || function (d, b) {
		    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
		    function __() { this.constructor = d; }
		    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
		};
		var jsfx = __webpack_require__(3);
		var live;
		var random;
		var buffers = {};
		var tracks = [];
		var schedulingInterval;
		var seed;
		function init(_seed, tempo, fps) {
		    if (_seed === void 0) { _seed = 0; }
		    if (tempo === void 0) { tempo = 120; }
		    if (fps === void 0) { fps = 60; }
		    live = jsfx.Live({});
		    setVolume(0.1);
		    seed = _seed;
		    random = new Random();
		    jsfx.setRandomFunc(random.get01);
		    exports.playInterval = 60 / tempo;
		    schedulingInterval = 1 / fps * 2;
		}
		exports.init = init;
		function setSeed(_seed) {
		    if (_seed === void 0) { _seed = 0; }
		    seed = _seed;
		}
		exports.setSeed = setSeed;
		exports.Preset = jsfx.Preset;
		var playPrefixes = {
		    c: exports.Preset.Coin,
		    l: exports.Preset.Laser,
		    e: exports.Preset.Explosion,
		    p: exports.Preset.Powerup,
		    h: exports.Preset.Hit,
		    j: exports.Preset.Jump,
		    s: exports.Preset.Select,
		    u: exports.Preset.Lucky,
		};
		var playprefixeArray = values(playPrefixes);
		function play(name, mult, params) {
		    if (name === void 0) { name = '0'; }
		    if (mult === void 0) { mult = 2; }
		    if (params === void 0) { params = null; }
		    if (live == null) {
		        return;
		    }
		    if (buffers[name] != null) {
		        buffers[name].play();
		        return;
		    }
		    random.setSeed(seed + getHashFromString(name));
		    if (params == null) {
		        var p = playPrefixes[name[0]];
		        if (typeof p === 'undefined') {
		            p = random.sample(playprefixeArray);
		        }
		        params = nArray(mult, p);
		    }
		    buffers[name] = new Sound(params);
		    buffers[name].play();
		}
		exports.play = play;
		function setVolume(volume) {
		    if (live == null) {
		        return;
		    }
		    live._volume.gain.value = volume;
		}
		exports.setVolume = setVolume;
		var quantize = 0.5;
		function setQuantize(_quantize) {
		    quantize = _quantize;
		}
		exports.setQuantize = setQuantize;
		function playBgm(name, interval, params, tracksNum) {
		    if (name === void 0) { name = '0'; }
		    if (interval === void 0) { interval = 0.25; }
		    if (params === void 0) { params = [exports.Preset.Laser, exports.Preset.Hit]; }
		    if (tracksNum === void 0) { tracksNum = 8; }
		    if (live == null) {
		        return;
		    }
		    stopBgm();
		    random.setSeed(seed + getHashFromString(name));
		    tracks = [];
		    times(tracksNum, function () { return addRandomTrack(interval, params); });
		    forEach(tracks, function (t) { return t.play(); });
		}
		exports.playBgm = playBgm;
		function stopBgm() {
		    if (live == null) {
		        return;
		    }
		    forEach(tracks, function (t) { return t.stop(); });
		}
		exports.stopBgm = stopBgm;
		function update() {
		    if (live == null) {
		        return;
		    }
		    var currentTime = live._context.currentTime;
		    var schedulingTime = currentTime + schedulingInterval;
		    forOwn(buffers, function (b) { return b.update(currentTime, schedulingTime); });
		    forEach(tracks, function (t) { return t.update(currentTime, schedulingTime); });
		    return currentTime;
		}
		exports.update = update;
		function reset() {
		    stopBgm();
		    buffers = {};
		    tracks = [];
		}
		exports.reset = reset;
		var isEmptyPlayed = false;
		function playEmpty() {
		    if (live == null) {
		        return;
		    }
		    if (isEmptyPlayed) {
		        return;
		    }
		    var eb = live._createEmptyBuffer();
		    live._playBuffer(eb, 0);
		    isEmptyPlayed = true;
		}
		exports.playEmpty = playEmpty;
		function playParam(param) {
		    if (live == null) {
		        return;
		    }
		    live._play(param);
		}
		exports.playParam = playParam;
		function addRandomTrack(interval, params) {
		    addTrack(random.sample(params), createRandomPattern(), interval);
		}
		function createRandomPattern() {
		    var len = 64;
		    var pattern = nArray(len, false);
		    var pi = 4;
		    while (pi <= len) {
		        pattern = reversePattern(pattern, pi);
		        pi *= 2;
		    }
		    return pattern;
		}
		function reversePattern(pattern, interval) {
		    var pt = nArray(interval, false);
		    var pr = 0.5;
		    for (var i = 0; i < interval / 2; i++) {
		        if (random.f() < pr) {
		            pt[random.i(interval - 1)] = true;
		        }
		        pr *= 0.5;
		    }
		    return map(pattern, function (p, i) { return pt[i % interval] ? !p : p; });
		}
		function addTrack(param, pattern, interval) {
		    if (interval === void 0) { interval = 0.25; }
		    var track = new Track(param);
		    track.patternInterval = interval;
		    if (typeof pattern === 'string') {
		        track.pattern = mapString(pattern, function (p) { return p === '1'; });
		    }
		    else {
		        track.pattern = pattern;
		    }
		    tracks.push(track);
		}
		exports.addTrack = addTrack;
		function getHashFromString(str) {
		    var hash = 0;
		    var len = str.length;
		    for (var i = 0; i < len; i++) {
		        var chr = str.charCodeAt(i);
		        hash = ((hash << 5) - hash) + chr;
		        hash |= 0;
		    }
		    return hash;
		}
		function values(obj) {
		    var vs = [];
		    for (var p in obj) {
		        if (obj.hasOwnProperty(p)) {
		            vs.push(obj[p]);
		        }
		    }
		    return vs;
		}
		function nArray(n, v) {
		    var a = [];
		    for (var i = 0; i < n; i++) {
		        a.push(v);
		    }
		    return a;
		}
		function times(n, func) {
		    for (var i = 0; i < n; i++) {
		        func();
		    }
		}
		function forEach(array, func) {
		    for (var i = 0; i < array.length; i++) {
		        func(array[i]);
		    }
		}
		function forOwn(obj, func) {
		    for (var p in obj) {
		        func(obj[p]);
		    }
		}
		function map(array, func) {
		    var result = [];
		    for (var i = 0; i < array.length; i++) {
		        result.push(func(array[i], i));
		    }
		    return result;
		}
		function mapString(str, func) {
		    var result = [];
		    for (var i = 0; i < str.length; i++) {
		        result.push(func(str.charAt(i), i));
		    }
		    return result;
		}
		var Sound = (function () {
		    function Sound(params) {
		        this.isPlaying = false;
		        this.playedTime = null;
		        if (!Array.isArray(params)) {
		            params = [params];
		        }
		        this.buffers = map(params, function (p) { return live._createBuffer(p); });
		    }
		    Sound.prototype.play = function () {
		        this.isPlaying = true;
		    };
		    Sound.prototype.stop = function () {
		        this.isPlaying = false;
		    };
		    Sound.prototype.update = function (currentTime, schedulingTime) {
		        if (!this.isPlaying) {
		            return;
		        }
		        this.isPlaying = false;
		        var interval = exports.playInterval * quantize;
		        var time = interval > 0 ?
		            Math.ceil(currentTime / interval) * interval : currentTime;
		        if (this.playedTime == null || time > this.playedTime) {
		            this.playLater(time);
		            this.playedTime = time;
		        }
		        return;
		    };
		    Sound.prototype.playLater = function (when) {
		        forEach(this.buffers, function (b) { return live._playBuffer(b, when); });
		    };
		    return Sound;
		}());
		var Track = (function (_super) {
		    __extends(Track, _super);
		    function Track() {
		        _super.apply(this, arguments);
		        this.patternIndex = 0;
		        this.patternInterval = 0.25;
		        this.scheduledTime = null;
		    }
		    Track.prototype.update = function (currentTime, schedulingTime) {
		        if (!this.isPlaying) {
		            return;
		        }
		        if (this.scheduledTime == null) {
		            this.scheduledTime = Math.ceil(currentTime / exports.playInterval) * exports.playInterval -
		                exports.playInterval * this.patternInterval;
		            this.patternIndex = 0;
		            this.calcNextScheduledTime();
		        }
		        for (var i = 0; i < 99; i++) {
		            if (this.scheduledTime >= currentTime) {
		                break;
		            }
		            this.calcNextScheduledTime();
		        }
		        while (this.scheduledTime <= schedulingTime) {
		            this.playLater(this.scheduledTime);
		            this.calcNextScheduledTime();
		        }
		    };
		    Track.prototype.calcNextScheduledTime = function () {
		        var pl = this.pattern.length;
		        var pi = exports.playInterval * this.patternInterval;
		        for (var i = 0; i < pl; i++) {
		            this.scheduledTime += pi;
		            var p = this.pattern[this.patternIndex];
		            this.patternIndex++;
		            if (this.patternIndex >= pl) {
		                this.patternIndex = 0;
		            }
		            if (p) {
		                break;
		            }
		        }
		    };
		    return Track;
		}(Sound));
		var Random = (function () {
		    function Random() {
		        this.setSeed();
		        this.get01 = this.get01.bind(this);
		        this.f = this.f.bind(this);
		        this.i = this.i.bind(this);
		    }
		    Random.prototype.setSeed = function (v) {
		        if (v === void 0) { v = -0x7fffffff; }
		        if (v === -0x7fffffff) {
		            v = Math.floor(Math.random() * 0x7fffffff);
		        }
		        this.x = v = 1812433253 * (v ^ (v >> 30));
		        this.y = v = 1812433253 * (v ^ (v >> 30)) + 1;
		        this.z = v = 1812433253 * (v ^ (v >> 30)) + 2;
		        this.w = v = 1812433253 * (v ^ (v >> 30)) + 3;
		        return this;
		    };
		    Random.prototype.f = function (minOrMax, max) {
		        if (minOrMax === void 0) { minOrMax = null; }
		        if (max === void 0) { max = null; }
		        if (minOrMax == null) {
		            return this.get01();
		        }
		        if (max == null) {
		            return this.get01() * minOrMax;
		        }
		        return this.get01() * (max - minOrMax) + minOrMax;
		    };
		    Random.prototype.i = function (minOrMax, max) {
		        if (minOrMax === void 0) { minOrMax = null; }
		        if (max === void 0) { max = null; }
		        return Math.floor(this.f(minOrMax, max + 1));
		    };
		    Random.prototype.sample = function (array) {
		        return array[this.i(array.length - 1)];
		    };
		    Random.prototype.getInt = function () {
		        var t = this.x ^ (this.x << 11);
		        this.x = this.y;
		        this.y = this.z;
		        this.z = this.w;
		        this.w = (this.w ^ (this.w >> 19)) ^ (t ^ (t >> 8));
		        return this.w;
		    };
		    Random.prototype.get01 = function () {
		        return this.getInt() / 0x7fffffff;
		    };
		    return Random;
		}());


	/***/ },
	/* 3 */
	/***/ function(module, exports) {

		// original ver.: https://github.com/loov/jsfx
		// these functions/variables are added by @abagames
		//  - module.exports
		//  - Live._createBuffer
		//  - Live._createEmptyBuffer
		//  - Live._playBuffer
		//  - setRandomFunc
		//  - webkitAudioContext
		var jsfx = {};
		(function(jsfx){
			'use strict';

			var chr = String.fromCharCode;
			var TAU = +Math.PI*2;
			var bitsPerSample = 16|0;
			var numChannels = 1|0;
			var sin = Math.sin;
			var pow = Math.pow;
			var abs = Math.abs;
			var EPSILON = 0.000001;

			jsfx.SampleRate = 0|0;
			jsfx.Sec = 0|0;

			jsfx.SetSampleRate = function(sampleRate){
				jsfx.SampleRate = sampleRate|0;
				jsfx.Sec = sampleRate|0;
			};
			jsfx.SetSampleRate(getDefaultSampleRate());

			// MAIN API

			// Creates a new Audio object based on the params
			// params can be a params generating function or the actual parameters
			jsfx.Sound = function(params){
				var processor = new Processor(params, jsfx.DefaultModules);
				var block = createFloatArray(processor.getSamplesLeft());
				processor.generate(block);
				return CreateAudio(block);
			};

			// Same as Sounds, but avoids locking the browser for too long
			// in case you have a large amount of sounds to generate
			jsfx.Sounds = function(library, ondone, onprogress){
				var audio  = {};
				var player = {};
				player._audio = audio;

				var toLoad = [];

				// create playing functions
				map_object(library, function(_, name){
					player[name] = function(){
						if(typeof audio[name] !== "undefined"){
							audio[name].currentTime = 0.0;
							audio[name].play();
						}
					};
					toLoad.push(name);
				});

				var loaded = 0, total = toLoad.length;
				function next(){
					if(toLoad.length == 0){
						ondone && ondone(sounds);
						return;
					}
					var name = toLoad.shift();
					audio[name] = jsfx.Sound(library[name]);
					loaded++;
					onprogress && onprogress(name, loaded, total);

					window.setTimeout(next, 30);
				}
				next();

				return player;
			}

			// SoundsImmediate takes a named set of params, and generates multiple
			// sound objects at once.
			jsfx.SoundsImmediate = function(library){
				var audio = {};
				var player = {};
				player._audio = audio;
				map_object(library, function(params, name){
					audio[name] = jsfx.Sound(params);
					player[name] = function(){
						if(typeof audio[name] !== "undefined"){
							audio[name].currentTime = 0.0;
							audio[name].play();
						}
					};
				})
				return player;
			};

		  var AudioContext = window.AudioContext || window.webkitAudioContext;
			if(typeof AudioContext !== "undefined"){
				// Node creates a new AudioContext ScriptProcessor that outputs the
				// sound. It will automatically disconnect, unless otherwise specified.
				jsfx.Node = function(audioContext, params, modules, bufferSize, stayConnected){
					var node = audioContext.createScriptProcessor(bufferSize, 0, 1);
					var gen = new Processor(params, modules || jsfx.DefaultModules);
					node.onaudioprocess = function(ev){
						var block = ev.outputBuffer.getChannelData(0);
						gen.generate(block);
						if(!stayConnected && gen.finished){
							// we need to do an async disconnect, otherwise Chrome may
							// glitch
							setTimeout(function(){ node.disconnect(); }, 30);
						}
					}
					return node;
				}

				// Live creates an managed AudioContext for playing.
				// This is useful, when you want to use procedurally generated sounds.
				jsfx.Live = function(library, modules, BufferSize){
					//TODO: add limit for number of notes played at the same time
					BufferSize = BufferSize || 2048;
					var player = {};

					var context = new AudioContext();
					var volume = context.createGain();
					volume.connect(context.destination);

					player._context = context;
					player._volume = volume;

					map_object(library, function(params, name){
						player[name] =  function(){
							var node = jsfx.Node(context, params, modules, BufferSize);
							node.connect(volume);
						};
					});

					player._close = function(){
						context.close();
					};

					player._play = function(params){
						var node = jsfx.Node(context, params, modules, BufferSize);
						node.connect(volume);
					};
		      
		      player._createBuffer = function(params) {
		        var processor = new Processor(params, jsfx.DefaultModules);
		        var block = createFloatArray(processor.getSamplesLeft());
		        processor.generate(block);
						return player._createBufferFromBlock(block);
		      }
		      
		      player._createEmptyBuffer = function() {
						return player._createBufferFromBlock([0]);
		      }
		      
		      player._createBufferFromBlock = function(block) {
		        var buffer = context.createBuffer(1, block.length, jsfx.SampleRate);
		        var channelData = buffer.getChannelData(0);
		        channelData.set(block);
		        return buffer;
		      }
		      
		      player._playBuffer = function(buffer, when) {
		        var bufSrc = context.createBufferSource();
		        bufSrc.buffer = buffer;
		        bufSrc.start = bufSrc.start || bufSrc.noteOn;
		        bufSrc.start(when);
		        bufSrc.onended = function() {
		          bufSrc.disconnect();
		        };
						bufSrc.connect(volume);
		      }

					return player;
				}
			} else {
				//jsfx.Live = jsfx.Sounds;
				jsfx.Live = function(library, modules, BufferSize){
					return null;
				};
			}

			// SOUND GENERATION
			jsfx.Module = {};

			// generators
			jsfx.G = {};

			var stage = jsfx.stage = {
				PhaseSpeed    : 0,
				PhaseSpeedMod : 10,
				Generator     : 20,
				SampleMod     : 30,
				Volume        : 40
			};
			function byStage(a,b){ return a.stage - b.stage; }

			jsfx.InitDefaultParams = InitDefaultParams;
			function InitDefaultParams(params, modules){
				// setup modules
				for(var i = 0; i < modules.length; i += 1){
					var M = modules[i];
					var P = params[M.name] || {};

					// add missing parameters
					map_object(M.params, function(def, name){
						if(typeof P[name] === 'undefined'){
							P[name] = def.D;
						}
					});

					params[M.name] = P;
				}
			}

			// Generates a stateful sound effect processor
			// params can be a function that creates a parameter set
			jsfx.Processor = Processor;
			function Processor(params, modules){
				params = params || {};
				modules = modules || jsfx.DefaultModules;

				if(typeof params === 'function'){
					params = params();
				} else {
					params = JSON.parse(JSON.stringify(params))
				}
				this.finished = false;

				this.state = {
					SampleRate: params.SampleRate || jsfx.SampleRate
				};

				// sort modules
				modules = modules.slice();
				modules.sort(byStage)
				this.modules = modules;

				// init missing params
				InitDefaultParams(params, modules);

				// setup modules
				for(var i = 0; i < this.modules.length; i += 1){
					var M = this.modules[i];
					this.modules[i].setup(this.state, params[M.name]);
				}
			}
			Processor.prototype = {
				//TODO: see whether this can be converted to a module
				generate: function(block){
					for(var i = 0|0; i < block.length; i += 1){
						block[i] = 0;
					}
					if(this.finished){ return; }

					var $ = this.state,
						N = block.length|0;
					for(var i = 0; i < this.modules.length; i += 1){
						var M = this.modules[i];
						var n = M.process($, block.subarray(0,N))|0;
						N = Math.min(N, n);
					}
					if(N < block.length){
						this.finished = true;
					}
					for(var i = N; i < block.length; i++){
						block[i] = 0;
					}
				},
				getSamplesLeft: function(){
					var samples = 0;
					for(var i = 0; i < this.state.envelopes.length; i += 1){
						samples += this.state.envelopes[i].N;
					}
					if(samples === 0){
						samples = 3*this.state.SampleRate;
					}
					return samples;
				}
			};

			// Frequency
			jsfx.Module.Frequency = {
				name: 'Frequency',
				params: {
					Start: { L:30, H:1800, D:440  },

					Min: { L:30, H:1800, D:30    },
					Max: { L:30, H:1800, D:1800  },

					Slide:      { L:-1, H:1, D:0 },
					DeltaSlide: { L:-1, H:1, D:0 },

					RepeatSpeed:  { L:0, H: 3.0, D: 0 },

					ChangeAmount: { L:-12, H:12, D:0 },
					ChangeSpeed : { L:  0, H:1,  D:0 }
				},
				stage: stage.PhaseSpeed,
				setup: function($, P){
					var SR = $.SampleRate;

					$.phaseParams = P;

					$.phaseSpeed    = P.Start * TAU / SR;
					$.phaseSpeedMax = P.Max * TAU / SR;
					$.phaseSpeedMin = P.Min * TAU / SR;

					$.phaseSpeedMin = Math.min($.phaseSpeedMin, $.phaseSpeed);
					$.phaseSpeedMax = Math.max($.phaseSpeedMax, $.phaseSpeed);

					$.phaseSlide = 1.0 + pow(P.Slide, 3.0) * 64.0 / SR;
					$.phaseDeltaSlide = pow(P.DeltaSlide, 3.0) / (SR * 1000);

					$.repeatTime = 0;
					$.repeatLimit = Infinity;
					if(P.RepeatSpeed > 0){
						$.repeatLimit = P.RepeatSpeed * SR;
					}

					$.arpeggiatorTime = 0;
					$.arpeggiatorLimit = P.ChangeSpeed * SR;
					if(P.ChangeAmount == 0){
						$.arpeggiatorLimit = Infinity;
					}
					$.arpeggiatorMod = 1 + P.ChangeAmount / 12.0;
				},
				process: function($, block){
					var speed = +$.phaseSpeed,
						min   = +$.phaseSpeedMin,
						max   = +$.phaseSpeedMax,
						slide = +$.phaseSlide,
						deltaSlide = +$.phaseDeltaSlide;

					var repeatTime  = $.repeatTime,
						repeatLimit = $.repeatLimit;

					var arpTime  = $.arpeggiatorTime,
						arpLimit = $.arpeggiatorLimit,
						arpMod   = $.arpeggiatorMod;

					for(var i = 0; i < block.length; i++){
						slide += deltaSlide;
						speed *= slide;
						speed = speed < min ? min : speed > max ? max : speed;

						if(repeatTime > repeatLimit){
							this.setup($, $.phaseParams);
							return i + this.process($, block.subarray(i)) - 1;
						}
						repeatTime++;

						if(arpTime > arpLimit){
							speed *= arpMod;
							arpTime = 0;
							arpLimit = Infinity;
						}
						arpTime++;

						block[i] += speed;
					}

					$.repeatTime = repeatTime;
					$.arpeggiatorTime = arpTime;
					$.arpeggiatorLimit = arpLimit;

					$.phaseSpeed = speed;
					$.phaseSlide = slide;

					return block.length;
				}
			};

			// Vibrato
			jsfx.Module.Vibrato = {
				name: 'Vibrato',
				params: {
					Depth:      {L: 0, H:1, D:0},
					DepthSlide: {L:-1, H:1, D:0},

					Frequency:      {L:  0.01, H:48, D:0},
					FrequencySlide: {L: -1.00, H: 1, D:0}
				},
				stage: stage.PhaseSpeedMod,
				setup: function($, P){
					var SR = $.SampleRate;
					$.vibratoPhase = 0;
					$.vibratoDepth = P.Depth;
					$.vibratoPhaseSpeed = P.Frequency * TAU / SR;

					$.vibratoPhaseSpeedSlide = 1.0 + pow(P.FrequencySlide, 3.0) * 3.0 / SR;
					$.vibratoDepthSlide = P.DepthSlide / SR;
				},
				process: function($, block){
					var phase = +$.vibratoPhase,
						depth = +$.vibratoDepth,
						speed = +$.vibratoPhaseSpeed,
						slide = +$.vibratoPhaseSpeedSlide,
						depthSlide = +$.vibratoDepthSlide;

					if((depth == 0) && (depthSlide <= 0)){
						return block.length;
					}

					for(var i = 0; i < block.length; i++){
						phase += speed;
						if(phase > TAU){phase -= TAU};
						block[i] += block[i] * sin(phase) * depth;

						speed *= slide;
						depth += depthSlide;
						depth = clamp1(depth);
					}

					$.vibratoPhase = phase;
					$.vibratoDepth = depth;
					$.vibratoPhaseSpeed = speed;
					return block.length;
				}
			};

			// Generator
			jsfx.Module.Generator = {
				name: 'Generator',
				params: {
					// C = choose
					Func: {C: jsfx.G, D:'square'},

					A: {L: 0, H: 1, D: 0},
					B: {L: 0, H: 1, D: 0},

					ASlide: {L: -1, H: 1, D: 0},
					BSlide: {L: -1, H: 1, D: 0}
				},
				stage: stage.Generator,
				setup: function($, P){
					$.generatorPhase = 0;

					if(typeof P.Func === 'string'){
						$.generator = jsfx.G[P.Func];
					} else {
						$.generator = P.Func;
					}
					if(typeof $.generator === 'object'){
						$.generator = $.generator.create();
					}
					assert(typeof $.generator === 'function', 'generator must be a function')

					$.generatorA = P.A;
					$.generatorASlide = P.ASlide;
					$.generatorB = P.B;
					$.generatorBSlide = P.BSlide;
				},
				process: function($, block){
					return $.generator($, block);
				}
			};

			// Karplus Strong algorithm for string sound
			var GuitarBufferSize = 1 << 16;
			jsfx.Module.Guitar = {
				name: 'Guitar',
				params: {
					A: {L:0.0, H:1.0, D: 1},
					B: {L:0.0, H:1.0, D: 1},
					C: {L:0.0, H:1.0, D: 1},
				},
				stage: stage.Generator,
				setup: function($, P){
					$.guitarA = P.A;
					$.guitarB = P.B;
					$.guitarC = P.C;

					$.guitarBuffer = createFloatArray(GuitarBufferSize);
					$.guitarHead = 0;
					var B = $.guitarBuffer;
					for(var i = 0; i < B.length; i++){
						B[i] = random()*2 - 1;
					}
				},
				process: function($, block){
					var BS = GuitarBufferSize,
						BM = BS - 1;

					var A = +$.guitarA, B = +$.guitarB, C = +$.guitarC;
					var T = A + B + C;
					var h = $.guitarHead;

					var buffer = $.guitarBuffer;
					for(var i = 0; i < block.length; i++){
						// buffer size
						var n = (TAU / block[i])|0;
						n = n > BS ? BS : n;

						// tail
						var t = ((h - n) + BS) & BM;
						buffer[h] =
							(buffer[(t-0+BS)&BM]*A +
							 buffer[(t-1+BS)&BM]*B +
							 buffer[(t-2+BS)&BM]*C) / T;

						block[i] = buffer[h];
						h = (h + 1) & BM;
					}

					$.guitarHead = h;
					return block.length;
				}
			}

			// Low/High-Pass Filter
			jsfx.Module.Filter = {
				name: 'Filter',
				params: {
					LP:          {L: 0, H:1, D:1},
					LPSlide:     {L:-1, H:1, D:0},
					LPResonance: {L: 0, H:1, D:0},
					HP:          {L: 0, H:1, D:0},
					HPSlide:     {L:-1, H:1, D:0}
				},
				stage: stage.SampleMod + 0,
				setup: function($, P){
					$.FilterEnabled = (P.HP > EPSILON) || (P.LP < 1 - EPSILON);

					$.LPEnabled = P.LP < 1 - EPSILON;
					$.LP = pow(P.LP, 3.0) / 10;
					$.LPSlide = 1.0 + P.LPSlide * 100 / $.SampleRate;
					$.LPPos = 0;
					$.LPPosSlide = 0;

					$.LPDamping = 5.0 / (1.0 + pow(P.LPResonance, 2) * 20) * (0.01 + P.LP);
					$.LPDamping = 1.0 - Math.min($.LPDamping, 0.8);

					$.HP = pow(P.HP, 2.0) / 10;
					$.HPPos = 0;
					$.HPSlide = 1.0 + P.HPSlide * 100 / $.SampleRate;
				},
				enabled: function($){
					return $.FilterEnabled;
				},
				process: function($, block){
					if(!this.enabled($)){ return block.length; }

					var lp         = +$.LP;
					var lpPos      = +$.LPPos;
					var lpPosSlide = +$.LPPosSlide;
					var lpSlide    = +$.LPSlide;
					var lpDamping  = +$.LPDamping;
					var lpEnabled  = +$.LPEnabled;

					var hp      = +$.HP;
					var hpPos   = +$.HPPos;
					var hpSlide = +$.HPSlide;

					for(var i = 0; i < block.length; i++){
						if((hp > EPSILON) || (hp < -EPSILON)){
							hp *= hpSlide;
							hp = hp < EPSILON ? EPSILON: hp > 0.1 ? 0.1 : hp;
						}

						var lpPos_ = lpPos;

						lp *= lpSlide;
						lp = lp < 0 ? lp = 0 : lp > 0.1 ? 0.1 : lp;

						var sample = block[i];
						if(lpEnabled){
							lpPosSlide += (sample - lpPos) * lp;
							lpPosSlide *= lpDamping;
						} else {
							lpPos = sample;
							lpPosSlide = 0;
						}
						lpPos += lpPosSlide;

						hpPos += lpPos - lpPos_;
						hpPos *= 1.0 - hp;

						block[i] = hpPos;
					}

					$.LPPos = lpPos;
					$.LPPosSlide = lpPosSlide;
					$.LP = lp;
					$.HP = hp;
					$.HPPos = hpPos;

					return block.length;
				}
			};

			// Phaser Effect
			var PhaserBufferSize = 1 << 10;
			jsfx.Module.Phaser = {
				name: 'Phaser',
				params: {
					Offset: {L:-1, H:1, D:0},
					Sweep:  {L:-1, H:1, D:0}
				},
				stage: stage.SampleMod + 1,
				setup: function($, P){
					$.phaserBuffer = createFloatArray(PhaserBufferSize);
					$.phaserPos  = 0;
					$.phaserOffset = pow(P.Offset, 2.0) * (PhaserBufferSize - 4);
					$.phaserOffsetSlide = pow(P.Sweep, 3.0) * 4000 / $.SampleRate;
				},
				enabled: function($){
					return (abs($.phaserOffsetSlide) > EPSILON) ||
						(abs($.phaserOffset) > EPSILON);
				},
				process: function($, block){
					if(!this.enabled($)){ return block.length; }

					var BS = PhaserBufferSize,
						BM = BS - 1;

					var buffer = $.phaserBuffer,
						pos    = $.phaserPos|0,
						offset = +$.phaserOffset,
						offsetSlide = +$.phaserOffsetSlide;

					for(var i = 0; i < block.length; i++){
						offset += offsetSlide;
						//TODO: check whether this is correct
						if(offset < 0){
							offset = -offset;
							offsetSlide = -offsetSlide;
						}
						if(offset > BM){
							offset = BM;
							offsetSlide = 0;
						}

						buffer[pos] = block[i];
						var p = (pos - (offset|0) + BS) & BM;
						block[i] += buffer[p];

						pos = ((pos + 1) & BM)|0;
					}

					$.phaserPos = pos;
					$.phaserOffset = offset;
					return block.length;
				}
			};

			// Volume dynamic control with Attack-Sustain-Decay
			//   ATTACK  | 0              - Volume + Punch
			//   SUSTAIN | Volume + Punch - Volume
			//   DECAY   | Volume         - 0
			jsfx.Module.Volume = {
				name: 'Volume',
				params: {
					Master:  { L: 0, H: 1, D: 0.5 },
					Attack:  { L: 0.001, H: 1, D: 0.01 },
					Sustain: { L: 0, H: 2, D: 0.3 },
					Punch:   { L: 0, H: 3, D: 1.0 },
					Decay:   { L: 0.001, H: 2, D: 1.0 }
				},
				stage: stage.Volume,
				setup: function($, P){
					var SR = $.SampleRate;
					var V = P.Master;
					var VP = V * (1 + P.Punch);
					$.envelopes = [
						// S = start volume, E = end volume, N = duration in samples
						{S: 0, E: V, N: (P.Attack  * SR)|0 }, // Attack
						{S:VP, E: V, N: (P.Sustain * SR)|0 }, // Sustain
						{S: V, E: 0, N: (P.Decay   * SR)|0 }  // Decay
					];
					// G = volume gradient
					for(var i = 0; i < $.envelopes.length; i += 1){
						var e = $.envelopes[i];
						e.G = (e.E - e.S) / e.N;
					}
				},
				process: function($, block){
					var i = 0;
					while(($.envelopes.length > 0) && (i < block.length)){
						var E = $.envelopes[0];
						var vol = E.S,
							grad = E.G;

						var N = Math.min(block.length - i, E.N)|0;
						var end = (i+N)|0;
						for(; i < end; i += 1){
							block[i] *= vol;
							vol += grad;
							vol = clamp(vol, 0, 10);
						}
						E.S = vol;
						E.N -= N;
						if(E.N <= 0){
							$.envelopes.shift();
						}
					}
					return i;
				}
			};

			// PRESETS

			jsfx.DefaultModules = [
				jsfx.Module.Frequency,
				jsfx.Module.Vibrato,
				jsfx.Module.Generator,
				jsfx.Module.Filter,
				jsfx.Module.Phaser,
				jsfx.Module.Volume
			];
			jsfx.DefaultModules.sort(byStage);

			jsfx.EmptyParams = EmptyParams;
			function EmptyParams(){
				return map_object(jsfx.Module, function(){ return {} });
			}

			jsfx._RemoveEmptyParams = RemoveEmptyParams;
			function RemoveEmptyParams(params){
				for(var name in params){
					if(Object_keys(params[name]).length == 0){
						delete params[name];
					}
				}
			};

			jsfx.Preset = {
				Reset: function(){
					return EmptyParams();
				},
				Coin: function(){
					var p = EmptyParams();
					p.Frequency.Start = runif(880, 660);
					p.Volume.Sustain = runif(0.1);
					p.Volume.Decay = runif(0.4, 0.1);
					p.Volume.Punch = runif(0.3, 0.3);
					if(runif() < 0.5){
						p.Frequency.ChangeSpeed = runif(0.15, 0.1);
						p.Frequency.ChangeAmount = runif(8, 4);
					}
					RemoveEmptyParams(p);
					return p;
				},
				Laser: function(){
					var p = EmptyParams();
					p.Generator.Func = rchoose(['square', 'saw', 'sine']);

					if(runif() < 0.33){
						p.Frequency.Start = runif(880, 440);
						p.Frequency.Min = runif(0.1);
						p.Frequency.Slide = runif(0.3, -0.8);
					} else {
						p.Frequency.Start = runif(1200, 440);
						p.Frequency.Min = p.Frequency.Start - runif(880, 440);
						if(p.Frequency.Min < 110){ p.Frequency.Min = 110; }
						p.Frequency.Slide = runif(0.3, -1);
					}

					if(runif() < 0.5){
						p.Generator.A = runif(0.5);
						p.Generator.ASlide = runif(0.2);
					} else {
						p.Generator.A = runif(0.5, 0.4);
						p.Generator.ASlide = runif(0.7);
					}

					p.Volume.Sustain = runif(0.2, 0.1);
					p.Volume.Decay   = runif(0.4);
					if(runif() < 0.5){
						p.Volume.Punch = runif(0.3);
					}
					if(runif() < 0.33){
						p.Phaser.Offset = runif(0.2);
						p.Phaser.Sweep = runif(0.2);
					}
					if(runif() < 0.5){
						p.Filter.HP = runif(0.3);
					}
					RemoveEmptyParams(p);
					return p;
				},
				Explosion: function(){
					var p = EmptyParams();
					p.Generator.Func = 'noise';
					if(runif() < 0.5){
						p.Frequency.Start = runif(440, 40);
						p.Frequency.Slide = runif(0.4, -0.1);
					} else {
						p.Frequency.Start = runif(1600, 220);
						p.Frequency.Slide = runif(-0.2, -0.2);
					}

					if(runif() < 0.2){ p.Frequency.Slide = 0; }
					if(runif() < 0.3){ p.Frequency.RepeatSpeed = runif(0.5, 0.3); }

					p.Volume.Sustain = runif(0.3, 0.1);
					p.Volume.Decay   = runif(0.5);
					p.Volume.Punch   = runif(0.6, 0.2);

					if(runif() < 0.5){
						p.Phaser.Offset = runif(0.9, -0.3);
						p.Phaser.Sweep  = runif(-0.3);
					}

					if(runif() < 0.33){
						p.Frequency.ChangeSpeed = runif(0.3, 0.6);
						p.Frequency.ChangeAmount = runif(24, -12);
					}
					RemoveEmptyParams(p);
					return p;
				},
				Powerup: function(){
					var p = EmptyParams();
					if(runif() < 0.5){
						p.Generator.Func = 'saw';
					} else {
						p.Generator.A = runif(0.6);
					}

					p.Frequency.Start = runif(220, 440);
					if(runif() < 0.5){
						p.Frequency.Slide = runif(0.5, 0.2);
						p.Frequency.RepeatSpeed = runif(0.4, 0.4);
					} else {
						p.Frequency.Slide = runif(0.2, 0.05);
						if(runif() < 0.5){
							p.Vibrato.Depth = runif(0.6, 0.1);
							p.Vibrato.Frequency = runif(30, 10);
						}
					}

					p.Volume.Sustain = runif(0.4);
					p.Volume.Decay = runif(0.4, 0.1);

					RemoveEmptyParams(p);
					return p;
				},
				Hit: function(){
					var p = EmptyParams();
					p.Generator.Func = rchoose(['square', 'saw', 'noise']);
					p.Generator.A = runif(0.6);
					p.Generator.ASlide = runif(1, -0.5);

					p.Frequency.Start = runif(880, 220);
					p.Frequency.Slide = -runif(0.4, 0.3);

					p.Volume.Sustain = runif(0.1);
					p.Volume.Decay = runif(0.2, 0.1);

					if(runif() < 0.5){
						p.Filter.HP = runif(0.3);
					}

					RemoveEmptyParams(p);
					return p;
				},
				Jump: function(){
					var p = EmptyParams();
					p.Generator.Func = 'square';
					p.Generator.A = runif(0.6);

					p.Frequency.Start = runif(330, 330);
					p.Frequency.Slide = runif(0.4, 0.2);

					p.Volume.Sustain = runif(0.3, 0.1);
					p.Volume.Decay = runif(0.2, 0.1);

					if(runif() < 0.5){
						p.Filter.HP = runif(0.3);
					}
					if(runif() < 0.3){
						p.Filter.LP = runif(-0.6, 1);
					}

					RemoveEmptyParams(p);
					return p;
				},
				Select: function(){
					var p = EmptyParams();
					p.Generator.Func = rchoose(['square', 'saw']);
					p.Generator.A = runif(0.6);

					p.Frequency.Start = runif(660, 220);

					p.Volume.Sustain = runif(0.1, 0.1);
					p.Volume.Decay   = runif(0.2);

					p.Filter.HP = 0.2;
					RemoveEmptyParams(p);
					return p;
				},
				Lucky: function(){
					var p = EmptyParams();
					map_object(p, function(out, moduleName){
						var defs = jsfx.Module[moduleName].params;
						map_object(defs, function(def, name){
							if(def.C){
								var values = Object_keys(def.C);
								out[name] = values[(values.length * random()) | 0];
							} else {
								out[name] = random() * (def.H - def.L) + def.L;
							}
						});
					});
					p.Volume.Master = 0.4;
					p.Filter = {}; // disable filter, as it usually will clip everything
					RemoveEmptyParams(p);
					return p;
				}
			};

			// GENERATORS

			// uniform noise
			jsfx.G.unoise = newGenerator("sample = Math.random();");
			// sine wave
			jsfx.G.sine = newGenerator("sample = Math.sin(phase);");
			// saw wave
			jsfx.G.saw = newGenerator("sample = 2*(phase/TAU - ((phase/TAU + 0.5)|0));");
			// triangle wave
			jsfx.G.triangle = newGenerator("sample = Math.abs(4 * ((phase/TAU - 0.25)%1) - 2) - 1;");
			// square wave
			jsfx.G.square = newGenerator("var s = Math.sin(phase); sample = s > A ? 1.0 : s < A ? -1.0 : A;");
			// simple synth
			jsfx.G.synth = newGenerator("sample = Math.sin(phase) + .5*Math.sin(phase/2) + .3*Math.sin(phase/4);");

			// STATEFUL
			var __noiseLast = 0;
			jsfx.G.noise = newGenerator("if(phase % TAU < 4){__noiseLast = Math.random() * 2 - 1;} sample = __noiseLast;");

			// Karplus-Strong string
			jsfx.G.string = {
				create: function(){
					var BS = 1 << 16;
					var BM = BS-1;

					var buffer = createFloatArray(BS);
					for(var i = 0; i < buffer.length; i++){
						buffer[i] = random()*2-1;
					}

					var head = 0;
					return function($, block){
						var TAU = Math.PI * 2;
						var A = +$.generatorA, ASlide = +$.generatorASlide,
							B = +$.generatorB, BSlide = +$.generatorBSlide;
						var buf = buffer;

						for(var i = 0; i < block.length; i++){
							var phaseSpeed = block[i];
							var n = (TAU/phaseSpeed)|0;
							A += ASlide; B += BSlide;
							A = A < 0 ? 0 : A > 1 ? 1 : A;
							B = B < 0 ? 0 : B > 1 ? 1 : B;

							var t = ((head - n) + BS) & BM;
							var sample = (
								buf[(t-0+BS)&BM]*1 +
								buf[(t-1+BS)&BM]*A +
								buf[(t-2+BS)&BM]*B) / (1+A+B);

							buf[head] = sample;
							block[i] = buf[head];
							head = (head + 1) & BM;
						}

						$.generatorA = A;
						$.generatorB = B;
						return block.length;
					}
				}
			};

			// Generates samples using given frequency and generator
			function newGenerator(line){
				return new Function("$", "block", "" +
					"var TAU = Math.PI * 2;\n" +
					"var sample;\n" +
					"var phase = +$.generatorPhase,\n"+
					"	A = +$.generatorA, ASlide = +$.generatorASlide,\n"+
					"	B = +$.generatorB, BSlide = +$.generatorBSlide;\n"+
					"\n"+
					"for(var i = 0; i < block.length; i++){\n"+
					"	var phaseSpeed = block[i];\n"+
					"	phase += phaseSpeed;\n"+
					"	if(phase > TAU){ phase -= TAU };\n"+
					"	A += ASlide; B += BSlide;\n"+
					"   A = A < 0 ? 0 : A > 1 ? 1 : A;\n"+
					"   B = B < 0 ? 0 : B > 1 ? 1 : B;\n"+
					line +
					"	block[i] = sample;\n"+
					"}\n"+
					"\n"+
					"$.generatorPhase = phase;\n"+
					"$.generatorA = A;\n"+
					"$.generatorB = B;\n"+
					"return block.length;\n" +
				"");
			}

			// WAVE SUPPORT

			// Creates an Audio element from audio data [-1.0 .. 1.0]
			jsfx.CreateAudio = CreateAudio;
			function CreateAudio(data){
				if(typeof Float32Array !== "undefined"){
					assert(data instanceof Float32Array, 'data must be an Float32Array');
				}

				var blockAlign = numChannels * bitsPerSample >> 3;
				var byteRate = jsfx.SampleRate * blockAlign;

				var output = createByteArray(8 + 36 + data.length * 2);
				var p = 0;

				// emits string to output
				function S(value){
					for(var i = 0; i < value.length; i += 1){
						output[p] = value.charCodeAt(i); p++;
					}
				}

				// emits integer value to output
				function V(value, nBytes){
					if(nBytes <= 0){ return; }
					output[p] = value & 0xFF; p++;
					V(value >> 8, nBytes - 1);
				}

				S('RIFF'); V(36 + data.length * 2, 4);

				S('WAVEfmt '); V(16, 4); V(1, 2);
				V(numChannels, 2); V(jsfx.SampleRate, 4);
				V(byteRate, 4); V(blockAlign, 2); V(bitsPerSample, 2);

				S('data'); V(data.length * 2, 4);
				CopyFToU8(output.subarray(p), data);

				return new Audio('data:audio/wav;base64,' + U8ToB64(output));
			};

			jsfx.DownloadAsFile = function(audio){
				assert(audio instanceof Audio, 'input must be an Audio object');
				document.location.href = audio.src;
			};

			// HELPERS
			jsfx.Util = {};

			// Copies array of Floats to a Uint8Array with 16bits per sample
			jsfx.Util.CopyFToU8 = CopyFToU8;
			function CopyFToU8(into, floats){
				assert(into.length/2 == floats.length,
					'the target buffer must be twice as large as the iinput');

				var k = 0;
				for(var i = 0; i < floats.length; i++){
					var v = +floats[i];
					var	a = (v * 0x7FFF)|0;
					a = a < -0x8000 ? -0x8000 : 0x7FFF < a ? 0x7FFF : a;
					a += a < 0 ? 0x10000 : 0;
					into[k] = a & 0xFF; k++;
					into[k] = a >> 8; k++;
				}
			}

			function U8ToB64(data){
				var CHUNK = 0x8000;
				var result = '';
				for(var start = 0; start < data.length; start += CHUNK){
					var end = Math.min(start + CHUNK, data.length);
					result += String.fromCharCode.apply(null, data.subarray(start, end));
				}
				return btoa(result);
			}

			// uses AudioContext sampleRate or 44100;
			function getDefaultSampleRate(){
				if(typeof AudioContext !== 'undefined'){
					return (new AudioContext()).sampleRate;
				}
				return 44100;
			}

			// for checking pre/post conditions
			function assert(condition, message){
				if(!condition){ throw new Error(message); }
			}

			function clamp(v, min, max){
				v = +v; min = +min; max = +max;
				if(v < min){ return +min; }
				if(v > max){ return +max; }
				return +v;
			}

			function clamp1(v){
				v = +v;
				if(v < +0.0){ return +0.0; }
				if(v > +1.0){ return +1.0; }
				return +v;
			}

			function map_object(obj, fn){
				var r = {};
				for(var name in obj){
					if(obj.hasOwnProperty(name)){
						r[name] = fn(obj[name], name);
					}
				}
				return r;
			}

			// uniform random
			function runif(scale, offset){
				var a = random();
		        if(scale !== undefined)
		            a *= scale;
		        if(offset !== undefined)
		            a += offset;
		        return a;
			}

			function rchoose(gens){
				return gens[(gens.length*random())|0];
			}

			function Object_keys(obj){
				var r = [];
				for(var name in obj){ r.push(name); }
				return r;
			}

			jsfx._createFloatArray = createFloatArray;
			function createFloatArray(N){
				if(typeof Float32Array === "undefined") {
					var r = new Array(N);
					for(var i = 0; i < r.length; i++){
						r[i] = 0.0;
					}
				}
				return new Float32Array(N);
			}

			function createByteArray(N){
				if(typeof Uint8Array === "undefined") {
					var r = new Array(N);
					for(var i = 0; i < r.length; i++){
						r[i] = 0|0;
					}
				}
				return new Uint8Array(N);
			}
			
			var randomFunc = Math.random;
			jsfx.setRandomFunc = function(func) {
				randomFunc = func;
			}
			
			function random() {
				return randomFunc();
			}
		})(jsfx = {});
		module.exports = jsfx;


	/***/ }
	/******/ ])
	});
	;

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	(function webpackUniversalModuleDefinition(root, factory) {
		if(true)
			module.exports = factory();
		else if(typeof define === 'function' && define.amd)
			define([], factory);
		else if(typeof exports === 'object')
			exports["pag"] = factory();
		else
			root["pag"] = factory();
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

		module.exports = __webpack_require__(3);


	/***/ },
	/* 1 */,
	/* 2 */,
	/* 3 */
	/***/ function(module, exports) {

		"use strict";
		exports.defaultOptions = {
		    isMirrorX: false,
		    isMirrorY: false,
		    seed: 0,
		    hue: null,
		    saturation: 0.8,
		    value: 1,
		    rotationNum: 1,
		    scale: 1,
		    scaleX: null,
		    scaleY: null,
		    colorNoise: 0.1,
		    colorLighting: 1,
		    edgeDarkness: 0.4,
		    isShowingEdge: true,
		    isShowingBody: true,
		};
		var generatedPixels = {};
		var seed = 0;
		function setSeed(_seed) {
		    if (_seed === void 0) { _seed = 0; }
		    seed = _seed;
		}
		exports.setSeed = setSeed;
		function generate(patterns, _options) {
		    if (_options === void 0) { _options = {}; }
		    _options.baseSeed = seed;
		    var jso = JSON.stringify({ patterns: patterns, options: _options });
		    if (generatedPixels[jso]) {
		        return generatedPixels[jso];
		    }
		    var options = {};
		    forOwn(exports.defaultOptions, function (v, k) {
		        options[k] = v;
		    });
		    forOwn(_options, function (v, k) {
		        options[k] = v;
		    });
		    var random = new Random();
		    var rndSeed = seed + getHashFromString(patterns.join());
		    if (options.seed != null) {
		        rndSeed += options.seed;
		    }
		    random.setSeed(rndSeed);
		    if (options.hue == null) {
		        options.hue = random.get01();
		    }
		    if (options.scaleX == null) {
		        options.scaleX = options.scale;
		    }
		    if (options.scaleY == null) {
		        options.scaleY = options.scale;
		    }
		    var pixels = generatePixels(patterns, options, random);
		    var result;
		    if (options.rotationNum > 1) {
		        result = map(createRotated(pixels, options.rotationNum), function (p) {
		            return createColored(p, options);
		        });
		    }
		    else {
		        result = [createColored(pixels, options)];
		    }
		    generatedPixels[jso] = result;
		    return result;
		}
		exports.generate = generate;
		var Pixel = (function () {
		    function Pixel() {
		        this.r = 0;
		        this.g = 0;
		        this.b = 0;
		        this.isEmpty = true;
		    }
		    Pixel.prototype.setFromHsv = function (hue, saturation, value) {
		        this.isEmpty = false;
		        this.r = value;
		        this.g = value;
		        this.b = value;
		        var h = hue * 6;
		        var i = Math.floor(h);
		        var f = h - i;
		        switch (i) {
		            case 0:
		                this.g *= 1 - saturation * (1 - f);
		                this.b *= 1 - saturation;
		                break;
		            case 1:
		                this.b *= 1 - saturation;
		                this.r *= 1 - saturation * f;
		                break;
		            case 2:
		                this.b *= 1 - saturation * (1 - f);
		                this.r *= 1 - saturation;
		                break;
		            case 3:
		                this.r *= 1 - saturation;
		                this.g *= 1 - saturation * f;
		                break;
		            case 4:
		                this.r *= 1 - saturation * (1 - f);
		                this.g *= 1 - saturation;
		                break;
		            case 5:
		                this.g *= 1 - saturation;
		                this.b *= 1 - saturation * f;
		                break;
		        }
		        this.setStyle();
		    };
		    Pixel.prototype.setStyle = function () {
		        var r = Math.floor(this.r * 255);
		        var g = Math.floor(this.g * 255);
		        var b = Math.floor(this.b * 255);
		        this.style = "rgb(" + r + "," + g + "," + b + ")";
		    };
		    return Pixel;
		}());
		exports.Pixel = Pixel;
		function generatePixels(patterns, options, random) {
		    var pw = reduce(patterns, function (w, p) { return Math.max(w, p.length); }, 0);
		    var ph = patterns.length;
		    var w = Math.round(pw * options.scaleX);
		    var h = Math.round(ph * options.scaleY);
		    w += options.isMirrorX ? 1 : 2;
		    h += options.isMirrorY ? 1 : 2;
		    var pixels = createPixels(patterns, pw, ph, w, h, options.scaleX, options.scaleY, random);
		    if (options.isMirrorX) {
		        pixels = mirrorX(pixels, w, h);
		        w *= 2;
		    }
		    if (options.isMirrorY) {
		        pixels = mirrorY(pixels, w, h);
		        h *= 2;
		    }
		    pixels = createEdge(pixels, w, h);
		    return pixels;
		}
		function createPixels(patterns, pw, ph, w, h, scaleX, scaleY, random) {
		    return timesMap(w, function (x) {
		        var px = Math.floor((x - 1) / scaleX);
		        return timesMap(h, function (y) {
		            var py = Math.floor((y - 1) / scaleY);
		            if (px < 0 || px >= pw || py < 0 || py >= ph) {
		                return 0;
		            }
		            var c = px < patterns[py].length ? patterns[py][px] : ' ';
		            var m = 0;
		            if (c === '-') {
		                m = random.get01() < 0.5 ? 1 : 0;
		            }
		            else if (c === 'x' || c === 'X') {
		                m = random.get01() < 0.5 ? 1 : -1;
		            }
		            else if (c === 'o' || c === 'O') {
		                m = -1;
		            }
		            else if (c === '*') {
		                m = 1;
		            }
		            return m;
		        });
		    });
		}
		function mirrorX(pixels, w, h) {
		    return timesMap(w * 2, function (x) { return timesMap(h, function (y) {
		        return x < w ? pixels[x][y] : pixels[w * 2 - x - 1][y];
		    }); });
		}
		function mirrorY(pixels, w, h) {
		    return timesMap(w, function (x) { return timesMap(h * 2, function (y) {
		        return y < h ? pixels[x][y] : pixels[x][h * 2 - y - 1];
		    }); });
		}
		function createEdge(pixels, w, h) {
		    return timesMap(w, function (x) { return timesMap(h, function (y) {
		        return ((pixels[x][y] === 0 &&
		            ((x - 1 >= 0 && pixels[x - 1][y] > 0) ||
		                (x + 1 < w && pixels[x + 1][y] > 0) ||
		                (y - 1 >= 0 && pixels[x][y - 1] > 0) ||
		                (y + 1 < h && pixels[x][y + 1] > 0))) ?
		            -1 : pixels[x][y]);
		    }); });
		}
		function createRotated(pixels, rotationNum) {
		    var pw = pixels.length;
		    var ph = pixels[0].length;
		    var pcx = pw / 2;
		    var pcy = ph / 2;
		    var w = Math.round(pw * 1.5 / 2) * 2;
		    var h = Math.round(ph * 1.5 / 2) * 2;
		    var cx = w / 2;
		    var cy = h / 2;
		    var offset = { x: 0, y: 0 };
		    return timesMap(rotationNum, function (ai) {
		        var angle = -ai * Math.PI * 2 / rotationNum;
		        return timesMap(w, function (x) { return timesMap(h, function (y) {
		            offset.x = x - cx;
		            offset.y = y - cy;
		            rotateVector(offset, angle);
		            var px = Math.round(offset.x + pcx);
		            var py = Math.round(offset.y + pcy);
		            return (px < 0 || px >= pw || py < 0 || py >= ph) ?
		                0 : pixels[px][py];
		        }); });
		    });
		}
		function rotateVector(v, angle) {
		    var vx = v.x;
		    v.x = Math.cos(angle) * vx - Math.sin(angle) * v.y;
		    v.y = Math.sin(angle) * vx + Math.cos(angle) * v.y;
		}
		function createColored(pixels, options) {
		    var w = pixels.length;
		    var h = pixels[0].length;
		    var random = new Random();
		    random.setSeed(options.seed);
		    return timesMap(w, function (x) { return timesMap(h, function (y) {
		        var p = pixels[x][y];
		        if ((p === 1 && !options.isShowingBody) ||
		            (p === -1 && !options.isShowingEdge)) {
		            return new Pixel();
		        }
		        if (p !== 0) {
		            var l = Math.sin(y / h * Math.PI) * options.colorLighting +
		                (1 - options.colorLighting);
		            var v = (l * (1 - options.colorNoise) +
		                random.get01() * options.colorNoise) * options.value;
		            v = v >= 0 ? (v <= 1 ? v : 1) : 0;
		            if (p === -1) {
		                v *= (1 - options.edgeDarkness);
		            }
		            var px = new Pixel();
		            px.setFromHsv(options.hue, options.saturation, v);
		            return px;
		        }
		        else {
		            return new Pixel();
		        }
		    }); });
		}
		function getHashFromString(str) {
		    var hash = 0;
		    var len = str.length;
		    for (var i = 0; i < len; i++) {
		        var chr = str.charCodeAt(i);
		        hash = ((hash << 5) - hash) + chr;
		        hash |= 0;
		    }
		    return hash;
		}
		function nArray(n, v) {
		    var a = [];
		    for (var i = 0; i < n; i++) {
		        a.push(v);
		    }
		    return a;
		}
		function times(n, func) {
		    for (var i = 0; i < n; i++) {
		        func(i);
		    }
		}
		function timesMap(n, func) {
		    var result = [];
		    for (var i = 0; i < n; i++) {
		        result.push(func(i));
		    }
		    return result;
		}
		function forEach(array, func) {
		    for (var i = 0; i < array.length; i++) {
		        func(array[i]);
		    }
		}
		function forOwn(obj, func) {
		    for (var p in obj) {
		        func(obj[p], p);
		    }
		}
		function map(array, func) {
		    var result = [];
		    for (var i = 0; i < array.length; i++) {
		        result.push(func(array[i], i));
		    }
		    return result;
		}
		function reduce(array, func, initValue) {
		    var result = initValue;
		    for (var i = 0; i < array.length; i++) {
		        result = func(result, array[i], i);
		    }
		    return result;
		}
		var Random = (function () {
		    function Random() {
		        this.setSeed();
		        this.get01 = this.get01.bind(this);
		    }
		    Random.prototype.setSeed = function (v) {
		        if (v === void 0) { v = -0x7fffffff; }
		        if (v === -0x7fffffff) {
		            v = Math.floor(Math.random() * 0x7fffffff);
		        }
		        this.x = v = 1812433253 * (v ^ (v >> 30));
		        this.y = v = 1812433253 * (v ^ (v >> 30)) + 1;
		        this.z = v = 1812433253 * (v ^ (v >> 30)) + 2;
		        this.w = v = 1812433253 * (v ^ (v >> 30)) + 3;
		        return this;
		    };
		    Random.prototype.getInt = function () {
		        var t = this.x ^ (this.x << 11);
		        this.x = this.y;
		        this.y = this.z;
		        this.z = this.w;
		        this.w = (this.w ^ (this.w >> 19)) ^ (t ^ (t >> 8));
		        return this.w;
		    };
		    Random.prototype.get01 = function () {
		        return this.getInt() / 0x7fffffff;
		    };
		    return Random;
		}());


	/***/ }
	/******/ ])
	});
	;

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	(function webpackUniversalModuleDefinition(root, factory) {
		if(true)
			module.exports = factory();
		else if(typeof define === 'function' && define.amd)
			define([], factory);
		else if(typeof exports === 'object')
			exports["ppe"] = factory();
		else
			root["ppe"] = factory();
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
		    scaleRatio: 1,
		    canvas: null
		};
		var emitters = {};
		var seed = 0;
		var context;
		// emit the particle.
		// specify the type with the first character of the patternName
		// (e: explosion, m: muzzle, s: spark, t: trail, j: jet)
		function emit(patternName, x, y, angle, sizeScale, countScale, hue) {
		    if (angle === void 0) { angle = 0; }
		    if (sizeScale === void 0) { sizeScale = 1; }
		    if (countScale === void 0) { countScale = 1; }
		    if (hue === void 0) { hue = null; }
		    if (emitters[patternName] == null) {
		        var random_1 = new Random();
		        random_1.setSeed(seed + getHashFromString(patternName));
		        emitters[patternName] = new Emitter(patternName[0], sizeScale, countScale, hue, random_1);
		    }
		    emitters[patternName].emit(x, y, angle);
		}
		exports.emit = emit;
		function update() {
		    Particle.update();
		}
		exports.update = update;
		function getParticles() {
		    return Particle.s;
		}
		exports.getParticles = getParticles;
		function setSeed(_seed) {
		    if (_seed === void 0) { _seed = 0; }
		    seed = _seed;
		}
		exports.setSeed = setSeed;
		function reset() {
		    emitters = {};
		    Particle.s = [];
		}
		exports.reset = reset;
		var Emitter = (function () {
		    function Emitter(patternType, sizeScale, countScale, hue, random) {
		        if (sizeScale === void 0) { sizeScale = 1; }
		        if (countScale === void 0) { countScale = 1; }
		        if (hue === void 0) { hue = null; }
		        this.base = new Particle();
		        this.angleDeflection = 0;
		        this.speedDeflection = 0.5;
		        this.sizeDeflection = 0.5;
		        this.ticksDeflection = 0.3;
		        this.count = 1;
		        if (hue == null) {
		            hue = random.get01();
		        }
		        switch (patternType) {
		            case 'e':
		                this.base.speed = 0.7;
		                this.base.slowdownRatio = 0.05;
		                this.base.targetSize = 10;
		                this.base.beginColor = new Color(hue, 1, 0.5, 0.3);
		                this.base.middleColor = new Color(hue, 0.2, 1, 0.1);
		                this.base.endColor = new Color(hue, 0, 0, 0);
		                this.base.middleTicks = 20;
		                this.base.endTicks = 30;
		                this.angleDeflection = Math.PI * 2;
		                this.count = 15;
		                break;
		            case 'm':
		            case 's':
		                this.base.speed = patternType === 'm' ? 1.5 : 0.5;
		                this.base.slowdownRatio = 0.025;
		                this.base.targetSize = 5;
		                this.base.beginColor = new Color(hue, 0.5, 0.5, 0.3);
		                this.base.middleColor = new Color(hue, 1, 1, 0.3);
		                this.base.endColor = new Color(hue, 0.75, 0.75, 0.2);
		                this.base.middleTicks = 10;
		                this.base.endTicks = 20;
		                this.angleDeflection = patternType === 'm' ?
		                    0.3 * random.getForParam() : Math.PI * 2;
		                this.count = 10;
		                break;
		            case 't':
		            case 'j':
		                this.base.speed = patternType === 't' ? 0.1 : 1;
		                this.base.slowdownRatio = 0.03;
		                this.base.targetSize = patternType === 't' ? 3 : 7;
		                this.base.beginColor = new Color(hue, 0.7, 0.7, 0.4);
		                this.base.middleColor = new Color(hue, 1, 1, 0.2);
		                this.base.endColor = new Color(hue, 0.7, 0.7, 0.1);
		                this.base.middleTicks = patternType === 't' ? 30 : 15;
		                this.base.endTicks = patternType === 't' ? 40 : 20;
		                this.angleDeflection = 0.5 * random.getForParam();
		                this.speedDeflection = 0.1;
		                this.sizeDeflection = 0.1;
		                this.ticksDeflection = 0.1;
		                this.count = 0.5;
		                break;
		        }
		        this.base.speed *= sizeScale * exports.options.scaleRatio;
		        this.base.targetSize *= sizeScale * exports.options.scaleRatio;
		        this.count *= countScale;
		        this.base.speed *= random.getForParam();
		        this.base.slowdownRatio *= random.getForParam();
		        this.base.targetSize *= random.getForParam();
		        var em = this.base.endTicks - this.base.middleTicks;
		        this.base.middleTicks *= random.getForParam();
		        this.base.endTicks = this.base.middleTicks + em * random.getForParam();
		        this.speedDeflection *= random.getForParam();
		        this.sizeDeflection *= random.getForParam();
		        this.ticksDeflection *= random.getForParam();
		        this.count *= random.getForParam();
		    }
		    Emitter.prototype.emit = function (x, y, angle) {
		        if (angle === void 0) { angle = 0; }
		        if (this.count < 1 && this.count < Math.random()) {
		            return;
		        }
		        for (var i = 0; i < this.count; i++) {
		            var p = new Particle();
		            p.pos.x = x;
		            p.pos.y = y;
		            p.angle = angle + (Math.random() - 0.5) * this.angleDeflection;
		            p.speed = this.base.speed *
		                ((Math.random() * 2 - 1) * this.speedDeflection + 1);
		            p.slowdownRatio = this.base.slowdownRatio;
		            p.targetSize = this.base.targetSize *
		                ((Math.random() * 2 - 1) * this.sizeDeflection + 1);
		            p.middleTicks = this.base.middleTicks *
		                ((Math.random() * 2 - 1) * this.ticksDeflection + 1);
		            p.endTicks = this.base.endTicks *
		                ((Math.random() * 2 - 1) * this.ticksDeflection + 1);
		            p.beginColor = this.base.beginColor;
		            p.middleColor = this.base.middleColor;
		            p.endColor = this.base.endColor;
		            Particle.s.push(p);
		        }
		    };
		    return Emitter;
		}());
		exports.Emitter = Emitter;
		var Particle = (function () {
		    function Particle() {
		        this.pos = new Vector();
		        this.size = 0;
		        this.angle = 0;
		        this.speed = 1;
		        this.slowdownRatio = 0.01;
		        this.targetSize = 10;
		        this.middleTicks = 20;
		        this.endTicks = 60;
		        this.ticks = 0;
		    }
		    Particle.prototype.update = function () {
		        this.pos.x += Math.cos(this.angle) * this.speed;
		        this.pos.y += Math.sin(this.angle) * this.speed;
		        this.speed *= (1 - this.slowdownRatio);
		        if (this.ticks >= this.endTicks) {
		            return false;
		        }
		        if (this.ticks < this.middleTicks) {
		            this.color = this.beginColor.getLerped(this.middleColor, this.ticks / this.middleTicks);
		            this.size += (this.targetSize - this.size) * 0.1;
		        }
		        else {
		            this.color = this.middleColor.getLerped(this.endColor, (this.ticks - this.middleTicks) / (this.endTicks - this.middleTicks));
		            this.size *= 0.95;
		        }
		        this.color = this.color.getSparkled();
		        if (context != null) {
		            context.fillStyle = this.color.getStyle();
		            context.fillRect(this.pos.x - this.size / 2, this.pos.y - this.size / 2, this.size, this.size);
		        }
		        this.ticks++;
		    };
		    Particle.update = function () {
		        if (context == null && exports.options.canvas != null) {
		            context = exports.options.canvas.getContext('2d');
		        }
		        for (var i = 0; i < Particle.s.length;) {
		            if (Particle.s[i].update() === false) {
		                Particle.s.splice(i, 1);
		            }
		            else {
		                i++;
		            }
		        }
		    };
		    Particle.s = [];
		    return Particle;
		}());
		exports.Particle = Particle;
		var Vector = (function () {
		    function Vector(x, y) {
		        if (x === void 0) { x = 0; }
		        if (y === void 0) { y = 0; }
		        this.x = x;
		        this.y = y;
		    }
		    return Vector;
		}());
		exports.Vector = Vector;
		var Color = (function () {
		    function Color(hue, saturation, value, sparkleRatio) {
		        if (hue === void 0) { hue = 0; }
		        if (saturation === void 0) { saturation = 1; }
		        if (value === void 0) { value = 1; }
		        if (sparkleRatio === void 0) { sparkleRatio = 0; }
		        this.hue = hue;
		        this.saturation = saturation;
		        this.value = value;
		        this.sparkleRatio = sparkleRatio;
		        this.r = 0;
		        this.g = 0;
		        this.b = 0;
		        this.r = value;
		        this.g = value;
		        this.b = value;
		        var h = hue * 6;
		        var i = Math.floor(h);
		        var f = h - i;
		        switch (i) {
		            case 0:
		                this.g *= 1 - saturation * (1 - f);
		                this.b *= 1 - saturation;
		                break;
		            case 1:
		                this.b *= 1 - saturation;
		                this.r *= 1 - saturation * f;
		                break;
		            case 2:
		                this.b *= 1 - saturation * (1 - f);
		                this.r *= 1 - saturation;
		                break;
		            case 3:
		                this.r *= 1 - saturation;
		                this.g *= 1 - saturation * f;
		                break;
		            case 4:
		                this.r *= 1 - saturation * (1 - f);
		                this.g *= 1 - saturation;
		                break;
		            case 5:
		                this.g *= 1 - saturation;
		                this.b *= 1 - saturation * f;
		                break;
		        }
		    }
		    Color.prototype.getStyle = function () {
		        var r = Math.floor(this.r * 255);
		        var g = Math.floor(this.g * 255);
		        var b = Math.floor(this.b * 255);
		        return "rgb(" + r + "," + g + "," + b + ")";
		    };
		    Color.prototype.getSparkled = function () {
		        if (this.sparkled == null) {
		            this.sparkled = new Color();
		        }
		        this.sparkled.r = clamp(this.r + this.sparkleRatio * (Math.random() * 2 - 1));
		        this.sparkled.g = clamp(this.g + this.sparkleRatio * (Math.random() * 2 - 1));
		        this.sparkled.b = clamp(this.b + this.sparkleRatio * (Math.random() * 2 - 1));
		        return this.sparkled;
		    };
		    Color.prototype.getLerped = function (other, ratio) {
		        if (this.lerped == null) {
		            this.lerped = new Color();
		        }
		        this.lerped.r = this.r * (1 - ratio) + other.r * ratio;
		        this.lerped.g = this.g * (1 - ratio) + other.g * ratio;
		        this.lerped.b = this.b * (1 - ratio) + other.b * ratio;
		        this.lerped.sparkleRatio =
		            this.sparkleRatio * (1 - ratio) + other.sparkleRatio * ratio;
		        return this.lerped;
		    };
		    return Color;
		}());
		exports.Color = Color;
		function getHashFromString(str) {
		    var hash = 0;
		    var len = str.length;
		    for (var i = 0; i < len; i++) {
		        var chr = str.charCodeAt(i);
		        hash = ((hash << 5) - hash) + chr;
		        hash |= 0;
		    }
		    return hash;
		}
		function clamp(v) {
		    if (v <= 0) {
		        return 0;
		    }
		    else if (v >= 1) {
		        return 1;
		    }
		    else {
		        return v;
		    }
		}
		var Random = (function () {
		    function Random() {
		        this.setSeed();
		        this.get01 = this.get01.bind(this);
		    }
		    Random.prototype.setSeed = function (v) {
		        if (v === void 0) { v = -0x7fffffff; }
		        if (v === -0x7fffffff) {
		            v = Math.floor(Math.random() * 0x7fffffff);
		        }
		        this.x = v = 1812433253 * (v ^ (v >> 30));
		        this.y = v = 1812433253 * (v ^ (v >> 30)) + 1;
		        this.z = v = 1812433253 * (v ^ (v >> 30)) + 2;
		        this.w = v = 1812433253 * (v ^ (v >> 30)) + 3;
		        return this;
		    };
		    Random.prototype.getInt = function () {
		        var t = this.x ^ (this.x << 11);
		        this.x = this.y;
		        this.y = this.z;
		        this.z = this.w;
		        this.w = (this.w ^ (this.w >> 19)) ^ (t ^ (t >> 8));
		        return this.w;
		    };
		    Random.prototype.get01 = function () {
		        return this.getInt() / 0x7fffffff;
		    };
		    Random.prototype.getForParam = function () {
		        return this.get01() + 0.5;
		    };
		    return Random;
		}());


	/***/ }
	/******/ ])
	});
	;

/***/ },
/* 8 */
/***/ function(module, exports) {

	"use strict";
	var dotPatterns;
	var charToIndex;
	var context;
	function init(_context) {
	    context = _context;
	    var letterCount = 66;
	    var letterPatterns = [
	        0x4644AAA4, 0x6F2496E4, 0xF5646949, 0x167871F4, 0x2489F697,
	        0xE9669696, 0x79F99668, 0x91967979, 0x1F799976, 0x1171FF17,
	        0xF99ED196, 0xEE444E99, 0x53592544, 0xF9F11119, 0x9DDB9999,
	        0x79769996, 0x7ED99611, 0x861E9979, 0x994444E7, 0x46699699,
	        0x6996FD99, 0xF4469999, 0x2224F248, 0x26244424, 0x64446622,
	        0x84284248, 0x40F0F024, 0x0F0044E4, 0x480A4E40, 0x9A459124,
	        0x000A5A16, 0x640444F0, 0x80004049, 0x40400004, 0x44444040,
	        0x0AA00044, 0x6476E400, 0xFAFA61D9, 0xE44E4EAA, 0x24F42445,
	        0xF244E544, 0x00000042
	    ];
	    var p = 0;
	    var d = 32;
	    var pIndex = 0;
	    dotPatterns = [];
	    for (var i = 0; i < letterCount; i++) {
	        var dots = [];
	        for (var y = 0; y < 5; y++) {
	            for (var x = 0; x < 4; x++) {
	                if (++d >= 32) {
	                    p = letterPatterns[pIndex++];
	                    d = 0;
	                }
	                if ((p & 1) > 0) {
	                    dots.push({ x: x, y: y });
	                }
	                p >>= 1;
	            }
	        }
	        dotPatterns.push(dots);
	    }
	    var charStr = "()[]<>=+-*/%&_!?,.:|'\"$@#\\urdl";
	    charToIndex = [];
	    for (var c = 0; c < 128; c++) {
	        var li = -2;
	        if (c == 32) {
	            li = -1;
	        }
	        else if (c >= 48 && c < 58) {
	            li = c - 48;
	        }
	        else if (c >= 65 && c < 90) {
	            li = c - 65 + 10;
	        }
	        else {
	            var ci = charStr.indexOf(String.fromCharCode(c));
	            if (ci >= 0) {
	                li = ci + 36;
	            }
	        }
	        charToIndex.push(li);
	    }
	}
	exports.init = init;
	function draw(str, x, y) {
	    for (var i = 0; i < str.length; i++) {
	        var idx = charToIndex[str.charCodeAt(i)];
	        if (idx === -2) {
	            throw "invalid char: " + str.charAt(i);
	        }
	        else if (idx >= 0) {
	            drawLetter(idx, x, y);
	        }
	        x += 5;
	    }
	}
	exports.draw = draw;
	function drawLetter(idx, x, y) {
	    var p = dotPatterns[idx];
	    for (var i = 0; i < p.length; i++) {
	        var d = p[i];
	        context.fillRect(d.x + x, d.y + y, 1, 1);
	    }
	}


/***/ }
/******/ ])
});
;