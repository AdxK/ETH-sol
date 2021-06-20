const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());

const compiledFactory = require('../ethereum/build/CampaignFactory.json');
const compailedCampaign = require('../ethereum/build/Campaign.json');

let accounts;
let factory;
let campaignAddress;
let campaign;

beforeEach(async () =>{
  accounts = await web3.eth.getAccounts();

  factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
     .deploy({data : compiledFactory.bytecode})
     .send({from: accounts[0], gas:'1000000'});

  await factory.methods.createCampaign('100').send({
    from: accounts[0],
    gas:'1000000'
  });

  [campaignAddress] = await factory.methods.getDeployedCampaigns().call();
  campaign = await new web3.eth.Contract(JSON.parse(compailedCampaign.interface),
  campaignAddress);
});

describe('Campaigns', ()=>{
  it('deploys a campaign', ()=>{
    assert.ok(factory.options.address);
    assert.ok(campaign.options.address);
  });

  it('Is manager?', async ()=>{
    const manager = await campaign.methods.manager().call();
    assert.equal(accounts[0], manager);
  });

  it('Takes in contributers', async ()=>{
    await campaign.methods.conrtibute().send({
      from: accounts[1],
      value: '200'
    });

    const isContributor = await campaign.methods.approvers(accounts[1]).call();

    assert(isContributor);
    });

  it('Aceepts requests', async ()=>{
    await campaign.methods
      .createRequest('batteries', '100', accounts[1])
      .send({from: accounts[0], gas:'1000000'});

    const request = await campaign.methods.requests(0).call();

    assert.equal('batteries', request.description);
  });

  it('Processes requests', async ()=>{

    await campaign.methods.conrtibute().send({
      from: accounts[0],
      value: web3.utils.toWei('10', 'ether' )
    });

    await campaign.methods.createRequest('Batteries', web3.utils.toWei('3', 'ether'), accounts[1])
      .send({
        from: accounts[0],
        gas: '1000000'
      });

    await campaign.methods.approveRequest(0).send({
      from: accounts[0],
      gas: '1000000'
    });

    await campaign.methods.finalizeRequest(0).send({
      from: accounts[0],
      gas: '1000000'
    });

    let balance = await web3.eth.getBalance(accounts[1]);
    balance = parseFloat(balance);
    console.log(balance);
    assert(balance > 102);


});

});
