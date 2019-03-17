# react-router-async-chunks
Пример настройки webpack 4 для lazy-подгрузки модулей react-приложения, осуществляемой после перехода пользователя на определённый маршрут (react-router 4).

### Простое приложение на react
Базовая настройка и написание простого приложения на реакт подробно описана в проекте [react-workspace](https://github.com/codyfet/react-workspace). Проделайте шаги, описанные в руководстве по ссылке, либо склонируйте проект.

### Устанавливаем react-router
Установить пакет react-router-dom
```
npm install --save react-router-dom
```

### Настраиваем работу с sass
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

            &.active{
                text-decoration: underline;
            }
        }
    }
}
```

Добавить поддержку работы с sass в webpack.config.js. На текущий моент он должен выглядеть так:
```
const HtmlWebpackPlugin = require('html-webpack-plugin');

var htmlPlugin = new HtmlWebpackPlugin({
    template: "./src/index.html",
    filename: "./index.html"
});

module.exports = {
    entry: './src/index.js',
    output: {
        path: __dirname + '/dist',
        filename: 'main.js'
    },
    module: {
        rules: [
            {
                test: /\.(js)$/,
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
        extensions: ['.js', '.css', '.scss']
    },
    plugins: [htmlPlugin]
};
```

### Пишем простое приложение с несколькими маршрутами
Напишем несколько простых компонентов:

Содержимое файла src/hello.component.js
```
import React from 'react';

export const HelloComponent = (props) => {
    return (
        <span style={{ color: 'red' }}>Hello Component!</span>
    );
}
```

Содержимое файла src/contact.component.js
```
import React from 'react';

import HelloComponent from './hello.component';

export const ContactComponent = (props) => {
    return (
        <h1>Contact Component! <HelloComponent /></h1>
    );
}
```

Содержимое файла src/about.component.js
```
import React from 'react';

import HelloComponent from './hello.component';

export const AboutComponent = ( props ) => {
    return (
        <h1>About Component! <HelloComponent /></h1>
    );
}
```

Содержимое файла src/home.component.js
```
import React from 'react';

import HelloComponent from './hello.component';

export const HomeComponent = ( props ) => {
    return (
        <h1>Home Component! <HelloComponent /></h1>
    );
}
```

Поместим в файл src/index.jsx следующий код приложения с реализованным роутером:
```
import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter, Switch, NavLink as Link, Route} from 'react-router-dom';
import {ContactComponent} from './component.contact';
import {AboutComponent} from './about.contact';
import {HomeComponent} from './home.contact';

import './styles.scss';

class App extends React.Component {
    constructor( props ) {
        super( props );
    }

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

### Устанавливаем плагин syntax-dynamic-import для babel
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

### Устанавливаем пакет react-loadable
Данный пакет необходим для реализации асинхронной подгрузки react компонентов приложения.
```
npm install --save react-loadable
```

### Напишем простой компонент, который будет использоваться на всех страницах
Создадим файл src/hello.component.js
```
import React from 'react';

const HelloComponent = (props) => {
    return (
        <span style={{color: 'red'}}>Hello Component!</span>
    );
}

export default HelloComponent;
```

### Добавляем асинхронную подгрузку компонента
Добавим компонент-спиннер. Внесём изменения в код роутера в файле src/index:
```
import loadable from 'react-loadable';
...
const LoadingComponent = () => <h3>please wait...</h3>;
...
const AsyncContactComponent = loadable({
    loader: () => import('./contact.component'),
    loading: LoadingComponent
});
...
<Switch>
    <Route exact path="/" component={HomeComponent} />
    <Route path="/about" component={AboutComponent} />
    <Route path="/contact" render={ 
        (props) => <AsyncContactComponent {...props} value="1" />
    } />
</Switch>
...
```

refereneces:
https://itnext.io/react-router-and-webpack-v4-code-splitting-using-splitchunksplugin-f0a48f110312
