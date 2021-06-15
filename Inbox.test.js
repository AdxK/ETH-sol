const assert = require('assert');//MODS
const ganache = require('ganache-cli');//MODS
const Web3 = require('web3');//MODS
const web3 = new Web3(ganache.provider());//MODS
const {interface, bytecode} = require('../Compile');//MODS

let Accounts;//Global variable
let inbox;//Global variable

beforeEach(async () =>{//Deploys the promise
  Accounts = await web3.eth.getAccounts();// Awaits for the promise
  inbox = await new web3.eth.Contract(JSON.parse(interface))//interface is the ABI
    .deploy({ data: bytecode,//initializes the bytecode
              arguments: ['Hi there!'] })
    .send({ from:Accounts[0], gas: '1000000'});//deploys the bytecode

});

describe('Inbox', () =>{//group of tests for contract Inbox
  it('deploys a contract', () => {//test to check for deployment
    assert.ok(inbox.options.address);//extracts the test accounts from .eth
  });
  it('has a default message', async () => {//test for default value of message
    const message = await inbox.methods.message().call();//calls message()
    assert.equal(message, 'Hi there!');//checks for the value of message
  });
  it('Change the data', async () =>{//test for the updated value of message
    await inbox.methods.setmessage('sup!').send({from:Accounts[0] })//calls for setmessage
    const message = await inbox.methods.message().call();// calls for the current value of message
    assert.equal('sup!',message);//checks for the value of message
  });
});
