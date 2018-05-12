import React from "react";

import { BrowserRouter as Router, Route, Link } from 'react-router-dom'

class Transactions extends React.Component {

  render() {
    //const { data } = this.props.holdersArray;
    var param = this.props.match.params.address;
    console.log("******-> " + param);
    console.log(this.props)

    return (
    <div>AAA {this.props.match.params.address}</div>
    )
}
}

export default Transactions