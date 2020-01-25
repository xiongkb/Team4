$(document).ready(function(){
    // global varibles to be used
    var queryURL;
    var ingredArray = [];
    var tempPlaceID ="";



    $("#addButton").on("click",function(event){
        event.preventDefault();
        userSearch = $("#ingredient").val();
        if(ingredArray.includes(userSearch)){
            alert("This is already included!")
        } else {
            ingredArray.push(userSearch);
        }
        $(".addedIngredients").text(ingredArray);
        
    })
    // Button to clear
    $("#clearButton").on("click",function(event){
        event.preventDefault();
        userSearch = $("#ingredient").val();
        ingredArray = [];
        $(".addedIngredients").text(ingredArray);
        
    })
    // button to submit
    $("#submitButton").on("click",function(event){
        event.preventDefault();
        tempStr = ingredArray.toString();
        tempStr = tempStr.replace(",","+");
        // console.log(tempStr)
        appId = "e7e14c99";
        appKey = "8b305785d6e489018ccfd57f33064460"
        queryURL = `https://api.edamam.com/search?q=${tempStr}&app_id=${appId}&app_key=${appKey}`;
        makeAPICall(queryURL);
    });

    // Create function for buttons regarding cuisine
    $(".cuisineButton").on("click",function(event){
        console.log(this);
        buttonPressed = $(this).val();
        apiKey = "AIzaSyDjO7VnG8faKTEwJNatbvRRZfJyuBxbNEk";
        queryURL = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${buttonPressed}&inputtype=textquery&type=restaurant&key=${apiKey}`
        // console.log($(this).val());
        restaurantAPICall(queryURL);
    
        // secondqueryURL = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${tempPlaceID}&fields=adr_address,formatted_address,geometry,icon,name,permanently_closed,photo,plus_code,type,url,utc_offset,vicinity&key=${apiKey}`
        // setTimeout(async function(){
        //     await anotherFunction
        // },1000);
    });

    var anotherFunction = function(param){
        secondqueryURL = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${param}&fields=adr_address,formatted_address,geometry,icon,name,permanently_closed,photo,plus_code,type,url,utc_offset,vicinity&key=${apiKey}`
        placeDetailCall(secondqueryURL);
        console.log(secondqueryURL)
    }

    // 2nd API function for restaurants
    var restaurantAPICall =  async function(queryURL){
        var settings = {
            "url": queryURL,
            "method": "GET",
        }

          await  $.ajax(settings).done(function (response) {
            console.log(response);
            tempPlaceID = response.candidates[0].place_id;

        });
        
        anotherFunction(tempPlaceID)
        
    }

    var placeDetailCall = function(secondqueryURL){
        var settings = {
            "url": secondqueryURL,
            "method": "GET",
        }
        $.ajax(settings).done(function (response) {
            console.log(response);
            // Add response code here
            name = response.result.name;
            address = response.result.formatted_address;
            mapURL = response.result.url;

            newDiv = $("<div>");
            newDiv.html(`
                <h2>${name}</h2>
                <br>
                <h3>${address}</h3>
                <br>
                <h3><a href=${mapURL}>Check out the location!</a></h3>
                <br>
            `);
            $(".results").html(newDiv);

        });
    }

    var makeAPICall = function(queryURL){
    // api call for recipes based on ingredients
        var settings = {
            "url": queryURL,
            "method": "GET",
        }
    // https://api.edamam.com/search?q=chicken+apple+pear&app_id=e7e14c99&app_key=8b305785d6e489018ccfd57f33064460

        $.ajax(settings).done(function (response) {
            var recipeNums = [];

            for (var i = 0; i < 4; i++) {
                var rNum = -1;
                
                while(rNum === -1) {
                    var tempNum = Math.floor(Math.random() * 9);

                    if(!recipeNums.includes(tempNum)) {
                        rNum = tempNum;
                        recipeNums.push(tempNum);
                    }
                }

                foodTitle = response.hits[rNum].recipe.label;
                apiURL = response.hits[rNum].recipe.url;

                newDiv = $("<div>");
                newDiv.html(`<a href=${apiURL}>` + foodTitle + '</a>');
                var image = $("<img>");
                image.attr("src", response.hits[rNum].recipe.image);
                newDiv.append(image);
                $(".results").append(newDiv);
                console.log(recipeNums);
            };
            
        });
    }      
});