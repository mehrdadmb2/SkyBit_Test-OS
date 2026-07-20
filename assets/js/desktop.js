/* ===========================================================
   Nexus OS Desktop Engine
   Version 1.0
=========================================================== */

const desktopIcons = [

    {

        id:"projects",

        title:"Projects",

        icon:"📁"

    },

    {

        id:"terminal",

        title:"Terminal",

        icon:"💻"

    },

    {

        id:"browser",

        title:"Browser",

        icon:"🌐"

    },

    {

        id:"dashboard",

        title:"Dashboard",

        icon:"📊"

    },

    {

        id:"gallery",

        title:"Gallery",

        icon:"🖼️"

    },

    {

        id:"settings",

        title:"Settings",

        icon:"⚙️"

    }

];

const iconContainer =
document.getElementById("desktop-icons");

function createDesktopIcons(){

    desktopIcons.forEach(app=>{

        const icon =
        document.createElement("div");

        icon.className="desktop-icon";

        icon.innerHTML=`

            <div class="icon">

                ${app.icon}

            </div>

            <span>

                ${app.title}

            </span>

        `;

        icon.onclick=()=>{

            openWindow(app);

        };

        iconContainer.appendChild(icon);

    });

}

function initializeDesktop(){

    createDesktopIcons();

}
