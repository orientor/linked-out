import React, { Component } from "react";
import { Link, withRouter} from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { registerUser } from "../../actions/authActions";
import classnames from "classnames";
import axios from "axios";
import DatePicker from 'react-date-picker';
import Select from 'react-select'
class Register extends Component {
  constructor() {
    super();
    this.state = {
      job: "",
      sop: "",
	  job_title: "",
	  app_no: "",
	  post_no: "",
	  tags: ["C++"],
	  type_of_job: "0",
	  duration: "0",
	  salary: "",
	  deadline: new Date(),
	  errors: {}
    };
  }
		isNumeric = (value) => {
        return /^\d+$/.test(value);
    }
	componentDidMount() {
    // If logged in and user navigates to Register page, should redirect them to dashboard
    if (this.props.auth.type === 1) {
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
onChangeDate = e => {
    this.setState({ deadline: e });
  };

onSubmit = e => {
	e.preventDefault();
	console.log(e);
if(this.isNumeric(this.state.app_no) && this.isNumeric(this.state.duration) && this.isNumeric(this.state.post_no) && this.isNumeric(this.state.salary))
{
const newUser = {
	  job_title: this.state.job_title,
	  app_no: this.state.app_no,
	  post_no: this.state.post_no,
	  deadline: this.state.deadline.getTime(),
	  skill: this.state.tags,
	  type_of_job: this.state.type_of_job,
	  duration: this.state.duration,
	  salary: this.state.salary
    };
axios.post("/api/jobs/job", newUser).then(() => {this.props.history.push("/dashboard");});
}
  };

removeTag = (i) => {
    const newTags = [ ...this.state.tags ];
    newTags.splice(i, 1);
    this.setState({ tags: newTags });
  }

  inputKeyDown = (e) => {
	console.log("XO");
    const val = e.target.value;
    if (e.key === 'Enter' && val) {
      if (this.state.tags.find(tag => tag.toLowerCase() === val.toLowerCase())) {
        return;
      }
      this.setState({ tags: [...this.state.tags, val]});
      this.tagInput.value = null;
    } else if (e.key === 'Backspace' && !val) {
      this.removeTag(this.state.tags.length - 1);
    }
  }

render() {
    const { errors } = this.state;
    const { tags } = this.state;
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
                <b>Create a New Job</b> below
              </h4>
            </div>
            <form noValidate onSubmit={this.onSubmit}>
             <div className="input-field col s12">
                <input
                  onChange={this.onChange}
                  value={this.state.job_title}
                  error={errors.job_title}
                  id="job_title"
                  type="text"
                />
                <label htmlFor="job_title">Job Title</label>
              </div>
	        <div className="input-field col s12">
                <input
                  onChange={this.onChange}
                  value={this.state.app_no}
                  error={errors.app_no}
                  id="app_no"
                  type="text"
                />
                <label htmlFor="app_no">Number of Applications</label>
              </div>
	<div className="input-field col s12">
                <input
                  onChange={this.onChange}
                  value={this.state.post_no}
                  error={errors.post_no}
                  id="post_no"
                  type="text"
                />
                <label htmlFor="post_no">Number of Posts</label>
              </div>
	<div className="input-field col s12">
                <input
                  onChange={this.onChange}
                  value={this.state.salary}
                  error={errors.salary}
                  id="salary"
                  type="text"
                />
                <label htmlFor="salary">Salary</label>
              </div>

	<div>
	<label> Deadline </label>
	<br />
      <DatePicker
        onChange={this.onChangeDate}
        value={this.state.deadline}
      />
    </div>
<div class="col s12">
    <label>Type of Job</label>
    <select className="browser-default" id="type_of_job" value={this.state.type_of_job} onChange={this.onChange}>
      <option value="0">Full Time</option>
      <option value="1">Part Time</option>
      <option value="2">Work From Home</option>
    </select>
  </div>
<div class="col s12">
    <label>Duration in Months</label>
    <select className="browser-default" id="duration" value={this.state.duration} onChange={this.onChange}>
      <option value="0">0</option>
      <option value="1">1</option>
      <option value="2">2</option>
      <option value="3">3</option>
      <option value="4">3</option>
      <option value="5">5</option>
      <option value="6">6</option>
    </select>
  </div>

<div className="col s12">
	<label>Skills</label>
	<div className="input-tag">
        <ul className="input-tag__tags">
          { tags.map((tag, i) => (
            <li key={tag}>
              {tag}
              <button type="button" onClick={() => { this.removeTag(i); }}>+</button>
            </li>
          ))}
          <li className="input-tag__tags__input"><input type="text" onKeyDown={this.inputKeyDown} ref={c => { this.tagInput = c; }} /></li>
        </ul>
      </div>
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
