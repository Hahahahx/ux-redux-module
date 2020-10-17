# ux-autoroute

自动路由配套路由组件, [在线 demo](https://hahahahx.github.io/ux-autoroute/), [demo源码](https://github.com/Hahahahx/ux-autoroute/blob/master/example/app.tsx)

React, hook, 函数组件

配套自动化路由，解析[自动化路由](https://hahahahx.github.io/ux-autoroute-plugin/)所生成的路由映射表
----
在pages的根目录下会有顶级路由`/`，由此开始依次递归子集路由，
demo中`/`只作为引导，取`index.tsx`部分片段：
```typescript
const Index = () => {
    return (
        <RouterView />
    )
}
export default React.memo(Index, () => true);
```
可以看到，代码块中的`<RouterView/>`为子集路由的映射。

___
在该项目中的所有路由都采用配置的方式呈现，所以，在每个路由`index.tsx`的同级
目录下创建一个`route.config`就可以配置该路由的属性。<br/>
`route.config`是JSON文件。路由配置规则如下：
```
{
    "noLazy":true,    
    "default":true,
    "meta":{
        "name":"'主页'"
    }
} 
```
当noLazy为true时，该路由为非动态路由，建议在`/`、`/main`这种根路由下使用该规则。<br/>
如果不使用该规则，那么在子集路由渲染页面时，会因为匹配到自身的动态引入导致页面的重新渲染。
其结果往往是我们不希望看到的。<br/>
default被应用在父级路由引导子集路由时的默认路由，如顶级路由`/`只是一个空白的页面，
那么此时我们就需要将`/login`或者`/main`的default开启。<br/>
如此一来，我们在渲染`/`顶级路由时，就会访问默认路由，去加载`login->index.tsx`或`main->index.tsx`。

我们在路由中可以使用`useRoute`来取到meta的值和当前路由的子路由列表
```typescript

const Main = () => {
    const { meta, routes } = useRoute();
    return (
        <>
            {meta?.name}
            <ul>
                {routes.map((item, index) => (
                    <li key={index}>
                        <NavLink to={item.path}>{item.meta?.name}</NavLink>
                    </li>
                ))}
            </ul>

            <div>
                <RouterView />
            </div>
        </>
    );
};

```

除了上述的路由管理，我们可能还会遇到一些与业务紧密耦合复用性不高的组件，推荐在当前的路由目录下
新建`__Component`目录，来存放当前路由所依赖的业务组件。


在demo中，我们还对角色访问权限做了一个小的样例，它是在`Routers`组件的`before`属性中完成的。

Routers：
```typescript

/**
 * routers 路由映射表对象
 * noMatch 404
 * before 访问路有前触发，如果结果返回了JSX对象的话则替换默认的路由组件
 * after 路由组件生成后触发
 */
interface RouterParams {
    routers: Array<RouteParams>;
    noMatch?: () => ReactElement | JSX.Element;
    before?: (location: Location) => void | JSX.Element | ReactElement;
    after?: (location: Location) => void;
}

```



所生成的路由映射表`router.ts`:
```typescript
import Page from '@/pages/index';
export const routeConfig = [
    {
        noLazy: true,
        meta: {
            name: '根目录'
        },
        child: [
            {
                default: true,
                meta: {
                    name: '登录'
                },
                child: [],
                componentPath: 'pages/login/index.tsx',
                path: '/login'
            },
            {
                meta: {
                    name: '首页'
                },
                child: [
                    {
                        meta: {
                            name: '土豆'
                        },
                        child: [],
                        componentPath: 'pages/main/potato/index.tsx',
                        path: '/main/potato'
                    },
                    {
                        meta: {
                            name: '西红柿'
                        },
                        child: [],
                        componentPath: 'pages/main/tomato/index.tsx',
                        path: '/main/tomato'
                    }
                ],
                componentPath: 'pages/main/index.tsx',
                path: '/main'
            }
        ],
        componentPath: 'pages/index.tsx',
        path: '',
        component: Page
    }
]
```



----------------------

<b>注意：[ux-autoroute-plugin](https://github.com/Hahahahx/ux-autoroute-plugin)仅仅只负责生成路由映射表，该组件才是对路由映射表规则的实现，同理你也可以写自己的规则。</b>