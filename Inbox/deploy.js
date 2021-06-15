const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const { interface, bytecode} = require('./Compile');

const provider = new HDWalletProvider(
  'valid gasp farm wheel assume throw text canoe doctor solution angry excuse',
  'https://rinkeby.infura.io/v3/9ac5b6c26b134e189971b6be4b1b46d4'
);

const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();
  console.log('Attempting to deploy', accounts[0]);

  const result = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({data : bytecode,
            arguments : ['Hi there!']})
    .send({gas:'1000000', from: accounts[0] })

    console.log('Contract deployed to',result.options.address );
};
deploy();
