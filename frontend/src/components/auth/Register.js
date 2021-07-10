import React, { Component } from "react";
import { Link } from "react-router-dom";
class Landing extends Component {
  render() {
    return (
      <div style={{ height: "75vh" }} className="container valign-wrapper">
        <div className="row">
          <div className="col s12 center-align">
            <div className="col s6">
              <Link
                to="/registerappl"
                style={{
                  width: "140px",
                  borderRadius: "3px",
                  letterSpacing: "1.5px"
                }}
                className="btn btn-large waves-effect waves-light hoverable blue accent-3"
              >
                Applicant
              </Link>
            </div>
            <div className="col s6">
              <Link
                to="/registerrecr"
                style={{
                  width: "140px",
                  borderRadius: "3px",
                  letterSpacing: "1.5px"
                }}
                className="btn btn-large btn-flat waves-effect black white-text"
              >
                Recruiter
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default Landing;
