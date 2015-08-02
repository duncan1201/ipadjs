// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'



var app = angular.module('starter', ['ionic', 'util', 'schemas', 'salesTax', 'general', 'supplier']);

app.run(function($ionicPlatform, DbUtil) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova) {
        if(window.cordova.plugins.Keyboard){
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        document.addEventListener("deviceready", function(){
                                                    initApp(DbUtil);
                                                 }, false);
    }else{
        initApp(DbUtil);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

function initApp(DbUtil){
    var db = DbUtil.openDb();
    console.log("after openDatabase");
    db.transaction(function(tx){
                   
                        var sqls = [
                                    /* development purpose */
                                //'Drop table if exists sales_taxes',
                                //'Drop table if exists suppliers',
                                
                                /* sales tax table */
                                'Create table if not exists sales_taxes(id INTEGER PRIMARY KEY, name VARCHAR(255) NOT NULL, rate real NOT NULL, system_generated BOOLEAN DEFAULT 0)',
                                'insert into sales_taxes (name, rate, system_generated) values ("No Tax", 0, 1)',
                                
                                /* suppliers table */
                                    
                                'Create table if not exists suppliers(id integer primary key, name varchar(100) NOT NULL, default_markup integer, desc varchar(255), company varchar(100), contact_name varchar(100), phone varchar(100), mobile varchar(100), fax varchar(50), email varchar(50), website varchar(50), physical_street varchar(50), physical_city varchar(50), physical_postcode varchar(50), physical_state varchar(50), physical_country varchar(50), postal_street varchar(50), postal_city varchar(50), postal_postcode varchar(50), postal_state varchar(50), postal_country varchar(50))'
                               ];
                   
                        for(i = 0; i < sqls.length; i++){
                            tx.executeSql(sqls[i],
                                          [],
                                          function(tx, results){},
                                          function(tx, e){
                                            console.log("Error:" + e.message);
                                          });// end of tx.executeSql
                        }
                   
                   });

}

app.controller('AppCtrl', function($rootScope, $scope, $timeout, $ionicModal, Menus, $ionicSideMenuDelegate){
               
               $rootScope.ion_header_bar_template = "test.htm";
               $rootScope.ion_content_template = "test2.htm";
               //$rootScope.ion_menu_content_template = "blank.htm";
               
               // Load or initialize menus
               $scope.menus = Menus.all();
  
               // Called to select the given project
               $scope.selectProject = function(project, index){
                    $scope.activeProject = "";
                    $ionicSideMenuDelegate.toggleLeft(false);
               };
               
               $scope.submenuClick = function(submenuTitle) {
                    $rootScope.active_submenu = submenuTitle;
               
                    // Products
                    if (submenuTitle == 'Products') {
                        $rootScope.ion_header_bar_template = "modules/products/products/templates/header_bar.htm";
                        $rootScope.ion_content_template = "modules/products/products/templates/main_content.htm";
                    } else if (submenuTitle == 'Supplier'){
                        $rootScope.ion_header_bar_template = "modules/products/suppliers/templates/header_bar.htm";
                        $rootScope.ion_content_template = "modules/products/suppliers/templates/main_content.htm";
                    }
               
                    // Setup
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

               
               $scope.toggleSideMenu = function() {
                    $ionicSideMenuDelegate.toggleLeft();
               };
               
});

app.factory('Menus', function(){
            return {
                all: function() {
                    return [
                            {
                                title: "Reporting",
                                submenus: ["Sales Reports", "Inventory Reports"]
                            },
                            {
                                title: "Sell",
                                submenus: []
                            },
                            {
                                title: "Products",
                                submenus: ["Products", "Stock Control", "Types", "Supplier", "Tags"]
                            },
                            {
                                title: "Setup",
                                submenus: ["General", "Quick Keys", "Sales Taxes"]
                            }
                            ];
                } // end of all
            } // end of return
});
