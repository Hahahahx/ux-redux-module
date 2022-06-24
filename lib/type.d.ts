/// <reference types="react" />

declare module "ux-redux-module" {
    function ReduxProvider({
        value,
        children,
    }: {
        value: any;
        children: any;
    }): JSX.Element;
    function useModule<T>(ModuleClass: T): T;
    /**
     * 更新状态
     * @function action**() 实现任意的action方法，添加Action装饰器，使用该注解必须确保return出一个promise对象
     * @return new Promise.then(res=>{ this.name = res.name })
     */
    // function Action(target: any, property: string, descriptor: any): void;
    /**
     * 更新状态
     * @function update() 实现update方法，添加Update装饰器在改变状态的action方法中调用该方法
     */
    // function Update(target: any, property: string, descriptor: any): void;

    /**
     * SessionStorage存储
     */
    function SessionStorage(...props: any): void;
    /**
     * LocalStorage存储
     */
    function LocalStorage(...props: any): void;

    class BaseModule {
        protected dispatch();
        update();
        deleteLocal(propertyName: string);
        deleteSeesion(propertyName: string);
    }

    export {
        ReduxProvider,
        useModule,
        BaseModule,
        // Action,
        // Update,
        SessionStorage,
        LocalStorage,
    };
}
