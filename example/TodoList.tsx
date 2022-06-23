import React, { useState } from "react";
import { useModuleState } from "../src/decorators";
import { useModule } from "../src/Provider";
import { TModule } from "./app";
import { Item } from "./Item";
import { TodoModule } from "./modules";

export const TodoList = () => {
    const [text, setText] = useState("");
    // const { TodoModule } = useModule<TModule>();

    console.log(TodoModule);

    const module = useModuleState(TodoModule);

    console.log("mmmmmmmmmmm", module);

    return (
        <>
            <input
                type="text"
                value={text}
                onChange={(e) => {
                    setText(e.target.value);
                }}
            />
            <button
                onClick={() => {
                    setText("");
                    TodoModule.actionAddItem(text + "asdafaf");
                }}
            >
                添加
            </button>
            <ul>
                {module.list.map((item, index) => {
                    return (
                        <li key={index}>
                            <Item index={index} str={item} />
                        </li>
                    );
                })}
            </ul>
        </>
    );
};
