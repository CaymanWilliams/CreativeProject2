var deckid = 0;
var money = 1000;
var dealercards = []
var dealertotal = [0];
var playercards = []
var playertotal = [0];
var started = false;
var bust = false;
var dealerbust = false;

document.getElementById("start").addEventListener("click", function(event) {
    event.preventDefault();
    if (!started) {
        var url = "https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1"
        fetch(url)
        .then(function(response){
            return response.json();
        })
        .then(function(result) {
            deckid = result['deck_id']
        })
        .then(function() {
            var url = "https://deckofcardsapi.com/api/deck/"+ deckid +"/draw/?count=4";
            fetch(url)
            .then(function(response) {
                return response.json();
            })
            .then(function(result) {
                for (let i=0; i<2; ++i) {
                    addToDealerTotal(result['cards'][i])
                    dealercards.push([result['cards'][i]['value'], result['cards'][i]['suit'], result['cards'][i]['image']])
                }
                for (let i=2; i < 4; ++i) {
                    addToPlayerTotal(result['cards'][i])
                    playercards.push([result['cards'][i]['value'], result['cards'][i]['suit'], result['cards'][i]['image']])
                }
            })
            .then(function() {
                updateDealer();
                updatePlayer();
                document.getElementById("stand").classList.replace("hidden", "show");
                document.getElementById("hit").classList.replace("hidden", "show");
                document.getElementById("start").classList.add("hidden");
            })
        })
        started = true;
    }
})

document.getElementById("hit").addEventListener("click", function(event) {
    event.preventDefault();
    hit()
})

document.getElementById("stand").addEventListener("click", function(event) {
    event.preventDefault();
    console.log("YUP")
    stand()
})

function updateDealer() {
    var string = ""
    if (bust) {
        for (let i=0; i < dealercards.length; i++) {
            string += "<img src=\"" + dealercards[i][2] + "\">\n"
        }
        document.getElementById("dealerCards").classList.add("dealerboxdisplay")
    }
    else if (dealerbust) {
        for (let i=0; i < dealercards.length; i++) {
            string += "<img src=\"" + dealercards[i][2] + "\">\n"
        }
        document.getElementById("dealerCards").classList.add("dealerboxdisplay")
        string += "<div class=\"result\"><h2>BUST</H2></div>"
    }
    else {
        string += "<div class=\"back\"><img src=\"/images/back.jpg\"></div>\n"
        for (let i=1; i < dealercards.length; i++) {
            string += "<div class=\"visible\"><img src=\"" + dealercards[i][2] + "\"></div>\n"
        }
    }
    document.getElementById("dealerCards").innerHTML = string;
    document.getElementById("dealerCards").classList.replace("hidden", "show");
}

function updatePlayer() {
    var string = "<h1>Total: "
    string += Math.max.apply(Math, playertotal) + "</h1>";
    for (let i=0; i < playercards.length; i++) {
        string += "<img src=\"" + playercards[i][2] + "\">\n"
    }
    document.getElementById("playerCards").innerHTML = string;
    document.getElementById("playerCards").classList.replace("hidden", "show");
    if (bust) {
        string += Math.min.apply(Math, playertotal) + "</h1>";
        for (let i=0; i < playercards.length; i++) {
            string += "<img src=\"" + playercards[i][2] + "\">\n"
        }
        document.getElementById("playerCards").innerHTML += "<div class=\"result\"><h1>BUST</h1></div>"
        document.getElementById("playerCards").classList.replace("hidden", "show");
        document.getElementById("playagain").classList.replace("hidden", "show");
    }
}

function hit() {
    if (!bust){
        var url = "https://deckofcardsapi.com/api/deck/"+ deckid +"/draw/?count=1";
        fetch(url)
        .then(function(response) {
            return response.json();
        })
        .then(function(result) {
            addToPlayerTotal(result['cards'][0]);
            playercards.push([result['cards'][0]['value'], result['cards'][0]['suit'], result['cards'][0]['image']]);
            checkPlayerHand();
            updatePlayer();
            updateDealer();
        })
    }
}

