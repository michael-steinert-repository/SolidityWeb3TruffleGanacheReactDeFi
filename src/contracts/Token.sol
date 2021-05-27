pragma solidity >=0.6.0 <=0.8.0;

/* Using a Library which implements all ERC20 Standard Specifications for a Token */
/* The Token is based on this Implementation */
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/* Inherit a Smart Contract from ERC20 (from openzeppelin) */
contract Token is ERC20 {
    /* Minter is that Person that will mine the Token */
    address public minter;

    /* Smart Contract have Events that can be subscribed from the Front End App or Blockchain */
    /* Event triggers if the Owner of the Token changed */
    event MinterChanged(address indexed from, address to);

    /* Constructor is automatically runs if Contract is deployed to a Network (Blockchain) */
    /* Run the ERC20() Constructor which is inherited */
    constructor() public payable ERC20("Decentralized Bank Currency", "DBC") {
        /* msg is a global Variable which contains the Sender which calls the Smart Contract */
        minter = msg.sender;
    }

    /* Function to pass the Minter Role to the Bank */
    function passMinterRole(address dBank) public returns (bool) {
        /* Check if msg.sender have Minter Role*/
        require(msg.sender == minter, 'Error: Only Owner can change Minter Role');
        minter = dBank;
        /* Calling Event */
        emit MinterChanged(msg.sender, dBank);
        return true;
    }

    /* Function that mint new Tokens */
    function mintToken(address account, uint256 amount) public {
        /* Check if msg.sender have Minter Role*/
        require(msg.sender == minter, 'Error: Sender does not have a Minter Role');
        _mint(account, amount);
    }
}