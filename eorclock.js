//! eorclock.js
//! authors : Quercus Maris
//! license : MIT
//! https://github.com/quercus2011/eorclock

;(function (global, factory) {
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
    return function eorclock() {
    };
  };

  return _eorclock;
}));
