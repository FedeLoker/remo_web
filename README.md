# REMO Litoral Web

Static frontend for [REMO Litoral](https://remolitoral.ar). This repository contains the
HTML, CSS, and browser-side JavaScript for the public website. Runtime infrastructure,
the control panel, forms, redirects, and deployment services are maintained separately
in `FedeLoker/remo_web_infra`.

There is no compilation step, package manager, or application server in this repository.
The site is served as static files.

## Environments and deployment

| Environment | Git branch | URL | Purpose |
| --- | --- | --- | --- |
| Production | `main` | <https://remolitoral.ar> | Public website |
| Staging | `stage` | <https://staging.remolitoral.ar> | Review and acceptance before production |

Staging is available at <https://staging.remolitoral.ar>.

The deployment service maintained in the infrastructure repository checks `main` and
`stage` approximately once per minute. It publishes each commit as an immutable release,
runs an HTTP health check, and keeps the previous release active if that check fails.
Pushing any other branch does not deploy a website.

At the time this README was written, `main` contains the temporary coming-soon page and
`stage` contains the full interactive landing page.

## Run locally

Requirements:

- Python 3, or any static HTTP server.
- A current web browser.

Clone the repository and start a local server from its root:

```bash
git clone git@github.com:FedeLoker/remo_web.git
cd remo_web
python3 -m http.server 8877
```

Then open <http://localhost:8877>. A server is required because the browser loads the
JavaScript as ES modules; opening `index.html` directly from the filesystem is not supported.

There is no dependency installation or build command. Stop the server with `Ctrl+C`.

## Project structure

- `index.html`: page structure and content.
- `assets/css/tokens.css`: colors, typography, spacing, and design tokens.
- `assets/css/base.css`: reset and shared accessibility defaults.
- `assets/css/layout.css`: containers and vertical rhythm.
- `assets/css/components.css`: navigation, chips, questions, and forms.
- `assets/css/sections.css`: full-site section styles.
- `assets/css/coming-soon.css`: temporary production landing styles on `main`.
- `assets/css/responsive.css`: tablet and mobile adjustments.
- `assets/css/motion.css`: transitions and reduced-motion behavior.
- `assets/js/state.js`: session state for roles, searches, events, and actions.
- `assets/js/onboarding.js`: interactive choices, matching, and the final summary.
- `assets/js/interactions.js`: form validation and submission behavior.
- `assets/js/animations.js`: hero animation and mobile navigation.
- `assets/js/main.js`: JavaScript entry point.
- `ejemplo claude design/`: design references; not part of the deployed runtime.

## Full-site behavior

The full landing page follows this sequence: introduction, people, matching mechanism,
events, participation options, and contact form. Answers are optional, remain in the
browser's `sessionStorage`, and are summarized at the end of the flow.

Several people, events, matching examples, photos, and response counts are sample content.
Search for `PLACEHOLDER` before publishing a full-site revision and replace every value with
approved content.

### Contact submission

The full-site contact form validates name, city, and either an email address or a phone
number. Submission is intentionally a placeholder: `enviarInscripcion()` in
`assets/js/interactions.js` logs the payload and returns success without storing or sending it.

To connect it to a backend:

1. Replace the body of `enviarInscripcion()` with a `fetch` request.
2. Return `{ ok: true }` only after the server confirms the submission.
3. Remove the two `pending-note` paragraphs from `index.html` once data is actually stored.
4. Test success, validation errors, network failures, and repeated submissions.

Do not remove the on-page warning before a real endpoint is available.

## Development workflow

Normal changes start from `stage` and return to `stage` through a pull request:

```bash
git switch stage
git pull --ff-only origin stage
git switch -c feature/short-description

# Make and validate the change.

git push -u origin feature/short-description
```

Open the pull request against `stage`. Once it is approved and merged, verify the change at
<https://staging.remolitoral.ar>. To release, open a pull request from `stage` to `main` and
verify production after merging. Pull requests to `main` must pass the configured source-branch
check.

Pull requests to both `main` and `stage` are protected:

- at least one approving review is required;
- approval from code owner `@FedeLoker` is required for every changed file;
- stale approvals are dismissed when new commits are pushed;
- the last push must be approved by someone other than its author;
- force pushes and branch deletion are disabled.

`stage` also requires every change to arrive through a pull request, including changes made
by repository administrators. On `main`, repository administrators may bypass the pull-request
requirement so that `@FedeLoker` can push directly when necessary. Keep administrator access
limited, because every administrator receives the same bypass.

GitHub does not allow a pull request author to approve their own pull request. Because
`@FedeLoker` is the sole code owner, changes authored by that account should be pushed directly
to `main` only when the explicit bypass is appropriate; normal staging changes should be
authored from a separate contributor account.

## Validation checklist

This repository currently has no automated frontend test suite or linter. Before requesting
a review:

1. Serve the site locally rather than opening the HTML file directly.
2. Check desktop and mobile layouts.
3. Navigate the full page with a keyboard and verify visible focus states.
4. Confirm the browser console has no errors.
5. Exercise interactive choices and reload behavior within the same tab.
6. Test valid and invalid contact form input when working on the full-site branch.
7. Verify that all internal links and asset requests return successfully.

A simple server check is:

```bash
curl --fail --head http://localhost:8877/
```
