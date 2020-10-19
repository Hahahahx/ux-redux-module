/// <reference types="react" />

declare module "ux-redux-module" {
    function ReduxProvider(): React.FC<{ value: any }>;
    function useModule<T = {}>(): T;
    function Action(target: any, property: string, descriptor: any): void;
    function Update(target: any, property: string, descriptor: any): void;
    function SessionStorage(
        target: any,
        property: string,
        descriptor: any
    ): void;
    function LocalStorage(target: any, property: string, descriptor: any): void;
    export {
        ReduxProvider,
        useModule,
        Action,
        Update,
        SessionStorage,
        LocalStorage,
    };
}

declare namespace JSX {
    interface IntrinsicElements {
        ReduxProvider: React.FC<{ value: any }>;
    }
}
