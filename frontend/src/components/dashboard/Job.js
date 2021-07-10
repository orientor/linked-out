import React, { Component } from "react";
import axios from "axios";
import { Link, withRouter} from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { setJob } from "../../actions/authActions";
import classnames from "classnames";
import DatePicker from 'react-date-picker';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Checkbox from '@material-ui/core/Checkbox';
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
import Fuse from "fuse.js";
import SearchIcon from "@material-ui/icons/Search";
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import Autocomplete from '@material-ui/lab/Autocomplete';
function XWS(props)
{
	console.log("KROSDSDSD");
	if(props.status===null)
	{
		return (<TableCell><a onClick={() => {props.func(props.id);}}> Apply </a></TableCell>);
	}
	else
	{
		return (<TableCell>{props.status}</TableCell>);
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
	  duration: "1",
	  jobs: [],
	  pjobs: [],
	  ppjobs: [],
	  mina: 0,
	  maxa: 100000,
	  sortName: true,
	  sortRating: true,
	  sortDuration: true,
	  one: true,
	  zero: true,
	  two: true
    };
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
        var array = this.state.jobs;
        var flag = this.state.sortName;
        array.sort(function(a, b) {
            if(a.salary != undefined && b.salary != undefined){
                return (1 - flag*2) * (a.salary - b.salary);
            }
            else{
                return 1;
            }
          });
        this.setState({
            jobs:array,
            sortName:!this.state.sortName,
        })
    }
	sortChangeDuration(){
/**
 *      Note that this is sorting only at front-end.
 */
        var array = this.state.jobs;
        var flag = this.state.sortDuration;
        array.sort(function(a, b) {
            if(a.duration != undefined && b.duration != undefined){
                return (1 - flag*2) * (a.duration - b.duration);
            }
            else{
                return 1;
            }
          });
        this.setState({
            jobs:array,
            sortDuration:!this.state.sortDuration,
        })
    }

sortChangeRating(){
/**
 *      Note that this is sorting only at front-end.
 */
        var array = this.state.jobs;
        var flag = this.state.sortRating;
        array.sort(function(a, b) {
            if(a.rating != undefined && b.rating != undefined){
                return (1 - flag*2) * (a.rating - b.rating);
            }
            else{
                return 1;
            }
          });
        this.setState({
            jobs:array,
            sortRating:!this.state.sortRating,
        })
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
    }
	else
	{
      this.props.history.push("/");
	}
		axios.get("/api/jobs/job").then(res => {console.log(res);this.setState({jobs: res.data, pjobs: res.data, ppjobs: res.data});});
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({
        errors: nextProps.errors
      });
    }
  }
onChange = e => {
	console.log(e.target.value);
    this.setState({ [e.target.id]: e.target.value });
  };
