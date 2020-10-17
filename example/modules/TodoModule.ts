import { Action, SesstionStorage, Update } from "../../src/decorators";

class TodoModule {
    @SesstionStorage
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
