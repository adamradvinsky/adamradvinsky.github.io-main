// ─────────────────────────────────────────────────────
//  YOUR DETAILS + PROJECTS
//  Edit this file to update your name, projects, etc.
// ─────────────────────────────────────────────────────

const CONFIG = {
  name: 'Adam',
  subtitle: '// SFU Computer Science · UI/UX & Software Dev',

  // To overlay an image on the monitor, set a path here. Leave '' to show the room photo as-is.
  monitorImage: '',

  projects: [
    {
      title: 'Health Triage AI',
      tag:   'Hackathon · 2025',
      desc:  'AI-powered ER triage that analyses symptoms and routes patients to the nearest hospital in real time.',
      tech:  ['React', 'Vite', 'Flask', 'Gemini 2.5 Flash', 'Google Maps'],
      url:   'https://github.com/euluna/GDSC-Team1',
    },
  ],
};

// ─────────────────────────────────────────────────────
//  CLICKABLE ROOM REGIONS
//  Coordinates are in the room photo's pixel space (1120 × 1149).
//  Use the ⚙ editor on the page to draw new ones, then export JSON to copy back here.
// ─────────────────────────────────────────────────────

const DEFAULT_REGIONS = [
  {
    id: 'monitor', name: 'Monitor', type: 'monitor',
    tooltip: '💻 View Projects',
    points: [[432,600],[648,600],[648,737],[432,737]],
    fillHover: 'rgba(85,170,255,0.16)', strokeHover: 'rgba(85,170,255,0.75)', filter: 'glow-blue',
  },
  {
    id: 'laptop', name: 'Laptop', type: 'highlight',
    tooltip: '💻 ThinkPad',
    points: [[248,665],[432,658],[432,788],[248,796]],
    fillHover: 'rgba(200,220,255,0.12)', strokeHover: 'rgba(200,220,255,0.55)', filter: 'glow-white',
  },
  {
    id: 'medals', name: 'Medals', type: 'highlight',
    tooltip: '🥇 Medals',
    points: [[934,88],[1088,88],[1088,462],[934,462]],
    fillHover: 'rgba(250,200,50,0.12)', strokeHover: 'rgba(250,200,50,0.65)', filter: 'glow-gold',
  },
  {
    id: 'monaco', name: 'Monaco Poster', type: 'highlight',
    tooltip: '🏎  Monaco F1',
    points: [[838,190],[992,190],[992,750],[838,750]],
    fillHover: 'rgba(255,100,50,0.1)', strokeHover: 'rgba(255,100,50,0.55)', filter: 'glow-white',
  },
  {
    id: 'zelda', name: 'Zelda Poster', type: 'highlight',
    tooltip: '🗡  Zelda: TotK',
    points: [[568,488],[724,488],[724,730],[568,730]],
    fillHover: 'rgba(60,200,110,0.12)', strokeHover: 'rgba(60,200,110,0.55)', filter: 'glow-white',
  },
  {
    id: 'drawers', name: 'Drawers', type: 'highlight',
    tooltip: '🗃  IKEA Alex Drawers',
    points: [[118,786],[295,786],[295,988],[118,988]],
    fillHover: 'rgba(200,200,200,0.1)', strokeHover: 'rgba(200,200,200,0.4)', filter: 'glow-white',
  },
  {
    id: 'shelf', name: 'Shelf', type: 'highlight',
    tooltip: '📦 Shelf',
    points: [[115,386],[848,386],[848,466],[115,466]],
    fillHover: 'rgba(200,200,200,0.08)', strokeHover: 'rgba(200,200,200,0.35)', filter: 'glow-white',
  },
  {
    id: 'racket', name: 'Tennis Racket', type: 'highlight',
    tooltip: '🎾 Prince Racket',
    points: [[506,258],[600,258],[600,470],[506,470]],
    fillHover: 'rgba(140,220,80,0.12)', strokeHover: 'rgba(140,220,80,0.55)', filter: 'glow-white',
  },
  {
    id: 'whiteboard', name: 'Whiteboard', type: 'highlight',
    tooltip: '📋 Whiteboard',
    points: [[430,260],[778,260],[778,478],[430,478]],
    fillHover: 'rgba(240,240,255,0.07)', strokeHover: 'rgba(240,240,255,0.35)', filter: 'glow-white',
  },
];