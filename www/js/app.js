// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'



var app = angular.module('starter', ['ionic', 'salesTax', 'general']);

app.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

document.addEventListener("deviceready", function(){
                          var db = window.sqlitePlugin.openDatabase({name: "my.db", createFromLocation: 2});
                          db.transaction(function(tx){
                                         tx.executeSql('Create table if not exists test_table(id integer primary key, data text, data_num integer)');
                          });
}, false);



app.controller('TodoCtrl', function($rootScope, $scope, $timeout, $ionicModal, Projects, Menus, $ionicSideMenuDelegate){
               // A utility function for creating a new project
               // with the given projectTitle
               var createProject = function (projectTitle) {
                    var newProject = Projects.newProject(projectTitle);
                    $scope.projects.push(newProject);
                    Projects.save($scope.projects);
                    $scope.selectProject(newProject, $scope.projects.length - 1);
               }
               
               $rootScope.ion_header_bar_template = "test.htm";
               $rootScope.ion_content_template = "test2.htm";
               
               // Load or initialize projects
               $scope.projects = Projects.all();
               $scope.menus = Menus.all();
               
               // Grab the last active, or the first project
               $scope.activeProject = $scope.projects[Projects.getLastActiveIndex()];
               
               // Called to create a new project
               $scope.newProject = function(){
                    var projectTitle = prompt('Project name');
                    if (projectTitle){
                        createProject(projectTitle);
                    }
               };
               
               // Called to select the given project
               $scope.selectProject = function(project, index){
                    $scope.activeProject = project;
                    Projects.setLastActiveIndex(index);
                    $ionicSideMenuDelegate.toggleLeft(false);
               };
               
               // Create our modal
               $ionicModal.fromTemplateUrl('new-task.html', function(modal){
                                           $scope.taskModal = modal;
                                           }, {
                                                scope: $scope
                                           });
               
               $scope.createTask = function(task){
                    if (!$scope.activeProject || !task){
                        return;
                    }
                    $scope.activeProject.tasks.push({
                        title: task.title
                    });
                    $scope.taskModal.hide();
               
                    // Inefficient, but save all the projects
                    Projects.save($scope.projects);
               
                    task.title = "";
               };
               
               $scope.menuClick = function(submenuTitle) {
                    console.log("test function:"+submenuTitle);
                    if (submenuTitle == 'Sales Taxes') {
                        //window.alert('inside if');
                        $rootScope.ion_header_bar_template = "modules/salesTax/templates/header_bar.htm";
                        $rootScope.ion_content_template = "modules/salesTax/templates/main_content.htm";
                    } else if (submenuTitle == 'General') {
                        $rootScope.ion_header_bar_template = "modules/general/templates/header_bar.htm";
                        $rootScope.ion_content_template = "modules/general/templates/main_content.htm";
                    } else if (submenuTitle == 'Quick Keys'){
                        $rootScope.ion_header_bar_template = "modules/quickKeys/templates/header_bar.htm";
                        $rootScope.ion_content_template = "modules/quickKeys/templates/main_content.htm";
                    }
               };
               
               $scope.newTask = function() {
                    $scope.taskModal.show();
               };
               
               $scope.closeNewTask = function () {
                    $scope.taskModal.hide();
               };
               
               $scope.toggleSideMenu = function() {
                    $ionicSideMenuDelegate.toggleLeft();
               };
               
               // Try to create the first project, make sure to defer
               // this by using $timeout so everything is initialized
               // properly
               $timeout(function(){
                        
                        if($scope.projects.length == 0) {
                        
                            while(true){
                                var projectTitle = prompt('Your first project title:');
                                if (projectTitle) {
                                    createProject(projectTitle);
                                    break;
                                }
                            }
                        }
                });
});

app.controller('menuCtrl', function($scope){
               $scope.menuClick = function(submenuTitle) {
                console.log("test function:"+submenuTitle);
                    if (submenuTitle == 'Sales Taxes') {
                        window.alert('inside if');
                    }
               }
});

app.controller('TestCtrl', function($scope){
               
               });

app.factory('Projects', function(){
            return {
                all: function() {
                    var projectString = window.localStorage['projects'];
                    if (projectString){
                        return angular.fromJson(projectString);
                    }
                    return [];
                },
                save: function(projects) {
                    window.localStorage['projects'] = angular.toJson(projects);
                },
                newProject: function(projectTitle) {
                    return {
                        title: projectTitle,
                        tasks:[]
                    };
                },
                getLastActiveIndex: function(){
                    return parseInt(window.localStorage['lastActiveProject']) || 0;
                },
                setLastActiveIndex: function(index) {
                    window.localStorage['lastActiveProject'] = index;
                }
            }
});

app.factory('Menus', function(){
            return {
                all: function() {
                    return [
                            {
                                title: "Sell",
                                submenus: []
                            },
                            {
                                title: "Products",
                                submenus: []
                            },
                            {
                                title: "Setup",
                                submenus: ["General", "Quick Keys", "Sales Taxes"]
                            }
                            ];
                }
            }
});
