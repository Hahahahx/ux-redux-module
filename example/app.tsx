import React from "react";
import ReactDOM from "react-dom";
import { TodoList } from "./TodoList";
import ReduxProvider from "../src/Provider";
import TodoModule from "./modules/TodoModule";

const module = { TodoModule };
const getModule = () => module;
export type TModule = ReturnType<typeof getModule>;


ReactDOM.render(
    <ReduxProvider value={module}>
        <div>可以刷新网页，对状态加了 @SesstionStorage 会保存到SesstionStorage中</div>
        <TodoList />
    </ReduxProvider>,
    document.getElementById("root")
);
