var app = angular.module("indexApp", ['ngRoute']);
app.controller('HeaderController', function ($scope, $window, $location, $window, $rootScope, $http) {

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

    });



    //Logout function when the user click to the logout button
    $scope.logout = function () {
        console.log("user logout");
        $scope.authenticated = false;
        $window.localStorage.removeItem("token");
        $window.localStorage.removeItem("username");
        $location.path('/Home');
    };

});
//my Account controller
app.controller('myAccountCtr', function ($scope, $routeParams, $http) {
    console.log("Account controller");
});

//my Collection controller
app.controller('myCollectionCtr', function ($scope, $http,$window) {
    $scope.showPlayerDetail = true;
    google.charts.load('current', { 'packages': ['corechart'] });
    google.charts.setOnLoadCallback(drawChart);
   var a = 1;

    // Draw the chart and set the chart values
    function drawChart() {
        var data = google.visualization.arrayToDataTable([
            ['Task', 'Hours per Day'],
            ['Point', a],
            ['More Collection', 2]
        ]);

        // Optional; add a title and set the width and height of the chart
        var options = { 'title': 'My Average Day'};

        // Display the chart inside the <div> element with id="piechart"
        var chart = new google.visualization.PieChart(document.getElementById('piechart'));
        chart.draw(data, options);
    }
    console.log("Collection controller");
    //Get the job detail which given the _id to retrived data from the database
    $http({
        method: "post",
        url: "/ViewMyCollection",
        data: { "username": $window.localStorage.getItem("username") }
    }).then(function mySuccess(response) {
        if (response.data.success) {
            var res = response.data.collections;
            console.log(res);
            $scope.collections = response.data.collections;
        }
        else {
            console.log(response.data.result);
        }
    });
    //Click to each row click
    $scope.setClickedRow = function (playerName,position,Height,Weight,DOB,Debut, Games, Goals, Cards ) {
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
        
        //console.log($scope.collections);
        //console.log("direct to detail job");
        //$location.path('/jobDetail').search({ id: id })
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
            $scope.playerName = res.playerName;
            $scope.Position = res.Position
            $scope.Height = res.Height
            $scope.Weight = res.Weight
            $scope.DOB = res.DOB
            $scope.Debut = res.Debut
            $scope.Games = res.Games
            $scope.Goals = res.Goals
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
                $location.path("/myCollection");

            }
            else {
                console.log(response);

            }
        });
    }
});


//App configuration
app.config(function ($routeProvider, $locationProvider) {
    $routeProvider

        .when("/Home", {
            templateUrl: "app/views/page/home.html"
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
