import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter, Switch, NavLink as Link, Route} from 'react-router-dom';
import loadable from 'react-loadable';

import './styles.scss';

/**
 * Компонент-спиннер.
 */
const LoadingComponent = () => <h3>please wait...</h3>;

const AsyncHomeComponent = loadable({
    loader: () => import('./home.component'),
    loading: LoadingComponent
});

const AsyncAboutComponent = loadable({
    loader: () => import('./about.component'),
    loading: LoadingComponent
});

/**
 * Loadable-обёртка для ContactComponent, которая подгрузит наш компонент асинхронно.
 * Важно отметить, что подгружаемый асинхронно компонент должен экспортироваться из модуля как дефолтный.
 */
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