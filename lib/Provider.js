import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _applyDecoratedDescriptor from "@babel/runtime/helpers/esm/applyDecoratedDescriptor";

var _class;

import "core-js/modules/es.function.name.js";
import "core-js/modules/es.object.assign.js";
import "core-js/modules/es.object.get-own-property-descriptor.js";
import React, { createContext, useContext, useSyncExternalStore } from "react";
import { combineReducers, legacy_createStore as createStore } from "redux";
import { getStore, Update } from "./decorators";
import { reducers, serializeProperty } from "./storage";
var ModuleContext = /*#__PURE__*/createContext(null);
/**
 * ReduxProvider组件
 */

export var ReduxProvider = function ReduxProvider(_ref) {
  var children = _ref.children,
      value = _ref.value;
  var reducer = combineReducers(reducers(value));
  var store = createStore(reducer);
  getStore(store);
  return /*#__PURE__*/React.createElement(ModuleContext.Provider, {
    value: store
  }, children);
};
/**
 * module Hook
 * 根据传入的类模块在store中找到对应的状态
 * 重新构建该类
 * 通过useSyncExternalStore更新视图
 */

export function useModule(params) {
  var store = useContext(ModuleContext); // @ts-ignore

  var name = params && (params === null || params === void 0 ? void 0 : params.constructor.name);

  if (name) {
    var state = useSyncExternalStore(store.subscribe, function () {
      return store.getState()[name];
    });
    state && Object.assign(params, serializeProperty(name, state));
    return params;
  }

  return params;
}
export var BaseModule = (_class = /*#__PURE__*/function () {
  function BaseModule() {
    _classCallCheck(this, BaseModule);
  }

  _createClass(BaseModule, [{
    key: "dispatch",
    value: function dispatch() {}
  }, {
    key: "update",
    value: function update() {}
  }, {
    key: "deleteLocal",
    value: function deleteLocal(propertyName) {}
  }, {
    key: "deleteSeesion",
    value: function deleteSeesion(propertyName) {}
  }]);

  return BaseModule;
}(), (_applyDecoratedDescriptor(_class.prototype, "dispatch", [Update], Object.getOwnPropertyDescriptor(_class.prototype, "dispatch"), _class.prototype)), _class);