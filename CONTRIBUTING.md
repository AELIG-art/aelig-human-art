# Contributing

## Development discipline

- Make focused commits that explain one meaningful change.
- Keep documentation aligned with implementation. Mark proposed, simulated, and deployed components distinctly.
- Add or update tests with protocol changes.
- Use synthetic fixtures only. Never commit operational keys, personal data, scans from real tags, or provider credentials.
- Preserve the event's truthful Git history and disclose reused work and AI assistance accurately.

## Before opening a pull request or merging to main

```sh
pnpm check
```

For protocol changes, add a concise threat-model note and negative tests. For user-facing work, include the relevant mobile-browser and World-handoff test evidence when available.

