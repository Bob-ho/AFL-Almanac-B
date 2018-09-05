var app = angular.module("indexApp", ['ngRoute']);

//my Account controller
app.controller('myAccountCtr', function ($scope, $routeParams,$http) {
    console.log("Account controller");
});

//my Collection controller
app.controller('myCollectionCtr', function ($scope, $routeParams,$http) {
    console.log("Collection controller");

    $scope.models = {
        selected: null,
        lists: {"A": [], "B": []}
    };

    // Generate initial model
    for (var i = 1; i <= 10; ++i) {
        $scope.models.lists.A.push({label: "Item A" + i});
        $scope.models.lists.B.push({label: "Item B" + i});
    }

    // Model to JSON for demo purpose
    $scope.$watch('models', function(model) {
        $scope.modelAsJson = angular.toJson(model, true);
    }, true);





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
            templateUrl: "app/views/page/register.html",
            controller: 'registerController'
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
