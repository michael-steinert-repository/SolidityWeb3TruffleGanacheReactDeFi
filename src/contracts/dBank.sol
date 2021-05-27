pragma solidity >=0.6.0 <=0.8.0;

import "./Token.sol";

contract dBank {
    Token private token;

    /* Mapping each Address to theirs Amount of Ether */
    mapping(address => uint) public etherBalanceOf;
    /* Mapping each Address to theirs Timestamp (if Block is mined) */
    mapping(address => uint) public depositStart;
    /* Mapping each Address to theirs Timestamp (if Block is mined) */
    mapping(address => bool) public isDeposited;
    /* Mapping each Address to theirs Collateral (specific Amount of Ether) */
    mapping(address => uint) public collateralEther;
    /* Mapping each Address to theirs Borrow Status */
    mapping(address => bool) public isBorrowed;

    /* Events to track the certain Activities that happens on the Blockchain */
    event Deposit(address indexed user, uint etherAmount, uint timeStart);
    event Withdraw(address indexed user, uint etherAmount, uint depositTime, uint interest);
    event Borrow(address indexed user, uint collateralEtherAmount, uint borrowedTokenAmount);
    event PayOff(address indexed user, uint fee);

    /* Constructor is automatically runs if Contract is deployed to a Network (Blockchain) */
    /* Deployed Token is passed into the Smart Contract through the Constructor */
    constructor(Token _token) public {
        token = _token;
    }

    function deposit() payable public {
        /* Check if msg.sender didn't already deposited Funds */
        require(isDeposited[msg.sender] == false, 'Error, Deposit already active');

        /* Check if msg.value is >= than 0.01 ETH */
        require(msg.value >= 1e16, 'Error, Deposit must be >= 0.01 ETH');

        /* Increase msg.sender Ether deposit Balance */
        etherBalanceOf[msg.sender] = etherBalanceOf[msg.sender] + msg.value;

        /* Start msg.sender holding Time */
        depositStart[msg.sender] = depositStart[msg.sender] + block.timestamp;

        /* Set msg.sender deposit Status to true */
        isDeposited[msg.sender] = true;

        /* Trigger Deposit Event */
        emit Deposit(msg.sender, msg.value, block.timestamp);
    }

    function withdraw() public {
        /* Check if msg.sender Deposit Status is true */
        require(isDeposited[msg.sender] == true, 'Error, no Previous Deposit');

        /* Assign msg.sender Ether Deposit Balance to Variable for Event */
        uint userBalance = etherBalanceOf[msg.sender];

        /* HODL or long-term Strategy is one Crypto Investment Strategy */
        /* Check Users HODL Time */
        /* depositStart[msg.sender] holds the Time of the latest Block */
        uint depositTime = block.timestamp - depositStart[msg.sender];

        /* Calc Interest per Second */
        /* 31668017 - Interest(10% APY) per Second for minimum Deposit Amount (0.01 ETH), because: */
        /* 1e15(10% of 0.01 ETH) / 31577600 (Seconds in 365.25 days) */

        /* (userBalance / 1e16) calculates how much higher Interest will be (based on Deposit), for Example: */
        /* For each minimum Deposit (0.01 ETH), (userBalance / 1e16) = 1 (the same, 31668017/s) */
        /* For deposit 0.02 ETH, (userBalance / 1e16) = 2 (doubled, (2*31668017)/s) */
        uint interestPerSecond = 31668017 * (etherBalanceOf[msg.sender] / 1e16);

        /* Calc accrued Interest */
        uint interest = interestPerSecond * depositTime;

        /* Send ETH to User */
        msg.sender.transfer(userBalance);

        /* Send Interest in Tokens to User */
        token.mintToken(msg.sender, interest);

        /* Reset Depositor Data */
        etherBalanceOf[msg.sender] = 0;
        depositStart[msg.sender] = 0;
        isDeposited[msg.sender] = false;

        /* Trigger Withdraw Event */
        emit Withdraw(msg.sender, userBalance, depositTime, interest);
    }

    function borrow() payable public {
        /* Check if Collateral is >= than 0.01 ETH */
        require(msg.value >= 1e16, 'Error, Collateral must be >= 0.01 ETH');

        /* Check if User doesn't have active Loan */
        require(isBorrowed[msg.sender] == false, 'Error, Loan already taken');

        /* Add msg.value to Ether Collateral */
        /* This Ether will be locked till user PayOff the Loan */
        collateralEther[msg.sender] = collateralEther[msg.sender] + msg.value;

        /* Calc Tokens Amount to mint which is 50% of msg.value */
        uint tokensToMint = collateralEther[msg.sender] / 2;

        /* Mint and send Tokens to User */
        token.mintToken(msg.sender, tokensToMint);

        /* Activate Users Borrower Loan Status */
        isBorrowed[msg.sender] = true;

        /* Trigger Borrow Event */
        emit Borrow(msg.sender, collateralEther[msg.sender], tokensToMint);
    }

    function payout() public {
        /* Check if Loan is active */
        require(isBorrowed[msg.sender] == true, 'Error, Loan not active');

        /* Check and transfer Tokens from User back to the Contract (must first approve dBank) */
        require(token.transferFrom(msg.sender, address(this), collateralEther[msg.sender] / 2), "Error, can't receive Tokens");

        /* Calc 10% Fee */
        uint fee = collateralEther[msg.sender] / 10;

        /* Send Users Collateral minus Fee */
        msg.sender.transfer(collateralEther[msg.sender] - fee);

        /* Reset Users Borrower Data */
        collateralEther[msg.sender] = 0;
        isBorrowed[msg.sender] = false;

        /* Trigger PayOff Event */
        emit PayOff(msg.sender, fee);
    }
}
