// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {IHumanArtRegistry} from "./interfaces/IHumanArtRegistry.sol";

/**
 * @title HumanArtRegistry
 * @notice Experimental trusted-operator registry. Not a production authenticity verifier.
 * @dev Operator reports are trusted until authenticated tag reports, World enrollment
 *      and artist signatures are implemented. Do not deploy as a permissionless verifier.
 */
contract HumanArtRegistry is IHumanArtRegistry {
    address public owner;
    mapping(address => bool) public authorizedIssuers;
    mapping(address => bool) public authorizedOperators;
    mapping(string => string) private _allocatedAuthors;

    modifier onlyOperator() {
        if (msg.sender != owner && !authorizedOperators[msg.sender]) revert Unauthorized();
        _;
    }

    function setOperator(address operator, bool authorized) external onlyOwner {
        if (operator == address(0)) revert Unauthorized();
        authorizedOperators[operator] = authorized;
    }

    function allocateTag(string calldata tagId, string calldata authorId) external onlyIssuer {
        if (!_tags[tagId].isRegistered) revert TagNotRegistered();
        if (_artworks[tagId].isActivated) revert TagAlreadyActivated();
        if (bytes(authorId).length == 0) revert EmptyAuthorId();
        _allocatedAuthors[tagId] = authorId;
        emit TagAllocated(tagId, authorId);
    }

    event TagAllocated(string tagId, string authorId);

    // tagId => TagCommitmentRecord
    mapping(string => TagCommitmentRecord) private _tags;

    // tagId => ArtworkRecord
    mapping(string => ArtworkRecord) private _artworks;

    modifier onlyOwner() {
        if (msg.sender != owner) revert Unauthorized();
        _;
    }

    modifier onlyIssuer() {
        if (msg.sender != owner && !authorizedIssuers[msg.sender]) {
            revert Unauthorized();
        }
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function setIssuer(address issuer, bool isAuthorized) external onlyOwner {
        authorizedIssuers[issuer] = isAuthorized;
    }

    function transferOwnership(address newOwner) external onlyOwner {
        if (newOwner == address(0)) revert Unauthorized();
        owner = newOwner;
    }

    function registerTag(string calldata tagId, bytes32 commitmentHash) external onlyIssuer {
        if (commitmentHash == bytes32(0)) revert InvalidCommitment();
        if (bytes(tagId).length == 0) revert EmptyTagId();
        if (_tags[tagId].isRegistered) revert TagAlreadyRegistered();

        _tags[tagId] =
            TagCommitmentRecord({commitmentHash: commitmentHash, registeredAt: block.timestamp, isRegistered: true});

        emit TagRegistered(tagId, commitmentHash);
    }

    function registerTagsBatch(string[] calldata tagIds, bytes32[] calldata commitmentHashes) external onlyIssuer {
        uint256 len = tagIds.length;
        if (len != commitmentHashes.length) revert Unauthorized();

        for (uint256 i = 0; i < len; i++) {
            string calldata tagId = tagIds[i];
            bytes32 commitmentHash = commitmentHashes[i];
            if (commitmentHash == bytes32(0)) revert InvalidCommitment();

            if (bytes(tagId).length == 0) revert EmptyTagId();
            if (_tags[tagId].isRegistered) revert TagAlreadyRegistered();

            _tags[tagId] =
                TagCommitmentRecord({commitmentHash: commitmentHash, registeredAt: block.timestamp, isRegistered: true});

            emit TagRegistered(tagId, commitmentHash);
        }

        emit TagsRegistered(commitmentHashes, block.timestamp);
    }

    function activateArtwork(
        string calldata tagId,
        string calldata metadataURI,
        bytes32 metadataDigest,
        string calldata authorId,
        uint256 initialCounter
    ) external onlyOperator {
        if (bytes(tagId).length == 0) revert EmptyTagId();
        if (bytes(authorId).length == 0) revert EmptyAuthorId();
        if (bytes(metadataURI).length == 0) revert EmptyMetadataURI();
        if (metadataDigest == bytes32(0)) revert InvalidMetadataDigest();

        TagCommitmentRecord storage tag = _tags[tagId];
        if (!tag.isRegistered) revert TagNotRegistered();
        if (keccak256(bytes(_allocatedAuthors[tagId])) != keccak256(bytes(authorId))) {
            revert Unauthorized();
        }

        ArtworkRecord storage artwork = _artworks[tagId];
        if (artwork.isActivated) revert TagAlreadyActivated();

        _artworks[tagId] = ArtworkRecord({
            metadataURI: metadataURI,
            metadataDigest: metadataDigest,
            authorId: authorId,
            lastCounter: initialCounter,
            activatedAt: block.timestamp,
            isActivated: true
        });

        emit ArtworkActivated(tagId, authorId, metadataURI, metadataDigest, initialCounter, block.timestamp);
    }

    function verifyScan(string calldata tagId, uint256 newCounter) external onlyOperator returns (bool) {
        if (bytes(tagId).length == 0) revert EmptyTagId();

        ArtworkRecord storage artwork = _artworks[tagId];
        if (!artwork.isActivated) revert ArtworkNotActivated();

        if (newCounter <= artwork.lastCounter) {
            revert CounterNotMonotonic(artwork.lastCounter, newCounter);
        }

        artwork.lastCounter = newCounter;

        emit ScanVerified(tagId, newCounter, msg.sender, block.timestamp);
        return true;
    }

    function getArtwork(string calldata tagId) external view returns (ArtworkRecord memory) {
        ArtworkRecord memory record = _artworks[tagId];
        if (!record.isActivated) revert ArtworkNotActivated();
        return record;
    }

    function isTagRegistered(string calldata tagId) external view returns (bool) {
        return _tags[tagId].isRegistered;
    }

    function isArtworkActivated(string calldata tagId) external view returns (bool) {
        return _artworks[tagId].isActivated;
    }
}
