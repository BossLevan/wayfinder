// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title Counter
 * @dev Simple counter contract for testing blockchain interactions
 * 
 * This is a trivial smart contract that:
 * - Stores a counter value
 * - Allows anyone to increment it
 * - Allows anyone to decrement it
 * 
 * Perfect for testing wallet integration!
 */
contract Counter {
    // The counter value
    uint256 public count;

    // Event emitted when counter changes
    event CountChanged(uint256 newCount, address changedBy);

    /**
     * @dev Increment the counter by 1
     */
    function increment() public {
        count += 1;
        emit CountChanged(count, msg.sender);
    }

    /**
     * @dev Decrement the counter by 1
     */
    function decrement() public {
        require(count > 0, "Counter cannot go below zero");
        count -= 1;
        emit CountChanged(count, msg.sender);
    }

    /**
     * @dev Get the current count (view function - free to call)
     */
    function getCount() public view returns (uint256) {
        return count;
    }

    /**
     * @dev Reset counter to zero (only for testing)
     */
    function reset() public {
        count = 0;
        emit CountChanged(count, msg.sender);
    }
}

