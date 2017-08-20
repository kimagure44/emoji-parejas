var g = (function(win, doc) {
var okAudio = new Audio('ok.mp3'); 
var finAudio = new Audio('fin.mp3'); 
var errorAudio = new Audio('error.mp3'); 
var clickAudio = new Audio('click.mp3');
var audioBackground = new Audio("backgroundAudio.mp3");
var tiempoGame = null;
var puntos = 0;
var fallos = 0;
var audioFX = function (type) {
    type.currentTime = 0;
    type.play();
};
var click = function () {
    var card = doc.getElementsByClassName("card");
    for (var cont = 0; cont < card.length; cont++) {
        triggerClick(card[cont]);
    }
};
var triggerClick = function (card) {
    card.addEventListener("click", function () {
        audioFX(clickAudio);
        if (this.classList.contains("turn")) {
            this.classList.remove("turn","locked");
        } else {
            this.classList.add("turn","locked");
        }
        if (doc.getElementsByClassName("turn").length == 2) {
            var card = doc.getElementsByClassName("card");
            for (var cont=0;cont<card.length;cont++) {
                card[cont].classList.add("locked");
            }
            setTimeout(function() {
                var turn = doc.getElementsByClassName("turn");
                if (turn[0].getAttribute("data-pair") == turn[1].getAttribute("data-pair")) {
                    audioFX(okAudio);
                    turn[0].children[0].style.opacity = 0
                    turn[0].children[1].style.opacity = 0
                    turn[0].style.opacity = 0;
                    turn[0].classList.add("locked");
                    turn[0].setAttribute("data-show",0);
                    turn[1].children[0].style.opacity = 0
                    turn[1].children[1].style.opacity = 0
                    turn[1].style.opacity = 0;
                    turn[1].classList.add("locked");    
                    turn[1].setAttribute("data-show",0);
                    puntos+=100;
                    doc.getElementById("puntos").innerHTML = puntos;
                } else {
                    audioFX(errorAudio);
                    fallos++;
                    doc.getElementById("fallos").innerHTML = fallos;
                }
                var card = doc.getElementsByClassName("card");
                for (var cont=0;cont<card.length;cont++) {
                    card[cont].classList.remove("locked");    
                }   
                for (var cont=0;cont<=turn.length;cont++) {
                    turn[0].classList.remove("turn");
                }
                var locked = doc.querySelectorAll(".card[data-show='0']");
                for (var cont = 0;cont<locked.length;cont++) {
                    locked[cont].classList.add("locked");
                }

                var endGame = card.length - locked.length;
                if (endGame == 0) {
                    audioFX(finAudio);
                    clearInterval(tiempoGame);
                    doc.getElementsByClassName("endGame")[0].classList.add("show");
                }

            },1000);
        }
    }, false);
};
var cards = function (totalCards) {
    var iconosUsados = [];
    var posicionCartas = [];
    var html = "";
    for (var cont=0;cont<totalCards;cont++) {
        html+="<div class='card' data-show='1'>";
        html+="<img src='caraComun.png' class='flip-1'/>";
        html+="<div class='pareja spriteSheet'></div>";
        html+="</div>";
    }
    doc.body.getElementsByClassName("container")[0].innerHTML = html;
    for (var cont=0;cont<totalCards;cont++) {
        posicionCartas[cont] = cont;
    }
    posicionCartas[cont] = posicionCartas.sort(function() {
        return Math.random() - 0.5;
    });
    posicionCartas.pop();
    for (var cont=0;cont<totalCards;cont+=2) {
        var cardA = doc.getElementsByClassName("card")[posicionCartas[cont]];
        var cardB = doc.getElementsByClassName("card")[posicionCartas[cont+1]];
        var salir = 0;
        var imgX = Math.floor((Math.random() * (39 * 41))); // iconos spriteSheet;
        do {
            if (iconosUsados.indexOf(imgX) !== -1) {
                imgX = Math.floor((Math.random() * (39 * 41))); // iconos spriteSheet
            } else {
                iconosUsados.push(imgX);
                salir = 1;
            }
        } while (salir == 0);    

        var X;
        var Y;
        if (imgX <= 38) { 
            X = imgX;
            Y = 0;
        } else {
            Y = Math.round(imgX / 39);    
            X = imgX - (Y * 39);                       
        }
        var pos = (X * 64) + "px " + (Y * 64) + "px";
        cardA.getElementsByClassName("pareja")[0].style.backgroundPosition = pos;
        cardB.getElementsByClassName("pareja")[0].style.backgroundPosition = pos;
        cardA.setAttribute("data-pair",cont);
        cardB.setAttribute("data-pair",cont);
    }
    click();
    tiempo();
}
var tiempo = function () {
    var m = 0;
    var s = 0;
    audioBackground.volume = 0.4;
    okAudio.volume = 0.7;
    finAudio.volume = 0.7;
    errorAudio.volume = 0.7;
    clickAudio.volume = 0.7;
    audioBackground.addEventListener('ended', function() {
        this.currentTime = 0;
        this.play();
    }, false);
    audioBackground.play();
    tiempoGame = setInterval(function() {
        s++;
        if (s == 60) {
            s = 0;
            m++;
        }
        if (m == 60) {
            alert("HAS PERDIDO");
            clearInterval(tiempoGame);
        }
        var seg = s<=9?'0'+s:s;
        var min = m<=9?'0'+m:m;
        doc.getElementById("tiempo").innerHTML = min + ":" + seg;
    },1000);
}
return {
    init: function () {
        cards(40);
    }
};
}(window, document));
window.addEventListener("DOMContentLoaded", g.init());