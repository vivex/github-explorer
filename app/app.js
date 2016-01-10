'use strict';

var API_URL = "https://api.github.com/";
// Declare app level module which depends on views, and components
angular.module('gitHubExplorer', [
  'ngRoute',
  'ngResource'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/home'});
}]);
