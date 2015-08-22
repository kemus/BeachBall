// ==UserScript==
// @name         Beachball Loader
// @namespace    http://github.com/codeRitter/BeachBall
// @version      1.1
// @description  Beachball autoloader for Sandcastle Builder.
// @author       codeRitter
// @match        http://castle.chirpingmustard.com/castle.html
// @match        http://castle.chirpingmustard.com/classic.html
// @grant        none
// ==/UserScript==

setTimeout(loadBB, 5000);

function loadBB() {
    var js = document.createElement('script');
    js.setAttribute('type', 'text/javascript');
    js.setAttribute('src', 'http://coderitter.github.io/BeachBall/BeachBall.js');
    document.head.appendChild(js);
}

// Xenko Beachball location - previous version.
// http://xenko.github.io/BeachBall/BeachBall.js
