// CONTROLLERS

app.controller('SearchResultsController', ['$scope', '$timeout', 'myUtils', function($scope, $timeout, myUtils) {

    $scope.showResults = true;
    $scope.lastUpdated = "0";

    $scope.hideResults = function() {
        $scope.showResults = false;
        $timeout( function(){
            $scope.showResults = true; 
        }, 500);  // artificial wait of 1/2 second
    }    

    $scope.data = data;

    // Filtering

    $scope.encodeURI = myUtils.encodeURI;

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

    lastUpdatedFilter = function(study) {

        if ($scope.lastUpdated == 0) return true;

        var now = new Date().getTime();
        var date = new Date(study.last_updated).getTime();
        var updateUTC = $scope.lastUpdated * 24 * 60 * 60 * 1000;

        return (now - date < updateUTC);
    }


    $scope.combinedFilter = function(study) {


        var health = healthFilter(study);
        var phase = phaseFilter(study);
        var age = ageFilter(study);
        var gender = genderFilter(study);
        var lastUpdated = lastUpdatedFilter(study);

        var state = (health && phase && age && gender && lastUpdated);

        // Results that don't pass the filter
        // if(!state) {
        //     console.log('- - - - - ');
        //     console.log('health: ' + study.health);
        //     console.log('phase: ' + study.phase);
        //     console.log('min age: ' + study.minimum_age);
        //     console.log('max age: ' + study.maximum_age);
        //     console.log('gender: ' + study.gender);
        // }

        return state;
    }
    
    $scope.resetFilters = function () {
        
        // Reset radio buttons
        $("#both").prop("checked", true);
        $scope.filters.gender = 'Both';

        // Check all checkboxes
        $("#offCanvas").find("input:checkbox").each(function() {
            $(this).prop('checked', true);
        });

        // Reset filters
        setAll($scope.filters.age, true);
        setAll($scope.filters.health, true);
        setAll($scope.filters.phases, true);
        $scope.lastUpdated = "0";

        // Update filters
        $scope.$apply();
    }

    // Sorting

    $scope.sortType = 'relevance';

    $scope.sortFunction = function(study) {
        
        var date = new Date(study.last_updated);

        switch ($scope.sortType) {
            case 'newestToOldest':
                return -date;
            case 'oldestToNewest':
                return date;
            case 'alphabetical':
                return study.brief_title;
            case 'relevance':
                return -study.score;
            default:
                return 1;
        }
    }

}]);

app.controller('DetailsController', ['$scope', 'myUtils', function($scope, myUtils) {
    $scope.data = data[0];

    // Replace this for the contact information if there isn't any
    if (!$scope.data.contact) {
        $scope.data.contact = {
            first_name: ['John'],
            last_name: ['Doe'],
            phone: ['555-555-5555'],
            email: ['testemail@miami.edu']
        };
    }

    // If there is no last name, replace it with "Primary Contact"
    if ($scope.data.contact.last_name[0]) {
        if ($scope.data.contact.last_name[0].indexOf("Use link") != -1) {
            $scope.data.contact.last_name = ['Primary Contact'];
        }
    }



    $scope.replaceNewlines = myUtils.replaceNewlines;
    $scope.encodeURI = myUtils.encodeURI;

}]);
