import React, {Component} from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.css";
import Deploy from "./components/Deploy";
import Verify from "./components/Verify";

class App extends Component {
    render() {
        return (
            <React.Fragment>
                <Deploy/>
                <Verify/>
            </React.Fragment>
        );
    }
}

export default App;
