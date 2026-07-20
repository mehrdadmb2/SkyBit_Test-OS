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

"Welcome to SkyBit OS"

];

/* ======================================================
   Boot Process
====================================================== */

function addBootLine(text){

    const line = document.createElement("p");

    line.textContent = text;

    bootLog.appendChild(line);

    bootLog.scrollTop = bootLog.scrollHeight;

}

function updateProgress(){

    if(current >= bootMessages.length){

        finishBoot();

        return;

    }

    addBootLine(bootMessages[current]);

    current++;

    const value = Math.floor(

        (current / bootMessages.length) * 100

    );

    progress.style.width = value + "%";

    percent.textContent = value + "%";

    statusText.textContent = bootMessages[current - 1];

}

/* ======================================================
   Random Boot Delay
====================================================== */

function startBoot(){

    const timer = setInterval(() => {

        updateProgress();

        if(current >= bootMessages.length){

            clearInterval(timer);

        }

    }, 450);

}

/* ======================================================
   Boot Sound (Future)
====================================================== */

function playBootSound(){

    // Reserved for future version

}
/* ======================================================
   Finish Boot
====================================================== */

function finishBoot(){

    statusText.textContent = "Launching SkyBit OS...";

    progress.style.width = "100%";

    percent.textContent = "100%";

    addBootLine("Boot Completed Successfully.");

    addBootLine("Launching Desktop...");

    bootScreen.classList.add("boot-finished");

    setTimeout(() => {

        bootScreen.style.display = "none";

        desktop.classList.remove("hidden");

        desktop.classList.add("visible");

        if(typeof initializeDesktop === "function"){

            initializeDesktop();

        }

        if(typeof startClock === "function"){

            startClock();

        }

    },900);

}

/* ======================================================
   Start System
====================================================== */

window.addEventListener("load",()=>{

    setTimeout(()=>{

        startBoot();

    },700);

});
