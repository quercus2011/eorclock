//! eorclock.js
//! authors : Quercus Maris
//! license : MIT
//! https://github.com/quercus2011/eorclock

;(function (global, factory) { // eslint-disable-line no-extra-semi
  if (typeof exports === 'object' && typeof module !== 'undefined') {
    module.exports = factory();
  } else if (typeof define === 'function' && define.amd) {
    define(factory);
  } else {
    global.eorclock = factory();
  }
}(this, function () {
  'use strict';

  var _eorclock = function eorclockFactory() {
    return function eorclock(win, doc) {

      //======================================================================

      function padStart(org, length, pad) {
        if (org === undefined || org === null) throw 'ERROR: padStart(): invalid 1st argument';
        if (typeof org !== 'string') return padStart('' + org, length, pad);
        if (typeof org.padStart === 'function') return org.padStart(length, pad);
        if (! length) throw 'ERROR: padStart(): invalid 2nd argument';
        if (typeof length !== 'number') return padStart(org, 1*length, pad);
        if (isNaN(length) || ! isFinite(length) || length <= 0 || length !== Math.floor(length)) throw 'ERROR: padStart(): invalid 2nd argument';
        if (org.length >= length) return org;
        if (! pad) throw 'ERROR: padStart(): invalid 3rd argument';
        if (typeof pad !== 'string') return padStart(org, length, '' + pad);
        if (! pad.length) throw 'ERROR: padStart(): invalid 3rd argument';
        return pad.repeat(Math.floor((length - org.length)/pad.length)) + pad.substr(0, (length - org.length) % pad.length) + org;
      }

      function to2digits(arg) {
        if (! /^\s*\d+\s*$/.test(arg)) throw 'ERROR: to2digits(): invalid argument: "' + arg + '"';
        const value = parseInt(arg, 10);
        if (isNaN(value) || ! isFinite(value)) throw 'ERROR: to2digits(): invalid argument: "' + arg + '"';
        if (99 < value) throw 'ERROR: to2digits(): too large argument: "' + arg + '"';
        return padStart(value, 2, '0');
      }

      //======================================================================

      const epoch = Date.UTC(1970, 1-1, 1, 0, 0, 0, 0); // "1970/Jan/01 00:00:00 UTC" (UNIX Epoch)
      const ratio = 70*60*1000/(24*60); // 24 hours of Eorzea Time is equal to 70 minutes of Local Time (earth time)

      function et2lt(et) {
        // allow outside of the normal range (such as "25:12")
        if (! et || typeof et.match !== 'function') throw 'ERROR: et2lt(): invalid argument';
        const matching = et.match(/\b(\d\d):(\d\d)\b/);
        if (! matching) throw 'ERROR: et2lt(): invalid ET format: "' + et + '"';
        return (matching[1]*60 + matching[2]*1) * ratio; // may has decimal fractions
      }

      function lt2et(lt) {
        const value = lt*1;
        if (isNaN(value) || ! isFinite(value)) throw 'ERROR: lt2et(): invalid argument: "' + lt + '"';
        if (value < epoch) throw 'ERROR: lt2et(): too small argument: "' + lt + '"';
        const elapsed = Math.floor((value-epoch)/ratio);
        const hours = Math.floor(elapsed/60) % 24;
        const minutes = elapsed % 60;
        return to2digits(hours) + ':' + to2digits(minutes);
      }

      function floorToDateline(lt) {
        const value = lt*1;
        if (isNaN(value) || ! isFinite(value)) throw 'ERROR: floorToDateline(): invalid argument: "' + lt + '"';
        if (value < epoch) throw 'ERROR: floorToDateline(): too small argument: "' + lt + '"';
        const elapsed = Math.floor((value-epoch)/ratio);
        return value - (elapsed % (24*60)) * ratio; // may has decimal fractions
      }

      //======================================================================

      function updateWallClock(now) {
        const dom = doc.getElementById('date');
        if (! dom) throw 'ERROR: #date is not found';
        dom.innerHTML = dom.innerHTML.replace(/\b\d\d:\d\d\b/, lt2et(now));
      }

      //======================================================================

      function processEorzeaTime() {
        const now = Date.now();
        updateWallClock(now);
        setTimeout(processEorzeaTime, Math.ceil(floorToDateline(now) + et2lt(lt2et(now)) + et2lt('00:01')) - now);
      }

      processEorzeaTime();
    };
  };

  return _eorclock;
}));
