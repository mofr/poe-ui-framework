// Ambient module declarations for non-code imports (Vite handles these at build time; TS just needs
// to know they resolve). Side-effect CSS imports and asset URL imports.
declare module '*.css';
declare module '*.png' { const src: string; export default src; }
declare module '*.svg' { const src: string; export default src; }
declare module '*.jpg' { const src: string; export default src; }
declare module '*.webp' { const src: string; export default src; }
