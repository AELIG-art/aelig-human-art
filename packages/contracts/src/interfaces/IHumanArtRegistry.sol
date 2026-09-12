// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/**
 * @title IHumanArtRegistry
 * @notice Authoritative registry for physical artwork authentication, tag commitments, and counter replay protection.
 */
interface IHumanArtRegistry {
    struct ArtworkRecord {
        string metadataURI;
        bytes32 metadataDigest;
        string authorId;
        uint256 lastCounter;
        uint256 activatedAt;
        bool isActivated;
    }

    struct TagCommitmentRecord {
        bytes32 commitmentHash;
        uint256 registeredAt;
        bool isRegistered;
    }

    event TagsRegistered(bytes32[] commitmentHashes, uint256 timestamp);
    event TagRegistered(string indexed tagId, bytes32 indexed commitmentHash);
    event ArtworkActivated(
        string indexed tagId,
        string authorId,
        string metadataURI,
        bytes32 metadataDigest,
        uint256 initialCounter,
        uint256 timestamp
    );
    event ScanVerified(string indexed tagId, uint256 newCounter, address indexed caller, uint256 timestamp);

    error Unauthorized();
    error InvalidCommitment();
    error TagAlreadyRegistered();
    error TagNotRegistered();
    error TagAlreadyActivated();
    error ArtworkNotActivated();
    error CounterNotMonotonic(uint256 lastCounter, uint256 receivedCounter);
    error InvalidMetadataDigest();
    error InvalidInitialCounter();
    error EmptyTagId();
    error EmptyAuthorId();
    error EmptyMetadataURI();

    function registerTag(string calldata tagId, bytes32 commitmentHash) external;
    function registerTagsBatch(string[] calldata tagIds, bytes32[] calldata commitmentHashes) external;

    function activateArtwork(
        string calldata tagId,
        string calldata metadataURI,
        bytes32 metadataDigest,
        string calldata authorId,
        uint256 initialCounter
    ) external;

    function verifyScan(string calldata tagId, uint256 newCounter) external returns (bool);

    function getArtwork(string calldata tagId) external view returns (ArtworkRecord memory);
    function isTagRegistered(string calldata tagId) external view returns (bool);
    function isArtworkActivated(string calldata tagId) external view returns (bool);
}
