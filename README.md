# Repform

A responsive push-up trainer with a 60-second test, free practice, spoken cues, camera overlays, and device-local session history.

## Run

Use Node.js 20.19+ or 22.12+.

```sh
npm install
npm run dev
```

Open http://localhost:5173. To make a production bundle, run `npm run build`. Serve `dist/` over HTTPS to use a phone camera. A phone opening an ordinary HTTP LAN address generally cannot access its camera. Session history is stored separately in each browser; there is no cross-device sync.

## Camera setup

1. Place the camera 2–3 metres away at roughly hip height, sideways to your body. Keep your whole body visible with good light.
2. Enable the camera. Hold a straight-arm plank and save the top position.
3. Lower your chest to approximately a fist above the floor. Have someone check your clearance, then hold steady and save the bottom position.
4. Start a test or free practice. There is a five-second setup countdown.
5. Recalibrate if you move the camera. Recalibrate for each person.

A rep requires a visible, straight-arm top position, calibrated bottom depth, and a return to straight arms. Hip deviation or bent knees during the movement invalidates the rep. Tracking loss cancels the unfinished movement and requires a fresh top position. Shallow attempts are counted as rejected when the user returns to the top. The test uses elapsed time, ends at 60 seconds, and ends early when the page is hidden. Early endings are labelled and excluded from the personal best. Free practice is capped at one hour.

## What the camera can establish

This is a training prototype, not an official SAF scorer. MINDEF specifies lowering to a fist’s distance from the floor: https://ask.gov.sg/mindef/questions/cmh4fdary01v7uk1bv4nbfyz4

The app uses a person-calibrated 2D elbow angle as a depth proxy, plus shoulder–hip–ankle alignment and knee extension. It cannot directly establish ground clearance, verify all official criteria, or guarantee accuracy across bodies, clothing, lighting and camera positions. A single side view also cannot reliably check both arms. The saved calibration is intentionally not reused across camera connections. Real exercise footage has not yet been used to validate accuracy.

MediaPipe Pose Landmarker runs locally. Its model and WebAssembly runtime are included in `public/`. Video is neither uploaded nor recorded. Google Fonts may be fetched for typography. Voice uses the browser’s speech synthesis implementation; availability and voice processing depend on the browser and operating system. Demo movement is simulated, labelled, and excluded from personal bests.

## Checks

`npm test` verifies valid cycles, shallow attempts, invalid posture, tracking interruptions and custom depth. Browser checks cover desktop/mobile layout, simulated rep counting, history, guide controls, camera/model startup, practice mode and the timed finish. These are software checks, not a physical accuracy validation.

## Deployment

Build output is ready in `dist/`. This workspace did not have Sites hosting enabled, so there is currently no hosted deployment or cross-device URL. Any static HTTPS host can serve this app.

## GitHub Pages

The included `.github/workflows/deploy.yml` tests and deploys the app on every push to `main`. In the repository's Settings → Pages, choose **GitHub Actions** as the source. No application API keys or secrets are needed.

The workflow uses the Pages URL's base path to build assets, including the locally hosted pose model and WebAssembly files. Both a repository URL such as `https://username.github.io/repform/` and a root/custom-domain URL are supported. To check a repository path locally:

```sh
PAGES_BASE_PATH=/repform/ npm run build
PAGES_BASE_PATH=/repform/ npm run preview
```

Open http://localhost:4173/repform/. After publishing, access the HTTPS Pages URL on your phone and allow camera permission.

## Positioning walkthrough

Before camera access, a three-step illustrated guide shows the camera beside the body, the starting plank, and the full-body preview frame. It is available on every training visit and supports back/next buttons and direct step selection. The camera setup action points users to this guide before they enable tracking.
