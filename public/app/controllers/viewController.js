var app = angular.module("indexApp", ['ngRoute']);
var Years =
    [
        { type: "2010" },
        { type: "2011" },
        { type: "2012" },
        { type: "2013" },
        { type: "2014" },
        { type: "2015" },
        { type: "2016" },
    ];
var Teams =
    [
        { type: "Adelaide" },
        { type: "Brisbane" },
        { type: "Carlton" },
        { type: "Collingwood" },
        { type: "Fremantle" },
        { type: "Geelong" },
        { type: "Gold Coast" },
        { type: "Greater Western Sydney" },
        { type: "Hawthorn" },
        { type: "Melbourne" },
        { type: "North Melbourne" },
        { type: "Port Adelaide" },
        { type: "Richmond" },
        { type: "St Kilda" },
        { type: "Sydney" },
        { type: "West Coast" },
        { type: "Western Bulldogs" },
    ];


app.controller('HeaderController', function ($scope, $window, $location, $window, $rootScope, $http) {
    //change the image to hide when the size is reached to the list of image
    $(window).resize(function () {
        var $teamLogo = $('#teamLogo');
        $window.innerWidth <= 1300 ? $teamLogo.hide() : $teamLogo.show();
    });

    //When the route change, this function will call
    $rootScope.$on('$routeChangeStart', function () {
        //console.log("Get token" +$window.localStorage.getItem("token"));
        //Get token
        if ($window.localStorage.getItem("token")) {
            $scope.authenticated = true;
            $scope.UserName = $window.localStorage.getItem("username");
            $window.localStorage.getItem("token");

            console.log("user login");
        }
        else {
            $scope.authenticated = false;
            console.log("user is not login");
        }

        if ($window.localStorage.getItem("playerID")) {
            $scope.showCardToAddToCollection = true;
            var array = [];
            array.push($window.localStorage.getItem("playerName"));
            $scope.cards = array;

            console.log("card" + $scope.cards);
        } else {
            console.log("NO");
            $scope.showCardToAddToCollection = false;

        }

    });

    // Add collection click
    $scope.AddToMyCollection = function () {
        console.log("Add to my collection clicked");

        //Request the back-end to save it to the database.
        $http({
            method: "post",
            url: "/AddToMyCollection",
            data: { "playerID": $window.localStorage.getItem("playerID"), "username": $window.localStorage.getItem("username") }
        }).then(function mySuccess(response) {
            if (response.data.success) {
                console.log(response);
                $window.localStorage.removeItem("playerID");
                $window.localStorage.removeItem("playerName");
                $location.path("/myCollection");

            }
            else {
                console.log(response);

            }
        });
    }



    //Logout function when the user click to the logout button
    $scope.logout = function () {
        console.log("user logout");
        $scope.authenticated = false;
        $window.localStorage.removeItem("token");
        $window.localStorage.removeItem("username");
        $location.path('/Home');
    };

});
app.controller('TeamAgainstVideoController', function ($scope, $location, $routeParams, $http) {
    console.log("Team video controller");
    //get the url including the data parsing
    var urlParams = $location.search();
    $scope.teamA = urlParams.teamA;
    $scope.teamB = urlParams.teamB;


});

//my team against controller
app.controller('TeamAgainstController', function ($scope, $location, $routeParams, $http) {
    console.log("Team agains controller");
    $scope.ResultTable = true;
    $scope.years = Years;
    $scope.teams = Teams;
    //View head to head button click
    $scope.ViewHeadtoHeadButtonClick = function (Search) {
        console.log(Search);
        if (Search.TeamA != null || Search.Year != null || Search.TeamB != null) {
            $scope.ResultTable = false;
        }
    };
    $scope.GetVideoResultClick = function (Search) {
        $location.path('/TeamAgainst/TeamVideo.html').search({ teamA: Search.TeamA, teamB: Search.TeamB });
    }
});
//my Account controller
app.controller('myAccountCtr', function ($scope, $routeParams, $http) {
    console.log("Account controller");
});

