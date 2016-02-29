define('bodyController',['angular','sweet-alert','app','dataFactory',
	'contenteditableDirective'], function(angular, swal){

	angular.module('app').controller('bodyController',['$scope','dataFactory',
		 function($scope, dataFactory){
		$scope.currentPage = 1;
		$scope.fnGetComments = function(issueObj){
			
			var commentsURL = repoIssueURL+'/'+issueObj.number+'/comments';
			dataFactory.getDataFromBackend(commentsURL).then(function(data){
					issueObj.commentsArray = data;
					
				},function(err){
					swal('Error','Error in fetching comments. Try again later','error');
				});
		};

		$scope.fnChangePage = function(){
			fnCheckValidURL();
		};

		var fnCheckValidURL = function(){
			if( $scope.searchText.indexOf('github.com') >-1 && $scope.searchText.split('github.com/')[1]){
				var partURL = $scope.searchText.split('github.com/')[1];
				repoURL = 'http://api.github.com/repos/' + partURL;
				repoIssueURL = repoURL + '/issues' ;
				filters = '?state=open&page=' + $scope.currentPage;
				$scope.dataLoaded = false;
				dataFactory.getDataFromBackend(repoURL).then(function(data){
					$scope.repoDetails = data;
				});
				dataFactory.getDataFromBackend(repoIssueURL + filters).then(function(data){
					$scope.dataLoaded = 'loaded';
					$scope.allIssues = data;
				},function(err){
					$scope.dataLoaded = true;
					swal('Error','Please enter a valid git url','error');
				});
			} else {
				swal('Error','Please enter a valid git url','error');
			}
		};	

		$scope.fnCheckForEnter = function(event){
			if(event.keyCode === 13){
				fnCheckValidURL();
			}
		};
		//--------END------//
	}]);

	angular.element(document).ready(function(){
		angular.bootstrap(document, ['app']);
	});
});