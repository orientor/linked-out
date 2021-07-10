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
      name: "",
      email: "",
      password: "",
      contact: "",
	  bio: "",
      errors: {},
	  file: "",
	  progress: 0,
	  pp: "",
	  resume: ""
    };
  }
	componentDidMount() {
    // If logged in and user navigates to Register page, should redirect them to dashboard
    if (!this.props.auth.isAuthenticated) {
      this.props.history.push("/");
    }
	else
	{
	if(this.props.auth.user.type===0)
	{
	   
      this.props.history.push("/dashboard");
	}
	else
	{
		console.log("THESE N AINT READY");
		axios.get("/api/users/test").then(res => {console.log(res);this.setState(res.data);});
	}
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
	  type: "1",
      name: this.state.name,
      email: this.state.email,
      contact: this.state.contact,
	  bio: this.state.bio
    };
axios.post("/api/users/edit", newUser);
console.log(newUser);
this.props.history.push("/dashboard");
  };
	handleChange = (e) => {
        this.setState({progress: 0});
        const file = e.target.files[0]; // accesing file
        this.setState({file: file}); // storing file
    }
    uploadFile = () => {
        const formData = new FormData();
		formData.append('file', this.state.file); // appending file
        axios.post('/api/users/uploadp', formData, {
            onUploadProgress: (ProgressEvent) => {
                let progress = Math.round(
                ProgressEvent.loaded / ProgressEvent.total * 100) + '%';
                this.setState({progress: progress});
            }
        }).then(res => {
            console.log(res);
			this.setState(res.data);
        }).catch(err => console.log(err))}

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
                <b>Edit your Profile</b> below
              </h4>
            </div>
            <form noValidate onSubmit={this.onSubmit}>
              <div className="input-field col s12">
                <input
                  onChange={this.onChange}
                  value={this.state.name}
                  error={errors.name}
                  id="name"
                  type="text"
                />
                <label htmlFor="name">Name</label>
              </div>
              <div className="input-field col s12">
                <input
                  onChange={this.onChange}
                  value={this.state.email}
                  error={errors.email}
                  id="email"
                  type="email"
                />
                <label htmlFor="email">Email</label>
              </div>
              <div className="input-field col s12">
                <input
                  onChange={this.onChange}
                  value={this.state.contact}
                  error={errors.contact}
                  id="contact"
                  type="text"
                />
                <label htmlFor="contact">Contact</label>
              </div>
	         <div className="col s12">
                <label htmlFor="bio">Bio</label>
	            <textarea
                  onChange={this.onChange}
                  value={this.state.bio}
                  error={errors.bio}
                  id="bio"
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
                  type="button"
	              onClick={this.onSubmit}
                  className="btn btn-large waves-effect waves-light hoverable blue accent-3"
                >
                  Sign up
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
