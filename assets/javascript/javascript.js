$(document).ready(function () {
    // global varibles to be used
    var queryURL;
    var ingredArray = [];
    var tempPlaceID = "";

    function addFunction(){
        userSearch = $("#ingredient").val();
        userSearch = userSearch.toLowerCase();
        userSearch = userSearch.charAt(0).toUpperCase() + userSearch.slice(1);
        if (userSearch.search(/[^a-zA-Z]+/) > -1 && userSearch.indexOf(' ') <= 0) {
            $("#errorMsg").html("Please enter only alphabetical letters.");
        }
        if (ingredArray.includes(userSearch)) {
            $("#errorMsg").html("This is already included!")
        } else {
            ingredArray.push(userSearch);
        }
        console.log(ingredArray)
        $(".addedIngredients").text(ingredArray.toString());
        $("#ingredient").val("");           //Resets Ingredient form input
    }

    $("#formId").keydown(function (e) {
        if (e.keyCode == 13) {
            e.preventDefault();
            addFunction();
        }
    });

    $("#addButton").on("click", function (event) {
        event.preventDefault();
        addFunction();
    })

    // Button to clear
    $("#clearButton").on("click", function (event) {
        event.preventDefault();
        ingredArray = [];
        $("#ingredient").val("");           //Resets Ingredient form input
        $(".addedIngredients").text(ingredArray);

    })
    
    // button to submit
    $("#submitButton").on("click", function (event) {
        event.preventDefault();
        tempStr = ingredArray.toString();
        tempStr = tempStr.replace(",", "+");
        appId = "e7e14c99";
        appKey = "8b305785d6e489018ccfd57f33064460";
        queryURL = `https://api.edamam.com/search?q=${tempStr}&app_id=${appId}&app_key=${appKey}`;
        makeAPICall(queryURL);
    });

    // Create function for buttons regarding cuisine
    $(".cuisineButton").on("click", function (event) {
        buttonPressed = $(this).val();
        apiKey = ""; //enter your google apiKey here
        queryURL = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${buttonPressed}&inputtype=textquery&type=restaurant&key=${apiKey}`
        restaurantAPICall(queryURL);
    });

    var anotherFunction = function (param) {
        secondqueryURL = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${param}&fields=adr_address,formatted_address,geometry,icon,name,permanently_closed,photo,plus_code,type,url,utc_offset,vicinity&key=${apiKey}`
        placeDetailCall(secondqueryURL);
    }

    // 2nd API function for restaurants
    var restaurantAPICall = async function (queryURL) {
        var settings = {
            "url": queryURL,
            "method": "GET",
        }

        await $.ajax(settings).done(function (response) {
            tempPlaceID = response.candidates[0].place_id;

        });
        anotherFunction(tempPlaceID)
    }

    // Calls the details of returned google search place ID
    var placeDetailCall = function (secondqueryURL) {
        var settings = {
            "url": secondqueryURL,
            "method": "GET",
        }
        $.ajax(settings).done(function (response) {
            name = response.result.name;
            address = response.result.formatted_address;
            mapURL = response.result.url;

            newDiv = $("<div>");
            newDiv.attr("class", "card-content");
            newDiv.html(`
                <p class="card-title">${name}</p>
                <p>${address}</p><hr>
                <p><a href=${mapURL}>Check out the location!</a></p>
            `);
            $(".results").html(newDiv);

        });
    }

    // Calls recipes based on array of ingredients using queryURL
    var makeAPICall = function (queryURL) {
        // api call for recipes based on ingredients
        var settings = {
            "url": queryURL,
            "method": "GET",
        }

        $.ajax(settings).done(function (response) {
            var recipeNums = [];
            var foodTitle;
            var apiURL;
            $(".results").empty();
            displayFood();
            function displayFood() {
                for (var i = 0; i < 3; i++) {
                    var rNum = -1;

                    while (rNum === -1) {
                        var tempNum = Math.floor(Math.random() * 9);

                        if (!recipeNums.includes(tempNum)) {
                            rNum = tempNum;
                            recipeNums.push(tempNum);
                        }
                    }

                    foodTitle = response.hits[rNum].recipe.label;
                    apiURL = response.hits[rNum].recipe.url;

                    var newDiv = $("<div>");
                    newDiv.attr("class", "recipe-display");
                    var a = $("<a>");
                    a.attr("href", apiURL);
                    a.attr("class", "food-name")
                    a.append(foodTitle);
                    var h4 = $("<h4>");
                    h4.append(a);
                    var image = $("<img>");
                    image.attr("src", response.hits[rNum].recipe.image);
                    image.attr("class", "food-image");
                    newDiv.append(h4);
                    newDiv.append(image);
                    $(".results").prepend(newDiv);
                };
            }
        });
    }
});