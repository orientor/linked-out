import React, { Component } from "react";
import axios from "axios";
import { Link, withRouter} from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { registerUser } from "../../actions/authActions";
import classnames from "classnames";
import DatePicker from 'react-date-picker';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import IconButton from "@material-ui/core/IconButton";
import InputAdornment from "@material-ui/core/InputAdornment";
import Rating from '@material-ui/lab/Rating';
import SearchIcon from "@material-ui/icons/Search";
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import Autocomplete from '@material-ui/lab/Autocomplete';
function Acor(props)
{
	if(props.status === "Applied")
	{
		return (<TableCell><button onClick={() => props.func(props.id)}>Shortlist</button> <button onClick={() => props.func2(props.id)}>Reject</button></TableCell>);
	}
	else if(props.status==="Shortlisted")
	{
		return (<TableCell><button onClick={() => props.func(props.id)}>Accept</button> <button onClick={() => props.func2(props.id)}>Reject</button></TableCell>);
	}
	else
	{

		return (<TableCell>Accepted</TableCell>);
	}
}
function Rate(props)
{
	if(props.rated===true)
	{
		return (<TableCell>Rated</TableCell>);
	}
	else
	{
		return (<TableCell><Rating name="size-small" defaultValue={2} size="small" onChange={(e) => {
			props.func(e.target.value, props.ID);
		}}/></TableCell>);
	}
}
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
	  jobs: [],
	  apps: [],
	  sortName: true,
	  sortS: true,
	  sortRating: true,
	  sortDuration: true,

	  sortName: true
    };
		  this.renderIconS = this.renderIconS.bind(this);
        this.sortChangeS = this.sortChangeS.bind(this);
  this.renderIcon = this.renderIcon.bind(this);
        this.sortChange = this.sortChange.bind(this);
	  this.renderIconRating = this.renderIconRating.bind(this);
        this.sortChangeRating = this.sortChangeRating.bind(this);
	  this.renderIconDuration = this.renderIconDuration.bind(this);
        this.sortChangeDuration = this.sortChangeDuration.bind(this);


  }
	sortChange(){
/**
 *      Note that this is sorting only at front-end.
 */
        var array = this.state.apps;
        var flag = this.state.sortName;
        array.sort(function(a, b) {
            if(a.appl.name != undefined && b.appl.name != undefined){
                return (1 - flag*2) * (a.appl.name.localeCompare(b.appl.name));
            }
            else{
                return 1;
            }
          });
        this.setState({
            apps:array,
            sortName:!this.state.sortName,
        })
    }
	sortChangeS(){
/**
 *      Note that this is sorting only at front-end.
 */
		console.log("YEK");
        var array = this.state.apps;
        var flag = this.state.sortS;
        array.sort(function(a, b) {
            if(a.job.job_title != undefined && b.job.job_title != undefined){
                return (1 - flag*2) * (a.job.job_title.localeCompare(b.job.job_title));
            }
            else{
                return 1;
            }
          });
        this.setState({
            apps:array,
            sortS:!this.state.sortS
        })
    }

	sortChangeDuration(){
/**
 *      Note that this is sorting only at front-end.
 */
        var array = this.state.apps;
        var flag = this.state.sortDuration;
        array.sort(function(a, b) {
            if(a.date != undefined && b.date != undefined){
				const d1=new Date(a.date);
				const d2=new Date(b.date);
				console.log(d1);
                return (1 - flag*2) * ((d1>d2)-(d2>d1));
            }
            else{
                return 1;
            }
          });
        this.setState({
            apps:array,
            sortDuration:!this.state.sortDuration,
        })
    }

