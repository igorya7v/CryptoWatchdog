import React from "react";

import ReactTable from "react-table"
import "react-table/react-table.css"

//import { BrowserRouter as Router, Route, Link } from 'react-router-dom'

var BigNumber = require('bignumber.js')
const config = require('../config')

BigNumber.config({ DECIMAL_PLACES: 2 })


class Transactions extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            address: "",
            transactions: {}
        }

        if (typeof web3 != 'undefined') {
            this.web3Provider = web3.currentProvider
        } else {
            this.web3Provider = new Web3.providers.HttpProvider(config.httpProvider)
        }

        this.web3 = new Web3(this.web3Provider)

        this.transactions = {}
        this.transactions.data = []

        this.MyContract = this.web3.eth.contract([{"constant":true,"inputs":[],"name":"mintingFinished","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"cap","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"unpause","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_amount","type":"uint256"}],"name":"mint","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"paused","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"allowedTransfers","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_subtractedValue","type":"uint256"}],"name":"decreaseApproval","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"finishMinting","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"pause","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_address","type":"address"},{"name":"_allowedTransfers","type":"bool"}],"name":"updateAllowedTransfers","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_addedValue","type":"uint256"}],"name":"increaseApproval","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[],"name":"Pause","type":"event"},{"anonymous":false,"inputs":[],"name":"Unpause","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"amount","type":"uint256"}],"name":"Mint","type":"event"},{"anonymous":false,"inputs":[],"name":"MintFinished","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"previousOwner","type":"address"},{"indexed":true,"name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"spender","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"}])
        this.contractInstance = this.MyContract.at('0xa74476443119A942dE498590Fe1f2454d7D4aC0d')

//        var param = this.props.match.params.address
//        console.log("******-> " + param)
//        console.log(this.props)

        this.getOutTokenTransfers(this.props.match.params.address)
    }

    getOutTokenTransfers(address) {
        console.log("Get OUT Tokens Transfers for address: " + address)
        event = this.contractInstance.Transfer({ from: address }, {
                fromBlock: 5592000,
                toBlock: 'latest'
            })

        console.log("watch event: " + event)
        event.get((error, events) => {
            console.log("==> OUT Transfer event callback:")
            if(error) {
                console.log("error: " + error)
            } else {
                console.log(events)
                events.forEach(transfer => {
                    console.log("--> OUT transfer by address: " + JSON.stringify(transfer))
                    this.transactions.data.push({
                        txHash: transfer.transactionHash,
                        from: transfer.args.from,
                        to: transfer.args.to,
                        direction: "OUT",
                        quantity: new BigNumber((transfer.args.value / (10**18)).toString(), 10).toNumber(),
                        block: transfer.blockNumber
                    })
                })

                this.getInTokenTransfers(address)
            }
        })
    }

    getInTokenTransfers(address) {
        console.log("Get IN Tokens Transfers for address: " + address)
        event = this.contractInstance.Transfer({ to: address }, {
                fromBlock: 5592000,
                toBlock: 'latest'
            })

        console.log("watch event: " + event)
        event.get((error, events) => {
            console.log("==> IN Transfer events callback:")
            if(error) {
                console.log("error: " + error)
            } else {
                console.log(events)
                events.forEach(transfer => {
                    console.log("--> IN transfer by address: " + JSON.stringify(transfer))
                    this.transactions.data.push({
                        txHash: transfer.transactionHash,
                        from: transfer.args.from,
                        to: transfer.args.to,
                        direction: "IN",
                        quantity: new BigNumber((transfer.args.value / (10**18)).toString(), 10).toNumber(),
                        block: transfer.blockNumber
                    })
                })

                this.setState({ address: address })
                this.setState({transactions: this.transactions})
                console.log("==> finish <==")
            }
        })
    }

    render() {
        const { data } = this.state.transactions
            return (
                <div>
                    <p>Adress: <strong>{this.state.address}</strong></p>
                    <a href="url">Go to Chart</a>
                    <hr/>
                    <ReactTable data={data}
                        columns={[
                            {
                                Header: "Transactions",
                                columns: [
                                    {
                                        Header: "TxHash",
                                        accessor: "txHash"
                                    },
                                    {
                                        Header: "From",
                                        accessor: "from"
                                    },
                                    {
                                        Header: "To",
                                        accessor: "to"
                                    },
                                    {
                                        Header: "",
                                        accessor: "direction"
                                    },
                                    {
                                        Header: "Quantity",
                                        accessor: "quantity"
                                    },
                                    {
                                        Header: "Block",
                                        accessor: "block"
                                    }
                                ]
                            }
                        ]}

                        defaultSorted={[{
                            id: "block",
                            desc: true
                        }]}

                        defaultPageSize={10}
                        className="-striped -highlight"
                    />
                </div>
            )
    }
}

export default Transactions