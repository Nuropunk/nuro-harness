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

Every user-visible name is a **configuration seam owned by the launcher**, not a hardcoded edit. That keeps the fork small and rebasable against upstream, and it follows the upstream rule that deployment-varying choices belong in validated config rather than in plugin source.

| Surface | Mechanism | Default |
|---|---|---|
| Model-facing self-identity | `system-prompt` row's `identity` config | `You are an AI agent powered by DeepSeek Harness.` |
| Web/desktop document title | `DSH_CLIENT_TITLE` (build-time) | `DSH Local Build` |
| Installed app name | `DSH_DESKTOP_PRODUCT_NAME` | `DeepSeek Harness` |
| Electron application id | `DSH_DESKTOP_APP_ID` | required by the packaging environment |
| Artifact file names | derived slug of the product name | `deepseek-harness` |
| Data home | `NURO_HOME` / `DSH_HOME` | `~/.nuro-dsh` |

`bin/nuro` sets the four branding variables and owns `DSH_HOME` outright. It sets `DSH_HOME` rather than inheriting it because a parent `dsh` process exports its own home to the agents it runs; inheriting that value would silently point Nuro at another installation's data.

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

The failure is **safe**: the migration refuses and leaves the source artifact untouched, so no session is corrupted or lost. But sessions containing a subagent descriptor at v2 cannot be opened in Nuro until a v2→v3 upgrader exists. Measured on one real 0.1.1 store: 121 of 256 sessions contained such a descriptor; the other 135 migrated cleanly.

Closing this gap needs a descriptor-version upgrader that understands the v2 field set, which is upstream work rather than a rebranding change. Using a separate data home keeps the limitation contained: the original installation retains full access to every session.

## Attribution

Nuro is DeepSeek Harness plus configuration. The harness, its packages, and its documentation are DeepSeek's work under MIT. If you redistribute Nuro, keep [LICENSE](LICENSE) and [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) intact and follow [BRAND_GUIDELINES.md](BRAND_GUIDELINES.md): describe the relationship truthfully (for example "built on DeepSeek Harness"), and do not present the result as official or endorsed.
