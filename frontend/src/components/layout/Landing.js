import React, { Component } from "react";
import { Link } from "react-router-dom";
import { withRouter} from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {registerUser} from "../../actions/authActions";

class Landing extends Component {
  componentDidMount()
{
	console.log("BIG PROBLEM");
	if(this.props.auth.isAuthenticated)
	{
		console.log("Problem");
		this.props.history.push("/dashboard");
	}
}
  render() {
    return (
      <div style={{ height: "75vh" }} className="container valign-wrapper">
        <div className="row">
          <div className="col s12 center-align">
            <h4>
		    Get a job from scratch or recruit people.
            </h4>
            <p className="flow-text grey-text text-darken-1">
              Made in India.
            </p>
            <br />
            <div className="col s6">
              <Link
                to="/register"
                style={{
                  width: "140px",
                  borderRadius: "3px",
                  letterSpacing: "1.5px"
                }}
                className="btn btn-large waves-effect waves-light hoverable blue accent-3"
              >
                Register
              </Link>
            </div>
            <div className="col s6">
              <Link
                to="/login"
                style={{
                  width: "140px",
                  borderRadius: "3px",
                  letterSpacing: "1.5px"
                }}
                className="btn btn-large btn-flat waves-effect black white-text"
              >
                Log In
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
Landing.propTypes = {
  registerUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};


const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { registerUser }
)(withRouter(Landing));
