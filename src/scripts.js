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
    if (_tasks === null || _tasks === undefined) {
      _tasks = [];
    }
  } catch (e) {
    _tasks = [];
  }
  return {
    setTasks: function(tasks) {
      _tasks = tasks;
      localStorage.setItem(LOCAL_STORAGE_KEY, angular.toJson(tasks));
    },
    getTasks: function() {
      return _tasks;
    }
  };
});

app.controller('ToDoCtrl', function($scope, $rootScope, $location, $http, Tasks) {
  $scope.tasks = Tasks.getTasks();
  updateCounts();
  $scope.newTask = {
    name: '',
    user: ''
  };
  $scope.archive = false;

  $scope.$watch('tasks', function(newTasks) {
    Tasks.setTasks(newTasks);
    updateCounts();
  }, true);

  function updateCounts(){
    $scope.taskCount = $scope.tasks.reduce(function(count, task){
      return count + (task.archived ? 0 : 1);
    },0)
    $scope.archivedTaskCount = $scope.tasks.length - $scope.taskCount;
  }

  $http.get('/server/users.json').
  success(function(data) {
    $scope.users = data.users;
  });

  $scope.createNewTask = function() {
    if ($scope.newTaskForm.taskName.$invalid || $scope.newTaskForm.taskUser.$error.required) {
      return;
    }
    $scope.tasks.push({
      name: $scope.newTask.name,
      user: $scope.newTask.user,
      done: false,
      archived: false
    });
    $scope.newTask = {
      name: '',
      user: ''
    };
  };

  $scope.archiveDoneTasks = function() {
    $scope.tasks = $scope.tasks.map(function(task) {
      if (task.done) task.archived = true;
      return task;
    });
  };

  $scope.notArchived = function(task) {
    return !task.archived;
  }
});

app.controller('ArchiveCtrl', function($scope, $rootScope, $location, Tasks) {
  $scope.tasks = Tasks.getTasks();
  $scope.archive = true;

  $scope.$watch('tasks', function(newTasks) {
    Tasks.setTasks(newTasks);
  }, true);

  $scope.archived = function(task) {
    return task.archived;
  }
});