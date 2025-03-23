// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

contract LegacyManager {
    struct Member {
        string name;
        string relationship;
        bool isTrustee;
        bool isHeir;
    }

    mapping(address => Member) public members;
    address[] public memberAddresses;

    event MemberAdded(address indexed wallet, string name, string relationship, bool isTrustee, bool isHeir);

    function addMember(
        address wallet,
        string memory name,
        string memory relationship,
        bool isTrustee,
        bool isHeir
    ) external {
        require(bytes(name).length > 0, "Name cannot be empty");
        require(bytes(relationship).length > 0, "Relationship cannot be empty");
        
        if (!isMember(wallet)) {
            memberAddresses.push(wallet);
        }
        
        members[wallet] = Member(name, relationship, isTrustee, isHeir);
        emit MemberAdded(wallet, name, relationship, isTrustee, isHeir);
    }

    function isMember(address wallet) public view returns (bool) {
        return bytes(members[wallet].name).length > 0;
    }

    function getAllMembers() external view returns (Member[] memory) {
        Member[] memory allMembers = new Member[](memberAddresses.length);
        for (uint i = 0; i < memberAddresses.length; i++) {
            allMembers[i] = members[memberAddresses[i]];
        }
        return allMembers;
    }
}