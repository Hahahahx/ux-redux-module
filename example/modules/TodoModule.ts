import { Action, SessionStorage, Update } from "../../src/decorators";



/**
 * 需要加module状态名，不然现在是TodoModule，在编译打包以后就变成了e，webpack简化代码了，于是导致部分对其的识别失效 session
 */

class TodoModule {
    @SessionStorage
    list: string[] = [];

    @Update
    private update() {}

    @Action
    actionAddItem(item: string) {
        console.log('add',item)
        return new Promise((resolve) => resolve(item)).then((res) => {
            this.list.push(res as string);
        });
    }

    actionDeleteItem(index: number) {
        console.log('delete',index)
        const newlist = this.list.filter((item, i) => i !== index);
        this.list = newlist;
        this.update();
    }


}

export default new TodoModule();
