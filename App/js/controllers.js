var app = angular.module('app', [])


app.controller('SearchResultsController', ['$scope', function($scope) {
    $scope.data = data;

    $scope.filters = {}

    $scope.filters.phases = {
        'Phase 1': true,
        'Phase 2': true,
        'Phase 3': true,
        'Phase 4': true,
        'N/A': true
    }

    $scope.phaseFilter = function(study) {
        if ($scope.filters.phases.hasOwnProperty(study.phase)) {
            return $scope.filters.phases[study.phase];
        }
        return false;
    }


}]);
