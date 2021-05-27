import {Tabs, Tab} from 'react-bootstrap'
import dBank from '../abis/dBank.json'
import React, {Component} from 'react';
import Token from '../abis/Token.json'
import dbank from '../dbank.png';
import Web3 from 'web3';
import './App.css';

//h0m3w0rk - add new tab to check accrued interest

class App extends Component {

    constructor(props) {
        super(props)
        this.state = {
            web3: 'undefined',
            account: '',
            token: null,
            dBank: null,
            balance: 0,
            dBankAddress: null
        }
    }

    async componentWillMount() {
        await this.loadBlockchainData(this.props.dispatch)
    }

    async loadBlockchainData(dispatch) {
        /* Check if MetaMask exists */
        if (typeof window.ethereum !== 'undefined') {
            /* Open a Web3 Connection */
            const web3 = new Web3(window.ethereum);
            /* Getting the Network ID (5777) to ensure that is the Ganache Network */
            const networkId = await web3.eth.net.getId();
            /* Getting the Accounts in the Wallet */
            const accounts = await web3.eth.getAccounts();
            /* Get first Account from all Accounts in the Wallet */
            const firstAccount = accounts[0];

            /* Check if Account exists */
            if (typeof firstAccount !== 'undefined') {
                /* Getting the Balance (in Wei) of Account in the Wallet */
                const balanceOfFirstAccount = await web3.eth.getBalance(firstAccount);
                /* Set State with Data from Account */
                this.setState({
                    account: firstAccount,
                    balance: balanceOfFirstAccount,
                    web3: web3
                });
            } else {
                window.alert('Login to MetaMask Extension to use a Blockchain based Website');
            }
            /* Trying load Smart Contracts */
            try {
                /* Create JavaScript based Version fo the Smart Contract (Token.sol) */
                const tokenSmartContract = new web3.eth.Contract(Token.abi, Token.networks[networkId].address);
                /* Create JavaScript based Version fo the Smart Contract (dBank.sol) */
                const dBankSmartContract = new web3.eth.Contract(dBank.abi, dBank.networks[networkId].address);
                /* Get the Address from ABI */
                const dBankAddress = dBank.networks[networkId].address;
                /* Set State with Data from ABIs */
                this.setState({
                    token: tokenSmartContract,
                    dBank: dBankSmartContract,
                    dBankAddress: dBankAddress
                });
            } catch (e) {
                console.log('Error', e);
                window.alert('Smart Contracts are not deployed to the current Network (Blockchain)');
            }
        } else {
            window.alert('Install MetaMask Extension to visit a Blockchain based Website');
        }
    }

    async deposit(amount) {
        /* Check if this.state.dBank is ok */
        if (this.state.dBank !== 'undefined') {
            try {
                await this.state.dBank.methods.deposit().send({
                    value: amount.toString(),
                    from: this.state.account
                });
            } catch (error) {
                console.log('Error while depositing', error);
            }
        }
    }

    async withdraw(event) {
        /* Disable Default Behavior of Click Event */
        event.preventDefault();
        /* Check if this.state.dBank is ok */
        if (this.state.dBank !== 'undefined') {
            try {
                await this.state.dBank.methods.withdraw().send({
                    from: this.state.account
                });
            } catch (error) {
                console.log('Error while withdrawing', error);
            }
        }
    }

    async borrow(amount) {
        /* Check if this.state.dBank is ok */
        if (this.state.dBank !== 'undefined') {
            try {
                await this.state.dBank.methods.borrow().send({
                    value: amount.toString(),
                    from: this.state.account
                });
            } catch (error) {
                console.log('Error, while borrowing', error);
            }
        }
    }

    async payOff(event) {
        /* Disable Default Behavior of Click Event */
        event.preventDefault();
        /* Check if this.state.dBank is ok */
        if (this.state.dBank !== 'undefined') {
            try {
                const collateralEther = await this.state.dBank.methods.collateralEther(this.state.account).call({
                    from: this.state.account
                });
                const tokenBorrowed = collateralEther / 2;
                await this.state.token.methods.approve(this.state.dBankAddress, tokenBorrowed.toString()).send({
                    from: this.state.account
                });
                await this.state.dBank.methods.payOff().send({
                    from: this.state.account
                });
            } catch (error) {
                console.log('Error, while Payout', error);
            }
        }
    }

