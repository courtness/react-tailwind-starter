import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";
import Header from "./components/Header";
import IndexPage from "./templates/index-page";

class AppComponent extends Component {
  appRef = React.createRef();

  //

  render() {
    return (
      <div ref={this.appRef} className="App">
        <Header />

        <Switch>
          <Route exact path="/" render={props => <IndexPage {...props} />} />
        </Switch>
      </div>
    );
  }
}

const App = () => {
  return <AppComponent />;
};

export default App;
