# CEBT Digital Employment & Opportunities Portal

**Connecting Carolina’s Talent with Opportunity**

A responsive client demonstration for the Carolina Economic Development Trust, based on the supplied portal brief. React 19, TypeScript and Vite; navy, teal, off-white and gold branding. Fonts are bundled locally, so the interface does not depend on a font service.

## Run the demo

```bash
cd /workspace/cebt-portal
npm ci --cache /tmp/cebt-npm-cache
npm run dev
```

Open **http://localhost:9081** on the machine running the development server. Both development and production preview use port **9081** with `strictPort: true`. If it is occupied, startup fails. Conflicting port overrides are rejected before startup. Port 5173 is reserved and must never be used for CEBT.

```bash
npm run build
npm run preview
```

Stop the development server before starting preview on the same port. Use the existing project directory; cloud tasks are already isolated and do not need a Git worktree. The unrelated `skills-introduction-to-github` repository is unchanged.

## Open online with GitHub Pages

The repository is **LuntuM91/CEBT-Project**. The included `.github/workflows/deploy-pages.yml` builds and publishes the portal when `main` changes, using the path supplied by GitHub Pages. You do not need to download the project to use the hosted demo.

In the repository on GitHub, go to **Settings → Pages → Build and deployment → Source**, choose **GitHub Actions**, then open **Actions → Deploy CEBT portal to GitHub Pages → Run workflow** if the first run happened before Pages was enabled. A successful deployment reports the actual site URL in the `github-pages` environment. The expected address for this repository is **https://luntum91.github.io/CEBT-Project/**; it is only available after GitHub Pages is enabled and the deployment completes.

The workflow uses GitHub's repository-scoped token; no deployment secret is needed. GitHub Pages availability depends on repository visibility and the account plan. If Pages is unavailable for a private repository, use a hosting service that supports private repositories rather than changing visibility without approval.

To reproduce the hosted-path build locally in Bash:

```bash
CEBT_BASE_PATH=/CEBT-Project/ npm run build
CEBT_BASE_PATH=/CEBT-Project/ npm run preview
```

For that build, use `http://localhost:9081/CEBT-Project/`. Normal development remains at `http://localhost:9081` with no environment variable required. Browser data is separate between the local and hosted origins. GitHub Pages hosts the demo frontend; it does not add a shared database or production authentication.

## Demonstration walkthrough

Click **Sign in** and choose a sample role. No password is required for the fictional demo personas. New job seekers and employers can also register and sign in using their own demo-only password.

1. **Job seeker – Thandi M.**: edit contact details, skills, qualifications and experience; upload a CV; browse/filter jobs; save opportunities; apply once per opportunity; track status history and interview details. Phone, qualifications, skills and a CV are required before applying.
2. **Employer – Carolina Mining Services**: edit company details; post, edit, close and reopen vacancies; search applicants by name, skill or qualification; review profiles and download CVs; shortlist; record an interview; mark a placement successful. Statistics update from application data.
3. **CEBT admin**: manage candidate and employer verification, activate/deactivate accounts, manage jobs and learning opportunities, review all applications, update placements, and explore skills demand, candidate skills, qualification demand, recent application activity and placement outcomes. Export the demo data or explicitly confirm a reset to restore the sample records.

Changing profile information returns it to awaiting verification. Unverified or inactive employers’ opportunities do not appear in public search. Closing a vacancy retains its existing applications. Opportunities past their closing date stop accepting applications. Supported opportunity types are full-time, part-time, contract, learnership, internship, apprenticeship, graduate programme and training.

## Data and prototype boundaries

All people, employers, contact details and records are fictional. The sample contains five candidates, five employers, ten vacancies and ten applications, including two successful applications for one placed candidate. Homepage counts and analytics reflect the actual browser data rather than invented headline totals.

The application uses browser localStorage for profiles, vacancies, applications, password hashes and CV files (maximum **2 MB** each), with tab-scoped sessionStorage for sign-in. Changes persist after refresh and synchronize between tabs on the same browser origin. A private browser window, different device or a different origin has its own separate data. CV download returns the original upload; sample CVs are clearly labelled fictional TXT documents. If browser storage is full, the app reports that the change could not be saved.

Registration passwords use salted PBKDF2 hashes, but this is **demo authentication**, not a production security boundary. Demo role switching is intentionally available. Local data is accessible to anyone with browser access; use fictional information, not real candidate documents. There is no shared backend, email service, production authentication, automated identity verification or live integration with GitHub Projects, WhatsApp or CEBT’s existing website. Candidate information verification is a manual demo action. Production deployment needs a server-side database, secure authentication and role authorization, protected document storage, privacy/consent handling and deployment integration with CEBT’s Employment Programme or dedicated subdomain.

The presentation itself was not attached in this workspace; this implementation follows the pasted requirements and palette. No existing CEBT application was present.

## Validation

```bash
npm run build
npm test
```

The Playwright suite exercises search and filters, saving and applying, duplicate prevention, CV upload/download, profile persistence, employer vacancy management, interview/placement updates visible to candidates, administration, account registration/sign-in, application readiness and mobile navigation. It runs a server on **9081** when one is not already available. The cloud machine has `/usr/bin/chromium`; set `CEBT_CHROMIUM_PATH` to an installed Chromium executable on another machine. Alternatively install Chromium with Playwright and set the executable path accordingly.

Use `npm ci` with the committed lockfile for repeatable dependency installation. Development credentials and browser content are never placed in project files.
