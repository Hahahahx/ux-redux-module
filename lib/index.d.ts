/// <reference types="react" />

declare module "ux-redux-module" {
    function ReduxProvider({
        value,
        children,
    }: {
        value: { [K: string]: string };
        children: any;
    }): JSX.Element;
    function useModule<T = {}>(): T;
    function Action(target: any, property: string, descriptor: any): void;
    function Update(target: any, property: string, descriptor: any): void;
    function SessionStorage(...props: any): void;
    function LocalStorage(...props: any): void;
    export {
        ReduxProvider,
        useModule,
        Action,
        Update,
        SessionStorage,
        LocalStorage,
    };
}
