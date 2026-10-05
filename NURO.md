# Nuro

Nuro is a personal fork of [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) (`dsh`), an all-plugin agent harness built on [Cordis](https://github.com/cordiverse/cordis). It runs as the **Nuro** desktop and web application.

- Fork: <https://github.com/Nuropunk/nuro-harness>
- Upstream: <https://github.com/deepseek-ai/deepseek-harness>
- Licensed MIT, retaining DeepSeek's original copyright notice ([LICENSE](LICENSE)).

Nuro is not affiliated with, endorsed by, or sponsored by DeepSeek. "DeepSeek Harness" is a DeepSeek trademark and appears in this repository only to describe the fork's origin, per [BRAND_GUIDELINES.md](BRAND_GUIDELINES.md).

## Run it

```sh
pnpm install
pnpm run build

./bin/nuro               # desktop app
./bin/nuro web           # web UI
./bin/nuro exec --help   # the underlying dsh CLI
./bin/nuro home          # print the resolved data home
```

`pnpm run build` must run once before launching; it compiles the workspace and emits the client bundles the UI loads.

## How the branding works

Nuro's own name reaches the product through **configuration seams owned by the launcher**, not through hardcoded edits. That keeps the fork small and rebasable against upstream, and it follows the upstream rule that deployment-varying choices belong in validated config rather than in plugin source.

| Surface | Mechanism | Default |
|---|---|---|
| Model-facing self-identity | `system-prompt` row's `identity` config | `You are an AI agent powered by DeepSeek Harness.` |
| Web/desktop document title | `DSH_CLIENT_TITLE` (build-time) | `DSH Local Build` for a local build; release builds require `DeepSeek Harness` |
| Installed app name | `DSH_DESKTOP_PRODUCT_NAME` | `DeepSeek Harness` |
| Electron application id | `DSH_DESKTOP_APP_ID` | required by the packaging environment |
| Artifact file names | derived slug of the product name | `deepseek-harness` |
| Data home | `NURO_HOME` / `DSH_HOME` | `~/.nuro-dsh` |

These seams cover the app name, the document title, the packaged identity, artifact names, and the model-facing opener. They are **not** a complete rebrand of every string, and three gaps are deliberate and known:

- The client's onboarding copy reads the product name from the typed locale dictionary (`packages/client/ui-settings-account/src/client/locales/onboarding.ts`, key `onboardingBrand`), which still says `DeepSeek Harness`. Upstream's own guidance is that a deployment with another identity supplies a replacement brand package alongside `packages/client/ui-brand-official`; that package does not exist here yet.
- `apps/desktop/scripts/electron-builder-config.mjs` still hardcodes the macOS `NSMicrophoneUsageDescription` text, which `DSH_DESKTOP_PRODUCT_NAME` does not rewrite.
- Roughly 195 `DeepSeek Harness` occurrences remain across shipped production files (package descriptions, prompt text, window titles). None of them are Nuro strings, and under the brand guidelines they are accurate: the harness underneath is DeepSeek Harness.

`bin/nuro` sets the four branding variables and owns `DSH_HOME` outright. It sets `DSH_HOME` rather than inheriting it because a parent `dsh` process exports its own home to the agents it runs; inheriting that value would silently point Nuro at another installation's data. The same applies to `ELECTRON_RUN_AS_NODE`, which a parent `dsh` process also exports: an inherited value makes Electron start as plain Node and refuse to open a window, so both desktop modes clear it and `bin/nuro home` is the way to inspect the resolved home.

Nuro's own identity text lives in the profile at `$DSH_HOME/profiles/desktop/cordis.patch.yml` (and `profiles/nuro/`), applied as the last patch layer over the shipped bundles.

### Source changes in this fork

Three additive changes, all default-preserving:

- `packages/core/system-prompt` — new `identity` config field defaulting to the shipped sentence,
so a distribution can replace the opener without editing source.
- `apps/desktop/scripts/desktop-release-environment.mjs` — new `resolveDesktopProductName`,
reading `DSH_DESKTOP_PRODUCT_NAME` and defaulting to the shipped name.
- `apps/desktop/scripts/electron-builder-config.mjs` — uses that product name for
`productName`, the registered protocol name, and a derived `artifactName` slug.

No shipped default changes. Tests pin the upstream behaviour and add coverage for the new seams.

## Data home and session compatibility

Nuro uses `~/.nuro-dsh` by default and does **not** read the session store of another harness installation. This is deliberate; see the limitation below.

### Known limitation: sessions written by 0.1.1 cannot be adopted

Sessions carry a format version and are migrated forward on read (`dsh-session-format-v0-to-v1` … `v3-to-v4`). Upstream 0.1.1 wrote session format **v0**; this fork writes **v4** and migrates v0 forward correctly.

However, 0.1.1 also wrote `subagent/descriptor` events at descriptor version **2**, while this fork requires `SUBAGENT_DESCRIPTOR_VERSION = 3` (`packages/subagent/subagent/src/descriptor.ts`) and has no v2→v3 upgrader. Adopting such a session fails with:

```
failed to observe session "<id>": subagent/descriptor 0 uses unsupported descriptor version 2;
source v0 artifact remains unchanged
```

The failure is **safe**: the refusal happens while the stored log is decoded, before any publication, and publication only ever writes the current-format path while re-checking the source. So the source artifact is not corrupted or lost. But sessions containing a subagent descriptor at v2 cannot be opened in Nuro until a v2→v3 upgrader exists.

The measurement behind this section comes from one 0.1.1 session store on the author's machine and is recorded as an observation rather than a reproducible fixture: it is not part of this checkout, so it cannot be re-derived from the repository. On that store, 121 of 256 sessions contained a descriptor at v2 and the other 135 migrated cleanly. Treat the ratio as indicative of how common the case is, not as a guarantee about any other store.

Two related gaps are worth recording. The `version !== 3` refusal in `packages/session/session-format-v0-to-v1/src/validation.ts` has no test that exercises a v2 descriptor, and it compares against a literal `3` rather than importing `SUBAGENT_DESCRIPTOR_VERSION`, so the two can drift apart. Both are upstream concerns rather than rebranding changes.

Closing this gap needs a descriptor-version upgrader that understands the v2 field set, which is upstream work rather than a rebranding change. Using a separate data home keeps the limitation contained: the original installation retains full access to every session.

## Attribution

Nuro is DeepSeek Harness plus configuration. The harness, its packages, and its documentation are DeepSeek's work under MIT. If you redistribute Nuro, keep [LICENSE](LICENSE) and [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) intact and follow [BRAND_GUIDELINES.md](BRAND_GUIDELINES.md): describe the relationship truthfully (for example "built on DeepSeek Harness"), and do not present the result as official or endorsed.
