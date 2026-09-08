# REMO Litoral Web

Static frontend for [REMO Litoral](https://remolitoral.ar). This repository contains the
HTML, CSS, and browser-side JavaScript for the public website. Infrastructure and backend
services are maintained separately in `FedeLoker/remo_web_infra`.

## Environments

| Environment | Branch | URL |
| --- | --- | --- |
| Production | `main` | <https://remolitoral.ar> |
| Staging | `stage` | <https://staging.remolitoral.ar> |

The deployment service checks both branches approximately once per minute. Changes pushed
to other branches are not deployed.

## Local development

The project has no dependencies or build step. Run it with any static HTTP server:

```bash
python3 -m http.server 8877
```

Then open <http://localhost:8877>. Do not open `index.html` directly from the filesystem,
because the site uses JavaScript modules.

Main files:

- `index.html`: page structure and content.
- `assets/css/`: styles, layout, responsive rules, and animations.
- `assets/js/`: state and browser interactions.
- `ejemplo claude design/`: design references; not part of the deployed site.

There is currently no automated frontend test suite. Before submitting a change, check the
desktop and mobile layouts, keyboard navigation, browser console, links, and interactive
elements locally.

## Development workflow

Regular changes are proposed through a pull request to `stage`. After the change is merged,
verify it at <https://staging.remolitoral.ar>. Production releases are pull requests from
`stage` to `main` and should be verified at <https://remolitoral.ar> after deployment.

Pull requests to `main` and `stage` require:

- at least one approval;
- approval from code owner `@FedeLoker`;
- a new approval after additional commits are pushed;
- approval of the most recent push by someone other than its author.

Force pushes and branch deletion are disabled for both branches. `stage` always requires a
pull request, including for administrators. Administrators may push directly to `main` when
necessary.
