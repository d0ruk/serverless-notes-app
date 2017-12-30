import React from "react";
import { render } from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/es/integration/react";
import { element } from "prop-types";
// import { Auth } from "aws-amplify";

import createStore from "./state";
import { getCurrentUser } from "./util";
import { setValidUser } from "./state/actions/auth-actions";

const { persistor, store } = createStore();

class Root extends React.Component {
  static propTypes = {
    children: element,
  }

  componentWillMount = async () => {
    const currentUser = await getCurrentUser();

    if (currentUser) {
      await store.dispatch(setValidUser(currentUser));
    }
  }

  render() {
    return (
      <Provider store={store}>
        <PersistGate
          // loading={<Loading />}
          // onBeforeLift={onBeforeLift}
          persistor={persistor}
        >
          <Router>
            {this.props.children}
          </Router>
        </PersistGate>
      </Provider>
    );
  }
}

export default (Component, props = {}) => {
  render(
    <Root>
      <Component {...props} />
    </Root>,
    document.getElementById("root"),
  );
};
