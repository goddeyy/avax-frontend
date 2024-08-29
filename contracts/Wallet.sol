// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Wallet {
    address public owner;
    uint256 public withdrawLimit;
    mapping(address => uint256) public balances;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Caller is not the owner");
        _;
    }

    function deposit() external payable {
        require(msg.value > 0, "Deposit amount must be greater than zero");
        balances[msg.sender] += msg.value;
    }

    function setWithdrawLimit(uint256 _limit) external onlyOwner {
        withdrawLimit = _limit;
    }

    function withdraw(uint256 _amount) external {
        require(_amount > 0, "Withdraw amount must be greater than zero");
        require(balances[msg.sender] >= _amount, "Insufficient balance");
        
        if (_amount > withdrawLimit) {
            revert("Amount exceeds the withdraw limit");
        }

        balances[msg.sender] -= _amount;
        payable(msg.sender).transfer(_amount);
    }

    function checkOwner() external view {
        assert(owner != address(0));
    }

    function contractBalance() external view returns (uint256) {
        return address(this).balance;
    }
}
