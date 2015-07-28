// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'



var app = angular.module('starter', ['ionic', 'schemas', 'salesTax', 'general']);

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
                          console.log("deviceready");
                          var db = openDatabase('mydb1', '1.0', 'Test DB', 2 * 1024 * 1024);
                          window.alert("after openDatabase");
                          db.transaction(function(tx){
                                         
                                         tx.executeSql('Drop table if exists sales_taxes');
                                         console.log("after drop table");
                                         tx.executeSql('Create table if not exists sales_taxes(id INTEGER PRIMARY KEY, name VARCHAR(255), rate real)');
                                         console.log("after create table");
                                         
                                         tx.executeSql('insert into sales_taxes (name, rate) values ("GST", 1.2)');
                                         console.log("after first insert");
                                         tx.executeSql('insert into sales_taxes (name, rate) values ("Service Tax", 15)');
                                         console.log("after second insert");
                                         var query = "select * from sales_taxes";
                                         tx.executeSql(query, [], function(tx, results){
                                                       console.log("success callback"+ results.rows.length);
                                                       }, function(tx, e){
                                                       window.alert("error");
                                                       });
                                         
                                         });

}, false);

app.controller('AppCtrl', function($rootScope, $scope, $timeout, $ionicModal, Menus, $ionicSideMenuDelegate){
               
               $rootScope.ion_header_bar_template = "test.htm";
               $rootScope.ion_content_template = "test2.htm";
               
               // Load or initialize menus
               $scope.menus = Menus.all();
  
               // Called to select the given project
               $scope.selectProject = function(project, index){
                    $scope.activeProject = "";
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
               
                    task.title = "";
               };
               
               $scope.menuClick = function(submenuTitle) {
                    if (submenuTitle == 'Supplier'){
                        $rootScope.ion_header_bar_template = "modules/products/suppliers/templates/header_bar.htm";
                        $rootScope.ion_content_template = "modules/products/suppliers/templates/main_content.htm";
                    }
               
                    if (submenuTitle == 'Sales Taxes') {
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
                }, 200);
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
                                submenus: ["Products", "Stock Control", "Supplier"]
                            },
                            {
                                title: "Setup",
                                submenus: ["General", "Quick Keys", "Sales Taxes"]
                            }
                            ];
                }
            }
});
