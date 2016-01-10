'use strict';

angular.module('gitHubExplorer')
    .config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/home', {
    templateUrl: 'home/home.html',
    controller: 'HomeCtrl'
  });
}])

.controller('HomeCtrl', ['$scope','GitHub',function($scope,GitHub) {

      $scope.metaInfoVisible = false;
        $scope.resultDone = true;

      $scope.getRepoInfo = function(){
          $scope.resultDone = false;
        var gitHubURL = $scope.repoURL;
        // Get Owner & REPO From URL
        gitHubURL = gitHubURL.replace("https://","");
        gitHubURL = gitHubURL.replace("http://","");
        gitHubURL = gitHubURL.split("/");
        var owner = gitHubURL[1];
        var repo = gitHubURL[2];

        // GET META INFO About the repository (will use total issue count from it to get all other old issue)
        $scope.metaInfo = GitHub.query({owner:owner,repo:repo});
        $scope.allIssues = [];
        $scope.last24HourIssue = [];
        $scope.last7DaysIssue = [];
        $scope.last7DaysIssuesCount = 0;
        $scope.last24HoursIssuesCount = 0;
        var last24Hour = new Date();
        last24Hour = last24Hour.setDate(last24Hour.getDate()-1);  // last before last 24 hour (in epoch mili second)
        var last7Days = new Date();
        last7Days = last7Days.setDate(last7Days.getDate()-7);  // last before last 7 Days (in epoch mili second)


          /**
           * Will recursively call for nextPage issue
           *
           * Getting sorted result based on created_date (desc order)
           * So that we can minimize the API calls ( will not fetch issues olrder than 7 days)
           *
           * To GET "All Other Old issue" we have "total issue count" (from meta api) Will substract from that
           * @param page
           * @returns {*|Function|promise|n}
           */
        var getNextPageIssue = function(page){
            var promise = GitHub.getAllIssue({owner:owner,repo:repo,page:page,sort:'created',direction:"desc"}).$promise;
            promise.then(function(allIssues){
                $scope.allIssues = $scope.allIssues.concat(allIssues);
                for(var i=0;i<allIssues.length;i++){
                    if((new Date(allIssues[i].created_at).getTime())>=last24Hour){
                        $scope.last24HourIssue.push(allIssues[i]);
                    } else if((new Date(allIssues[i].created_at).getTime())>=last7Days){
                        $scope.last7DaysIssue.push(allIssues[i]);
                    }
                }
                $scope.last7DaysIssuesCount = $scope.last7DaysIssue.length;
                $scope.last24HoursIssuesCount = $scope.last24HourIssue.length;
                //recursiveCall
                /**
                 * Will do recursive  call only if we are still left with issues older than 7 days
                 *
                 */
                if(allIssues.length>0 && allIssues.length===100 &&
                    allIssues[allIssues.length-1].created_at<=last7Days){
                    getNextPageIssue(page+1);
                } else{
                    $scope.resultDone = true;
                }
            });

            return promise;
        }
          //initiate calls
          getNextPageIssue(1);

        $scope.metaInfo.$promise.then(function(){
          $scope.metaInfoVisible = true;
        })

      }

}]);