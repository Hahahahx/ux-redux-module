/**
 * @File: decorators
 * @Author: Ux
 * @Date: 2020/9/25
 * @Description: 装饰器
 */

import {
    deleteLocal,
    deleteSeesion,
    initLocal,
    initSession,
    initStringify,
    setLocal,
    setSession,
    StringifyMap,
} from "./storage";
import { AnyAction, CombinedState, Store } from "redux";
import { LocalMap, SessionMap } from "./storage";

let store: Store<
    CombinedState<{
        [p: string]: any;
    }>,
    AnyAction
>;

export const getStore = (
    stores: Store<
        CombinedState<{
            [p: string]: any;
        }>,
        AnyAction
    >
) => {
    store = stores;
};

/**
 * 将属性添加到SessionStorage中
 */
export function SessionStorage(...params: any) {
    // 因为是属性装饰器有函数提升效果，所以需要初始化Map，且需要确保SessionMap也存在变量提升！
    SessionMap || initSession();
    const [target, property] = params;
    const contextName = target.constructor.name;
    // 将该属性添加到sessionStorage属性队列中去
    let list = SessionMap.get(contextName);
    list = list ? [...list, property] : [property];

    SessionMap.set(contextName, list);
}

/**
 * 将属性添加到LocalStorage中
 */
export function LocalStorage(...params: any) {
    // 因为是属性装饰器有函数提升效果，所以需要初始化Map，且需要确保SessionMap也存在变量提升！
    LocalMap || initLocal();
    const [target, property] = params;
    const contextName = target.constructor.name;
    // 将该属性添加到sessionStorage属性队列中去
    let list = LocalMap.get(contextName);
    list = list ? [...list, property] : [property];
    LocalMap.set(contextName, list);
}

/**
 * 将属性添加到Stringify中
 */
export function Stringify(...params: any) {
    // 因为是属性装饰器有函数提升效果，所以需要初始化Map，且需要确保StringifyMap也存在变量提升！
    StringifyMap || initStringify();
    const [target, property] = params;
    const contextName = target.constructor.name;
    // 将该属性添加到sessionStorage属性队列中去
    let list = StringifyMap.get(contextName);
    list = list ? [...list, property] : [property];
    StringifyMap.set(contextName, list);
}

/**
 * 控制同步更新Module状态，方法被调用时触发
 * 该装饰器现在转移到基础Module中去，由引入父类实现
 *
 * @param target 所属Module
 * @param property 方法名为update
 * @param descriptor 方法对象
 */
export function Update(target: any, property: string, descriptor: any) {
    // 限定方法名为update
    // if (property !== "update") return;
    // 保留update原生函数
    const oldFunc = descriptor.value;

    descriptor.value = async function (contextName: string, module: any) {
        try {
            const value = await oldFunc.apply(this);
            // 同步dispatch 如UserModule_SET ，即为发送action去更新UserModule

            // 现在每次更新都是对整个模块的更新，
            // 字符串化整个模块，取的时候再通过反序列取出整个模块
            Object.keys(this).map((key) => {
                if (StringifyMap.get(contextName)?.includes(key))
                    this[key] = JSON.stringify(this[key]);
            });

            store.dispatch({
                type: contextName + "_SET",
                payload: { ...module },
            });

            setSession(contextName, module, false);
            setLocal(contextName, module, false);
            return value;
        } catch (e: any) {
            throw Error(e);
        }
    };
    // 冻结对象
    descriptor.configurable = false;
    descriptor.writable = false;
}

/**
 * 控制同步更新Module状态，方法被调用时触发，但是原生函数必须返回一个promise对象出来。
 * @param target 所属Module
 * @param property 方法名为update
 * @param descriptor 方法对象
 */
// export function Action(target: any, property: string, descriptor: any) {
//     // 抽出的原生函数在调用时this已经发生了改变
//     // 因为被新的async覆盖了，所以需要重新apply(this)进去改变他的上下文环境
//     const oldFunc = descriptor.value;
//     descriptor.value = async function (...params: any[]) {
//         try {
//             const value = await oldFunc.apply(this, params);
//             const module = { ...this };
//             // 同步dispatch
//             store.dispatch({
//                 type: target.constructor.name + "_SET",
//                 payload: module,
//             });
//             setSession(target.constructor.name, module);
//             return value;
//         } catch (e: any) {
//             throw Error(e);
//         }
//     };
//     // 冻结对象
//     descriptor.configurable = false;
//     descriptor.writable = false;
// }

/**
 * 类装饰器，实现一个可以使用的this.update()
 * 该方法作用于给用户更新状态
 */
export function Module(module: any) {
    module.prototype.update = function () {
        module.prototype.dispatch(module.name, this);
    };

    module.prototype.deleteSeesion = function (name: string) {
        deleteSeesion(module.name, name);
    };
    module.prototype.deleteLocal = function (name: string) {
        deleteLocal(module.name, name);
    };

    return module;
}
