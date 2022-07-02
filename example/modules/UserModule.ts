import { Module, BaseModule } from "../../lib";

/**
 * 需要加module状态名，不然现在是TodoModule，在编译打包以后就变成了e，webpack简化代码了，于是导致部分对其的识别失效 session
 */

@Module
class UserModule extends BaseModule {
    test = "userModule ";
}

export default new UserModule();
