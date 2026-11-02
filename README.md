# IDC — Impressive Digital Communication

Cinematic, scroll-driven portfolio site for [IDC](https://idcbdtech.com/) — React + Vite, GSAP ScrollTrigger,
Lenis smooth scroll, and a Three.js "liquid light" ribbon world (React Three Fiber + postprocessing).

## Run locally

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build in dist/
npm run preview    # serve the production build
```

Add `?lite` to the URL to preview the lighter mobile experience on desktop, or `?full` to force the full 3D one.

## Deploy free on GitHub Pages

Deployment is automatic via GitHub Actions (`.github/workflows/deploy.yml`).

1. Create a new **public** repository on GitHub (for example `idc-site`). Don't add a README or licence.
2. Push this project to it:
   ```bash
   git remote add origin https://github.com/<your-username>/idc-site.git
   git push -u origin main
   ```
3. On GitHub open **Settings → Pages**, and under **Build and deployment → Source** choose **GitHub Actions**.
4. Open the **Actions** tab and wait for "Deploy to GitHub Pages" to finish (re-run it once if the first run
   started before step 3). The site will be live at `https://<your-username>.github.io/idc-site/`.

Every later push to `main` redeploys automatically.

The base path is derived from the repository name, so any repo name works. A repo named
`<your-username>.github.io` is served from the domain root instead. Direct links such as `/projects`
work because the build also ships `index.html` as `404.html` (GitHub Pages has no SPA fallback).

## Project structure

- `src/components/` — page sections (Hero, Services, About, Work, Testimonial, CTA, Footer), the projects page, header, cursor, scroll rail, light sweep
- `src/three/` — the 3D scene: ribbon shader and formations, camera rig, dust, post-processing
- `src/lib/` — smooth scroll + scene state, kinetic type, split text, UI primitives, the IDC icon
- `src/data/content.js` — all site copy and project data
- `src/assets/` — logo, icon and project images
