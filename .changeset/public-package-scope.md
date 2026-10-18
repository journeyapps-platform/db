---
'@ja-platform/parser-schema': major
'@ja-platform/parser-common': major
'@ja-platform/day': major
'@ja-platform/evaluator': major
'@ja-platform/db': major
---

Move public packages to the `@ja-platform/` scope and publish them to the public npm registry. Update dependency names and imports to the new scope. Remove the legacy `journeyapps` wrapper; customers should use the direct exports from `@ja-platform/db`.

Rename the date package to `@ja-platform/day` and move it to the `packages/day` workspace directory, preserving its existing exports and behavior.

Organize the workspace under `packages/`, with the customer database SDK in `packages/db`.
