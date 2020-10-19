import "core-js/modules/es.symbol";
import "core-js/modules/es.array.concat";
import "core-js/modules/es.array.filter";
import "core-js/modules/es.array.for-each";
import "core-js/modules/es.function.name";
import "core-js/modules/es.object.assign";
import "core-js/modules/es.object.get-own-property-descriptor";
import "core-js/modules/es.object.get-own-property-descriptors";
import "core-js/modules/es.object.keys";
import "core-js/modules/es.reflect.delete-property";
import "core-js/modules/es.reflect.get";
import "core-js/modules/es.reflect.own-keys";
import "core-js/modules/es.reflect.set";
import "core-js/modules/es.regexp.constructor";
import "core-js/modules/es.regexp.exec";
import "core-js/modules/es.regexp.to-string";
import "core-js/modules/web.dom-collections.for-each";
import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

/**
 * @File: index
 * @Author: Ux
 * @Date: 2020/9/23
 * @Description:
 */
import { Decrypt, Encrypt } from "./utils/js-aes";
import { LocalMap, SessionMap } from "./decorators";
var Session = window.sessionStorage;
var Local = window.localStorage;
/**
 * 自定义通用reducer，以module区分，每次更新module
 */

export function reducers(modules) {
  // reducer类型
  var obj = {}; // 遍历modules，生成对应的reducer

  Reflect.ownKeys(modules).forEach(function (key) {
    var module = Reflect.get(modules, key);
    var contextName = module.constructor.name; // session 的优先级高于Local 所以local中查出的结果会被Session覆盖

    var moduleItem = hasSession(hasLocal(_objectSpread({}, module), contextName), contextName);

    obj[contextName] = function () {
      var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : moduleItem;
      var action = arguments.length > 1 ? arguments[1] : undefined;

      // 以命名规则 Module_ 开头的，确保Action匹配到自身的Module而不会影响到其他的Module
      if (new RegExp("^" + contextName + "_").test(action.type)) {
        return _objectSpread(_objectSpread({}, state), action.payload);
      }

      return _objectSpread({}, state);
    };
  });
  return obj;
}
/**
 * 查看localStorage中是否有值，有则返回
 * @param moduleItem 默认初始值
 * @param module    module对象
 */

function hasLocal(moduleItem, name) {
  var moduleLocal = Local.getItem(name);

  if (moduleLocal) {
    moduleItem = Object.assign(moduleItem, JSON.parse(Decrypt(moduleLocal)));
  } else {
    setLocal(name, moduleItem);
  }

  return moduleItem;
}
/**
 * 查看sessionStorage中是否有值，有则返回
 * @param moduleItem 默认初始值
 * @param module    module对象
 */


function hasSession(moduleItem, name) {
  var moduleSession = Session.getItem(name);

  if (moduleSession) {
    moduleItem = Object.assign(moduleItem, JSON.parse(Decrypt(moduleSession)));
  } else {
    setSession(name, moduleItem);
  }

  return moduleItem;
}

export function setLocal(name, module) {
  var list = LocalMap && LocalMap.get(name); // 只添加属性队列中需要localStorage的属性

  if (list) {
    var obj = {}; // 遍历需要local的字段

    list.forEach(function (key) {
      Reflect.set(obj, key, Reflect.get(module, key));
    }); // 将他们存放到Localstorage中

    Local.setItem(name, Encrypt(JSON.stringify(obj)));
  }
}
export function setSession(name, module) {
  var list = SessionMap && SessionMap.get(name); // 只添加属性队列中需要sessionStorage的属性

  if (list) {
    var obj = {}; // 遍历需要session的字段

    list.forEach(function (key) {
      Reflect.set(obj, key, Reflect.get(module, key));
    }); // 将他们存放到session中

    Session.setItem(name, Encrypt(JSON.stringify(obj)));
  }
}
/**
 * 删除SessionStorage中的数据
 * @param moduleName   Module名
 * @param property module字段名，没有则删除整个module
 */

export function deleteSeesion(moduleName, property) {
  var session = Session.getItem(moduleName);

  var hasModule = function hasModule(todo) {
    if (session) {
      todo();
    } else {
      throw new Error("没有在SessionStorage中搜索到" + moduleName);
    }
  };

  if (property) {
    hasModule(function () {
      var module = JSON.parse(Decrypt(session));

      if (Reflect.deleteProperty(module, property)) {
        Session.setItem(moduleName, Encrypt(JSON.stringify(module)));
      } else {
        throw new Error("\u5728SessionStorage\u7684".concat(moduleName, "\u4E2D\u6CA1\u6709").concat(property, "\u5B57\u6BB5"));
      }
    });
  } else {
    hasModule(function () {
      return Session.removeItem(moduleName);
    });
  }
}
/**
 * 删除LocalStorage中的数据
 * @param moduleName   Module名
 * @param property module字段名，没有则删除整个module
 */

export function deleteLocal(moduleName, property) {
  var local = Local.getItem(moduleName);

  var hasModule = function hasModule(todo) {
    if (local) {
      todo();
    } else {
      throw new Error("没有在LocalStorage中搜索到" + moduleName);
    }
  };

  if (property) {
    hasModule(function () {
      var module = JSON.parse(Decrypt(local));

      if (Reflect.deleteProperty(module, property)) {
        Local.setItem(moduleName, Encrypt(JSON.stringify(module)));
      } else {
        throw new Error("\u5728LocalStorage\u7684".concat(moduleName, "\u4E2D\u6CA1\u6709").concat(property, "\u5B57\u6BB5"));
      }
    });
  } else {
    hasModule(function () {
      return Local.removeItem(moduleName);
    });
  }
}