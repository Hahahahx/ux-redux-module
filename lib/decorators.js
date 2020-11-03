import "core-js/modules/es.symbol";
import "core-js/modules/es.array.concat";
import "core-js/modules/es.array.filter";
import "core-js/modules/es.array.for-each";
import "core-js/modules/es.array.iterator";
import "core-js/modules/es.function.name";
import "core-js/modules/es.map";
import "core-js/modules/es.object.get-own-property-descriptor";
import "core-js/modules/es.object.get-own-property-descriptors";
import "core-js/modules/es.object.keys";
import "core-js/modules/es.object.to-string";
import "core-js/modules/es.string.iterator";
import "core-js/modules/web.dom-collections.for-each";
import "core-js/modules/web.dom-collections.iterator";
import "regenerator-runtime/runtime";
import _asyncToGenerator from "@babel/runtime/helpers/esm/asyncToGenerator";
import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

/**
 * @File: decorators
 * @Author: Ux
 * @Date: 2020/9/25
 * @Description: 装饰器
 */
import { setSession } from "./storage";
var store;
export var getStore = function getStore(stores) {
  store = stores;
};
/**
 * 属性队列，用于判断哪些属性是需要添加到sessionStorage中的，
 */

export var SessionMap;
/**
 * 属性队列，用于判断哪些属性是需要添加到localStorage中的，
 */

export var LocalMap;

/**
 * 将属性添加到SessionStorage中
 */
export function SessionStorage() {
  // 因为是属性装饰器有函数提升效果，所以需要初始化Map，且需要确保SessionMap也存在变量提升！
  SessionMap || (SessionMap = new Map());

  for (var _len = arguments.length, params = new Array(_len), _key = 0; _key < _len; _key++) {
    params[_key] = arguments[_key];
  }

  var target = params[0],
      property = params[1];
  var contextName = target.constructor.name; // 将该属性添加到sessionStorage属性队列中去

  var list = SessionMap.get(contextName);
  list = list ? [].concat(_toConsumableArray(list), [property]) : [property];
  SessionMap.set(contextName, list);
}

/**
 * 将属性添加到LocalStorage中
 */
export function LocalStorage() {
  // 因为是属性装饰器有函数提升效果，所以需要初始化Map，且需要确保SessionMap也存在变量提升！
  LocalMap || (LocalMap = new Map());

  for (var _len2 = arguments.length, params = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    params[_key2] = arguments[_key2];
  }

  var target = params[0],
      property = params[1];
  var contextName = target.constructor.name; // 将该属性添加到sessionStorage属性队列中去

  var list = LocalMap.get(contextName);
  list = list ? [].concat(_toConsumableArray(list), [property]) : [property];
  LocalMap.set(contextName, list);
}
/**
 * 控制同步更新Module状态，方法被调用时触发
 * @param target 所属Module
 * @param property 方法名为update
 * @param descriptor 方法对象
 */

export function Update(target, property, descriptor) {
  // 限定方法名为update
  if (property !== "update") return; // 保留update原生函数

  var oldFunc = descriptor.value;
  var contextName = target.constructor.name;

  descriptor.value = function () {
    try {
      var value = oldFunc();

      var module = _objectSpread({}, this); // 同步dispatch 如UserModule_SET ，即为发送action去更新UserModule


      store.dispatch({
        type: contextName + "_SET",
        payload: module
      });
      setSession(contextName, module);
      return value;
    } catch (e) {
      throw Error(e);
    }
  }; // 冻结对象


  descriptor.configurable = false;
  descriptor.writable = false;
}
/**
 * 控制同步更新Module状态，方法被调用时触发，但是原生函数必须返回一个promise对象出来。
 * @param target 所属Module
 * @param property 方法名为update
 * @param descriptor 方法对象
 */

export function Action(target, property, descriptor) {
  // 抽出的原生函数在调用时this已经发生了改变
  // 因为被新的async覆盖了，所以需要重新apply(this)进去改变他的上下文环境
  var oldFunc = descriptor.value;
  descriptor.value = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    var _len3,
        params,
        _key3,
        value,
        module,
        _args = arguments;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;

            for (_len3 = _args.length, params = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
              params[_key3] = _args[_key3];
            }

            _context.next = 4;
            return oldFunc.apply(this, params);

          case 4:
            value = _context.sent;
            module = _objectSpread({}, this);
            // 同步dispatch

            store.dispatch({
              type: target.constructor.name + "_SET",
              payload: module
            });
            setSession(target.constructor.name, module);
            return _context.abrupt("return", value);

          case 12:
            _context.prev = 12;
            _context.t0 = _context["catch"](0);
            throw Error(_context.t0);

          case 15:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this, [[0, 12]]);
  })); // 冻结对象

  descriptor.configurable = false;
  descriptor.writable = false;
}