//my Collection controller
app.controller('myCollectionCtr', function ($scope, $http, $window, $location, $timeout) {
    $scope.showPlayerDetail = true;
    var point = 0;
    var numberTime = 0;

    console.log("Collection controller");
    //Get the player detail which given the _id to retrived data from the database
    $http({
        method: "post",
        url: "/ViewMyCollection",
        data: { "username": $window.localStorage.getItem("username") }
    }).then(function mySuccess(response) {
        if (response.data.success) {
            var res = response.data.collections;
           
            $timeout(function() {
                res.forEach(function(element) {
                    point = point + element.point;
                    numberTime = numberTime +1;
                  }); 
                
                    console.log("my totol point " + point);
                    console.log("number" + numberTime);
                    $scope.collections = response.data.collections;
              }, 1000);
        }
        else {
            console.log(response.data.result);
        }
    });
    //Click to each row click
    $scope.setClickedRow = function (playerName, position, Height, Weight, DOB, Debut, Games, Goals, Cards) {
        $scope.showPlayerDetail = false;
        $scope.playerName = playerName;
        $scope.Position = position;
        $scope.Height = Height;
        $scope.Weight = Weight;
        $scope.DOB = DOB;
        $scope.Debut = Debut;
        $scope.Games = Games;
        $scope.Goals = Goals;
        $scope.Cards = Cards;
    }
    //line chart
    google.charts.load('current', { 'packages': ['corechart'] });

    setTimeout(function () {
        google.charts.setOnLoadCallback(drawLineChart);
    }, 3000);

    function drawLineChart() {
        var data = google.visualization.arrayToDataTable([
            ['Month', 'Collected'],
            ['Jan', 0],
            ['Fed', 0],
            ['Mar', 0],
            ['Apr', 0],
            ['May', 0],
            ['Jun', 0],
            ['Jul', 0],
            ['Aug', 0],
            ['Sep', numberTime],
            ['Oct', 0],
            ['Nov', 0],
            ['Dec', 0],
        ]);

        var options = {
            title: 'My Collection Performance',
            curveType: 'function',
            legend: { position: 'bottom' }
        };

        var chart = new google.visualization.LineChart(document.getElementById('curve_chart'));

        chart.draw(data, options);
    }



    //Pie chart
    google.charts.load('current', { 'packages': ['corechart'] });
    setTimeout(function () {
        google.charts.setOnLoadCallback(drawChart);
    }, 3000);

    //var a = 1;

    // Draw the chart and set the chart values
    function drawChart() {
        console.log(point);
        var data = google.visualization.arrayToDataTable([
            ['Task', 'My card collection'],
            ['Point', point],
            ['More Collection', 100]
        ]);

        // Optional; add a title and set the width and height of the chart
        var options = { 'title': 'Point collections' };

        // Display the chart inside the <div> element with id="piechart"
        var chart = new google.visualization.PieChart(document.getElementById('piechart'));
        chart.draw(data, options);
    }
    $scope.ViewVideo = function (playerName) {
        console.log("playerName" + playerName);
        $location.path("/player/Video").search({ NameOfPlayer: playerName});
    }

});
//******User Login*****/
app.controller('loginController', function ($scope, $http, $location, $window) {
    console.log("this is login controller");

    $scope.login = function () {
        console.log($scope.loginData);
        $scope.errMessage = false;
        $http({
            method: "post",
            url: "/Login",
            data: $scope.loginData
        }).then(function mySuccess(response) {
            if (response.data.success) {
                //set token to local storage
                $window.localStorage.setItem("token", response.data.token);
                $window.localStorage.setItem("username", response.data.username);
                console.log(response.data.username);
                console.log(response.data.token);
                //set the error meassage
                $scope.successMsg = response.data.message;
                $location.path("/Home");
            }
            else {
                //console.log(response.data.message);
                $scope.errMessage = response.data.message;
            }
        });
    };
});
//******User Register*****/
app.controller('registerController', function ($scope, $http, $location) {
    console.log("this is register controller");
    $scope.register = function () {
        console.log("This is scope" + $scope.regData.username);
        $scope.errMessage = false;
        $http({
            method: "post",
            url: "/Register",
            data: $scope.regData
        }).then(function mySuccess(response) {
            console.log(response.data.success);
            if (response.data.success) {
                console.log(response.data.message);
                $scope.successMsg = response.data.message;
                $location.path("/login");
            }
            else {
                console.log(response.data.message);
                $scope.errMessage = response.data.message;
            }
        });
    };
});
//Player controller
app.controller('playerCtr', function ($scope, $routeParams, $http, $window, $location) {

    console.log("i am player " + $routeParams.playerID);
    // $scope.name = $routeParams.playerID;
    //get the url including the data parsing

    console.log("Get player detail");

    //Get the job detail which given the _id to retrived data from the database
    $http({
        method: "post",
        url: "/getPlayerDetail",
        data: { "id": $routeParams.playerID }
    }).then(function mySuccess(response) {
        if (response.data.success) {
            var res = response.data.result;
            console.log(res);
            $scope.playerImage = res.imageLink;
            console.log($scope.playerImage);
            $scope.playerName = res.playerName;
            $scope.Position = res.Position
            $scope.Height = res.Height
            $scope.Weight = res.Weight
            $scope.DOB = res.DOB
            $scope.Debut = res.Debut
            $scope.Games = res.Games
            $scope.Goals = res.Goals
            console.log("id " + res._id);
            $window.localStorage.setItem("playerID", res._id);
            $window.localStorage.setItem("playerName", res.playerName);
        }
        else {
            console.log(response.data.result);
        }
    });
    console.log("Get user name" + $window.localStorage.getItem("username"));

    // Add collection click
    $scope.AddToMyCollection = function () {
        console.log("Add to my collection clicked");

        //Request the back-end to save it to the database.
        $http({
            method: "post",
            url: "/AddToMyCollection",
            data: { "playerID": $routeParams.playerID, "username": $window.localStorage.getItem("username") }
        }).then(function mySuccess(response) {
            if (response.data.success) {
                console.log(response);
                $window.localStorage.removeItem("playerID");
                $window.localStorage.removeItem("playerName");
                $location.path("/myCollection");

            }
            else {
                console.log(response);

            }
        });
    }
});
app.controller('PlayerVideoController', function ($scope, $http, $location) {
    console.log("this is PlayerVideoController controller");
    var urlParams = $location.search();
            $scope.NameOfPlayer = urlParams.NameOfPlayer;
            console.log(urlParams.NameOfPlayer);
});

