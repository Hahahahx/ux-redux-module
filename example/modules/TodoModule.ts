import {
    BaseModule,
    LocalStorage,
    Module,
    SessionStorage, 
} from "../../src";
/**
 * 需要加module状态名，不然现在是TodoModule，在编译打包以后就变成了e，webpack简化代码了，于是导致部分对其的识别失效 session
 */

@Module
class TodoModule extends BaseModule {
    @SessionStorage
    list: string[] = [];

    @LocalStorage
    str = "string";

    @LocalStorage
    test = "string";

    async actionAddItem(item: string) {
        try {
            this.str = "fasdfa";
            this.list = await Promise.resolve([...this.list, item]);
            this.update();
        } catch (e: any) {
            console.log(e);
        }
    }

    actionDeleteItem(index: number) {
        const newlist = this.list.filter((item, i) => i !== index);
        this.list = [...newlist];

        this.update();
    }
}

export default new TodoModule();
