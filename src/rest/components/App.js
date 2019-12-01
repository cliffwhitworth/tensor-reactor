import React from 'react';
// import { BrowserRouter, HashRouter, MemoryRouter, Route, Link } from 'react-router-dom';
import { BrowserRouter, Route } from 'react-router-dom';
import Header from './Header';
import PostRoute from './routes/PostRoute';
import ListRoute from './routes/ListRoute';
import ReadRoute from './routes/ReadRoute';
import DeleteRoute from './routes/DeleteRoute';
import PutRoute from './routes/PutRoute';
import history from '../history';

// const MelloWord = () => {
//     return (
//         <div>
//             Mello Word<br />
//             <Link to='/yellowbird'>Yellow Bird</Link>
//         </div>)
// }

// const YellowBird= () => {
//     return (
//         <div>
//             Yellow Bird<br />
//             <Link to='/'>Mello Word</Link>
//         </div>)
// }

const App = () => {
    return (
        <div className="ui container">
            {/* change BrowserRouter to vanilla Router to control history */}
            <BrowserRouter history={history}>
                <div>
                    <Header />
                    <Route path="/" exact component={ListRoute} />
                    <Route path="/route/post" exact component={PostRoute} />
                    <Route path="/route/list" exact component={ListRoute} />
                    <Route path="/route/read/:id" exact component={ReadRoute} />
                    <Route path="/route/delete/:id" exact component={DeleteRoute} />
                    <Route path="/route/put/:id" exact component={PutRoute} />
                </div>
            </BrowserRouter>
            {/*<br /><strong>Hash Browser</strong><br />
             <HashRouter> 
                <div>
                    <Route path="/" exact component={MelloWord} />
                    <Route path="/yellowbird" component={YellowBird} />
                </div>
            </HashRouter>
            <br /><strong>Memory Browser</strong><br />
            <MemoryRouter> 
                <div>
                    <Route path="/" exact component={MelloWord} />
                    <Route path="/yellowbird" component={YellowBird} />
                </div>
            </MemoryRouter> */}
        </div>
    )
}

export default App;