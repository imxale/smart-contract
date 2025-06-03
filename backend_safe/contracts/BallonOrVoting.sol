// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract BallonOrVoting {
    address public owner;
    string[] public nominees;
    mapping(string => uint256) public votes;
    mapping(address => bool) public hasVoted;

    constructor(string[] memory _nominees) {
        owner = msg.sender;
        nominees = _nominees;
    }

    function vote(string memory nominee) public {
        require(!hasVoted[msg.sender], "Vous avez deja vote");
        require(validNominee(nominee), "Nominee invalide");

        votes[nominee] += 1;
        hasVoted[msg.sender] = true;
    }

    function getVotes(string memory nominee) public view returns (uint256) {
        require(validNominee(nominee), "Nominee invalide");
        return votes[nominee];
    }

    function getNominees() public view returns (string[] memory) {
        return nominees;
    }

    function validNominee(string memory nominee) internal view returns (bool) {
        for (uint i = 0; i < nominees.length; i++) {
            if (keccak256(bytes(nominees[i])) == keccak256(bytes(nominee))) {
                return true;
            }
        }
        return false;
    }
}
