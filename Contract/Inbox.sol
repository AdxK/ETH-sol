pragma solidity ^0.4.17;

contract Inbox{

  string public message;

  function Inbox(string initialmessage) public{
  message = initialmessage;
  }

  function setmessage(string newmessage) public{
  message = newmessage;
  }
}
