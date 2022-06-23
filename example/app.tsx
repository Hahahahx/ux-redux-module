import React from "react";
import { createRoot } from "react-dom/client";
import { TodoList } from "./TodoList";
import ReduxProvider, { useModule } from "../src/Provider";
import * as modules from "./modules";
import { useModuleState } from "../src/decorators";
import { TodoModule } from "./modules";
 
console.log(modules)
const getModule = () => modules;
export type TModule = ReturnType<typeof getModule>;

const Test = () => { 
    const module = useModuleState(modules.UserModule);
 

    return (
        <div>
            {module.test}
            可以刷新网页，对状态加了 @SesstionStorage 会保存到SesstionStorage中
        </div>
    );
};

const container = document.getElementById("root");
const root = createRoot(container!);
root.render(
    <ReduxProvider value={modules}>
        <Test />
        <TodoList />
    </ReduxProvider>
);
