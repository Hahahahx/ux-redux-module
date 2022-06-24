import React, { useState } from "react";
import { useModule } from "../src";
// import { TModule } from "./app";
import { Item } from "./Item";
import { TodoModule } from "./modules";

export const TodoList = () => {
    const [text, setText] = useState("");
    const module = useModule(TodoModule);

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
                    module.actionAddItem(text + "asdafaf");
                }}
            >
                添加{module.str}
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
