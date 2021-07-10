import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch} from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Landing from "./components/layout/Landing";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import { Provider } from "react-redux";
import store from "./store";
import jwt_decode from "jwt-decode";
import setAuthToken from "./utils/setAuthToken";
import { setCurrentUser, logoutUser } from "./actions/authActions";
import PrivateRoute from "./components/private-route/PrivateRoute";
import Dashboard from "./components/dashboard/Dashboard";
import RegisterAppl from "./components/auth/RegisterAppl"
import EditAppl from "./components/auth/EditAppl"
import EditRecr from "./components/auth/EditRecr"
import RegisterRecr from "./components/auth/RegisterRecr"
import RegisterApp from "./components/auth/RegisterApp"
import RegisterJob from "./components/auth/RegisterJob"
import Jobs from "./components/dashboard/Job";
import JobRecr from "./components/dashboard/JobRecr";
import ApplRecr from "./components/dashboard/ApplRecr";
import Appl from "./components/dashboard/Appl"
import Emp from "./components/dashboard/Employees"
import EditJob from "./components/auth/EditJob"
import Glog from "./components/auth/LoginGoogle"
if (localStorage.jwtToken) {
  // Set auth token header auth
  const token = localStorage.jwtToken;
  setAuthToken(token);
  // Decode token and get user info and exp
  let decoded = jwt_decode(token);
  // Set user and isAuthenticated
  store.dispatch(setCurrentUser(decoded));
// Check for expired token
  const currentTime = Date.now() / 1000; // to get in milliseconds
  if (decoded.exp < currentTime) {
    // Logout user
    store.dispatch(logoutUser());
    // Redirect to login
    window.location.href = "./login";
  }
}

class App extends Component {
  render() {
    return (
	  <Provider store={store}>
      <Router>
        <div className="App">
          <Navbar />
          <Route exact path="/" component={Landing} />
          <Route exact path="/register" component={Register} />
          <Route exact path="/login" component={Login} />
		  <Route exact path="/registerappl" component={RegisterAppl} />
		  <Route exact path="/editappl" component={EditAppl} />
		  <Route exact path="/editrecr" component={EditRecr} />
		  <Route exact path="/editjob" component={EditJob} />
		  <Route exact path="/registerrecr" component={RegisterRecr} />
		  <Route exact path="/registerapp" component={RegisterApp} />
		  <Route exact path="/registerjob" component={RegisterJob} />
		  <Route exact path="/emp" component={Emp} />
		  <Route exact path="/jobs" component={Jobs} />
		  <Route exact path="/jobrecr" component={JobRecr} />
		  <Route exact path="/applrecr" component={ApplRecr} />
		  <Route exact path="/appl" component={Appl} />
		  <Route exact path="/glog" component={Glog} />
		<Switch>
              <PrivateRoute exact path="/dashboard" component={Dashboard} />
            </Switch>
        </div>
      </Router>
	</Provider>
    );
  }
}
export default App;
