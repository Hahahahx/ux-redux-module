import { FC } from "react";
import { Action, LocalStorage, SessionStorage, Update } from "./decorators";

type ReduxProvider = FC<{ value: any }>;
type useModule<T = {}> = () => T;
type Action = (target: any, property: string, descriptor: any) => void;
type Update = (target: any, property: string, descriptor: any) => void;
type SessionStorage = (target: any, property: string, descriptor: any) => void;
type LocalStorage = (target: any, property: string, descriptor: any) => void;

declare module "ux-redux-module" {
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
        ReduxProvider: FC<{ value: any }>;
    }
}
