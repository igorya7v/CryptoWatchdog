import React from 'react'
import ReactDOM from 'react-dom'
import Web3 from 'web3'
import 'bootstrap/dist/css/bootstrap.css'
import '../css/style.css'
import ReactTable from "react-table"
import "react-table/react-table.css"
import Transactions from './Transactions'

import { BrowserRouter as Router, Route, Link } from 'react-router-dom'

var BigNumber = require('bignumber.js')
const config = require('../config')
const labels = require('../labels')

BigNumber.config({ DECIMAL_PLACES: 2 })

class HoldersTable extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            labeledData: {}
        }

        if (typeof web3 != 'undefined') {
            this.web3Provider = web3.currentProvider
        } else {
            this.web3Provider = new Web3.providers.HttpProvider(config.httpProvider)
        }

        this.web3 = new Web3(this.web3Provider)

        this.MyContract = this.web3.eth.contract([{"constant":true,"inputs":[],"name":"mintingFinished","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"cap","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"unpause","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_amount","type":"uint256"}],"name":"mint","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"paused","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"allowedTransfers","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_subtractedValue","type":"uint256"}],"name":"decreaseApproval","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"finishMinting","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"pause","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_address","type":"address"},{"name":"_allowedTransfers","type":"bool"}],"name":"updateAllowedTransfers","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_addedValue","type":"uint256"}],"name":"increaseApproval","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[],"name":"Pause","type":"event"},{"anonymous":false,"inputs":[],"name":"Unpause","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"amount","type":"uint256"}],"name":"Mint","type":"event"},{"anonymous":false,"inputs":[],"name":"MintFinished","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"previousOwner","type":"address"},{"indexed":true,"name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"spender","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"}])
        this.contractInstance = this.MyContract.at('0xa74476443119A942dE498590Fe1f2454d7D4aC0d')

        //TODO: fetch from the SM
        this.totalSupply = 1000000000

        this.buildLabelsMap()
        this.getTokenTransfers()
    }

    buildLabelsMap() {
        console.log("Build Labels Map...")
        this.labelsMap = {}
        labels.forEach(label => {
            this.labelsMap[label.address] = label.label
        })
    }

    getTokenTransfers() {
        console.log("Get Tokens Transfers...")
        event = this.contractInstance.Transfer({}, {
            fromBlock: 5592000,
            toBlock: 'latest'
        })

        console.log("watch event: " + event)
        event.get((error, event) => {
            console.log("==> Transfer event callback:")
            if(error) {
                console.log("error: " + error)
            } else {
                console.log(event)
                var holders = {}
                event.forEach(transfer => {
                    console.log("--> transfer: " + JSON.stringify(transfer))
                    holders[transfer.args.from] = transfer.args.from
                    holders[transfer.args.to] = transfer.args.to
                })

                this.getBalances(holders)
            }
        })
    }

    getBalances(holders) {
        console.log("Get Holders Balances...")
        this.count = Object.keys(holders).length - 1
        Object.keys(holders).forEach(key => {
            //console.log(holders[key])
            this.contractInstance.balanceOf(key, (error, res) => {
                if(error) {
                    console.log("error: " + error)
                } else {
                    holders[key] = {address: key, quantity: (res / (10**18))}
                    if(this.count <= 0) {
                        console.log("Finished to fetch balances.")
                        this.labelTheData(holders)
                    }

                    this.count--
                }
            })
        })
    }

    labelTheData(holders) {
        console.log("Adding Labels to the Data...")
        var labeledData = {}
        labeledData.data = []

        Object.keys(holders).forEach(key => {
            //console.log(JSON.stringify(holders[key]))
            if(holders[key].quantity > 0) {
                holders[key] = {
                    address: key,
                    quantity: new BigNumber(holders[key].quantity.toString(), 10).toString(),
                    percentage: new BigNumber(((holders[key].quantity / this.totalSupply) * 100).toString(), 10).toNumber(),
                    label: (key in this.labelsMap) ? this.labelsMap[key] : "",
                    linkDest: "/transactions/" + key
                }

                labeledData.data.push(holders[key])
                console.log("Labeled: " + JSON.stringify(holders[key]))
            }
        })

        this.setState({labeledData: labeledData})
        console.log("==> finish <==")
    }

  render() {
    const { data } = this.state.labeledData
    return (
        <div>
            <ReactTable data={data}
                columns={[
                    {
                        Header: "Test",
                        columns: [
                            {
                                Header: "Label",
                                accessor: "label"
                            },
                            {
                                Header: "Address",
                                accessor: "address",
                                Cell: ({row}) => (
                                    <div>
                                        <Link to={row._original.linkDest}>{row.address}</Link>
                                    </div>
                                )
                            },
                            {
                                Header: "Quantity",
                                accessor: "quantity"
                            },
                            {
                                Header: "Percentage",
                                accessor: "percentage"
                            }
                        ]
                    }
                ]}

                defaultSorted={[{
                    id: "percentage",
                    desc: true
                }]}

                defaultPageSize={10}
                className="-striped -highlight"
            />
        </div>
    );
  }
}

export default HoldersTable

