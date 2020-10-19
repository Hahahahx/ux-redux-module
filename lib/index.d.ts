import { FC } from "react";
import { useModule } from "../src/Provider";
import { Action, LocalStorage, SessionStorage, Update } from "./decorators";

declare var ReduxProvider: FC<{ value: any }>;
type useModule<T = {}> = () => T;

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
