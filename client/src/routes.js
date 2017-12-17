import React from "react"
import { Route, Switch } from "react-router-dom"

import Home from "./pages/Home"
import Login from "./pages/Login"
// import SignUp from "./pages/SignUp"
import NotFound from "./components/NotFound"

export const List = [
  {
    href: "/",
    iconType: "home",
    name: "Home",
  },
  {
    href: "/login",
    iconType: "login",
    name: "Login",
  },
  {
    href: "/signup",
    iconType: "user-add",
    name: "Sign Up",
  }
]

export const Component = props => (
  <Switch>
    <Route path="/" exact component={Home} />
    <Route path="/login" exact component={Login} />
    <Route component={NotFound} />
  </Switch>
);
