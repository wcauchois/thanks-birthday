# Loose bones

A small vanilla TypeScript + SVG + Rapier 2D toy.

```sh
npm install
npm run dev
npm run build
```

Grab any bone to pull the skeleton around, then release. The first tap requests phone motion permission where required. Press R to restore the pose. The page has no visible text or controls; accessible controls remain available to screen readers.

Phone motion requires HTTPS (localhost is also a secure context). Opening the Vite server by a LAN IP over HTTP supports dragging but not motion. Sensor direction and feel should be checked on a physical phone before release.

## Structure

- `src/art.ts`: compact SVG paths and shared bone, hand, and foot definitions.
- `src/physics.ts`: eleven rigid bodies, joint limits, spring dragging and reset.
- `src/motion.ts`: permission handling, smoothed gravity, bounded shake impulses, and sensor fallback.
- `src/main.ts`: page, pointer input, and a fixed 60 Hz physics loop.

The skeleton has no enclosing walls, and its parts do not collide with one another, avoiding snagging at joints. The rib cage and pelvis share one rigid body. Rapier's compatibility package embeds WebAssembly and accounts for most of the production bundle (about 1.3 MB gzipped).
