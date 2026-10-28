---
'@ja-platform/db': major
---

Publish the JourneyApps Platform database SDK as `@ja-platform/db` on the public npm registry.

- Remove the legacy `journeyapps` wrapper. Import `Database`, `OnlineDB`, `Day`, and other SDK exports directly from `@ja-platform/db`.
- Require Node `^22.19.0 || ^24.11.0 || >=26.0.0` to support the upgraded parser dependencies.
- Consume the type system, expressions, and schema from `@ja-platform/parser-type-system`, `@ja-platform/parser-expressions`, and `@ja-platform/parser-schema` in the separate parser repository. Update database integration to the typed expression API.
- Use `Day` from `@ja-platform/parser-schema`, preserving its re-export from the database SDK. Retire `@ja-platform/parser-common` and legacy Version-based schema handling.
- Move the database SDK to the repository root as a single package, preserving its compiled entry points and simplifying build, test, and release configuration.
