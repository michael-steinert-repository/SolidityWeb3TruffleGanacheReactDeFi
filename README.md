# Ethereum
* Ethereum is an open-source distributed System that offers the Creation, Management and Execution of decentralised Programmes or Smart Contracts in its own Blockchain
* It represents a Counter Design to the classic Client Server Architecture

## Units within Ethereum
* The Factor between Ether and Wei is 10^18
* The same Amount:
    * 1.000000000000000000 Ether => 1 Ether
    * 1000000000000000000.0 Wei => 1000000000000000000 Wei
    
## Backend
* The Backend is based on a Blockchain
* The Blockchain contains two Smart Contracts (Token.sol and dBank.sol)

## System Architecture
![System Architecture](https://user-images.githubusercontent.com/29623199/119400491-909c8000-bcda-11eb-9e3c-b7c284aea51d.png)

## Contract ABI Specification
* The Contract Application Binary Interface (ABI) is the standard Way to interact with Contracts in the Ethereum ecosystem
* ABIs are used for the Interaction from Outside the Blockchain and for Contract-to-Contract Interaction
* It describes the Interfaces from the Smart Contracts
* Data is encoded according to its Type, as described in this Specification
* The Encoding is not self describing and thus requires a Schema in Order to decode
* Using the higher-level Library Web3.js abstracts most of technical Details, but the ABIs in JSON format are still needed to be provided to Web3.js

## ERC20 Specification
* The ERC20 Specification is a Standard for Fungible Tokens
* The Tokens that realised the ERC20 Specification makes each Token be exactly the same (in Type and Value) of another Token which realised the ERC20 Specification

### Methods
![ERC20 Methods](https://user-images.githubusercontent.com/29623199/119462530-1a7f3400-bd41-11eb-821e-904287397284.JPG)

### Events
![ERC20 Events](https://user-images.githubusercontent.com/29623199/119462746-5f0acf80-bd41-11eb-8733-cf8296b30b25.JPG)

## Dependency
* To update the Dependency runs:
  1) npm install -g npm-check-updates
  1) ncu -update
  1) npm update
  1) npm install

### MetaMask
* MetaMask is a Browser Extension which allows the Connection to a Blockchain
* It provides a Wallet to interact with a Blockchain
* Setup of MetaMask:
  1) Create local Network in Ganache
  1) Change Network to the locale Network from Ganache
  1) Import Account 
  1) Copy and paste private Key from Ganache
  1) Connect manual Account to the Site

### Web3.js
* Web3.js allows the Front End Application (ReactJS) to communicate with the Blockchain (Ganache)
* It creates JavaScript based Versions of the Smart Contracts, so it is possible to interact with it from the Client Side
* It needs to create the JavaScript based Version:
  1) The ABI (JSON Interface) which contains the Information about the Variables, Arguments, Events and Methods of the Smart Contract
  1) The Address which contains the Location of the Smart Contract in the Network (Blockchain)


### Truffle
* Truffle is a Framework that allows to create Smart Contracts on the Computer with die Language Solidity
* It deploys the Smart Contracts into the Blockchain which is provided by Ganache
* Truffle Commands:
    * truffle install: Installing the Smart Contracts
    * truffle migrate: Compiling, testing and deploying the Smart Contracts into the Blockchain (runs the Migration Scripts)
    * truffle migrate --reset: Compiling, testing and deploying the new Smart Contracts into the Blockchain (runs again the Migration Scripts)
    * truffle console: Opens a JavaScript Runtime Environment where it is possible to interact through Commands with the Blockchain
    * .exit: closes the JavaScript Runtime Environment
    * truffle test: Runs the 

Command (in JavaScript Runtime Environment) | Description
  --- | ---        
const token = await Token.deployed() | Getting the Token in a asynchronous Way as Promise
token | Shows all Information from the token
token.address | Shows only the Address from the Token: '0x2A81EfB521F1e315027AA2458935e70C8C5a51b4'
token.name() | Shows th Name of the Token: 'Decentralized Bank Currency'
token.symbol() | Shows the Symbol of the Token: 'DCB'
token.totalSupply() | Shows the Total Supply of the Token: <BN: 0>
const accounts = web3.eth.getAccounts() | Getting all Accounts from the Wallet
accounts | Shows all Accounts from the Wallet
token.balanceOf(accounts[0]) | Shows the Balance of the first Account from the Wallet (Way using inherited Methods from ERC20)
let etherBalanceAsWei = await web3.eth.getBalance(accounts[0]) | Shows the Balance of the first Account from the Wallet (Way using Abstraction from Web3.js): '99963160840000000000'
let etherBalanceAsEther = web3.utils.fromWei(etherBalanceAsWei) | Converts from Wei to Ether: '99.96316084'
web3.utils.toWei(etherBalanceAsEther) | Converts from Ether to Wei: '99963160840000000000'
**token.mint(accounts[0], web3.utils.toWei('42'))** | **Mint a Token with the own Implementation of the mint(address account, uint256 amount) Method**
tokenBalance = await web3.eth.getBalance(accounts[0]) | Getting th new Balance
web3.utils.fromWei(tokenBalance) | Shows the new Balance: '42'

### Ganache
* Ganache provides a personal Blockchain on the Computer (it is locally running)

### NodeJS
* NodeJs allows running JavaScript on the Computer
* NodeJS brings the Package-Manager npm to install JavaScript-Modules

### Chai Assertion Library
* Chai is a BDD (Behavior driven Design) / TDD (Test driven Design) Assertion Library for Node.js 
*  It allows to pair the browser that with any Javascript Testing Framework (for Example Mocha which comes bundled with Truffle)

### Mocha
* Mocha is a Feature-rich JavaScript Test Framework running on Node.js and in the Browser
* It is making asynchronous testing simple
