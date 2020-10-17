var deckid = 0;
var money = 1000;
var dealercards = []
var playercards = []

document.getElementById("start").addEventListener("click", function(event) {
    event.preventDefault();
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
        console.log(url)
        fetch(url)
        .then(function(response) {
            return response.json();
        })
        .then(function(result) {
            for (let i=0; i<2; ++i) {
                dealercards.push([result['cards'][i]['value'], result['cards'][i]['suit'], result['cards'][i]['image']])
            }
            console.log(dealercards)
            for (let i=2; i < 4; ++i) {
                playercards.push([result['cards'][i]['value'], result['cards'][i]['suit'], result['cards'][i]['image']])
            }
            console.log(playercards)
        })
        .then(function() {
            var string = ""
            string += "<h2> Dealer's Hand </h2>"
            string += "<div class=\"back\"><img src=\"/images/back.jpg\"></div>\n"
            for (let i=1; i < dealercards.length; i++) {
                string += "<div class=\"visible\"><img src=\"" + dealercards[i][2] + "\"></div>\n"
            }
            document.getElementById("dealerCards").innerHTML = string;
            string = ""
            for (let i=0; i < playercards.length; i++) {
                string += "<img src=\"" + playercards[i][2] + "\">\n"
            }
            document.getElementById("playerCards").innerHTML = string
            document.getElementById("dealerCards").classList.replace("hidden", "show");
            document.getElementById("playerCards").classList.replace("hidden", "show");
            document.getElementById("stand").classList.replace("hidden", "show");
            document.getElementById("hit").classList.replace("hidden", "show");
            document.getElementById("startForm").classList.add("hidden")
        })
    })
})



/*document.getElementById("weatherSubmit").addEventListener("click", function(event) {
    event.preventDefault();
    const value = document.getElementById("city").value;
    if (value === "")
      return;

    const weatherResultsElement = document.getElementById("weatherResults")
    const forecastResultsElement = document.getElementById("forecastResults")

    const url = "http://api.openweathermap.org/data/2.5/weather?q=" + value + ",US&units=imperial" + "&APPID=36d99ea290096c07662d15885e933672";
    fetch(url)
    .then(function(response) {
      return response.json();
    })
    .then(function(json) {
        let results = "<div class=\"left\">";
        results += '<h5>Current Weather in ' + json.name + "</h5>";
        results += '<h1>' + json.main.temp + " &deg;F</h1>"
        results += "<p><strong>"
        for (let i=0; i < json.weather.length; i++) {
            results += json.weather[i].main
            if (i !== json.weather.length - 1)
                results += ", "
        }
        results += "</strong></p></div>\n <div class=\"right\">";
        for (let i=0; i < json.weather.length; i++) {
            results += '<img src="http://openweathermap.org/img/w/' + json.weather[i].icon + '.png"/>';
        }
        results += "<h2><strong>Humidity:</strong> " + json.main['humidity'] + "%</h2>\n"
        results += "<h2><strong>Wind Speed:</strong> " + json.wind['speed'] + "mph</h2>\n"
        results += "<h2><strong>Feels Like:</strong> " + json.main['feels_like'] + "&deg;F</h2>\n"
        results += "</div>"
        document.getElementById("weatherResults").innerHTML = results;
        weatherResultsElement.classList.replace("hidden", "show");
    });

    const url2 = "http://api.openweathermap.org/data/2.5/forecast?q=" + value + ", US&units=imperial" + "&APPID=36d99ea290096c07662d15885e933672";
    fetch(url2)
    .then(function(response) {
        return response.json();
    })
    .then(function(json) {
        let forecast = "<div class=\"heading\"><h4>5-Day Forecast</h4><hr></div>";
        var lastDate = moment(json.list[0].dt_txt).format('MMMM Do YYYY');
        forecast += "<div class=\"heading\"><h1>" + lastDate + "</h1></div>"
        forecast += "<div class=\"row\">"
        var counter = 0;
        for (let i=0; i < json.list.length; i++) {
            let date = moment(json.list[i].dt_txt).format('MMMM Do YYYY');
            let myDate = new Date(json.list[i].dt * 1000);
            // outputs myDate in local time zone, formatted as "HH:MM:SS AM/PM"
            myDate = myDate.toLocaleTimeString();
            if (date == lastDate) {
                forecast += "<div class=\"element\">"
                forecast += "<h2>" + myDate.replace(":00:00","") + "</h2>";
                forecast += "<h5>" + json.list[i].main.temp + "&deg;F</h5>";
                forecast += '<img src="http://openweathermap.org/img/w/' + json.list[i].weather[0].icon + '.png"/>';
                forecast += "<p class=\"description\"><strong>" + json.list[i].weather[0].main + "</strong></p>"
                forecast += "<p><strong>Humidity:</strong> " + json.list[i].main.humidity + "</p>";
                forecast += "<p><strong>Wind Speed:</strong> " + json.list[i].wind.speed + "</p>";
                forecast += "<p><strong>Feels Like:</strong> " + json.list[i].main.feels_like + "</p>";
                forecast += "</div>";
            }
            else if (counter != 2) {
                counter += 1;
                forecast += "<div class=\"element\">"
                forecast += "<h2>" + myDate.replace(":00:00","") + "</h2>";
                forecast += "<h5>" + json.list[i].main.temp + "&deg;F</h5>";
                forecast += '<img src="http://openweathermap.org/img/w/' + json.list[i].weather[0].icon + '.png"/>';
                forecast += "<p class=\"description\"><strong>" + json.list[i].weather[0].main + "</strong></p>"
                forecast += "<p><strong>Humidity:</strong> " + json.list[i].main.humidity + "</p>";
                forecast += "<p><strong>Wind Speed:</strong> " + json.list[i].wind.speed + "</p>";
                forecast += "<p><strong>Feels Like:</strong> " + json.list[i].main.feels_like + "</p>"
                forecast += "</div>";
            }
            else {
                lastDate = date;
                forecast += "</div><div class=\"heading\"><h1>" + lastDate + "</h1></div><div class=\"row\">";
                forecast += "<div class=\"element\">"
                forecast += "<h2>" + myDate.replace(":00:00","") + "</h2>";
                forecast += "<h5>" + json.list[i].main.temp + "&deg;F</h5>";
                forecast += '<img src="http://openweathermap.org/img/w/' + json.list[i].weather[0].icon + '.png"/>';
                forecast += "<p class=\"description\"><strong>" + json.list[i].weather[0].main + "</strong></p>"
                forecast += "<p><strong>Humidity:</strong> " + json.list[i].main.humidity + "</p>";
                forecast += "<p><strong>Wind Speed:</strong> " + json.list[i].wind.speed + "</p>";
                forecast += "<p><strong>Feels Like:</strong> " + json.list[i].main.feels_like + "</p>"
                forecast += "</div>";
                counter = 0;
            }
        }
        forecast += "</div>";
        document.getElementById("forecastResults").innerHTML = forecast;
        forecastResultsElement.classList.replace("hidden", "show");
    });


});
*/