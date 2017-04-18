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

      function partialApply() {
        const args0 = Array.prototype.concat.apply([], arguments);
        const func = args0.shift();
        if (typeof func !== 'function') throw 'ERROR: partialApply(): 1st argument should be a function';
        if (! func.length) throw 'ERROR: partialApply(): 1st argument should be a function which has at least one parameter';
        if (args0.length >= func.length) throw 'ERROR: partialApply(): too many arguments';
        return function partialApplyHelper() {
          if (! arguments.length) throw 'ERROR: partialApplyHelper(): too few arguments';
          const args = Array.prototype.concat.apply(args0, arguments);
          if (args.length >= func.length) return func.apply(null, args);
          args.unshift(func);
          return partialApply.apply(null, args);
        };
      }

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

      function toMS(milliseconds) {
        const minutes = Math.floor(milliseconds/(60*1000));
        const seconds = Math.floor(milliseconds/1000) % 60;
        if (minutes > 99) throw 'ERROR: toMS(): too large argument: "' + milliseconds + '"';
        return to2digits(minutes) + 'm' + to2digits(seconds) + 's';
      }

      function toHMS(arg) {
        const date = new Date(1*arg);
        return [date.getHours(), date.getMinutes(), date.getSeconds()].map(to2digits).join(':');
      }

      function toCountDown(enableMS, enableSec, subject, now) {
        const remain = 1000*Math.floor(((subject >= now ? 0 : et2lt('24:00')) + subject - now)/1000);
        if (remain < 0) throw 'ERROR: toCountDown(): BUG';
        const sec = remain/1000;
        if (sec > 9999) throw 'ERROR: toCountDown(): too large remain: "' + remain + '"';
        return '(' + [enableMS && ('-' + toMS(remain)), enableSec && padStart('-' + sec + 'sec', 8, ' ')].filter((e) => e).join(',') + ')';
      }

      function writeContent(dom, className, content, enableCheck) {
        const target = className ? dom.getElementsByClassName(className)[0] : dom;
        if (! target) throw 'ERROR: writeContent(): target is not found';
        if (target.innerHTML === content) {
          if (enableCheck) win.console.trace('WARNING: writeContent(): detect duplicated update: ', target, content);
        } else {
          target.innerHTML = content;
        }
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
        // allow LT with decimal fractions
        const value = lt*1;
        if (isNaN(value) || ! isFinite(value)) throw 'ERROR: lt2et(): invalid argument: "' + lt + '"';
        if (value < epoch) throw 'ERROR: lt2et(): too small argument: "' + lt + '"';
        const elapsed = Math.floor((value-epoch)/ratio);
        const hours = Math.floor(elapsed/60) % 24;
        const minutes = elapsed % 60;
        return to2digits(hours) + ':' + to2digits(minutes);
      }

      function floorToDateline(lt) {
        // allow LT with decimal fractions
        const value = lt*1;
        if (isNaN(value) || ! isFinite(value)) throw 'ERROR: floorToDateline(): invalid argument: "' + lt + '"';
        if (value < epoch) throw 'ERROR: floorToDateline(): too small argument: "' + lt + '"';
        const elapsedDays = Math.floor((value-epoch)/ratio/(24*60));
        return elapsedDays*(24*60)*ratio; // may has decimal fractions
      }

      //======================================================================

      function updateWallClock(dom, now) {
        writeContent(dom, undefined, 'ET ' + lt2et(now) + ' now');
      }

      function updateRow(dom, now) {
        let subject = et2lt(dom.getElementsByClassName('subject')[0].innerHTML) + floorToDateline(now);
        if (subject > 1*now) {
          subject -= et2lt('24:00');
        }
        if (subject > 1*now) throw 'ERROR: updateRow(): BUG';

        const periodText = dom.getElementsByClassName('period')[0].innerHTML;
        if (! /^[1-9]?\dH$/.test(periodText)) throw 'ERROR: updateRow(): invalid period: "' + periodText + '"';
        const periodHours = parseInt(periodText, 10);
        if (! periodHours || isNaN(periodHours) || ! isFinite(periodHours)) throw 'ERROR: updateRow(): invalid period: "' + periodText + '"';
        if (periodHours >= 24) throw 'ERROR: updateRow(): too large period: "' + periodText + '"';
        const period = et2lt(to2digits(periodHours) + ':00');

        const limit = subject + period;
        if (limit > 1*now) {
          dom.classList.add('active');
        } else {
          dom.classList.remove('active');
        }

        if (subject < 1*now) subject += et2lt('24:00');
        if (subject < 1*now) throw 'ERROR: updateRow(): BUG';

        writeContent(dom, 'localtime', 'LT ' + toHMS(subject), false);
        writeContent(dom, 'countdown', toCountDown(true, true, subject, now), true);
        writeContent(dom, 'remain', toCountDown(true, true, limit, now), true);
      }

      function loop(list, next) {
        if (! list || ! list.length) return;
        const now = new Date();
        list.forEach((func) => func(now));
        const period = next(now) - now + 50; // "50ms" is a margin to avoid duplicating same time
        if (! (period > 0)) throw 'ERROR: loop(): BUG';
        setTimeout(loop.bind(null, list, next), period);
      }

      //======================================================================

      const listForET = Array.prototype.concat.apply([], [
        partialApply(updateWallClock, doc.getElementById('date')),
      ]);

      const listForLT = Array.prototype.concat.apply([], [
        Array.prototype.map.call(doc.getElementsByTagName('tr'), (e) => partialApply(updateRow, e)),
      ]);

      loop(listForET, (now) => Math.ceil(floorToDateline(now) + et2lt(lt2et(now)) + et2lt('00:01')));
      loop(listForLT, (now) => new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes(), 1+now.getSeconds()));
    };
  };

  return _eorclock;
}));
