import React, {Component} from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import Dapp from './components/Dapp';

class App extends Component {
    render() {
        return (
            <React.Fragment>
                <Dapp/>
            </React.Fragment>
        );
    }
}

export default App;
