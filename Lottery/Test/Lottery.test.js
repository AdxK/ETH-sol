const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());
const {interface, bytecode} = require('../Compile');

let lottery;
let accounts;

beforeEach( async () =>{

  accounts = await web3.eth.getAccounts();
  lottery = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({data: bytecode})
    .send({from: accounts[0], gas:'1000000'});
});

describe('Lottery Contract', () =>{

  it('deploys a contract', ()=>{
    assert.ok(lottery.options.address);
  });

  it('Checks for entry', async () => {
    await lottery.methods.Entry().send({
      from: accounts[0],
      value: web3.utils.toWei('0.2', 'ether')
    });

    await lottery.methods.Entry().send({
      from: accounts[1],
      value: web3.utils.toWei('0.2', 'ether')
    });

    await lottery.methods.Entry().send({
      from: accounts[2],
      value: web3.utils.toWei('0.2', 'ether')
    });

    const players = await lottery.methods.getplayers().call({
      from: accounts[0]
    });

    assert.equal(accounts[0], players[0]);
    assert.equal(accounts[1], players[1]);
    assert.equal(accounts[2], players[2]);
    assert.equal(3, players.length);
  });

  it('Checks for the minimum required gas', async ()=>{
    try {
      await lottery.methods.Entry().send({
        from: accounts[0],
        value: '200'
      });
      assert(false);
    }
    catch (err) {
      assert(err);
    }
  });

  it('Checks if the manager is choosing the winner', async ()=>{
    try {
      await lottery.methods.pickwinner().send({
        from: accounts[1]
      });
      assert(false);
    } catch (err) {
      assert(err);
    }
  });

  it('Checks for the correct winner', async ()=>{


    await lottery.methods.Entry().send({
      from: accounts[0],
      value: web3.utils.toWei('2','ether')
    });

    const InitialBalance = await web3.eth.getBalance(accounts[0]);

    await lottery.methods.pickwinner().send({
      from:accounts[0]
    });

    const FinalBalance = await web3.eth.getBalance(accounts[0]);

    const difference = FinalBalance - InitialBalance;
    console.log(FinalBalance - InitialBalance);
    assert(difference > web3.utils.toWei('1.8','ether'));

  });
});
