pragma solidity ^0.4.17;

contract Lottery{

    address public Manager;
    address[] public players;

    function Lottery() public{
        Manager = msg.sender;
    }

    function Entry() public payable {
        require(msg.value > 0.1 ether );
        players.push(msg.sender);
    }

    function random() public view returns(uint256) {
       return uint(keccak256(block.difficulty, now, players));
    }

    function pickwinner() public restricted {
        uint index = random() % players.length;
        players[index].transfer(this.balance);
        players = new address[](0);
    }

    modifier restricted(){
        require(msg.sender == Manager);
        _;
    }

    function getplayers() public view returns (address[]){
        return players;
    }
}
