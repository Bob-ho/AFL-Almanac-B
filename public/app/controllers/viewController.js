var app = angular.module("indexApp", ['ngRoute']);


//Player controller
app.controller('playerCtr', function ($scope, $routeParams) {
    console.log("i am player "+ $routeParams.playerName);
    $scope.name = $routeParams.playerName;
});


//App configuration
app.config(function ($routeProvider, $locationProvider) {
    $routeProvider
       
        .when("/", {
            templateUrl: "app/views/page/home.html"
        })
        .when("/register", {
            templateUrl: "app/views/page/register.html"
        })
        .when("/login", {
            templateUrl: "app/views/page/login.html"
        }) 
        .when("/player/:playerName", {
            templateUrl: "app/views/page/player.html",
            controller: 'playerCtr'
        })
        .otherwise({ redirectTo: "/" });
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });
});
