Last checked: 2026-09-06. This file is the event-specific companion to the [Human-Art project documentation](https://docs.aelig.art/doc/human-art-fgMdmkph45). It consolidates team notes, current public rules and sponsor scouting; it is not an organizer-issued rulebook.

## Event and Team Status

ETHOnline 2026 is an online/asynchronous ETHGlobal hackathon scheduled for **September 4-16, 2026**, as listed in the [official events calendar](https://ethglobal.com/events). Development submission closes before the event window ends.

Team-reported status: the application was submitted; Davide and Giacomo were accepted. Edoardo was discussed as another participant, but his acceptance and final team membership are not confirmed in these notes. Individual contributors are building HumanArt. The planned public monorepo is `aelig-human-art`; it has not been created as part of this documentation work.

Official entry points:

- [Event homepage and schedule](https://ethglobal.com/events/ethonline2026)
- [Application](https://ethglobal.com/events/ethonline2026/apply)
- [Participant information hub](https://ethglobal.com/events/ethonline2026/info)
- [Getting started, team setup and check-ins](https://ethglobal.com/events/ethonline2026/info/start)
- [Submission rules and judging](https://ethglobal.com/events/ethonline2026/info/details)
- [All partner prizes](https://ethglobal.com/events/ethonline2026/prizes)
- [Tools and resources](https://ethglobal.com/events/ethonline2026/info/resources)
- [General rules and code of conduct](https://ethglobal.com/rules)
- [ETHGlobal Discord](https://discord.com/invite/ethglobal)

The event homepage timed out during this refresh. The participant information pages and prize pages were readable. Exact workshop times, a new applicant's deadline and dashboard-only items were not independently verified; do not substitute another year's event pages.

## Dates and Required Actions

| Date or timing                                 | Item                                           | Action                                                                 |
| ---------------------------------------------- | ---------------------------------------------- | ---------------------------------------------------------------------- |
| September 4, 2026                              | Event begins                                   | Preserve the real start time and development provenance                |
| During the event                               | Dashboard check-ins and partner support        | Monitor authenticated dashboard, email and event Discord               |
| September 8 through submission                 | Chainlink liquidation challenge enrollment     | Relevant only to that separate challenge, not HumanArt's planned track |
| **September 13, 2026, 12:00 EDT**              | **Project submission deadline**                | Submit before the cutoff; no late submission                           |
| **September 13, 2026, 18:00 CEST / 16:00 UTC** | Same deadline in Zurich/Italy and UTC          | Use this conversion for team coordination                              |
| After submission                               | Partner judging and possible finalist sessions | Follow the team's dashboard instructions                               |
| September 16, 2026                             | Event window ends                              | Do not confuse this with the coding submission deadline                |
| Usually three weeks after the event            | Stake return for eligible submitters           | Verify wallet and status in the dashboard                              |
| September 30                                   | Arc deployment/deployment-readiness deadline   | Applies to Arc launch tracks only; not a general extension             |

Submission time comes from the [event-specific rules](https://ethglobal.com/events/ethonline2026/info/details). Staking/check-ins come from [participant onboarding](https://ethglobal.com/events/ethonline2026/info/start). Special track dates are linked in the sponsor sections below.

## Participation and Team Setup

Each participant applies and is accepted individually; teams may contain up to five people, including solo projects. The onboarding page requires an individual ETH stake and describes its return after submission, usually around three weeks later. The required amount and each member's payment status must be checked in the dashboard. Contact organizers if staking is a barrier.

Create/join the team through the dashboard, connect Discord, complete requested check-ins and use the mentorship channel for blockers. Acceptance alone is not confirmation that all administrative steps are complete. [Participant onboarding](https://ethglobal.com/events/ethonline2026/info/start)

The team's live-session notes say an organization-owned GitHub repository is allowed and team creation only needs to be completed before submission. These notes are useful operational guidance, but final membership should be checked directly in the dashboard.

## Rules Summary

**Build provenance.** Start Fresh excludes earlier project-specific code, designs and assets; public libraries/starter kits are allowed. Continuity permits eligible existing work with substantive new development and disclosure. Undisclosed reuse or misleading history can lead to disqualification, revoked prizes or future bans. Keep genuine incremental commits. Teams retain their developments; third-party materials retain their own licenses. Respect the code of conduct and review the event's media/data terms. [General rules](https://ethglobal.com/rules)

**Submission and judging.** Select up to three Partner Prizes; multiple tracks from one partner count as one selection. Submit a 2-4 minute video, at least 720p. Follow restrictions on speed-up, synthetic narration and video format. AI assistance requires attribution and meaningful human contribution; spec-driven work must include its specifications and prompts. Partner evaluation is asynchronous and independent of finalist screening. Live judging uses seven minutes: four for the presentation and three for questions. Criteria are technicality, originality, practicality, usability and wow factor. [Event-specific rules](https://ethglobal.com/events/ethonline2026/info/details)

### HumanArt Compliance Plan

- Prefer a genuinely new implementation, but confirm the selected track before importing existing project-specific material.
- Disclose earlier brainstorming, this documentation's creation date, any reused implementation and all external libraries. A newly created repository does not erase earlier work.
- Keep the repository public and readable throughout development; never fabricate commit history.
- Include the real source of NFC test vectors and the licenses of cryptographic libraries.
- Use readable explanations for human judges: what happens, what each dependency does, and what remains trusted.
- Keep AI attribution specific to files, designs, specifications and review work. Do not claim the entire project was independently hand-written.
- Record test versus production environments, local simulation versus live services, and the actual deployment state.
- Keep the main video within the stricter event limit even when a sponsor mentions a five-minute video.
- Do not buy extra services or force unrelated integrations simply to fill a third partner slot.

The written submission page establishes a three-partner prize-selection limit. Earlier notes described this as a three-SDK limit. Do not turn that shorthand into a broader rule without written organizer confirmation; HumanArt currently targets only two partners anyway.

## Published Prize Pool

The current page lists **11 partner pools totaling $80,000**. This is our arithmetic sum of the listed pools, not a verified total including finalist perks, credits or bonuses. Earlier notes mentioned more than $100,000 overall; that larger figure is not substantiated by the current listed partner amounts alone. [Prize listing](https://ethglobal.com/events/ethonline2026/prizes)

| Partner            | Listed pool | HumanArt assessment                                                                    |
| ------------------ | ----------- | -------------------------------------------------------------------------------------- |
| The Graph          | $15,000     | Optional indexing; not required for counter safety                                     |
| Hedera             | $15,000     | Current tokenization track is enterprise-finance oriented, not generic art NFT minting |
| Arc                | $10,000     | Stablecoin/payment focus; outside base scope                                           |
| World              | $7,000      | Selected integration direction: Selfie Check                                           |
| 1inch              | $7,000      | Aqua/DeFi focus; outside base scope                                                    |
| ENS                | $5,000      | Explicitly deferred; naming complexity has insufficient artist benefit                 |
| Uniswap Foundation | $5,000      | No required swap/liquidity workflow                                                    |
| Ledger             | $5,000      | No required Ledger Agent Stack workflow                                                |
| Privy              | $5,000      | Current prizes require financial flows; not just simple onboarding                     |
| Chainlink          | $3,000      | Selected integration direction: confidential workflow                                  |
| Bazantic           | $3,000      | No required agent/API recipe workflow                                                  |

## Selected Partner: Chainlink

Published tracks are **Best Confidential Workflow: $2,000**, up to two awards of $1,000; **Best Chainlink-Powered Upgrade: $500**, Continuity only; and **Automated Liquidation Protection Challenge: $500**. The main target requires a meaningful confidential handler, such as `handlerInTee`, processing actual sensitive data or secrets. Supply evidence of a successful CRE CLI simulation or live execution. A placeholder does not qualify. The upgrade track requires an on-chain state change. Sponsor guidance prefers CRE instead of Functions or Automation. The liquidation challenge opens enrollment September 8 and uses Ethereum Sepolia; it is unrelated to HumanArt's base flow. [Chainlink prize requirements](https://ethglobal.com/events/ethonline2026/prizes/chainlink)

HumanArt proposal: protect the World application credential and the sensitive part of author-activation verification before producing a tightly bound authorization result. This is intended to be meaningful identity infrastructure, not a decorative oracle call. The SDK/runtime bridge and actual confidentiality boundary still need a working prototype.

The ZK/MPC tag verifier is a separate component. Chainlink does not automatically supply it. If the confidential workflow cannot be integrated honestly, do not mislabel a conventional API as a qualifying confidential workflow.

Live Confidential Workflows access is private beta; local simulation is not real enclave protection. We can develop before access is granted, while clearly labelling the evidence. [Confidential Workflows](https://docs.chain.link/cre/concepts/confidential-workflows), [starter workflow](https://docs.chain.link/cre-templates/hello-confidential-workflows)

Evidence to prepare: code path from activation to workflow, sanitized successful execution output, accepted contract authorization, exact runtime versions, and an explanation of which secret is protected and where it travels.

## Selected Partner: World

World lists **Selfie Check: $3,500** and **AgentKit Continuity: $3,500**, each with up to three awards listed as $1,166. Selfie Check must be used meaningfully as a risk, eligibility, fairness, continuity or abuse-prevention signal in a working app. A feedback document must cover the integration, Developer Portal, sandbox behavior and confusing or broken cases. AgentKit is Continuity-only and requires a genuine human-backed agent integration; it is not HumanArt's target. [World prize requirements](https://ethglobal.com/events/ethonline2026/prizes/world)

HumanArt fit: artists can activate tags with a low-friction first-user check and return under the same author profile. Visitors do not need a credential. Orb/passport are optional, not barriers. World does not certify the artwork's authorship merely by checking the person.

The prize text calls Selfie Check low-assurance; the current developer page describes it as medium-assurance. Both must be interpreted through its actual properties: liveness/continuity, not strict global uniqueness. Keep that wording difference in sponsor feedback, rather than promoting Selfie to Orb-equivalent assurance. [Selfie Check technical description](https://docs.world.org/world-id/credentials/11)

Confirm HumanArt's app-specific feature flag and team device access. Sandbox is integration testing, not real production identities. [Sandbox access form](https://forms.gle/mqbaiwMvX5MzmKdY8), [Selfie sandbox guide](https://docs.world.org/world-id/sandbox/testing-selfie-check)

Evidence to prepare: first and returning artist, cancelled/failed check, exact operation binding, credential label, draft recovery, and a concise feedback file with reproducible issues. Optional Identity Check is product research, not a separately listed World bounty.

## Other Partner Scouting

### The Graph: $15,000

Three $5,000 pools cover composable/standardized products, new AI tooling/use cases, and Continuity AI tooling/use cases. The composition track requires multiple Graph products or meaningful standardized-schema use and live data; querying one ordinary Subgraph is insufficient. AI tracks require substantive tooling or agent behavior using live Graph data. [The Graph tracks](https://ethglobal.com/events/ethonline2026/prizes/the-graph)

HumanArt decision: no Graph integration is required now. Indexing may later help artwork discovery and history. It must never be responsible for atomically updating counters. Adding AI or unnecessary data pipelines solely to qualify would weaken the current scope.

### Hedera: $15,000

Pools: AI/agentic payments $6,000; improving Hedera Harness $2,000; tokenization $6,000; Continuity $1,000. The payments track requires a working x402-paid service and consumer. Tokenization requires Asset Tokenization Studio and an asset lifecycle on Hedera testnet, with verified contracts where applicable. Harness rewards substantive tooling contributions. [Hedera tracks](https://ethglobal.com/events/ethonline2026/prizes/hedera)

HumanArt decision: earlier generic NFT interest does not establish eligibility. An art certificate without enterprise-finance token lifecycle features is not an obvious fit for the published tokenization challenge.

### Arc: $10,000

Pools: new DeFi/on-chain finance $1,667; new agentic economy $1,667; Continuity DeFi/agentic work $1,666; launch-to-mainnet $3,500; Continuity launch $1,500. The emphasis is Arc, stablecoins and meaningful financial or agent payment flows. Launch tracks require deployment or deployment readiness on Arc mainnet by September 30. [Arc tracks](https://ethglobal.com/events/ethonline2026/prizes/arc)

HumanArt decision: no stablecoin checkout or settlement feature in the base product. Do not add one to justify a sponsor.

### 1inch: $7,000

Build an Aqua App has a $5,000 new-project pool and $2,000 Continuity pool. Use official Aqua/SwapVM contracts, demonstrate token movement and maintain genuine commit history; local forks are allowed. SwapVM use is favored. [1inch tracks](https://ethglobal.com/events/ethonline2026/prizes/1inch)

HumanArt decision: no liquidity or DeFi position is required to activate an NFC certificate.

### ENS: $5,000

ENSv2 has a $4,500 new-project track and $500 existing-project track. Both use the Sepolia beta and require ENSv2 to contribute materially, rather than display a cosmetic alias. The new registry, resolver and permission model is central. [ENS tracks](https://ethglobal.com/events/ethonline2026/prizes/ens)

HumanArt decision: explicitly deferred. Name ownership, subname control and lifecycle rules add process complexity without improving the core artist activation enough. No ENS dependency is required for artist identity or NFC authentication.

### Uniswap Foundation: $5,000

Uniswap-stack contributions have $3,000 new-project and $2,000 Continuity pools. A public repository, `FEEDBACK.md`, developer feedback-form submission and precise integration pointers are required. [Uniswap tracks](https://ethglobal.com/events/ethonline2026/prizes/uniswap-foundation)

HumanArt decision: no swap, liquidity or protocol contribution is currently needed.

### Ledger: $5,000

AI Agents x Ledger has $3,500; Continuity has $1,500. The new-project direction centers on Ledger Agent Stack and Key Ring, device-backed secrets, scoped capabilities, payments or human approval. [Ledger tracks](https://ethglobal.com/events/ethonline2026/prizes/ledger)

HumanArt decision: simply using a Ledger to deploy contracts is not the intended integration. Its agent/security workflows are outside the base user journey and do not automatically solve distributed NFC key custody.

### Privy: $5,000

Two $2,500 tracks cover B2B financial products and financial flows. Both require a meaningful Privy wallet integration and a working financial or administrative flow; B2B additionally uses controls such as policies or quorum approvals. Guided-onboarding mock features do not replace the required working integration. [Privy tracks](https://ethglobal.com/events/ethonline2026/prizes/privy)

HumanArt decision: embedded wallets could be useful later, but generic easy onboarding alone does not meet these financial prize requirements.

### Bazantic: $3,000

Three $1,000 pools cover a Continuity agent-use improvement, multi-service sponsor-API recipes, and adding a new API. They involve working gateways/recipes, demonstrable outcomes and account attribution. The Continuity comparison must isolate the recipe as the meaningful difference; the new-API track needs a service absent from the initial service/sponsor set. [Bazantic section in the full prize listing](https://ethglobal.com/events/ethonline2026/prizes)

HumanArt decision: no agent workflow is needed now. The dedicated partner URL failed during this refresh; the full listing was readable.

## Live Notes and Unresolved Conflicts

| Item from team notes                              | Current interpretation                                               | Required confirmation                                                                                 |
| ------------------------------------------------- | -------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| Repository can belong to a GitHub organization    | Retained as live-session guidance                                    | Ensure public access and actual team attribution                                                      |
| No separate team-creation deadline                | Complete team before submission                                      | Check dashboard membership and individual acceptance/stake                                            |
| Up to three partners                              | Written page confirms three prize selections                         | Do not infer a blanket three-library limit                                                            |
| Extra $1,000 for valid projects                   | Superseded by the user's later live note about ten finalist projects | Verify eligibility, amount per project/person, and whether it is a bonus or finalist perk             |
| Top ten and substantial finalist benefits         | Team-reported, not established as a full current benefits schedule   | Obtain written ETHOnline-specific confirmation; do not copy another event's package                   |
| Any chain is acceptable if deployed on mainnet    | Too broad to treat as a confirmed universal requirement              | ENS/Hedera explicitly use testnets; Chainlink permits simulation; confirm final HumanArt requirements |
| Wallet used to deploy does not affect eligibility | Retained as live-session guidance                                    | Still document operational roles and deployments                                                      |
| Larger than $100,000 overall prize pool           | Not established by the $80,000 listed sponsor sum                    | Check what bonuses/perks or unlisted awards explain the difference                                    |

The mainnet discrepancy should not prevent prototyping on Sepolia. It does mean the final deployment requirement must be confirmed for the selected event category and sponsor tracks. Simulation acceptance for one bounty is not universal approval to fake other project components.

## Changes Since Earlier Scouting

- Chainlink's tracks are now published; older notes saying coming soon are obsolete.
- World Selfie Check is the intended fit, not AgentKit by default and not an unconditional uniqueness claim.
- The Graph has distinct new-project and Continuity AI pools; a simple counter query is not enough for the composability bounty.
- The project has narrowed to prepared NFC certificates, simple artist activation and no extra NFT/wallet ceremony.
- ZK plus MPC replaces a centralized full-key verification server as the proposed research direction.
- ENS is deferred and the third partner slot remains unused.
- Railway is selected for support services, with the tag-key trust boundary kept separate.
- The project documentation is now independent of event scouting and uses the planned repository name `aelig-human-art`.

## Submission Preparation Checklist

- Verify every participant and the final team in the dashboard.
- Confirm Start Fresh versus Continuity and disclose earlier project-specific work accurately.
- Provide the public repository, setup instructions, real commit history and licenses.
- Include the architecture, protocol profile, limitations and AI-assistance record.
- Provide a working demo with prepared test tags and safe tester instructions.
- Record the physical scan, author check, activation, independent visitor verification and replay rejection.
- Show explorer links and actual contract/circuit/workflow versions; label test and simulated components.
- Select World and Chainlink only if their working integrations meet the current requirements.
- Include World feedback and confidential-workflow execution evidence.
- Choose finalist consideration explicitly if desired; partner selection is not the same action.
- Use a clear human-narrated video within the event's duration/resolution rules.
- Leave upload time before September 13 at 18:00 CEST, then inspect the submitted record.
- Monitor dashboard/Discord afterward for judging, requested corrections, survey and stake return.

No prizes, finalist places, beta access grants or production guarantees are assumed in the project budget or pitch.
