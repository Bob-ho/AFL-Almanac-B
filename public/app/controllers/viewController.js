
//var app = angular.module("appControl", []);
var app = angular.module("indexApp", ['ngRoute']);

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
        .otherwise({ redirectTo: "/" });
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });
});
