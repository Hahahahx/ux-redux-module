/**
 * @File: index
 * @Author: Ux
 * @Date: 2020/9/23
 * @Description:
 */
import { Decrypt, Encrypt } from "./utils/js-aes";
import { ReducersMapObject } from "redux";

export interface Action<T = any> {
    type: T;
    payload: any;
}

const Session = window.sessionStorage;
const Local = window.localStorage;

/**
 * 属性队列，用于判断哪些属性是需要添加到sessionStorage中的，
 */
export var SessionMap: Map<string, string[]>;
/**
 * 属性队列，用于判断哪些属性是需要添加到localStorage中的，
 */
export var LocalMap: Map<string, string[]>;

export function initLocal() {
    LocalMap = new Map<string, string[]>();
}

export function initSession() {
    SessionMap = new Map<string, string[]>();
}

/**
 * 自定义通用reducer，以module区分，每次更新module
 */
export function reducers(modules: any) {
    // reducer类型
    const obj: ReducersMapObject<{ [p: string]: any }, any> = {};

    // 遍历modules，生成对应的reducer
    Reflect.ownKeys(modules).forEach((key) => {
        const module = Reflect.get(modules, key);
        const contextName = module.constructor.name;

        // session 的优先级高于Local 所以local中查出的结果会被Session覆盖
        // 在程序初始化的时候也会执行写入Session或者Local的操作
        // 但是因为初始化的时候获取不到SessionStorage和LocalStorage两个装饰器的值
        // 所以无法判断哪些是我们需要添加到持久化里的
        // 而且这样也没有意义，因为初始化的状态始终保存在类模块中
        // 如果状态值没有发生变化也就不需要持久化了
        // 当状态发生变化时，能够拿到带有装饰器需要持久化的对象
        let moduleItem = hasSession(
            hasLocal({ ...module }, contextName),
            contextName
        );

        obj[contextName] = function (
            state: any = JSON.stringify(moduleItem),
            action: Action
        ) {
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
function hasLocal(moduleItem: any, name: string) {
    const moduleLocal = Local.getItem(name);
    if (moduleLocal) {
        moduleItem = Object.assign(
            moduleItem,
            JSON.parse(Decrypt(moduleLocal))
            // JSON.parse(moduleLocal)
        );
    } else {
        setLocal(name, JSON.stringify(moduleItem));
    }
    return moduleItem;
}

/**
 * 查看sessionStorage中是否有值，有则返回
 * @param moduleItem 默认初始值
 * @param module    module对象
 */
function hasSession(moduleItem: any, name: string) {
    const moduleSession = Session.getItem(name);
    if (moduleSession) {
        moduleItem = Object.assign(moduleItem, JSON.parse(moduleSession));
    } else {
        setSession(name, JSON.stringify(moduleItem));
    }
    return moduleItem;
}

export function setLocal(name: string, module: any) {
    const list = LocalMap && LocalMap.get(name);
    // 只添加属性队列中需要localStorage的属性
    if (list) {
        const obj = {};
        // 遍历需要local的字段
        list.forEach((key: string) => {
            Reflect.set(obj, key, Reflect.get(JSON.parse(module), key));
        });
        // 将他们存放到Localstorage中
        Local.setItem(name, Encrypt(JSON.stringify(obj)));
        // Local.setItem(name, JSON.stringify(obj));
    }
}

export function setSession(name: string, module: any) {
    const list = SessionMap && SessionMap.get(name);
    // 只添加属性队列中需要sessionStorage的属性
    if (list) {
        const obj = {};

        // 遍历需要session的字段
        list.forEach((key: string) => {
            Reflect.set(obj, key, Reflect.get(JSON.parse(module), key));
        });
        // 将他们存放到session中
        Session.setItem(name, JSON.stringify(obj));
    }
}

/**
 * 删除SessionStorage中的数据
 * @param moduleName   Module名
 * @param property module字段名，没有则删除整个module
 */
export function deleteSeesion(moduleName: string, property?: string) {
    const session = Session.getItem(moduleName);
    const hasModule = (todo: Function) => {
        if (session) {
            todo();
        } else {
            throw new Error("没有在SessionStorage中搜索到" + moduleName);
        }
    };
    if (property) {
        hasModule(() => {
            const module = JSON.parse(session as any);
            if (Reflect.deleteProperty(module, property)) {
                Session.setItem(moduleName, JSON.stringify(module));
            } else {
                throw new Error(
                    `在SessionStorage的${moduleName}中没有${property}字段`
                );
            }
        });
    } else {
        hasModule(() => Session.removeItem(moduleName));
    }
}

/**
 * 删除LocalStorage中的数据
 * @param moduleName   Module名
 * @param property module字段名，没有则删除整个module
 */
export function deleteLocal(moduleName: string, property?: string) {
    const local = Local.getItem(moduleName);
    const hasModule = (todo: Function) => {
        if (local) {
            todo();
        } else {
            throw new Error("没有在LocalStorage中搜索到" + moduleName);
        }
    };
    if (property) {
        hasModule(() => {
            const module = JSON.parse(Decrypt(local));
            // const module = JSON.parse(local || "");
            if (Reflect.deleteProperty(module, property)) {
                Local.setItem(moduleName, Encrypt(JSON.stringify(module)));
                // Local.setItem(moduleName, JSON.stringify(module));
            } else {
                throw new Error(
                    `在LocalStorage的${moduleName}中没有${property}字段`
                );
            }
        });
    } else {
        hasModule(() => Local.removeItem(moduleName));
    }
}
