// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {HumanArtRegistry} from "../src/HumanArtRegistry.sol";
import {IHumanArtRegistry} from "../src/interfaces/IHumanArtRegistry.sol";

interface Vm {
    function prank(address) external;
    function expectRevert(bytes4) external;
    function expectRevert(bytes calldata) external;
}

contract HumanArtRegistryTest {
    Vm constant vm = Vm(address(uint160(uint256(keccak256("hevm cheat code")))));
    HumanArtRegistry registry;
    string constant TAG = "HA-TEST";

    function setUp() public {
        registry = new HumanArtRegistry();
        registry.registerTag(TAG, keccak256("fixture"));
        registry.allocateTag(TAG, "artist");
    }

    function activate() internal {
        registry.activateArtwork(TAG, "ipfs://fixture", keccak256("metadata"), "artist", 100);
    }

    function testRejectUnauthorizedActivation() public {
        vm.expectRevert(IHumanArtRegistry.Unauthorized.selector);
        vm.prank(address(123));
        registry.activateArtwork(TAG, "ipfs://fixture", keccak256("metadata"), "artist", 100);
    }

    function testRejectUnauthorizedCounterJump() public {
        activate();
        vm.expectRevert(IHumanArtRegistry.Unauthorized.selector);
        vm.prank(address(123));
        registry.verifyScan(TAG, type(uint256).max);
        require(registry.getArtwork(TAG).lastCounter == 100);
    }

    function testRejectWrongArtist() public {
        vm.expectRevert(IHumanArtRegistry.Unauthorized.selector);
        registry.activateArtwork(TAG, "ipfs://fixture", keccak256("metadata"), "other", 100);
    }

    function testRejectReplay() public {
        activate();
        registry.verifyScan(TAG, 102);
        vm.expectRevert(abi.encodeWithSelector(IHumanArtRegistry.CounterNotMonotonic.selector, 102, 102));
        registry.verifyScan(TAG, 102);
        vm.expectRevert(abi.encodeWithSelector(IHumanArtRegistry.CounterNotMonotonic.selector, 102, 101));
        registry.verifyScan(TAG, 101);
        require(registry.getArtwork(TAG).lastCounter == 102);
    }

    function testBatchAtomicity() public {
        string[] memory ids = new string[](2);
        ids[0] = "NEW";
        ids[1] = TAG;
        bytes32[] memory hashes = new bytes32[](2);
        hashes[0] = keccak256("new");
        hashes[1] = hashes[0];
        vm.expectRevert(IHumanArtRegistry.TagAlreadyRegistered.selector);
        registry.registerTagsBatch(ids, hashes);
        require(!registry.isTagRegistered("NEW"));
    }

    function testPreviousOwnerLosesImplicitIssuerRole() public {
        registry.transferOwnership(address(123));
        vm.expectRevert(IHumanArtRegistry.Unauthorized.selector);
        registry.registerTag("OTHER", keccak256("other"));
    }

    function testFuzzCounterNeverDecreases(uint256 next) public {
        activate();
        if (next <= 100) {
            vm.expectRevert(abi.encodeWithSelector(IHumanArtRegistry.CounterNotMonotonic.selector, 100, next));
            registry.verifyScan(TAG, next);
            require(registry.getArtwork(TAG).lastCounter == 100);
        } else {
            registry.verifyScan(TAG, next);
            require(registry.getArtwork(TAG).lastCounter == next);
        }
    }
}
