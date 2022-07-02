import React from "react";
import { createRoot } from "react-dom/client";
import { TodoList } from "./TodoList";
import { ReduxProvider, useModule } from "../lib";
import { TodoModule, UserModule } from "./modules";

// const modules =;
// const getModule = () => modules;
// export type TModule = ReturnType<typeof getModule>;

const Test = () => {
    const module = useModule(UserModule);

    console.log("_---------------");

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
    <ReduxProvider value={{ TodoModule }}>
        <Test />
        <TodoList />
    </ReduxProvider>
);
