import React, { Component } from "react";
import { Link, withRouter} from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { registerUser } from "../../actions/authActions";
import classnames from "classnames";
import axios from "axios";

class Register extends Component {
  constructor() {
    super();
    this.state = {
      job: "",
      sop: "",
	  errors: {},
	  errorx: ""
    };
  }
	componentDidMount() {
    // If logged in and user navigates to Register page, should redirect them to dashboard
    if ("job"  in this.props.auth) {
      this.setState({job: this.props.auth.job});
    }
    else
	{
this.props.history.push("/dashboard");
	}
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({
        errors: nextProps.errors
      });
    }
  }
onChange = e => {
    this.setState({ [e.target.id]: e.target.value });
  };
onSubmit = e => {
    e.preventDefault();
const newUser = {
	  job: this.state.job,
	  sop: this.state.sop
    };
axios.post("/api/jobs/app", newUser).then((res) => {console.log(res.status);
	this.props.history.push("/dashboard");
}).catch(res => {console.log("YELLO");this.setState({errorx: res.response.data.error});});
console.log(newUser);
  };
render() {
    const { errors } = this.state;
return (
      <div className="container">
        <div className="row">
          <div className="col s8 offset-s2">
            <Link to="/" className="btn-flat waves-effect">
              <i className="material-icons left">keyboard_backspace</i> Back to
              home
            </Link>
            <div className="col s12" style={{ paddingLeft: "11.250px" }}>
              <h4>
                <b>Create</b> Application below
              </h4>
	          <p className="red">{this.state.errorx}</p>
            </div>
            <form noValidate onSubmit={this.onSubmit}>
		         <div className="col s12">
                <label htmlFor="sop">SOP</label>
	            <textarea
                  onChange={this.onChange}
                  value={this.state.sop}
                  error={errors.sop}
                  id="sop"
                />
              </div>

              <div className="col s12" style={{ paddingLeft: "11.250px" }}>
                <button
                  style={{
                    width: "150px",
                    borderRadius: "3px",
                    letterSpacing: "1.5px",
                    marginTop: "1rem"
                  }}
                  type="submit"
                  className="btn btn-large waves-effect waves-light hoverable blue accent-3"
                >
                  Apply
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

Register.propTypes = {
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
)(withRouter(Register));
