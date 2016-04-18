var app = angular.module('app', [])


app.controller('SearchResultsController', ['$scope', function($scope) {
    $scope.data = data;

    $scope.filters = {}

    $scope.filters.phases = {
        'Phase 1': true,
        'Phase 2': true,
        'Phase 3': true,
        'Phase 4': true,
        'Not Specified': true
    }

    $scope.filters.health = {
        'Accepts Healthy Volunteers': true,
        'No': true
    }

    $scope.filters.age = {
        'Child': true,
        'Adult': true,
        'All': true
    }

    phaseFilter = function(study) {
        if ($scope.filters.phases.hasOwnProperty(study.phase)) {
            return $scope.filters.phases[study.phase];
        }
        return false;
    }

    healthFilter = function(study) {
        if ($scope.filters.health.hasOwnProperty(study.health)) {
            return $scope.filters.health[study.health];
        }
        return false;
    }

    ageFilter = function(study) {
        if (study.hasOwnProperty('minimum_age')) {
            var minAge = getAge(study.minimum_age);
        }
        if (study.hasOwnProperty('maximum_age')) {
            var maxAge = getAge(study.maximum_age);
        }

        if (minAge >= 18) {
            ageType = 'Adult';
        } else if (maxAge <= 18) {
            ageType = 'Child';
        } else {
            ageType = 'All';
        }

        return $scope.filters.age[ageType];
    }


    $scope.combinedFilter = function(study) {

        var health = healthFilter(study);
        var phase = phaseFilter(study);
        var age = ageFilter(study);

        var state = (health && phase && age);

        if(state) {
            console.log('- - - - - ');
            console.log('health: ' + study.health);
            console.log('phase: ' + study.phase);
            console.log('min age: ' + study.minimum_age);
            console.log('max age: ' + study.maximum_age)
        }

        return state;
    }

}]);


// Converts an ageString to an integer representation of age
// e.g. "18 Years" -> 18

function getAge(ageString) {
    if (ageString == 'N/A') {
        return null;
    }
    var age = ageString.replace(/(\d+)\sYears/g, '$1'); 
    return parseInt(age);
}
