// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

contract LifeChain {
    // User structure
    struct User {
        bool exists;
        uint256 lastLogin;
        uint256[] capsules;
    }
    
    // Capsule structure
    struct Capsule {
        string name;
        string description;
        string ipfsHash;
        address owner;
        address[] trustees;
        uint256 threshold;
        uint256 createdAt;
    }

    // State variables
    uint256 public capsuleCounter;
    mapping(address => User) public users;
    mapping(uint256 => Capsule) public capsules;

    // Events
    event UserRegistered(address user);
    event UserLoggedIn(address user);
    event CapsuleCreated(uint256 id, address owner, string ipfsHash);

    // Automatic registration modifier
    modifier autoRegister() {
        if (!users[msg.sender].exists) {
            users[msg.sender] = User({
                exists: true,
                lastLogin: block.timestamp,
                capsules: new uint256[](0)
            });
            emit UserRegistered(msg.sender);
        }
        _;
        users[msg.sender].lastLogin = block.timestamp;
    }

    // Create new capsule
    function createCapsule(
        string memory _name,
        string memory _description,
        string memory _ipfsHash,
        address[] memory _trustees,
        uint256 _threshold
    ) external autoRegister {
        require(bytes(_name).length > 0, "Name required");
        require(bytes(_ipfsHash).length > 0, "IPFS hash required");
        require(_trustees.length > 0, "At least 1 trustee required");
        require(_threshold > 0 && _threshold <= _trustees.length, "Invalid threshold");

        capsuleCounter++;
        capsules[capsuleCounter] = Capsule({
            name: _name,
            description: _description,
            ipfsHash: _ipfsHash,
            owner: msg.sender,
            trustees: _trustees,
            threshold: _threshold,
            createdAt: block.timestamp
        });

        users[msg.sender].capsules.push(capsuleCounter);
        emit CapsuleCreated(capsuleCounter, msg.sender, _ipfsHash);
    }

    // Get user capsules
    function getUserCapsules(address _user) external view returns (uint256[] memory) {
        return users[_user].capsules;
    }

    // Explicit login (optional)
    function login() external autoRegister {
        emit UserLoggedIn(msg.sender);
    }
}