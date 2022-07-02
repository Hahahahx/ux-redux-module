import {
    Stringify,
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
    @Stringify
    @SessionStorage
    list: string[] = [];

    @LocalStorage
    str = "string";

    @LocalStorage
    test = "string";

    actionAddItem(item: string) {
        this.list = [...this.list, item];
        this.update();
    }

    actionDeleteItem(index: number) {
        const newlist = this.list.filter((item, i) => i !== index);
        this.list = [...newlist];

        this.update();
    }
}

export default new TodoModule();
