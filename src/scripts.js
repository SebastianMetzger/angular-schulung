var app = angular.module('ToDoApp', ['ngRoute']);

app.config(function($routeProvider) {
  $routeProvider.
  when('/tasks', {
    controller: 'TasksController',
    templateUrl: 'views/tasks.html'
  }).
  when('/users', {
    controller: 'UsersController',
    templateUrl: 'views/users.html'
  }).
  when('/users/:id', {
    controller: 'UserDetailsController',
    templateUrl: 'views/userDetails.html'
  }).
  otherwise({
    redirectTo: '/tasks'
  });
});

app.controller('UsersController', function($scope, $location, Users) {
  $scope.newUser = '';
  var getUsersRequest = Users.getUsersPromise();
  getUsersRequest.success(function(data) {
    $scope.users = data;
  });

  $scope.go = function(path) {
    $location.path(path);
  };
  $scope.createNewUser = function() {
    Users.createNewUser($scope.newUser).success(function(data) {
      $scope.users.push(data);
    });
    $scope.newUser = '';
  }
  $scope.deleteUser = function(id, index) {
    Users.deleteUser(id).success(function() {
      $scope.users.splice(index,1);
    });
  };
});

app.controller('UserDetailsController', function($scope, $routeParams) {
  $scope.userId = $routeParams.id;
});

app.controller('TasksController', function($scope, $rootScope, TasksFactory, Users) {
  var getUsersRequest = Users.getUsersPromise();
  getUsersRequest.success(function(data) {
    $scope.users = data;
  });

  $scope.newTask = '';
  $scope.newTaskUser = '';
  $scope.tasks = TasksFactory.getTasks();

  $scope.$watch('tasks', function(newVal) {
    TasksFactory.saveTasks(newVal);
  }, true);

  $rootScope.$on('taskModelChanged', function(event, data){
    console.log(data);
  });

  $scope.createNewTask = function() {
    $scope.tasks.push({
      title: $scope.newTask,
      user: $scope.newTaskUser.name,
      checked: false
    });
    $scope.newTask = '';
    $scope.newTaskUser = '';
  };

  $scope.removeTask = function($index) {
    $scope.tasks.splice($index,1);
  }
});

// app.service('TasksService', function(){
//   this.saveTasks = function(tasks){
//     console.log(tasks);
//   };
// });

app.factory('TasksFactory', function($rootScope) {
  return {
    getTasks: function() {
      var tasks = [];
      var tasksJson = localStorage.getItem('TASKS');
      if (tasksJson !== null) {
        try {
          tasks = JSON.parse(tasksJson);
        } catch (e) {
          console.warn('invalid json in localStorage');
        }
      }
      return tasks;
    },
    saveTasks: function(tasks) {
      localStorage.setItem('TASKS', angular.toJson(tasks));
      $rootScope.$emit('taskModelChanged', tasks);
    }
  };
});

app.factory('Users', function($http) {
  var getUsersRequest = $http.get('http://localhost:1337/user');
  return {
    getUsersPromise: function() {
      return getUsersRequest;
    },
    createNewUser: function(newUser) {
      return $http.post('http://localhost:1337/user', {
        name: newUser
      });
    },
    deleteUser: function(id) {
      return $http.delete('http://localhost:1337/user/' + id);
    }
  };
});