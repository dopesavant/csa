'use strict'

angular.module('consumergram',  [ 'ui.router', 'ui.bootstrap', 'ngStorage', 'infinite-scroll'])

.constant('BASE_URL', 'https://api.instagram.com/v1/tags/consumeraffairs/media/recent?client_id=e74fe79c1eff4a7aac2ccbddb1d7c94d&callback=JSON_CALLBACK')

// App Configurations
.config(function($stateProvider, $urlRouterProvider, $httpProvider){
	
	$urlRouterProvider.otherwise('/')

	$stateProvider
		.state('home',{
			url: "/",
			templateUrl: "static/partials/feed.html",
			controller: 'MainCtrl'
		})

		.state('user',{
			url: "/user/:id",
			templateUrl: "/partials/userinfo.html",
			controller: 'UserCtrl'
		})
})

// App Controller
.controller('MainCtrl',['$scope', '$state', 'MainSrvc', '$localStorage', function($scope, $state, MainSrvc, $localStorage){
	MainSrvc.getData().then(function(){
		$scope.feeds = $localStorage.feed
		$scope.totalLength = $localStorage.feed.length
	})

	$scope.loadMore = function(){
		$scope.busy = true
		MainSrvc.getMore()
		.then(function(){
			$scope.feeds = $localStorage.feed
			$scope.busy = false
			$scope.totalLength = $localStorage.feed.length
			console.log($scope.totalLength)
		})
	}

}])


  // App Service
.factory('MainSrvc', ['BASE_URL','$http', '$localStorage', function(BASE_URL, $http, $localStorage){

	var posts = {
		next:[],
		blow: [],

		getData: function(){
			return $http.jsonp(BASE_URL).then(function(response){
				// $localStorage.feed = []
				posts.next = response.data.pagination.next_url
				$localStorage.feed = response.data.data
				console.log ($localStorage.feed)
				console.log(posts.next)
			}, 
				function errorCallback(response){
					console.log("Error")
					console.log($localStorage.feed)
				})
		},

		getMore: function(){
			return $http.jsonp(posts.next + '&callback=JSON_CALLBACK').then(function(response){
				$localStorage.feed = $localStorage.feed.concat(response.data.data)
				console.log($localStorage.feed)
				posts.next = response.data.pagination.next_url
			})
		}

	}
	return posts
}])
