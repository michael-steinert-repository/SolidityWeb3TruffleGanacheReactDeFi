const Token = artifacts.require('./Token');
const DecentralizedBank = artifacts.require('./dBank');

/* Utils */
const wait = seconds => {
    const milliseconds = seconds * 1000;
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}
const EVM_REVERT = 'VM Exception while processing transaction: revert';

/* Mocha Test from chai framework */
require('chai')
    .use(require('chai-as-promised'))
    .should();

/* Tests are important because if a Smart Contract is deployed on the Network (Blockchain) it can not be changed */
/* So the Smart Contract have to work before it is deployed on a Network (Blockchain) */
/* Tests check the Behavior of the Smart Contracts */
contract('dBank', ([deployer, user]) => {
    let dBank, token;
    /* 10% APY for minimum Deposit (0.01 ETH) */
    const interestPerSecond = 31668017;

    beforeEach(async () => {
        token = await Token.new();
        dBank = await DecentralizedBank.new(token.address);
        await token.passMinterRole(dBank.address, {from: deployer});
    })

    describe('Testing Token Contract', () => {
        describe('success', () => {
            it('Checking Token Name', async () => {
                expect(await token.name()).to.be.eq('Decentralized Bank Currency')
            })

            it('Checking Token Symbol', async () => {
                expect(await token.symbol()).to.be.eq('DBC')
            })

            it('Checking Token initial Total Supply', async () => {
                expect(Number(await token.totalSupply())).to.eq(0)
            })

            it('dBank should have Token Minter Role', async () => {
                expect(await token.minter()).to.eq(dBank.address)
            })
        })

        describe('failure', () => {
            it('Passing Minter Role should be rejected', async () => {
                await token.passMinterRole(user, {from: deployer}).should.be.rejectedWith(EVM_REVERT)
            })

            it('Tokens Minting should be rejected', async () => {
                /* Unauthorized Minter */
                await token.mintToken(user, '1', {from: deployer}).should.be.rejectedWith(EVM_REVERT)
            })
        })
    })

    describe('Testing Deposit', () => {
        let balance;

        describe('success', () => {
            beforeEach(async () => {
                await dBank.deposit({
                    /* 0.01 ETH */
                    value: 10 ** 16,
                    from: user
                })
            })

            it('Balance should increase', async () => {
                expect(Number(await dBank.etherBalanceOf(user))).to.eq(10 ** 16)
            })

            it('Deposit Time should > 0', async () => {
                expect(Number(await dBank.depositStart(user))).to.be.above(0)
            })

            it('Deposit Status should eq true', async () => {
                expect(await dBank.isDeposited(user)).to.eq(true)
            })
        })

        describe('failure', () => {
            it('Depositing should be rejected', async () => {
                /* To small amount */
                await dBank.deposit({value: 10 ** 15, from: user}).should.be.rejectedWith(EVM_REVERT)
            })
        })
    })

    describe('Testing Withdraw', () => {
        let balance;

        describe('success', () => {
            beforeEach(async () => {
                await dBank.deposit({
                    /* 0.01 ETH */
                    value: 10 ** 16,
                    from: user
                });

                /* Accruing Interest */
                await wait(2);

                balance = await web3.eth.getBalance(user);
                await dBank.withdraw({
                    from: user
                });
            })

            it('Balances should decrease', async () => {
                expect(Number(await web3.eth.getBalance(dBank.address))).to.eq(0);
                expect(Number(await dBank.etherBalanceOf(user))).to.eq(0);
            })

            it('User should receive Ether back', async () => {
                expect(Number(await web3.eth.getBalance(user))).to.be.above(Number(balance))
            })

            it('User should receive proper Amount of Interest', async () => {
                /* Time Synchronization Problem make us check the 1-3s range for 2s Deposit Time */
                balance = Number(await token.balanceOf(user));
                expect(balance).to.be.above(0);
                expect(balance % interestPerSecond).to.eq(0);
                expect(balance).to.be.below(interestPerSecond * 4);
            })

            it('Depositor Data should be reseted', async () => {
                expect(Number(await dBank.depositStart(user))).to.eq(0);
                expect(Number(await dBank.etherBalanceOf(user))).to.eq(0);
                expect(await dBank.isDeposited(user)).to.eq(false);
            })
        })

        describe('failure', () => {
            it('Withdrawing should be rejected', async () => {
                await dBank.deposit({
                    /* 0.01 ETH */
                    value: 10 ** 16,
                    from: user
                });
                /* Accruing Interest */
                await wait(2);
                /* Wrong User */
                await dBank.withdraw({from: deployer}).should.be.rejectedWith(EVM_REVERT);
            })
        })
    })
})
