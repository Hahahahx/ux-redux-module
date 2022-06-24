# ux-redux-module

面向对象redux, [在线 demo](https://hahahahx.github.io/ux-redux-module/), [demo源码](https://github.com/Hahahahx/ux-redux-module/tree/master/example)

React, hook, 函数组件

-----------------------------

在该项目的状态管理中，约束用户必须采用`面向对象`的形式来编写，这有助于
更好的管理项目，面向对象的形式使我们更能清晰的看见状态的结构。

```typescript
@Module
class FileModule extends BaseModule {

    @LocalStorage
    @SesstionStorage
    filename = 'FileModule';

    @SesstionStorage
    fileType = 'txt' 
 

    reqFilebyUpdate() {
        this.filename = 'FileModule被Update更新了';
        this.fileType = 'update'
        this.update()
    }
}
```

模块类需要继承基础模块`BaseModule`，以及加装饰器`@Module`，之后可以在类内部使用`this.update()`方法来提交该模块状态的更新

被`@SessionStorage`和`@LocalStorage`装饰的字段会被注册到内存和本地中。<br/>
提供了`deleteSession(property:string)`和`deleteLocal(property:string)`可以让你自由的删除他们。<br/>
你需要确保你不会在你的事件流中使用到被删除的属性。因为被装饰的属性会不断的在更新状态中更新对应的Local或Session

引入:

```js

const module = { FileModule }; 
ReactDOM.render(
    <ReduxProvider value={module}>
        <div>可以刷新网页，对状态加了 @SesstionStorage 会保存到SesstionStorage中</div>
        <App />
    </ReduxProvider>,
    document.getElementById("root")
);

```

引入ReduxProvider，传入状态module，可以对module推测类型，方便后续在组件中更好的使用。

在组件中使用：

```js

const Main = () => {

    const fileModule = useModule(FileModule)

    return (
        <div style={{ textAlign: 'center' }}>
            <div className='page'>
                FileModule-filename:{fileModule.filename}
            </div>
            <Button ghost onClick={() => {
                fileModule.reqFile()
            }}>ChangeFileModuleByAction</Button>
            <Button ghost onClick={() => {
                fileModule.reqFilebyUpdate()
            }}>ChangeUserModuleByUpdate</Button>
        </div>
    )
}
```
