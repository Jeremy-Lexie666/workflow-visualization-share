# React Bits Threads (historical effect, currently inactive)

The current light.html no longer loads threads.js. The source and license are retained for earlier versions.

The four GLSL shaders and the clamp / compile / link / locate helpers in `threads.js` are adapted from David Haz's React Bits Threads component. The report's renderer/lifecycle was adapted for a standalone HTML report. Color, resolution cap, animation speed, line density, input and pause behavior were customized.

Source: https://github.com/DavidHDev/react-bits/blob/main/src/content/Backgrounds/Threads/Threads.jsx

Copyright (c) 2026 David Haz.

License: MIT + Commons Clause License Condition v1.0. The complete upstream permission and restriction notice is preserved in `react-bits-LICENSE.txt`. This adapted effect is embedded as part of the workflow visualization report, rather than distributed as a component library.

The report layout, icons, static fallback and report navigation are original project code. No third-party fonts or photos are used. The homepage Spline embed requires its remote viewer and scene.

# React Bits SpotlightCard

The `clamp` and `falloff` helpers in `spotlight.js`, and the card-local light/edge gradients, pointer proximity, smoothing and focus behavior are adapted from David Haz's React Bits SpotlightCard. React lifecycle was replaced with standalone HTML event handling; colors, opacity, visibility cleanup and shared-grid event handling were customized for this report.

Source: https://github.com/DavidHDev/react-bits/blob/main/src/content/Components/SpotlightCard/SpotlightCard.jsx

Copyright (c) 2026 David Haz. MIT + Commons Clause; the complete upstream permission and restriction notice is included in `react-bits-LICENSE.txt`. This adapted effect is embedded as part of the workflow visualization report.

# Spline scene from the user-supplied component reference

Active scene: https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode

This scene URL was supplied by the user in a React Spline / card / spotlight example. The report adapts its left-copy / right-scene composition to standalone HTML. The original scene materials and colors are preserved; only the scene background is set to #f5f7fb. No creator or license is inferred from the previously used Super Attractor scene, which is no longer active. Native Spline branding is not removed or covered.

Spline Viewer is loaded from its official CDN pinned to version 2.0.98. The SDK and scene remain remote dependencies. https://spline.design/

The layout and integration are local report code. No React, shadcn, Tailwind, framer-motion or npm build step was introduced. The existing pointer spotlight effect remains covered by the React Bits attribution above.


# ManyPixels / Birdview illustrations

Source and license: https://www.manypixels.co/gallery

Copyright 2020 MANYPIXELS PTE LTD. The gallery permits free personal and commercial use, including modification, without attribution. Its license excludes compiling or redistributing illustrations as asset packs or a competing service. These three illustrations are decorative assets within this report.

- Standard graphical modeling: Creative Process (Birdview).
- Business approval configuration: Checklist 1 (Birdview).
- Script and code configuration: Coding 4 (Birdview).

Original SVG download URLs and exact palette changes are recorded in `manypixels/sources.json`. Blue accents and background planes were recolored for the report; geometry and people were retained. Assets are stored locally and require no remote runtime.
