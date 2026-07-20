/* ======================================================
   Nexus OS Boot System
====================================================== */

const bootLog = document.getElementById("boot-log");

const progress =
document.getElementById("loading-progress");

const percent =
document.getElementById("loading-percent");

const statusText =
document.getElementById("boot-status");

const bootScreen =
document.getElementById("boot-screen");

const desktop =
document.getElementById("desktop");

let current = 0;

const bootMessages = [

"Loading Kernel...",

"Checking CPU...",

"Checking RAM...",

"Initializing GPU...",

"Loading Drivers...",

"Starting Network Manager...",

"Checking Internet Connection...",

"Loading User Interface...",

"Mounting File System...",

"Loading Desktop Environment...",

"Loading Window Manager...",

"Loading Fonts...",

"Loading Icons...",

"Loading Applications...",

"Loading AI Module...",

"Connecting GitHub...",

"Loading Projects...",

"Loading Dashboard...",

"Loading Widgets...",

"Loading Terminal...",

"Preparing Explorer...",

"Loading Browser...",

"Loading Settings...",

"Checking Security...",

"Synchronizing Time...",

"Optimizing Performance...",

"Preparing Workspace...",

"Almost Ready...",

"Finalizing...",

"Welcome to Nexus OS"

];
