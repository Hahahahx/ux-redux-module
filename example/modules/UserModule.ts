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
class UserModule extends BaseModule {
    test = "string";
}

export default new UserModule();
