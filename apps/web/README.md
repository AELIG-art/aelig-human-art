# Web App

This package contains the Expo web application for the artist activation and collector verification journeys.

It must parse the NFC URL supplied by the operating system, preserve activation drafts across the World ID App handoff, and present distinct pending, accepted, stale, invalid, and unavailable states. It must not contain NFC secrets, World RP signing material, or privileged authorization logic.

The current interface is an explicit local prototype: it parses NFC URL parameters and renders the intended flows, but does not yet verify World ID, connect a wallet, validate AES tag messages, or submit blockchain transactions. See [the architecture](../../docs/architecture.md) for the evidence and trust-boundary requirements before connecting those integrations.
