import React, { Component } from "react";
import { Link, withRouter} from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { registerUser } from "../../actions/authActions";
import classnames from "classnames";
import DatePicker from 'react-date-picker';
import axios from "axios";
class Register extends Component {
  constructor() {
    super();
    this.state = {
      name: "",
      email: "",
      password: "",
      rating: "",
	  tags: [],
	  shareholders: [{name:"", start: "", end: ""}],
      errors: {},
	  elo: "",
	  file: "",
	  file2: "",
	  pp: "",
	  progress: 0,
	  progress2: 0
    };
  }
	isNumeric = (value) => {
        return /^\d+$/.test(value);
    }
	componentDidMount() {
    // If logged in and user navigates to Register page, should redirect them to dashboard
    if (!this.props.auth.isAuthenticated) {
      this.props.history.push("/");
    }
	else
	{
	if(this.props.auth.user.type===1)
	{
	   
      this.props.history.push("/dashboard");
	}
	else
	{
		console.log("THESE N AINT READY");
		axios.get("/api/users/test").then(res => {console.log(res);this.setState(res.data);this.setState({shareholders: res.data.ed_list});this.setState({tags: res.data.skills});});
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
onSubmit = async e => {
    e.preventDefault();
	this.setState({elo:true});
	await this.state.shareholders.map( async (holder, index) =>
	{
		console.log(holder);
		console.log(this.isNumeric(holder.start));
		if(this.isNumeric(holder.start) && (this.isNumeric(holder.end) || holder.end === ""))
		{
		}
		else
		{
			console.log("YUP");
			await this.setState({elo: false});
	console.log(this.state.elo);
			console.log("KUP");
		}
	});
	if(this.isNumeric(this.state.rating) || this.state.rating==="")
	{

	}
	else
	{
		await this.setState({elo: false});
	}
	console.log(this.state.elo);
	if(this.state.elo===false)
	{
		console.log("YEET");
		return 0;
	}
const newUser = {
	  type: "0",
      name: this.state.name,
      email: this.state.email,
      skills: this.state.tags,
	  rating: this.state.rating,
	  ed_list: this.state.shareholders
    };
axios.post("/api/users/edit", newUser);
console.log(newUser);
this.props.history.push("/dashboard");
  };

removeTag = (i) => {
    const newTags = [ ...this.state.tags ];
    newTags.splice(i, 1);
    this.setState({ tags: newTags });
  }

  inputKeyDown = (e) => {
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

  handleNameChange = evt => {
    this.setState({ name: evt.target.value });
  };

  handleShareholderNameChange = idx => evt => {
    const newShareholders = this.state.shareholders.map((shareholder, sidx) => {
      if (idx !== sidx) return shareholder;
      return { ...shareholder, name: evt.target.value };
    });

    this.setState({ shareholders: newShareholders });
  };
  handleShareholderStartChange = idx => evt => {
	  console.log(evt);
    const newShareholders = this.state.shareholders.map((shareholder, sidx) => {
      if (idx !== sidx) return shareholder;
      return { ...shareholder, start: evt.target.value };
    });

    this.setState({ shareholders: newShareholders });
  };
 handleShareholderEndChange = idx => evt => {
    const newShareholders = this.state.shareholders.map((shareholder, sidx) => {
      if (idx !== sidx) return shareholder;
      return { ...shareholder, end: evt.target.value };
    });

    this.setState({ shareholders: newShareholders });
  };




  handleAddShareholder = () => {
    this.setState({
		shareholders: this.state.shareholders.concat([{ name: "", start: "", end: "" }])
    });
  };

  handleRemoveShareholder = idx => () => {
    this.setState({
      shareholders: this.state.shareholders.filter((s, sidx) => idx !== sidx)
    });
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

	handleChange2 = (e) => {
        this.setState({progress2: 0});
        const file = e.target.files[0]; // accesing file
        this.setState({file2: file}); // storing file
    }
    uploadFile2 = () => {
        const formData = new FormData();
		formData.append('file', this.state.file2); // appending file
        axios.post('/api/users/uploadr', formData, {
            onUploadProgress: (ProgressEvent) => {
                let progress = Math.round(
                ProgressEvent.loaded / ProgressEvent.total * 100) + '%';
                this.setState({progress2: progress});
            }
        }).then(res => {
            console.log(res);
			this.setState(res.data);
        }).catch(err => console.log(err))}



render() {
    const { errors } = this.state;
	const { tags } = this.state;
const dval = new Date();
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
<label> Profile Picture</label>
	<div className="input-field col s12">
                <input type="file"  onChange={this.handleChange} />                <div className="progessBar" style={{ width: this.progress }}>
                   {this.progress}
                </div>
                <button onClick={this.uploadFile} className="upbutton">                   Upload
                </button>
            <hr />
            {/* displaying received image*/}
            {this.state.pp && <img src={this.state.pp}  style={{ width: 200 }}/>}
            </div>

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
                  value={this.state.rating}
                  error={errors.rating}
                  id="rating"
                  type="text"
                />
                <label htmlFor="rating">Rating</label>
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

<label className="col s12">Education</label>
{this.state.shareholders.map((shareholder, idx) => (
          <div className="shareholder col s12">
            <input
              type="text"
	          className= "col s3"
              placeholder={`Institute Name`}
              value={shareholder.name}
              onChange={this.handleShareholderNameChange(idx)}
            />
	      <input
              type="text"
	          className= "col s3"
              placeholder={`Start Year`}
              value={shareholder.start}
              onChange={this.handleShareholderStartChange(idx)}
            />
	      <input
              type="text"
	          className= "col s3"
              placeholder={`End Year`}
              value={shareholder.end}
              onChange={this.handleShareholderEndChange(idx)}
            />


            <button
              type="button"
              onClick={this.handleRemoveShareholder(idx)}
              className="small"
            >
              -
            </button>
          </div>
        ))}
<button
          type="button"
          onClick={this.handleAddShareholder}
          className="col s2"
        >
          Add Education
        </button>
	<div className="input-field col s12">
<label> Resume </label>
	<hr />
	<hr />
	<br />
                <input type="file"  onChange={this.handleChange2} />                <div className="progessBar" style={{ width: this.progress2 }}>
                   {this.progress2}
                </div>
                <button onClick={this.uploadFile2} className="upbutton">                   Upload
                </button>
            <hr />
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