    render() {
        return (
            <div className='text-monospace'>
                <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
                    <a
                        className="navbar-brand col-sm-3 col-md-2 mr-0"
                        href="#"
                        target="_self"
                        rel="noopener noreferrer"
                    >
                        <img src={dbank} className="App-logo" alt="logo" height="32"/>
                        <b>dBank</b>
                    </a>
                </nav>
                <div className="container-fluid mt-5 text-center">
                    <br></br>
                    <h1>Welcome to Decentralized bank</h1>
                    <h2>{this.state.dBankAddress}</h2>
                    <br></br>
                    <div className="row">
                        <main role="main" className="col-lg-12 d-flex text-center">
                            <div className="content mr-auto ml-auto">
                                <Tabs defaultActiveKey="profile" id="uncontrolled-tab-example">
                                    <Tab eventKey="deposit" title="Deposit">
                                        <div>
                                            How much do you want to deposit?
                                            <br/>
                                            (Minimum Amount is 0.01 ETH)
                                            <br/>
                                            (Only one Despite is possible at the Time)
                                            <br/>
                                            <form onSubmit={(event) => {
                                                /* preventDefault() to stop Refreshing the Page after triggered Submit Event */
                                                event.preventDefault();
                                                /* Catching the Amount from the Ref (from <Input/>) */
                                                let amount = this.depositAmount.value;
                                                /* Convert Amount to Wei (with Factor 10^18) */
                                                amount = amount * 10 ** 18;
                                                this.deposit(amount);
                                            }}>
                                                <div className="form-group mr-sm-2">
                                                    <input
                                                        id="depositAmount"
                                                        step="0.01"
                                                        type="number"
                                                        className="form-control form-control-md"
                                                        placeholder="Amount of Ether"
                                                        required
                                                        ref={(input) => {
                                                            this.depositAmount = input
                                                        }}
                                                    />
                                                </div>
                                                <button type="submit" className="btn btn-primary">Deopsit</button>
                                            </form>
                                        </div>
                                    </Tab>
                                    <Tab eventKey="withdraw" title="Withdraw">
                                        <div>
                                            How much do you want to withdraw (with Interest)?
                                            <button type="submit" className="btn btn-primary"
                                                    onClick={(event => this.withdraw(event))}>Withdraw</button>
                                        </div>
                                    </Tab>
                                    <Tab eventKey="borrow" title="Borrow">
                                        <div>
                                            Do you want to borrow tokens?
                                            <br/>
                                            (You'll get 50% of collateral, in Tokens)
                                            <br/>
                                            Type collateral amount (in ETH)
                                            <br/>
                                            <form onSubmit={(event) => {
                                                /* preventDefault() to stop Refreshing the Page after triggered Submit Event */
                                                event.preventDefault();
                                                /* Catching the Amount from the Ref (from <Input/>) */
                                                let amount = this.borrowAmount.value;
                                                /* Convert Amount to Wei (with Factor 10^18) */
                                                amount = amount * 10 ** 18; //convert to wei
                                                this.borrow(amount);
                                            }}>
                                                <div className="form-group mr-sm-2">
                                                    <input
                                                        id="borrowAmount"
                                                        step="0.01"
                                                        type="number"
                                                        ref={(input) => {
                                                            this.borrowAmount = input
                                                        }}
                                                        className="form-control form-control-md"
                                                        placeholder="Amount of Ether"
                                                        required
                                                    />
                                                </div>
                                                <button type="submit" className="btn btn-primary">Borrow</button>
                                            </form>
                                        </div>
                                    </Tab>
                                    <Tab eventKey="payOff" title="Payoff">
                                        <div>
                                            <br/>
                                            Do you want to payoff the Loan?
                                            <br/>
                                            (You'll receive your Collateral Fee)
                                            <br/>
                                            <button type="submit" className="btn btn-primary"
                                                    onClick={(event) => this.payOff(event)}>Payoff
                                            </button>
                                        </div>
                                    </Tab>
                                </Tabs>
                            </div>
                        </main>
                    </div>
                </div>
            </div>
        );
    }
}

export default App;