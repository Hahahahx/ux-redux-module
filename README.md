# ux-redux-module

面向对象redux, [在线 demo](https://hahahahx.github.io/ux-redux-module/), [demo源码](https://github.com/Hahahahx/ux-redux-module/tree/master/example)

React, hook, 函数组件

-----------------------------

在该项目的状态管理中，约束用户必须采用`面向对象`的形式来编写，这有助于
更好的管理项目，面向对象的形式使我们更能清晰的看见状态的结构。

```typescript
class FileModule {

    @LocalStorage
    @SesstionStorage
    filename = 'FileModule';

    @SesstionStorage
    fileType = 'txt'

    @Update
    private update() { }

    @Action
    reqFile() {
        return UserApi.GetUserInfo('id1').then(res => {
            this.filename = 'FileModule被Action更新了';
            this.fileType = 'action'
        })
    }

    reqFilebyUpdate() {
        this.filename = 'FileModule被Update更新了';
        this.fileType = 'update'
        this.update()
    }
}
```
每一个类都可以提供一个update函数来更新你所做的状态改变，该update()必须要被@Update装饰，
且命名必须为"update"。

你也可以使用@Action，但是需要确保所装饰的函数的返回值是一个Promise对象，且你的状态修改也是在该流程中完成的。

被@SessionStorage和@LocalStorage装饰的字段会被注册到内存和本地中。<br/>
提供了deleteSession(moduleName:string,property?:string)和deleteLocal()可以让你自由的删除他们。<br/>
你需要确保你不会在你的事件流中使用到被删除的属性。因为被装饰的属性会不断的在更新状态中更新对应的Local或Session

引入:
```typescript

const module = { FileModule };
const getModule = () => module;
export type TModule = ReturnType<typeof getModule>;

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
```typescript

const Main = () => {

    const { FileModule } = useModule<TModule>()

    return (
        <div style={{ textAlign: 'center' }}>
            <div className='page'>
                FileModule-filename:{FileModule.filename}
            </div>
            <Button ghost onClick={() => {
                FileModule.reqFile()
            }}>ChangeFileModuleByAction</Button>
            <Button ghost onClick={() => {
                FileModule.reqFilebyUpdate()
            }}>ChangeUserModuleByUpdate</Button>
        </div>
    )
}
```
