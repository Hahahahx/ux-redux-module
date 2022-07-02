import "core-js/modules/es.symbol.js";
import "core-js/modules/es.array.filter.js";
import "core-js/modules/es.object.get-own-property-descriptor.js";
import "core-js/modules/es.object.get-own-property-descriptors.js";
import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

import "core-js/modules/es.array.iterator.js";
import "core-js/modules/es.map.js";
import "core-js/modules/es.object.to-string.js";
import "core-js/modules/es.string.iterator.js";
import "core-js/modules/web.dom-collections.iterator.js";
import "core-js/modules/web.dom-collections.for-each.js";
import "core-js/modules/es.reflect.own-keys.js";
import "core-js/modules/es.reflect.get.js";
import "core-js/modules/es.function.name.js";
import "core-js/modules/es.regexp.constructor.js";
import "core-js/modules/es.regexp.exec.js";
import "core-js/modules/es.regexp.to-string.js";
import "core-js/modules/es.object.assign.js";
import "core-js/modules/es.reflect.set.js";
import "core-js/modules/es.reflect.delete-property.js";
import "core-js/modules/es.array.concat.js";
import "core-js/modules/es.array.map.js";
import "core-js/modules/es.object.keys.js";
import "core-js/modules/es.array.includes.js";
import "core-js/modules/es.string.includes.js";

/**
 * @File: index
 * @Author: Ux
 * @Date: 2020/9/23
 * @Description:
 */
import { Decrypt, Encrypt } from "./utils/js-aes";
var Session = window.sessionStorage;
var Local = window.localStorage;
/**
 * 属性队列，用于判断哪些属性是需要添加到sessionStorage中的，
 */

export var SessionMap;
/**
 * 属性队列，用于判断哪些属性是需要添加到localStorage中的，
 */

export var LocalMap;
/**
 * 属性队列，用于判断哪些属性是需要字符串序列化的，
 */

export var StringifyMap;
export function initLocal() {
  LocalMap = new Map();
}
export function initSession() {
  SessionMap = new Map();
}
export function initStringify() {
  StringifyMap = new Map();
}
/**
 * 自定义通用reducer，以module区分，每次更新module
 */

export function reducers(modules) {
  // reducer类型
  var obj = {}; // 遍历modules，生成对应的reducer

  Reflect.ownKeys(modules).forEach(function (key) {
    var module = Reflect.get(modules, key);
    var contextName = module.constructor.name; // session 的优先级高于Local 所以local中查出的结果会被Session覆盖
    // 在程序初始化的时候也会执行写入Session或者Local的操作
    // 但是因为初始化的时候获取不到SessionStorage和LocalStorage两个装饰器的值
    // 所以无法判断哪些是我们需要添加到持久化里的
    // 而且这样也没有意义，因为初始化的状态始终保存在类模块中
    // 如果状态值没有发生变化也就不需要持久化了
    // 当状态发生变化时，能够拿到带有装饰器需要持久化的对象

    var moduleItem = hasSession(hasLocal(_objectSpread({}, module), contextName), contextName); // 在程序初始化的时候字符串化那些被stringify标记的字段
    // 因为在上层模块中取值的时候序列化了这些对象
    // 如果其是未字符串化的对象则会报错

    moduleItem = stringifyProperty(contextName, moduleItem);

    obj[contextName] = function () {
      var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : moduleItem;
      var action = arguments.length > 1 ? arguments[1] : undefined;

      // 以命名规则 Module_ 开头的，确保Action匹配到自身的Module而不会影响到其他的Module
      if (new RegExp("^" + contextName + "_").test(action.type)) {
        return action.payload;
      }

      return state;
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
    // 存到storage中的数据是字符串，需要转化一下才能拿到module
    moduleLocal = JSON.parse(Decrypt(moduleLocal)); // 在module中有些字段我们做了stringify字符串化
    // 因为取Strinify的值在上层模块中做了序列化
    // 同时在另一个模块写入的时候做了字符串化
    // 这个过程相互转化没有问题
    // 但是在程序首次初始化的时候，即还没有数据写入到Session或者local中
    // 我们所读到的module模块中，被标记Stringify的字段是尚未字符串化的
    // 所以我们需要在第一次初始化程序的时候对整个结构做一次字符串化
    // 这时如果后续再次程序初始化，即session或local中有了数据（数据是字符串化的）
    // 就会对被标记的字段做两次字符串化的工作
    // 所以此处我们对其做了序列化

    moduleLocal = serializeProperty(name, moduleLocal);
    moduleItem = Object.assign(moduleItem, moduleLocal);
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
    moduleSession = JSON.parse(moduleSession);
    moduleSession = serializeProperty(name, moduleSession);
    moduleItem = Object.assign(moduleItem, moduleSession);
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

    Local.setItem(name, Encrypt(JSON.stringify(obj))); // Local.setItem(name, JSON.stringify(obj));
  }
}
export function setSession(name, module) {
  var list = SessionMap && SessionMap.get(name); // 只添加属性队列中需要sessionStorage的属性

  if (list) {
    var obj = {}; // 遍历需要session的字段

    list.forEach(function (key) {
      Reflect.set(obj, key, Reflect.get(module, key));
    }); // 将他们存放到session中

    Session.setItem(name, JSON.stringify(obj));
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
      var module = JSON.parse(session);

      if (Reflect.deleteProperty(module, property)) {
        Session.setItem(moduleName, JSON.stringify(module));
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
      var module = JSON.parse(Decrypt(local)); // const module = JSON.parse(local || "");

      if (Reflect.deleteProperty(module, property)) {
        Local.setItem(moduleName, Encrypt(JSON.stringify(module))); // Local.setItem(moduleName, JSON.stringify(module));
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
export function serializeProperty(contextName, module) {
  StringifyMap && Object.keys(module).map(function (key) {
    var _StringifyMap$get;

    if ((_StringifyMap$get = StringifyMap.get(contextName)) !== null && _StringifyMap$get !== void 0 && _StringifyMap$get.includes(key)) {
      module[key] = typeof module[key] === "string" ? JSON.parse(module[key]) : module[key];
    }
  });
  return module;
} // 字符串化某个被Stringify标记的对象，取的时候再通过反序列取出该对象

export function stringifyProperty(contextName, module) {
  StringifyMap && Object.keys(module).map(function (key) {
    var _StringifyMap$get2;

    if ((_StringifyMap$get2 = StringifyMap.get(contextName)) !== null && _StringifyMap$get2 !== void 0 && _StringifyMap$get2.includes(key)) module[key] = JSON.stringify(module[key]);
  });
  return module;
}