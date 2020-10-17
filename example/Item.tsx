import React, { FC } from "react";
import { useModule } from "../src/Provider";
import { TModule } from "./app";

export const Item: FC<{ index: number; str: string }> = ({ index, str }) => {
    
    const {TodoModule} = useModule<TModule>();
    
    return (
        <div>
            <button onClick={()=>{
                TodoModule.actionDeleteItem(index)
            }}>删除</button>
            {str}
        </div>
    );
};
