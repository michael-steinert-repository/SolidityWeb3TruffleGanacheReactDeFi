/* Importing the Smart Contracts in JavaScript */
const Token = artifacts.require("Token");
const dBank = artifacts.require("dBank");

/* A Migration Script deploy the Smart Contract from the Computer to the Network (Blockchain) */
module.exports = async function (deployer) {
    /* Deploy Token */
    await deployer.deploy(Token);

    /* Assign Token into Variable to get it Address */
    const tokenDeployed = await Token.deployed();

    /* Deploy dBank */
    /* Pass Token Address for dBank Smart Contract for future Minting */
    await deployer.deploy(dBank, tokenDeployed.address);

    /* Assign dBank Smart Contract into Variable to get it Address */
    const dBankDeployed = await dBank.deployed();

    /* Change Token Minter (Owner) from Deployer to dBank
    /* So instead a Minter control the Token the Bank can do it */
    await tokenDeployed.passMinterRole(dBankDeployed.address);
};
