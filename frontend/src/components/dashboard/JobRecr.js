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

import SearchIcon from "@material-ui/icons/Search";
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import Autocomplete from '@material-ui/lab/Autocomplete';

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
	  sortName: true
    };
	  this.renderIcon = this.renderIcon.bind(this);
        this.sortChange = this.sortChange.bind(this);
  }
	sortChange(){
/**
 *      Note that this is sorting only at front-end.
 */
        var array = this.state.jobs;
        var flag = this.state.sortName;
        array.sort(function(a, b) {
            if(a.date != undefined && b.date != undefined){
                return (1 - flag*2) * (new Date(a.date) - new Date(b.date));
            }
            else{
                return 1;
            }
          });
        this.setState({
            users:array,
            sortName:!this.state.sortName,
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
		axios.get("/api/jobs/job").then(res => {console.log(res);this.setState({jobs: res.data});});
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
funky = async (id) => {
	await this.props.setJob(id);
	this.props.history.push("/applrecr");
}
edit = async (id) => {
	await this.props.setJob(id);
	this.props.history.push("/editjob");
}
delet = async (id) => {
	axios.post("/api/jobs/delete", {job: id}).then((res) =>
	{console.log("YEX");this.props.history.push("/dashboard");});
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
                                            <TableCell> Job Title</TableCell>
                                            <TableCell>Recruiter Name</TableCell>
                                            <TableCell>Job Rating</TableCell>
                                            <TableCell>Remaining Applications</TableCell>
                                            <TableCell>Remaining Jobs</TableCell>
                                            <TableCell>Posting Date</TableCell>
                                            <TableCell>See Applications</TableCell>
                                            <TableCell>Edit</TableCell>
                                            <TableCell>Delete</TableCell>
		
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                {
                                this.state.jobs.map((job,ind) => (
                                        <TableRow key={ind}>
                                            <TableCell>{job.job_title}</TableCell>
                                            <TableCell>{job.recr.name}</TableCell>
                                            <TableCell>{job.rating}</TableCell>
                                            <TableCell>{job.app_no}</TableCell>
                                            <TableCell>{job.post_no}</TableCell>
                                            <TableCell>{job.post_date}</TableCell>
									        <TableCell><a onClick={() => {this.funky(job._id);}}>see</a></TableCell>
									        <TableCell><a onClick={() => {this.edit(job._id);}}>Edit</a></TableCell>
									        <TableCell><a className="red" onClick={() => {this.delet(job._id);}}>Delete</a></TableCell>
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
