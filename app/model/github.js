/**
 * Created by vivex on 10/1/16.
 */
'use strict';
angular.module('gitHubExplorer').factory('GitHub', ['$resource','$rootScope',
    function($resource,$rootScope){
        console.log($rootScope);
        return $resource(API_URL+'repos/:owner/:repo', {}, {
            query: {method:'GET', params:{}, isArray:false},
            getAllIssue: {method:'GET', params:{}, isArray:true,url:API_URL+"repos/:owner/:repo/issues?per_page=100&page=:page&sort=:sort&direction=:direction"},
            save:{method:'POST'},
        });
    }]);