# react-router-async-chunks
Пример настройки webpack 4 для lazy-подгрузки модулей react-приложения, осуществляемой после перехода пользователя на определённый маршрут (react-router 4).

## Простое приложение на react
Базовая настройка и написание простого приложения на реакт подробно описана в проекте [react-workspace](https://github.com/codyfet/react-workspace). Проделайте шаги, описанные в руководстве по ссылке, либо склонируйте проект. ПШаги, описанные ниже, предполагают наличие развёрнутого абочего проекта.

## Устанавливаем react-router
Установить пакет react-router-dom
```
npm install --save react-router-dom
```

## Настраиваем работу с sass
Установить sass и лоадер для webpack для работы с sass. Кроме того, необходимо установить node-sass
```
npm install --save-dev sass node-sass sass-loader
```

Создать файл со стилями src/styles.scss и поместить туда следующий код:
```
html, body {
    font-size: 14px;
    font-family: sans-serif;

    .menu{
        > a {
            display: inline-block;
            margin: 0 10px;
            text-decoration: none;

            &.active {
                text-decoration: underline;
            }
        }
    }
}
```

Добавить поддержку работы с sass в webpack.config.js. На текущий момент он может выглядеть так:
```
const HtmlWebpackPlugin = require('html-webpack-plugin');

var htmlPlugin = new HtmlWebpackPlugin({
    template: "./src/index.html",
    filename: "./index.html"
});

module.exports = {
    entry: './src/index.jsx',
    output: {
        path: __dirname + '/dist',
        filename: 'main.js'
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: ['babel-loader']
            }, 
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.scss$/,
                use: ["style-loader", "css-loader", "sass-loader"]
            }
        ],
    },
    resolve: {
        extensions: ['.js', '.jsx', '.css', '.less']
    },
    plugins: [htmlPlugin]
};
```

## Пишем простое приложение с несколькими маршрутами
Напишем несколько простых компонентов:

Содержимое файла src/hello.component.jsx
```
import React from 'react';

export const HelloComponent = () => {
    return (
        <span style={{color: 'red'}}>Hello Component!</span>
    );
}
```

Содержимое файла src/contact.component.jsx
```
import React from 'react';

import {HelloComponent} from './hello.component';

const ContactComponent = () => {
    return (
        <h1>Contact Component! <HelloComponent /></h1>
    );
}

export default ContactComponent;
```

Содержимое файла src/about.component.jsx
```
import React from 'react';

import {HelloComponent} from './hello.component';

const AboutComponent = () => {
    return (
        <h1>About Component! <HelloComponent /></h1>
    );
}

export default AboutComponent;
```

Содержимое файла src/home.component.jsx
```
import React from 'react';

import {HelloComponent} from './hello.component';

const HomeComponent = () => {
    return (
        <h1>Home Component! <HelloComponent /></h1>
    );
}

export default HomeComponent;
```

Поместим в файл src/index.jsx следующий код приложения с реализованным роутером:
```
import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter, Switch, NavLink as Link, Route} from 'react-router-dom';
import {ContactComponent} from './contact.component';
import {AboutComponent} from './about.component';
import {HomeComponent} from './home.component';

import './styles.scss';

class App extends React.Component {
    render() {
        return(
            <BrowserRouter>
                <div>
                    <div className="menu">
                        <Link exact to="/" activeClassName="active">Home</Link>
                        <Link to="/about" activeClassName="active">About</Link>
                        <Link to="/contact" activeClassName="active">Contact</Link>
                    </div>
                    
                    <Switch>
                        <Route exact path="/" component={HomeComponent} />
                        <Route path="/about" component={AboutComponent} />
                        <Route path="/contact" component={ContactComponent} />
                    </Switch>
                </div>
            </BrowserRouter>
        );
    }
}

ReactDOM.render(<App />, document.getElementById('root'));
```

## Устанавливаем плагин syntax-dynamic-import для babel
Для корректной работы функции import в webpack (используется для реализации асинхронной подгрузки модулей) необходимо установить плагин для бабеля:
```
npm install --save-dev babel-plugin-syntax-dynamic-import
```

Обновляем файл .babelrc (настройки бабеля). На данный момент он может выглядеть так:
```
{
    "presets": [
        "env",
        "react"
    ],
    "plugins": [
        "syntax-dynamic-import"
    ]
}
```

## Устанавливаем пакет react-loadable
Данный пакет необходим для реализации асинхронной подгрузки react компонентов приложения.
```
npm install --save react-loadable
```

## Добавляем асинхронную подгрузку компонента
Добавим компонент-спиннер. Внесём изменения в код роутера в файле src/index.
```
import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter, Switch, NavLink as Link, Route} from 'react-router-dom';
import loadable from 'react-loadable';

import './styles.scss';

/**
 * Компонент-спиннер.
 */
const LoadingComponent = () => <h3>please wait...</h3>;

/**
 * Loadable-обёртка для компонента, которая подгрузит компонент асинхронно.
 * Важно отметить, что подгружаемый асинхронно компонент должен экспортироваться из модуля как дефолтный.
 */
const AsyncHomeComponent = loadable({
    loader: () => import('./home.component'),
    loading: LoadingComponent
});

const AsyncAboutComponent = loadable({
    loader: () => import('./about.component'),
    loading: LoadingComponent
});

const AsyncContactComponent = loadable({
    loader: () => import('./contact.component'),
    loading: LoadingComponent
});

class App extends React.Component {
    render() {
        return (
            <BrowserRouter>
                <div>
                    <div className="menu">
                        <Link exact to="/" activeClassName="active">Home</Link>
                        <Link to="/about" activeClassName="active">About</Link>
                        <Link to="/contact" activeClassName="active">Contact</Link>
                    </div>

                    <Switch>
                        <Route exact path="/" render={(props) => <AsyncHomeComponent {...props} value="1" />} />
                        <Route path="/about" render={(props) => <AsyncAboutComponent {...props} value="2" />} />
                        <Route path="/contact" render={(props) => <AsyncContactComponent {...props} value="3" />} />
                    </Switch>
                </div>
            </BrowserRouter>
        );
    }
}

ReactDOM.render(<App />, document.getElementById('root'));
```

ссылки:
https://itnext.io/react-router-and-webpack-v4-code-splitting-using-splitchunksplugin-f0a48f110312