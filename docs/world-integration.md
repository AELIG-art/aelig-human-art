Last updated: 2026-09-06. Status: agreed user experience and credential policy; SDK integration, access grants and on-chain authorization bridge are not yet verified.

## Role in HumanArt

World helps establish a human-backed artist account and continuity when the artist returns. It does not verify the artwork, establish legal authorship or authenticate the NFC chip. HumanArt records the artist's declaration that a particular artwork belongs to that author profile.

World is required for artist activation, not visitor verification. The NFC scan itself must never force visitors to enroll in World.

## Credential Policy

| Credential | HumanArt policy | Meaning to expose in the interface |
|------------|-----------------|------------------------------------|
| Selfie Check | Sufficient for the base activation flow | Selfie/liveness check completed; returning-user continuity where supported |
| Orb-backed Proof of Human | Optional        | Orb-backed unique-human credential |
| Passport   | Optional        | Verified NFC passport credential; not interchangeable with Orb uniqueness |
| Identity Check | Optional preview experiment | Specific supplied document-backed attributes matched |

The product accepts more than one assurance level but must label them differently. Do not describe a selfie as an Orb-equivalent check.

Selfie Check uses liveness and facial matching, not a strict one-person-one-account guarantee or a numerical uniqueness score. It supports a returning-user camera check and has a 90-day inactivity window. Mobile uses a World ID App handoff; desktop can use a QR handoff. An artist may need to install that app first. [Selfie Check documentation](https://docs.world.org/world-id/credentials/11)

## SDK and Preview Constraints

Current IDKit exposes Selfie Check through `selfieCheckLegacy()`, using World ID 3.0 rather than a native 4.0 Selfie credential. The selected SDK, credential and verifier versions must be tested together. `proofOfHuman` and `passport` represent different credential requests. `require_user_presence` requests fresh liveness where supported. [Credential configuration](https://docs.world.org/world-id/idkit/credentials)

The team reports access to new sandbox features. Treat that as access to explore, not evidence that every feature is enabled on the HumanArt app. Confirm the app-specific Selfie Check flag and request Identity Check separately if needed.

Sandbox follows the integration journey using test identities/proofs. TestFlight or private Android distribution may be required; iOS recovery and invite flows have documented limitations. Label sandbox evidence as test evidence, never as production identity certification. [Sandbox access](https://docs.world.org/world-id/sandbox/sandbox-access), [Selfie sandbox coverage](https://docs.world.org/world-id/sandbox/testing-selfie-check)

## Activation Authorization Design

Proposed flow:


1. The artist scans an issued tag and completes the artwork form.
2. HumanArt prepares a canonical activation digest containing protocol version, chain, contract, tag ID, metadata digest, intended author context, a single-use operation identifier and expiry.
3. The World request binds to that operation using the supported signal/context mechanism. Editing the artwork afterward requires new authorization.
4. The app obtains an RP-signed request through the server-side integration path. RP means relying party: HumanArt, the application requesting the check.
5. IDKit transfers the user to World ID App and obtains the result.
6. The verifier validates the complete result, expected credential, environment, action, signal/context and validity window. It derives the author association from authenticated evidence, not from a client-supplied author ID.
7. The selected on-chain authorization bridge binds that evidence to the same activation digest and delivery entitlement.
8. The relayer submits the exact authorized operation with the tag proof. Contract checks consume the operation and counter once.

The standard World integration requires a backend to sign requests and verify results. RP signing keys must never be exposed in Expo/browser code. HumanArt proposes moving meaningful secret handling into Chainlink confidential execution, but that runtime integration is not established yet. [IDKit integration](https://docs.world.org/world-id/idkit/integrate)

Removing a manual wallet signature does not remove authorization. The exact bridge between the external credential and contract acceptance must be implemented and tested before activation can be called secure.

## Author Identity and Returning Users

Use an application-scoped pseudonymous `authorId`. Record credential version, type, verification time and an evidence reference. A public HumanArt profile can aggregate artworks for that identifier with the artist's informed consent.

World 3.0 action-scoped nullifiers and 4.0 session mechanisms are not the same identifier. Version 4.0 distinguishes a session identifier from per-proof session nullifiers. A nullifier is a replay/linking primitive within its defined scope, not a public global identity or a login cookie. [World ID migration guide](https://docs.world.org/world-id/4-0-migration)

Before implementation, select a stable supported identity scope for repeat activations. Do not create a different action per artwork and then assume resulting identifiers automatically identify the same artist. Do not merge Selfie, passport and Orb identities because display names match. Credential upgrades and recovery need explicit account-linking authorization.

## Artist Profile and Personal Data

Display name, biography and website are artist-supplied fields. World does not automatically supply a legal name or public social profile.

Identity Check can attest that requested document-backed attributes match, including a supplied `full_name`; a successful response includes `identity_attested`. This is not an API that returns every passport field. HumanArt would use a separately consented optional name-match check, not collect document numbers, nationality or passport images for the base flow. [Identity Check preview](https://docs.world.org/world-id/idkit/credentials#identity-check-preview)

Default public record: chosen artist name, scoped author reference, credential description and verification date. If an optional name match is implemented, distinguish that result explicitly. Reconfirm what public evidence is necessary before putting any personal name on an immutable chain.

## UX and Error Requirements

* Explain before handoff that World ID App is needed; do not promise a browser-only selfie.
* Preserve the draft across mobile app switching, cancellation and recovery.
* Show a QR fallback for desktop and test the real mobile deep-link round trip.
* Support denied camera access, cancelled consent, failed matching, expired requests and unavailable preview features.
* Never activate on a UI success callback alone; require verified server/contract evidence.
* Never reuse a prior operation proof to activate another tag or modified artwork.
* Distinguish account recovery from author reassignment. Support cannot silently rewrite authorship.

## Integration Acceptance Evidence

Record the app configuration, credential and SDK versions, enabled feature flags, environment and tested device/OS combinations. Provide successful first-user and returning-user flows, plus rejected wrong-context, replayed and expired requests. Keep privacy-safe screenshots and logs. Do not retain biometric samples or operational signing keys in the repository.

Detailed event-specific sponsor qualification and feedback requirements belong only in the [hackathon dossier](https://docs.aelig.art/doc/ethonline-2026-event-rules-and-partner-dossier-EVwaRTPdg9).
