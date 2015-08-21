// ==UserScript==
// @name         Beachball Loader
// @namespace    http://github.com/codeRitter/BeachBall
// @version      1.0
// @description  Beachball autoloader for Sandcastle Builder.
// @author       codeRitter
// @match        http://castle.chirpingmustard.com/castle.html
// @grant        none
// ==/UserScript==

setTimeout(loadBB, 5000);

function loadBB() {
    var js = document.createElement('script');
    js.setAttribute('type', 'text/javascript');
    js.setAttribute('src', 'https://raw.githubusercontent.com/codeRitter/BeachBall/master/BeachBall.js');
    document.head.appendChild(js);
}

// Xenko Beachball location - previous version.
// http://xenko.github.io/BeachBall/BeachBall.js
