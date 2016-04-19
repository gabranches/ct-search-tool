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

    $scope.filters.health = {
        'Accepts Healthy Volunteers': true,
        'No': true
    }

    $scope.filters.age = {
        'Child': true,
        'Adult': true,
        'All': true
    }

    $scope.filters.gender = 'Both';


    // $scope.$watch('filters', function() {
    //     console.log('changed');
    // }, true);

    phaseFilter = function(study) {
        if ($scope.filters.phases.hasOwnProperty(study.phase)) {
            return $scope.filters.phases[study.phase];
        }
        return true;
    }

    healthFilter = function(study) {
        if ($scope.filters.health.hasOwnProperty(study.health)) {
            return $scope.filters.health[study.health];
        }
        return true;
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

    genderFilter = function(study) {
        if (study.hasOwnProperty('gender')) {
            
            // Return true if radio button set to "Both"
            if ($scope.filters.gender === 'Both') {
                return true;
            }

            // Return true if study set to "Both"
            if (study.gender === 'Both') {
                return true;
            }

            return (study.gender === $scope.filters.gender)

        } else {

            // If it's not "Male", "Female", or "Both"
            return true;
        }
    }


    $scope.combinedFilter = function(study) {

        var health = healthFilter(study);
        var phase = phaseFilter(study);
        var age = ageFilter(study);
        var gender = genderFilter(study);

        var state = (health && phase && age && gender);

        if(!state) {
            console.log('- - - - - ');
            console.log('health: ' + study.health);
            console.log('phase: ' + study.phase);
            console.log('min age: ' + study.minimum_age);
            console.log('max age: ' + study.maximum_age);
            console.log('gender: ' + study.gender);
        }

        return state;
    }


}]);

app.controller('DetailsController', ['$scope', '$sce', function($scope, $sce) {
    $scope.data = data[0];

    $scope.data.inclusion_criteria = $sce.trustAsHtml(unescape($scope.data.inclusion_criteria));

    $scope.encodeURI = function(text) {
        return encodeURIComponent(text);
    }

}]);

function replaceNewlines(text) {
    return text.replace('\n', '<br>');
}

// Converts an ageString to an integer representation of age
// e.g. "18 Years" -> 18

function getAge(ageString) {
    if (ageString == 'N/A') {
        return null;
    }
    var age = ageString.replace(/(\d+)\sYears/g, '$1'); 
    return parseInt(age);
}
