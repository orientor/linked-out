import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { loginGoogleUser} from "../../actions/authActions";
import classnames from "classnames";
import {proxy} from "../../../package.json";
import axios from "axios";
import queryString from 'query-string';

class Login extends Component {
  constructor() {
    super();
    this.state = {
	  name: "",
      email: "",
      password: "",
	  type: "0",
      errors: {}
    };
  }
	async componentDidMount() {
			let params = queryString.parse(this.props.location.search);
	console.log(params);
	if("token" in params)
	{
			var xo={};
	xo.token = "Bearer " + params.token;
	await this.props.loginGoogleUser(xo);
    this.props.history.push("/dashboard"); // push user to dashboard when they login
	}
	else
	{
		var email = params.email;
		this.setState({name: email, email: email, password: email});
	}
    // If logged in and user navigates to Register page, should redirect them to dashboard
  }
onChange = e => {
    this.setState({ [e.target.id]: e.target.value });
  };
onSubmit = e => {
    e.preventDefault();
const userData = {
      email: this.state.email,
      password: this.state.password
    };
console.log(userData);
  };
appl = () => {
	const newUser = {
		name: this.state.name,
		email: this.state.name,
		password: this.state.name,
		type: "0"
	};
	axios.post("/api/users/register", newUser).then((res) => this.props.history.push("/login")).catch((err) => console.log(err.data));
}
recr = () => {
	const newUser = {
		name: this.state.name,
		email: this.state.name,
		password: this.state.name,
		type: "1"
	};
	axios.post("/api/users/register", newUser).then((res) => this.props.history.push("/login"));
}

render() {
    const { errors } = this.state;
return (
      <div className="container">
	  <button onClick={this.appl} > Applicant</button>
	  <button onClick={this.recr} > Recruiter</button>
      </div>
    );
  }
}
Login.propTypes = {
  loginGoogleUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});
export default connect(
  mapStateToProps,
  { loginGoogleUser }
)(Login);
