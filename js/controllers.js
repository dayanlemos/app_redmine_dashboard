app.controller('MainCtrl', function($scope, $http){

    $scope.setHoursPerDay = function (hours) {
        localStorage.hoursPerDay = hours;
        $scope.hoursPerDay = hours;
    }

    $scope.setUser = function (userId) {
        localStorage.userId = userId;
        $scope.selectedUser = userId;
    }

    $scope.getUsers = function () {
        $http.get(server+'/users.json?key='+authKey).then(function (response) {
            $scope.users = response.data.users;
        }, function (err) {
            alert('ERRO: '+ err);
        });
    }

    $scope.getTimeEntries = function (statDate, endDate, userId) {
        var index = 0;
        var dates = $scope.createDateRangeArray(statDate, endDate);
        $scope.timeEntries = [];
        $scope.timeEntriesByDate = [];
        angular.forEach(dates, function (date, key) {
            $http.get(server+'/time_entries.json?spent_on='+date+'&user_id='+userId+'limit=100&key='+authKey).then(function (response) {
                //console.log(JSON.stringify(response));
                $scope.timeEntries = $scope.timeEntries.concat(response.data.time_entries);
                index ++;
                if(dates.length == index){
                    $scope.joinTimeEntriesByDate(dates, $scope.timeEntries);
                }
            }, function (err) {
                alert('ERRO: '+ err);
                index ++;
            });
        })
    }

    $scope.createDateRangeArray = function (startDate, endDate) {

        startDate = startDate.substr(6,9)+startDate.substr(2,4)+startDate.substr(0,2);
        endDate = endDate.substr(6,9)+endDate.substr(2,4)+endDate.substr(0,2);

        var dates = [];
        var itr = moment.twix(new Date(startDate),new Date(endDate)).iterate("days");
        while(itr.hasNext()){
            dates.push(itr.next().format("YYYY-MM-DD"))
        }
        return dates;
    }

    $scope.joinTimeEntriesByDate = function (dates, timeEntries) {
        angular.forEach(dates, function (date, key) {
            $scope.timeEntriesByDate.push({date:date, hoursTotal: 0, status:'pendente', timeEntries: []});
            angular.forEach(timeEntries, function (timeEntry, key2) {
                if(date == timeEntry.spent_on){
                    $scope.timeEntriesByDate[key].timeEntries.push(timeEntry);
                    $scope.timeEntriesByDate[key].hoursTotal+=timeEntry.hours;
                    if($scope.timeEntriesByDate[key].hoursTotal >= $scope.hoursPerDay){
                        $scope.timeEntriesByDate[key].status = 'fechado';
                    }
                }
            });
        });
        console.log(JSON.stringify($scope.timeEntriesByDate))
    }

    //RUN-------------------------------------

    

    $scope.hoursPerDay = '';
    $scope.selectedUser = '';


    var date = new Date();
    $scope.startDate = '01/02/2017'; //new Date(date.getFullYear(), date.getMonth()).toLocaleString().substr(0,10);
    $scope.endDate = '10/02/2017';  // new Date().toLocaleString().substr(0,10);

    $scope.users = [];
    $scope.timeEntries = [];
    $scope.timeEntriesByDate = [];

    $scope.getUsers();

    if(localStorage.hoursPerDay){
        $scope.setHoursPerDay(localStorage.hoursPerDay)
    }else $scope.setHoursPerDay(8);
    if(localStorage.userId){
        $scope.setUser(localStorage.userId)
    }else $scope.setUser('17');


    $scope.getTimeEntries($scope.startDate, $scope.endDate, $scope.selectedUser)

});
