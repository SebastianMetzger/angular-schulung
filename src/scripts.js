var app = angular.module('ToDoApp', ['ngRoute']);

app.config(function($routeProvider) {
  $routeProvider.
  when('/', {
    controller: 'ToDoCtrl',
    templateUrl: 'views/todo.html'
  }).
  when('/archive', {
    controller: 'ArchiveCtrl',
    templateUrl: 'views/archive.html'
  }).
  otherwise({
    redirectTo: '/'
  });
});

// app.filter('byArchived', function() {
//     return function(tasks,archive) {
//       tasks = tasks.filter(function(task){
//         if(archive){
//           return task.archived;
//         } else {
//           return !task.archived;
//         }
//       });
//       return tasks;
//     }
//   });

app.factory('Tasks', function() {
  var LOCAL_STORAGE_KEY = 'TO_DO_APP.TASKS';
  var _tasks = [];
  try {
    _tasks = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));
    if(_tasks === null || _tasks === undefined){
    _tasks = [];
    }
  } catch (e) {
    _tasks = [];
  }
  return {
    setTasks: function(tasks) {
      debugger;
      _tasks = tasks;
      localStorage.setItem(LOCAL_STORAGE_KEY, angular.toJson(tasks));
    },
    getTasks: function() {
      debugger;
      return _tasks;
    }
  };
});

app.controller('ToDoCtrl', function($scope, $rootScope, $location, Tasks) {
  $scope.tasks = Tasks.getTasks();
  $scope.newTaskName = '';
  $scope.archive = false;

  $scope.$watch('tasks', function(newTasks) {
    Tasks.setTasks(newTasks);
  }, true);

  $scope.createNewTask = function() {
    if ($scope.newTask.taskName.$invalid) {
      return;
    }
    $scope.tasks.push({
      name: $scope.newTaskName,
      done: false,
      archived: false
    });
    $scope.newTaskName = '';
  };

  $scope.archiveDoneTasks = function() {
    $scope.tasks = $scope.tasks.map(function(task) {
      if (task.done) task.archived = true;
      return task;
    });
  };

  $scope.notArchived = function(task){
    return !task.archived;
  }
});

app.controller('ArchiveCtrl', function($scope, $rootScope, $location, Tasks) {
  $scope.tasks = Tasks.getTasks();
  $scope.archive = true;

  $scope.$watch('tasks', function(newTasks) {
    Tasks.setTasks(newTasks);
  }, true);

  $scope.archived = function(task){
    return task.archived;
  }
});