//App configuration
app.config(function ($routeProvider, $locationProvider) {
    $routeProvider
        .when("/player/Video", {
            
            templateUrl: "app/views/page/PlayerVideo.html",
            controller: 'PlayerVideoController'
        })
        .when("/Home", {
            templateUrl: "app/views/page/home.html"
        })
        .when("/TeamAgainst", {
            templateUrl: "app/views/page/TeamAgainst.html",
            controller: 'TeamAgainstController'
        })
        .when("/TeamAgainst/TeamVideo.html", {
            templateUrl: "app/views/page/TeamVideo.html",
            controller: 'TeamAgainstVideoController'
        })
        .when("/", {
            templateUrl: "app/views/page/home.html"
        })
        .when("/register", {
            templateUrl: "app/views/page/register.html",
            controller: 'registerController'
        })
        .when("/login", {
            templateUrl: "app/views/page/login.html",
            controller: 'loginController'
        })
        .when("/player/:playerID", {
            templateUrl: "app/views/page/player.html",
            controller: 'playerCtr'
        })
        .when("/myCollection", {
            templateUrl: "app/views/page/myCollection.html",
            controller: 'myCollectionCtr'
        })
        .when("/myAccount", {
            templateUrl: "app/views/page/myAccount.html",
            controller: 'myAccountCtr'
        })
        .otherwise({ redirectTo: "/" });
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });
});
