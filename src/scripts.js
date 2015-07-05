var app = angular.module('ToDoApp', []);
app.controller('ToDoCtrl', function($scope) {
  $scope.tasks = [];
  $scope.newTaskName = '';

  $scope.createNewTask = function() {
    $scope.tasks.push({
      name: $scope.newTaskName,
      done: false
    });
    $scope.newTaskName = '';
  };

  $scope.deleteDoneTasks = function() {
    $scope.tasks = $scope.tasks.filter(function(task){
      return !task.done;
    });
  };
});