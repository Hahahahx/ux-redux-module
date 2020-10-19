import "core-js/modules/es.array.for-each";
import "core-js/modules/es.function.name";
import "core-js/modules/es.object.assign";
import "core-js/modules/es.reflect.get";
import "core-js/modules/es.reflect.own-keys";
import "core-js/modules/es.reflect.set";
import "core-js/modules/web.dom-collections.for-each";
import React from "react";
import { Provider, useSelector } from "react-redux";
import { combineReducers, createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import { getStore } from "./decorators";
import { reducers } from "./storage";
var modules = {};
/**
 * ReduxProvider组件
 */

var ReduxProvider = function ReduxProvider(_ref) {
  var children = _ref.children,
      value = _ref.value;
  modules = value;
  var reducer = combineReducers(reducers(modules));
  var store = createStore(reducer, composeWithDevTools());
  getStore(store);
  return /*#__PURE__*/React.createElement(Provider, {
    store: store
  }, children);
};

export default ReduxProvider;
/**
 * module Hook
 * 使用react-redux的useSelector重新组装每个Module对象
 */

export function useModule() {
  var _useSelector = useSelector(function (state) {
    return {
      state: state
    };
  }),
      state = _useSelector.state;

  var obj = {}; // 重新组装module

  Reflect.ownKeys(modules).forEach(function (key) {
    var module = Reflect.get(modules, key);
    var moduleState = Reflect.get(state, module.constructor.name);
    Reflect.set(obj, key, Object.assign(module, moduleState));
  }); // 对Module进行类型断言

  return obj;
}