onChanges = e => {
	console.log(e.target.value);
    this.setState({ [e.target.id]: e.target.checked });
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

funky = async (id) => {
	await this.props.setJob(id);
	this.props.history.push("/registerapp");
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
appfi = () => {
	var arr = this.state.ppjobs;
	console.log("YEX");
	console.log(this.state.zero);
	console.log(this.state.one);
	console.log(this.state.two);
	if(this.state.zero===true)
	{

	}
	else
	{
		arr = arr.filter((val) => {
			if(val.type_of_job===0)
			{
				return false;
			}
			else
			{return true;}
		});
	}
	if(this.state.one===true)
	{

	}
	else
	{
		arr = arr.filter((val) => {
			if(val.type_of_job===1)
			{
				return false;
			}
			else
			{return true;}
		});
	}
	if(this.state.two===true)
	{

	}
	else
	{
		arr = arr.filter((val) => {
			if(val.type_of_job===2)
			{
				return false;
			}
			else
			{return true;}
		});
	}
	arr = arr.filter((val) => {
			if(val.duration<this.state.duration)
			{
				return true;
			}
			else
		{return false;}
		});	
	if(this.isNumeric(this.state.mina))
	{
	arr = arr.filter((val) => {
			if(val.salary>this.state.mina)
			{
				return true;
			}
			else
		{return false;}
		});
	}
	if(this.isNumeric(this.state.maxa))
	{
	arr = arr.filter((val) => {
			if(val.salary<this.state.maxa)
			{
				return true;
			}
			else
		{return false;}
		});
	}

	this.setState({jobs: arr, pjobs: arr});
}
chng = (e) => {
	var arr = this.state.pjobs;
	const fuse = new Fuse(arr, {
  keys: ['job_title']
});
const aspd = fuse.search(e.target.value);
console.log(aspd);
this.setState({jobs: aspd.map((as) => as.item)});
}
render() {
	return (
            <div>
                <Grid container className="blue">
                <Grid item xs={12} md={3} lg={3} className="blue">
                    <List component="nav" aria-label="mailbox folders" className="blue">
                        <ListItem text className="blue">
                                        Filters
                        </ListItem>
                    </List>
                </Grid>
                    <Grid item xs={12} md={9} lg={9}>
                    <List component="nav" aria-label="mailbox folders" className="white">
                        <TextField
                        id="standard-basic"
                        label="Search"
                        fullWidth={true}
		                onChange={this.chng}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment>
                                    <IconButton>
                                        <SearchIcon />
                                    </IconButton>
                                </InputAdornment>
                            )}}
                        // onChange={customFunction}
                        />
                    </List>
                    </Grid>
                </Grid>
                <Grid container className="white">
                    <Grid item xs={12} md={3} lg={3} className="white">
                        <List component="nav" aria-label="mailbox folders" className="white">

                            <ListItem button>
                                <form noValidate autoComplete="off">
                                    <label>Salary</label>
                                    <TextField id="standard-basic" label="Enter Min" value={this.state.mina} onChange={(e) => {this.setState({mina: e.target.value});}} fullWidth={true} />
                                    <TextField id="standard-basic" label="Enter Max" value={this.state.maxa}  onChange={(e) => {this.setState({maxa: e.target.value});}} fullWidth={true}/>
                                </form>
                            </ListItem>
                            <Divider />
                            <ListItem button divider>
		                    <div class="col s12">
    <label>Duration in Months</label>
    <select className="browser-default" id="duration" value={this.state.duration} onChange={this.onChange}>
      <option value="1">1</option>
      <option value="2">2</option>
      <option value="3">3</option>
      <option value="4">4</option>
      <option value="5">5</option>
      <option value="6">6</option>
      <option value="7">7</option>
    </select>
  </div>

                            </ListItem>
		                <Divider />
		<ListItem>
<label>        <Checkbox id="zero" value={this.state.zero} onChange={this.onChanges} /> Full Time</label>
	<Divider />
<label>		<Checkbox id="one" value={this.state.one} onChange={this.onChanges} /> Part Time</label>
	<Divider />
<label>		<Checkbox id="two" value={this.state.two} onChange={this.onChanges} /> Work From Home</label>
	<Divider />
	    </ListItem>
		<ListItem>
		<button onClick={this.appfi} >APPLY FILTERS</button>
		</ListItem>
                        </List>
                    </Grid>
                    <Grid item xs={12} md={9} lg={9}>
                        <Paper>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                            <TableCell> Job Title</TableCell>
                                            <TableCell>Recruiter Name</TableCell>
                                            <TableCell> <Button onClick={this.sortChangeRating}>{this.renderIconRating()}</Button>Job Rating</TableCell>
                                            <TableCell><Button onClick={this.sortChange}>{this.renderIcon()}</Button>Salary</TableCell>
                                            <TableCell><Button onClick={this.sortChangeDuration}>{this.renderIconDuration()}</Button>Duration</TableCell>
                                            <TableCell>Deadline</TableCell>
                                            <TableCell>Status</TableCell>
		
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                {
                                this.state.jobs.map((job,ind) => (
                                        <TableRow key={ind}>
                                            <TableCell>{job.job_title}</TableCell>
                                            <TableCell>{job.recr.name}</TableCell>
                                            <TableCell>{job.rating}</TableCell>
                                            <TableCell>{job.salary}</TableCell>
                                            <TableCell>{job.duration}</TableCell>
                                            <TableCell>{job.deadline}</TableCell>
                                           	 <XWS status={job.status} func={this.funky} id={job._id} />
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
  setJob: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};


const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { setJob }
)(withRouter(Register));
