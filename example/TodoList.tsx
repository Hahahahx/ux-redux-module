import React, { useState } from "react";
import { useModule } from "../src/Provider";
import { TModule } from "./app";
import { Item } from "./Item";

export const TodoList = () => {
    const [text, setText] = useState("");
    const { TodoModule } = useModule<TModule>();

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
                    setText('')
                    TodoModule.actionAddItem(text);
                }}
            >
                添加
            </button>
            <ul>
                {TodoModule.list.map((item, index) => {
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
