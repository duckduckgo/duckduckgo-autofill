(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

(function () {
  // Capture globals before the page overrides them
  var secretGlobals = {
    window: window,
    // Methods must be bound to their interface, otherwise they throw Illegal invocation
    encrypt: window.crypto.subtle.encrypt.bind(window.crypto.subtle),
    decrypt: window.crypto.subtle.decrypt.bind(window.crypto.subtle),
    generateKey: window.crypto.subtle.generateKey.bind(window.crypto.subtle),
    exportKey: window.crypto.subtle.exportKey.bind(window.crypto.subtle),
    importKey: window.crypto.subtle.importKey.bind(window.crypto.subtle),
    getRandomValues: window.crypto.getRandomValues.bind(window.crypto),
    TextEncoder: TextEncoder,
    TextDecoder: TextDecoder,
    Uint8Array: Uint8Array,
    Uint16Array: Uint16Array,
    Uint32Array: Uint32Array,
    JSONstringify: window.JSON.stringify,
    JSONparse: window.JSON.parse,
    Arrayfrom: window.Array.from,
    Promise: window.Promise,
    stringReplace: function stringReplace(string, toSearch, toReplace) {
      return window.String.prototype.replace.call(string, toSearch, toReplace);
    }
  };
  Object.defineProperty(window.navigator, 'ddgGlobals', {
    enumerable: false,
    configurable: false,
    writable: false,
    value: Object.freeze(secretGlobals)
  });
})();

},{}]},{},[1]);
