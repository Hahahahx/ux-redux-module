import React, { FC } from "react"; 

// import { TModule } from "./app"; 
import { TodoModule } from "./modules";

export const Item: FC<{ index: number; str: string }> = ({ index, str }) => {
    
    // const {TodoModule} = useModule<TModule>();
 
    
    return (
        <div>
            <button onClick={()=>{
                TodoModule.actionDeleteItem(index)
            }}>删除</button>
            {str}
        </div>
    );
};