function stand() {
    if (!bust){
        dealerPlays();
    }
}

function dealerPlays() {
    console.log(dealertotal)
    var url = "https://deckofcardsapi.com/api/deck/"+ deckid +"/draw/?count=1";
    fetch(url)
    .then(function(response) {
        return response.json();
    })
    .then(function(result) {
        addToDealerTotal(result['cards'][0]);
        dealercards.push([result['cards'][0]['value'], result['cards'][0]['suit'], result['cards'][0]['image']]);
        checkDealerHand();
        updateDealer();
    })
    if (!dealerbust) {
        if (dealertotal > playertotal) {
            document.getElementById("dealerCards").classList.add("dealerboxdisplay")
            document.getElementById("dealerCards").innerHTML+= "<div class=\"results\"><h2>WIN</h2></div>"
            document.getElementById("playerCards").innerHTML+= "<div class=\"results\"><h1>LOSE<h1></div>"
        }
        else if (playertotal > dealertotal) {
            document.getElementById("dealerCards").classList.add("dealerboxdisplay")
            document.getElementById("dealerCards").innerHTML+= "<div class=\"results\"><h2>LOSE></h2></div>"
            document.getElementById("playerCards").innerHTML+= "<div class=\"results\"><h1>WIN<h1></div>"
        }
        else {
            document.getElementById("dealerCards").classList.add("dealerboxdisplay")
            document.getElementById("dealerCards").innerHTML+= "<div class=\"results\"><h2>TIE</h></div>"
            document.getElementById("playerCards").innerHTML+= "<div class=\"results\"><h1>TIE<h1></div>"
        }
    }
}

function checkPlayerHand() {
    if (playertotal.filter(num => num < 22 ).length == 0) {
        bust = true;
        return
    }
    else {
        playertotal = playertotal.filter(num => num < 22);
    }
}

function checkDealerHand() {
    if (dealertotal.filter(num => num < 22 ).length == 0) {
        dealerbust = true;
        return
    }
    else {
        dealertotal = dealertotal.filter(num => num < 22);
    }
}

function checkDealerHand() {
    for (var i = 0; i < dealertotal.length; ++i) {
        dealertotal.filter(num => num < 22)
    }
    if (dealertotal.length == 0) {
        return
    }
}

function checkDealerTotal() {
    for (let i in dealertotal) {
        if (i >= 17) {
            return true;
        }
        else {
            return false;
        }
    }
}

function addToDealerTotal(card) {
    var dictionary = {"KING":10, "QUEEN":10, "JACK":10, "10":10, "9":9, "8":8, "7":7,"6":6, "5":5,"4":4, "3":3, "2":2}
    if (card['value'] == "ACE") {
        var newtotal = [];
        for (let i = 0; i < dealertotal.length; ++i) {
            newtotal.push(1+dealertotal[i])
            newtotal.push(11+dealertotal[i])
        }
        dealertotal = []
        for (let i = 0; i < newtotal.length; ++i){
            dealertotal.push(newtotal[i])
        }
    }
    else {
        for (let i = 0; i < dealertotal.length; ++i) {
            dealertotal[i] += dictionary[card['value']]
        }
    }
}

function addToPlayerTotal(card) {
    var dictionary = {"KING":10, "QUEEN":10, "JACK":10, "10":10, "9":9, "8":8, "7":7,"6":6, "5":5,"4":4, "3":3, "2":2}
    if (card['value'] == "ACE") {
        var newtotal = [];
        for (let i = 0; i < playertotal.length; ++i) {
            newtotal.push(1 + playertotal[i])
            newtotal.push(11 + playertotal[i])
        }
        playertotal = []
        for (let i = 0; i < newtotal.length; ++i){
            if (!playertotal.includes(newtotal[i])) {
                playertotal.push(newtotal[i])
            }
        }
    }
    else {
        for (let i = 0; i < playertotal.length; ++i) {
            playertotal[i] += dictionary[card['value']]
        }
    }
}