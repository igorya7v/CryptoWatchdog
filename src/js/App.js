/* jshint ignore:start */
import React from 'react'
import ReactDOM from 'react-dom'
import 'bootstrap/dist/css/bootstrap.css'
import '../css/style.css'
import HoldersTable from './HoldersTable'
import Transactions from './Transactions'

import { BrowserRouter as Router, Route, Link } from 'react-router-dom'

class App extends React.Component {

    render() {
        return (
            <Router>
                <div className="App">
                    <div className="container">
                        <ul>
                            <li><Link to="/">Home</Link></li>
                        </ul>
                        <hr/>
                        <Route exact path="/" component={HoldersTable} />
                        <Route path="/transactions/:address" component={Transactions} />
                    </div>
                </div>
            </Router>
        )
    }
}

ReactDOM.render(
   <App />,
   document.querySelector('#root')
)