sortChangeRating(){
/**
 *      Note that this is sorting only at front-end.
 */
        var array = this.state.apps;
        var flag = this.state.sortRating;
        array.sort(function(a, b) {
            if(a.appl.rating != undefined && b.appl.rating != undefined){
                return (1 - flag*2) * (a.appl.rating - b.appl.rating);
            }
            else{
                return 1;
            }
          });
        this.setState({
            apps:array,
            sortRating:!this.state.sortRating,
        })
    }

    renderIconS(){
        if(this.state.sortS){
            return(
                <ArrowDownwardIcon/>
            )
        }
        else{
            return(
                <ArrowUpwardIcon/>
            )
        }
    }


    renderIcon(){
        if(this.state.sortName){
            return(
                <ArrowDownwardIcon/>
            )
        }
        else{
            return(
                <ArrowUpwardIcon/>
            )
        }
    }
	renderIconRating(){
        if(this.state.sortRating){
            return(
                <ArrowDownwardIcon/>
            )
        }
        else{
            return(
                <ArrowUpwardIcon/>
            )
        }
    }
	renderIconDuration(){
        if(this.state.sortDuration){
            return(
                <ArrowDownwardIcon/>
            )
        }
        else{
            return(
                <ArrowUpwardIcon/>
            )
        }
    }

	  customFunction(e){
        console.log(e.target.value);
        this.setState({
            searchText:e.target.value
        })
    }
	isNumeric = (value) => {
        return /^\d+$/.test(value);
    }
	componentDidMount() {
    // If logged in and user navigates to Register page, should redirect them to dashboard
    if (this.props.auth.isAuthenticated) {
		if(this.props.auth.user.type==0)
		{
			this.props.history.push("dashboard");
		}
		else
		{
		console.log("WOLOLO");
		console.log(this.props.auth.job);
		axios.get("/api/jobs/emp").then(
			res => {
				console.log("WOLOLX");
				console.log(res.data);this.setState({apps: res.data});});
		}
		}
	else
	{
      this.props.history.push("/");
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
      password: this.state.password,
      skills: this.state.tags,
	  rating: this.state.rating,
	  ed_list: this.state.shareholders
    };
this.props.registerUser(newUser, this.props.history); 
console.log(newUser);
  };
ratefunc = (rating, rated) => {
	axios.post("/api/jobs/rate", {
		rating: rating,
		rated: rated
	}).then(this.props.history.push("/dashboard"));
}
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

 func = (id) => {
	 axios.post("/api/jobs/up", {id:id}).then(() => {console.log("RECEIVED");this.props.history.push("/dashboard")});
 }
	func2 = (id) => {
	 axios.post("/api/jobs/down", {id:id}).then(() => this.props.history.push("/dashboard"));
 }



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
  convSkill = (array) =>
  {
	  return array.join(",");
  };
 convEduction = (ed_list) =>
  {
	  var array = ed_list.map((ed) => {
		  return ed.name + " ("+ ed.start + ", " + ed.end + ")";
	  });
	  console.log("EDUC");
	  console.log(array);
	  return array.join(", ");
  };
conv = (fe) => {
	if(fe===0)
	{
		return "Full Time";
	}
	else if(fe===1)
	{
		return "Part-Time";
	}
	else
	{
		return "Work From Home";
	}
}

render() {
	return (
            <div>
                <Grid container className="white">
                     <Grid item xs={12} md={12} lg={12}>
                        <Paper>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                            <TableCell> <Button onClick={this.sortChange}>{this.renderIcon()}</Button>Name</TableCell>
                                            <TableCell> <Button onClick={this.sortChangeS}>{this.renderIconS()}</Button>Job Title</TableCell>
                                            <TableCell> <Button onClick={this.sortChangeRating}>{this.renderIconRating()}</Button>rating</TableCell>
                                            <TableCell> <Button onClick={this.sortChangeDuration}>{this.renderIconDuration()}</Button>Joining Date</TableCell>
                                            <TableCell> Type of Job</TableCell>
                                            <TableCell> Skills</TableCell>
                                            <TableCell> Education</TableCell>
                                            <TableCell> Rate</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                {
                                this.state.apps.map((job,ind) => (
                                        <TableRow key={ind}>
                                            <TableCell>{job.appl.name}</TableCell>
                                            <TableCell>{job.job.job_title}</TableCell>
                                            <TableCell>{job.appl.rating}</TableCell>
                                            <TableCell>{job.date}</TableCell>
                                            <TableCell>{this.conv(job.job.type_of_job)}</TableCell>
                                            <TableCell>{this.convSkill(job.appl.skills)}</TableCell>
                                            <TableCell>{this.convEduction(job.appl.ed_list)}</TableCell>
									        <Rate func={this.ratefunc} ID={job.appl._id} rated={job.rated} />
                                        </TableRow>
                                ))
                                }
                                </TableBody>
                            </Table>
                        </Paper>
                    </Grid>
                </Grid>
            </div>
        )
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
