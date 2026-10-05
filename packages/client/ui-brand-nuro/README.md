---
description: "Nuro brand occupants for the sidebar, active in every build except the official one; for users and maintainers replacing brand presentation."
kind: "package-reference"
---

# @deepseek-ai/dsh-client-ui-brand-nuro

English | [中文](README.zh.md)

## Summary

This package gives a non-`official` client build the Nuro mark and name in the sidebar. The official build profile keeps DeepSeek's own presentation, so exactly one of the two brand packages registers in any build. Use it for a distribution that ships under its own name; the package owns no runtime state and does not affect model requests.

## Table of Contents

- [Use this package](#use-this-package)
- [Understand the implementation](#understand-the-implementation)
- [Further Exploration](#further-exploration)
- [Model Experience](#model-experience)
- [Known Limitations and Deferred Work](#known-limitations-and-deferred-work)
- [Dev Note](#dev-note)

-----

<a id="use-this-package"></a>
## Use this package

Mount this plugin in the browser roster of a deployment whose identity is not DeepSeek's own, and leave the `official` profile for builds that are DeepSeek's.

### Choosing the profile

`DSH_CLIENT_BUILD_PROFILE` selects which brand renders. Every value except `official` registers the Nuro occupants; `official` leaves them out so `dsh-client-ui-brand-official` supplies DeepSeek's mark and name instead. The conversation hero keeps its own declaring fallback in both cases, because this package does not occupy that slot. The plugin loads and validates under every profile; only the registration is profile-gated.

### Replacing the brand

A deployment with another identity leaves this package out and composes its own package over the same sidebar slots. Occupying a slot is the only composition route; there is no brand configuration surface here.

-----

<a id="understand-the-implementation"></a>
## Understand the implementation

<details>
<summary>Implementation internals — click to expand</summary>

The two occupants install as one declaration-aware registration set: nested `ctx.slots.inject()` calls wait on the sidebar declaration, so the set works whether this row activates before or after the declarer, withdraws both occupants when the declaration collapses, and leaves no partial brand mix during HMR. The browser half is [`src/client/index.ts`](src/client/index.ts); the node half is an empty Loader seat.

The name renders as text rather than artwork. The shipped wordmark is an SVG of DeepSeek's lettering with no text alternative, so it cannot be reused for another name, and this package ships no matching lettering. The browser title is a build-environment concern (`DSH_CLIENT_TITLE`), outside the slot system.

</details>

-----

<a id="further-exploration"></a>
## Further Exploration

Read these pages when the brand surface is not enough. They move from the slots this package occupies to the shell that renders them.

- [ui-sidebar](../ui-sidebar/README.md) — declares `sidebar.brand.mark` and `sidebar.brand.name` and renders their fallbacks.
- [ui-brand-official](../ui-brand-official/README.md) — the DeepSeek occupants this package displaces outside official builds.
- [Web client architecture](../../../docs/subsystems/web-client.md) — how browser plugin rows load and register slots.

-----

<a id="model-experience"></a>
## Model Experience

None, as the package contributes browser presentation only; nothing here reaches a model request.

#### KV Cache effect

None; this package neither assembles nor sends a provider request.

## Known Limitations and Deferred Work

<a id="known-limitations-and-deferred-work"></a>


These limits define how brand presentation is supplied. They are current package constraints, not a brand-design comparison or a task backlog.

- **One occupant set** — alternative presentation belongs in another Cordis package occupying the same slots.
- **No Nuro lettering** — the name is set as text because no artwork exists for it; supplying artwork means extending this package.
- **The browser title is independent** — `DSH_CLIENT_TITLE` selects title text at build time rather than through a UI slot.
- **Client onboarding copy is not covered** — the product name inside onboarding comes from a locale dictionary, so it still reads DeepSeek Harness in a Nuro build.

<a id="dev-note"></a>
### Dev Note

<details>
<summary>Working context for maintainers — click to expand</summary>

None.

</details>
