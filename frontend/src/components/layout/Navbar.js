import React, { Component } from "react";
import { Link, withRouter} from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser } from "../../actions/authActions";

function Greeting(props) {
  const isLoggedIn = props.isLoggedIn;
	console.log("YOLO");
	console.log(isLoggedIn);
  if (isLoggedIn === 1) {
	  console.log("YELL");
    return (
<Link to="registerjob"> Job+ </Link>
	);
} 
else if (isLoggedIn === 0) {
	  console.log("YELL");
    return (
<Link to="appl"> See applications </Link>
	);
}

else
{
	return null;
}
}
function Greeting2(props) {
  const isLoggedIn = props.isLoggedIn;
	console.log("YOLO");
	console.log(isLoggedIn);
  if (isLoggedIn === 1) {
	  console.log("YELL");
    return (
<Link to="emp"> Employees </Link>
	);
} 
else
{
	return null;
}
}

function Profile(props) {
  const isLoggedIn = props.isLoggedIn;
	console.log("YOLO");
	console.log(isLoggedIn);
  if (isLoggedIn === 0) {
	  console.log("YELL");
    return (
<Link to="editappl"> Profile </Link>
	);
}
else if (isLoggedIn === 1) {
	  console.log("YELL");
    return (
<Link to="editrecr"> Profile </Link>
	);
}
else
{
	return null;
}
}


class navbar extends Component {
	Logout(props) {
  const isLoggedIn = props.isLoggedIn;
	console.log("YOLO");
	console.log(isLoggedIn);
  if (isLoggedIn === 0) {
	  console.log("GOT INNNNNNN");
    return (
<a onClick={props.func}> Logout </a>
	);
}
else if (isLoggedIn === 1) {
	  console.log("YELL");
    return (
<a onClick={props.func}> Logout </a>
	);
}
else
{
	return null;
}
}

  func = () => {this.props.logoutUser(); this.props.history.push("/");}
  render() {
	console.log(this.props.auth);
    return (
		<div className="container blue">
                <nav className="blue">
<Link to="/" className="blue">Home </Link>
	<Greeting isLoggedIn={this.props.auth.user.type} />
	<Greeting2 isLoggedIn={this.props.auth.user.type} />
	<Profile isLoggedIn={this.props.auth.user.type} />
    <this.Logout isLoggedIn={this.props.auth.user.type} func={this.func}/>
                </nav>
            </div>
	);
}
}
navbar.propTypes = {
  LogoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};
const mapstatetoprops = state => ({
  auth: state.auth
});
export default connect(
  mapstatetoprops,
  { logoutUser }
)(withRouter(navbar));
