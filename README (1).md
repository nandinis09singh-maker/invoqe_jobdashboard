# invoqe_jobdashboard
# CareerFlow

A graduate job dashboard for India. Browse roles, save the ones you like, apply, and track your applications. It is a static site (HTML, CSS and JavaScript) that runs on GitHub Pages with no backend.

Live site: https://nandinis09singh-maker.github.io/invoqe_jobdashboard/

## Features

- **Find jobs** (`index.html`): search, filters (city, work mode, job type), sorting, job details pop-up, and an apply form.
- **Saved jobs** (`saved-jobs.html`): every job you save on the Find jobs page, with Remove and Apply buttons.
- **Applications** (`applications.html`): sample applications plus any you submit, with status and location filters.
- **Accounts** (`signup.html`, `login.html`, `profile.html`): sign up and log in, with your name and initials shown in the top right.
- **Motion**: scroll reveals, card tilt and animated page transitions (`js/motion.js`).

## Project structure

```
invoqe_jobdashboard/
├── index.html
├── saved-jobs.html
├── applications.html
├── career-resources.html
├── login.html
├── signup.html
├── profile.html
├── README.md
└── js/
    ├── jobs-data.js        # all jobs + saved/applied storage (shared by 3 pages)
    ├── auth.js             # sign up, log in, fills in the user's name and initials
    ├── motion.js           # animations and page transitions
    └── vector-wordmark.js  # large CAREERFLOW wordmark banner
```

File names are case-sensitive on GitHub Pages. Keep them lowercase exactly as shown.

## How saving and applying works

Saved jobs and applications are stored in the visitor's own browser using `localStorage`:

| Key | What it holds |
|---|---|
| `cf_saved` | IDs of saved jobs |
| `cf_apps` | Submitted applications (job ID and date) |
| `cf_user` | The signed-up user (name, email, phone) |
| `cf_name` | The name shown on the Find jobs page |

Because this is browser storage, data does not carry over to another browser or device. Clearing site data resets it.

## Adding or editing jobs

Open `js/jobs-data.js` and add a row to the `JOBS` list:

```js
J(19, 'Job title', 'Company', 'CO', 'teal', 'Pune', 'Hybrid', 'Full-time', '0–1 years', '₹6L–₹9L', 2, 'Short description.', false)
```

The values are: id, title, company, initials, logo colour (`''`, `teal`, `orange`, `pink`, `sky` or `violet`), city, work mode, job type, experience, salary, days since posted, description, and top match (`true` or `false`). Use a new, unique id for every job. All pages update automatically.

## Run locally

Open a terminal in the project folder and start a simple server:

```bash
python -m http.server 8000
```

Then visit http://localhost:8000. Opening the files directly (`file://`) mostly works, but a server matches how GitHub Pages behaves.

## Deploy to GitHub Pages

1. Push all files to your repository, with `jobs-data.js` inside the `js` folder.
2. In the repo, open **Settings → Pages** and choose the branch to publish (usually `main`, root folder).
3. Wait about a minute, then hard refresh the site with `Ctrl + Shift + R`.

## Troubleshooting

**A page is blank**
- Right-click the page and choose **View page source**. If it is empty, the file in your repo is empty. Upload it again.
- Press `F12` and open the **Console** tab. A red error shows which file or line is failing.
- Confirm the file names are lowercase and in the right folders.

**Saved jobs or Applications are empty**
- Make sure `js/jobs-data.js` is uploaded. Without it those pages cannot load the job list.
- Save or apply on `index.html` first, then open the other pages in the same browser.

**The top right shows "AM" or "NS" instead of your name**
- The name only appears after you sign up at `signup.html` on the live site, in the same browser.

**Changes do not show after deploying**
- GitHub Pages can take a minute. Check the **Actions** tab for a green deploy, then hard refresh.

## Tech

Plain HTML, CSS and JavaScript. Optional extras loaded from a CDN: Inter font (Google Fonts), Lenis (smooth scroll) and Three.js (the 3D hero shape on the home page). If a CDN fails, the site still works without that effect.

## Notes

This is a demo project. Sign up and login store details in the browser only, and passwords are not secure. A real site must handle accounts and passwords on a server.
