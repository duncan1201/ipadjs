// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'



var app = angular.module('starter', ['ionic', 'util', 'salesTax', 'general', 'supplier', 'product', 'brand', 'tag', 'layout']);

app.run(function($ionicPlatform, DbUtil, App_URLs, Schema_SQLs) {
        var ready_function = function(){
            /*
             Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
             for form inputs)
             */
            if(window.cordova) {
                if(window.cordova.plugins.Keyboard){
                    cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                }
                document.addEventListener("deviceready",
                                          function(){
                                            initApp(DbUtil, Schema_SQLs);
                                          },
                                          false);
                }else{
                    initApp(DbUtil, Schema_SQLs);
                }
                if(window.StatusBar) {
                    StatusBar.styleDefault();
                }
        };
        
        $ionicPlatform.ready(ready_function);
});// end of run

app.constant('App_URLs',
             {
                product_add_edit_url: 'modules/products/products/templates/add_edit_product.htm',
                product_main_content_url: 'modules/products/products/templates/main_content.htm',
                supplier_add_edit_url: 'modules/products/suppliers/templates/add_edit_supplier.htm',
                layout_add_edit_url: 'modules/quickKeys/templates/add_edit_layout.htm',
                layout_main_content_url: 'modules/quickKeys/templates/main_content.htm',
             });

function initApp(DbUtil, Schema_SQLs){
    var db = DbUtil.openDb();
    db.transaction(function(tx){
                        for(i = 0; i < Schema_SQLs.length; i++){
                            tx.executeSql(Schema_SQLs[i],
                                          [],
                                          function(tx, results){},
                                          function(tx, e){
                                            console.log("Error:" + e.message);
                                          });// end of tx.executeSql
                        }
                   
                   });

};

app.controller('AppCtrl', function($rootScope, $scope, $timeout, $ionicModal, Menus, $ionicSideMenuDelegate, App_URLs){
               
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
                    } else if (submenuTitle == 'Brands'){
                        $rootScope.ion_header_bar_template = "modules/products/brands/templates/header_bar.htm";
                        $rootScope.ion_content_template = "modules/products/brands/templates/main_content.htm";
                    } else if (submenuTitle == 'Tags'){
                        $rootScope.ion_header_bar_template = "modules/products/tags/templates/header_bar.htm";
                        $rootScope.ion_content_template = App_URLs.product_add_edit_url;
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
                        $rootScope.ion_content_template = App_URLs.layout_main_content_url;
                    }
               };

               
               $scope.toggleSideMenu = function() {
                    $ionicSideMenuDelegate.toggleLeft();
               };
               
               $scope.list1 = {title: 'AngularJS - Drag Me'};
               $scope.list2 = {};
               
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
                                submenus: ["Products", "Stock Control", "Types", "Supplier", "Brands", "Tags"]
                            },
                            {
                                title: "Setup",
                                submenus: ["General", "Quick Keys", "Sales Taxes"]
                            }
                            ];
                } // end of all
            } // end of return
});
