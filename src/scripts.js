var app = angular.module('ToDoApp', ['ngRoute']);

app.config(function($routeProvider) {
  $routeProvider.
  when('/', {
    controller: 'ToDoCtrl'
  }).
  when('/archive', {
    controller: 'ToDoCtrl'
  }).
  otherwise({
    redirectTo: '/'
  });
});

app.run(function($route){
  //
});

app.filter('byArchived', function() {
    return function(tasks,archive) {
      tasks = tasks.filter(function(task){
        if(archive){
          return task.archived;
        } else {
          return !task.archived;
        }
      });
      return tasks;
    }
  });

app.controller('ToDoCtrl', function($scope, $rootScope, $location) {
  $scope.tasks = [];
  $scope.newTaskName = '';
  $scope.archive = false;

  $rootScope.$on("$routeChangeSuccess", function(event, next, current) {
    if(next.$$route.originalPath === '/archive'){
      $scope.archive = true;
    } else {
      $scope.archive = false;
    }
  });

  $scope.createNewTask = function() {
    $scope.tasks.push({
      name: $scope.newTaskName,
      done: false,
      archived: false
    });
    $scope.newTaskName = '';
  };

  $scope.archiveDoneTasks = function() {
    $scope.tasks = $scope.tasks.map(function(task) {
      if(task.done) task.archived = true;
      return task;
    });
  };
});