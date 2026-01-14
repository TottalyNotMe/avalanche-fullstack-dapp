// SPDX-License-Identifier: MIT 
pragma solidity ^0.8.20;

contract SimpleStorage {
    uint256 private storedValue;
    
    // variabel owner
    address public owner;

    // Event OwnerSet
    event OwnerSet(address indexed oldOwner, address indexed newOwner);
    event ValueUpdated(uint256 newValue);

    // Tentukan owner saat deploy
    constructor() {
        owner = msg.sender;
        emit OwnerSet(address(0), msg.sender);
    }

    function setValue(uint256 _value) public {
        // Opsional: Biasanya hanya owner yang boleh mengubah nilai
        // require(msg.sender == owner, "Bukan owner"); 
        storedValue = _value;
        emit ValueUpdated(_value);
    }

    function getValue() public view returns (uint256) {
        return storedValue;
    }
}
