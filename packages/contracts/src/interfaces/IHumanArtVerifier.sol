// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/// @notice Proposed tag-report boundary; not implemented or called by the prototype registry.
/// @dev World enrollment is a separate protocol and must not share this interface.
interface IHumanArtVerifier {
    struct TagReport {
        bytes32 requestId;
        bytes32 ciphertextHash;
        bytes32 tagKey;
        uint256 counter;
        uint256 chainId;
        address registry;
        uint256 deadline;
    }

    function verifyReport(TagReport calldata report, bytes calldata attestation) external view returns (bool);
}
