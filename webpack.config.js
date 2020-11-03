const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const htmlWebpackPlugin = new HtmlWebpackPlugin({
    template: path.join(__dirname, "./example/index.html"),
    filename: "./index.html",
});

const rules = [
    {
        test: /\.css/,
        use: [
            "style-loader",
            {
                loader: "css-loader",
                options: {
                    modules: true,
                },
            },
        ],
    },
    {
        test: /\.(js|jsx|ts|tsx)$/,
        use: {
            loader: "babel-loader",
            options: {
                presets: [
                    [
                        "@babel/preset-env",
                        {
                            targets: {}, // 这里是targets的配置，根据实际browserslist设置
                            corejs: 3, // 添加core-js版本
                            modules: false, // 模块使用 es modules ，不使用 commonJS 规范
                            useBuiltIns: "usage", // 默认 false, 可选 entry , usage
                        },
                    ],
                    "@babel/preset-react",
                    "@babel/preset-typescript",
                ],
                plugins: [
                    [
                        "@babel/plugin-transform-runtime",
                        {
                            corejs: false, // 默认值，可以不写
                            helpers: true, // 默认，可以不写
                            regenerator: false, // 通过 preset-env 已经使用了全局的 regeneratorRuntime, 不再需要 transform-runtime 提供的 不污染全局的 regeneratorRuntime
                            useESModules: true, // 使用 es modules helpers, 减少 commonJS 语法代码
                        },
                    ],
                ],
            },
        },
        exclude: /node_modules/,
    },
    {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: "ts-loader",
    },
];

module.exports = {
    entry: [
        "core-js/es/map",
        "core-js/es/set",
        path.join(__dirname, "./example/app.tsx"),
    ],
    output: {
        path: path.join(__dirname, "./example/dist"),
        filename: "index.js",
        //libraryTarget: "commonjs2",
    },
    module: {
        rules: rules,
    },
    plugins: [htmlWebpackPlugin],
    resolve: {
        alias: {
            "@": path.resolve("example"),
        },
        extensions: [".js", ".jsx", ".ts", ".tsx"],
        fallback: { crypto: false },
    },
    // externals: [
    //     // nodeExternals(),
    //     {
    //         react: {
    //             root: "React",
    //             commonjs2: "react",
    //             commonjs: "react",
    //             amd: "react",
    //         },
    //         "react-dom": {
    //             root: "ReactDOM",
    //             commonjs2: "react-dom",
    //             commonjs: "react-dom",
    //             amd: "react-dom",
    //         },
    //     },
    // ],
    // devtool: "source-map",
    devtool: "cheap-module-source-map",
    devServer: {
        port: 9000,
    },
};
