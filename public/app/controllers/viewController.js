var app = angular.module("indexApp", ['ngRoute']);

//my Account controller
app.controller('myAccountCtr', function ($scope, $routeParams,$http) {
    console.log("Account controller");
});

//my Collection controller
app.controller('myCollectionCtr', function ($scope, $routeParams,$http) {
    console.log("Collection controller");
});

//Player controller
app.controller('playerCtr', function ($scope, $routeParams,$http) {
    console.log("i am player "+ $routeParams.playerName);
    $scope.name = $routeParams.playerName;
    //Search click
    $scope.AddToMyCollection = function () {
        console.log("Add to my collection clicked");

        //Request the back-end to store it to the database.
        $http({
            method: "post",
            url: "/AddToMyCollection"
        }).then(function mySuccess(response) {
            if (response.data.success) {
                console.log(response);
               
            }
            else {
                console.log(response);
               // $scope.successMsg = "Result could not foud";
            }
        });
    }
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
