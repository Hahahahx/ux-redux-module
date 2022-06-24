import React, {
    createContext,
    FC,
    useContext,
    useSyncExternalStore,
} from "react";
import { combineReducers, legacy_createStore as createStore } from "redux";
import { getStore, Update } from "./decorators";
import { reducers } from "./storage";

const ModuleContext = createContext<any>(null);

/**
 * ReduxProvider组件
 */
export const ReduxProvider: FC<{ value: any; children: any }> = ({
    children,
    value,
}) => {
    const reducer = combineReducers(reducers(value));
    const store = createStore(reducer);
    getStore(store);
    return (
        <ModuleContext.Provider value={store}>
            {children}
        </ModuleContext.Provider>
    );
};

/**
 * module Hook
 * 根据传入的类模块在store中找到对应的状态
 * 重新构建该类
 * 通过useSyncExternalStore更新视图
 */
export function useModule<T>(params: T) {
    const store = useContext(ModuleContext);

    // @ts-ignore
    const name = params && params?.constructor.name;
    if (name) {
        const state = useSyncExternalStore(
            store.subscribe,
            () => store.getState()[name]
        );

        Object.assign(params, JSON.parse(state));
        return params;
    }
    return params;
}

export class BaseModule {
    @Update
    protected dispatch() {}

    update() {}

    deleteLocal(propertyName: string) {}
    deleteSeesion(propertyName: string) {}
}
