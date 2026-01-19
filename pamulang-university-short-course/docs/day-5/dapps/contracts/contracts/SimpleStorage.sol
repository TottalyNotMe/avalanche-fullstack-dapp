// SPDX-License-Identifier: MIT 
pragma solidity ^0.8.20;

contract SimpleStorage {
    uint256 private storedValue;
    
    //Ownership
    address public owner;

    //Event Definitions
    event OwnerSet(address indexed oldOwner, address indexed newOwner);
    event ValueUpdated(uint256 newValue);

    constructor() {
        owner = msg.sender;
        // OwnerSet muncul saat deploy
        emit OwnerSet(address(0), msg.sender);
    }

    function setValue(uint256 _value) public {
        storedValue = _value;
        // ValueUpdated muncul saat set value
        emit ValueUpdated(_value);
    }

    function getValue() public view returns (uint256) {
        return storedValue;
    }
}
