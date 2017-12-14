// Generated by Babel
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getSource = getSource;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var FileSource = function () {
  function FileSource(file) {
    _classCallCheck(this, FileSource);

    this._file = file;
    this.size = file.size;
  }

  _createClass(FileSource, [{
    key: "slice",
    value: function slice(start, end) {
      return this._file.slice(start, end);
    }
  }, {
    key: "close",
    value: function close() {}
  }]);

  return FileSource;
}();

var CordovaFileSource = function () {
  function CordovaFileSource(file) {
    _classCallCheck(this, CordovaFileSource);

    this._file = file;
    this.size = file.size;
  }

  _createClass(CordovaFileSource, [{
    key: "slice",
    value: function slice(start, end) {
      var _this = this;

      return new Promise(function (_resolve, _error) {
        var reader = new FileReader();
        reader.onload = function () {
          _resolve(new Uint8Array(reader.result));
          reader = null;
        };
        reader.onerror = function (event) {
          _error(event);
          reader = null;
        };
        reader.readAsArrayBuffer(_this._file.slice(start, end));
      });
    }
  }, {
    key: "close",
    value: function close() {}
  }]);

  return CordovaFileSource;
}();

function getSource(input) {

  // Are we using cordova and this is a cordova file?
  if (input && input.localURL && input.localURL.indexOf('cdvfile') === 0) {
    return new CordovaFileSource(input);
  }

  // Since we emulate the Blob type in our tests (not all target browsers
  // support it), we cannot use `instanceof` for testing whether the input value
  // can be handled. Instead, we simply check is the slice() function and the
  // size property are available.
  if (typeof input.slice === "function" && typeof input.size !== "undefined") {
    return new FileSource(input);
  }

  throw new Error("source object may only be an instance of File or Blob in this environment");
}