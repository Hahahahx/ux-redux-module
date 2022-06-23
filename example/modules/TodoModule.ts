import { Action, Module, SessionStorage, Update } from "../../src/decorators";

/**
 * 需要加module状态名，不然现在是TodoModule，在编译打包以后就变成了e，webpack简化代码了，于是导致部分对其的识别失效 session
 */

class BaseModule {
    @Update
    dispatch() {}

    update() {}
}

@Module
class TodoModule extends BaseModule {
    @SessionStorage
    list: string[] = [];

    str = "string";

    // @Action
    async actionAddItem(item: string) {
        console.log("add", item);
        try {
            this.list = await Promise.resolve([...this.list, item]);
            this.update();
        } catch (e: any) {
            console.log(e);
        }
    }

    actionDeleteItem(index: number) {
        console.log("delete", index);
        const newlist = this.list.filter((item, i) => i !== index);
        this.list = [...newlist];
        this.update();
    }
}

export default new TodoModule();
