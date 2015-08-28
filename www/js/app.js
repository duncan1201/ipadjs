// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'



var app = angular.module('starter', ['ionic', 'util', 'salesTax', 'general', 'supplier', 'product', 'brand', 'tag', 'layout', 'productType', 'outlet', 'sale']);

app.run(function($ionicPlatform, DbUtil, App_URLs, Schema_SQLs, Initialization_SQLs) {
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
                                            initApp(DbUtil, Schema_SQLs, Initialization_SQLs);
                                          },
                                          false);
                }else{
                    initApp(DbUtil, Schema_SQLs, Initialization_SQLs);
                }
                if(window.StatusBar) {
                    StatusBar.styleDefault();
                }
        };
        
        $ionicPlatform.ready(ready_function);
});// end of run

app.constant('App_URLs',
             {
                product_add_edit: 'modules/products/products/templates/add_edit_product.htm',
                product_main_content: 'modules/products/products/templates/main_content.htm',
                supplier_add_edit: 'modules/products/suppliers/templates/add_edit_supplier.htm',
                layout_add_edit: 'modules/quickKeys/templates/add_edit_layout.htm',
                layout_main_content: 'modules/quickKeys/templates/main_content.htm',
                outlet_main_content: 'modules/outlets/outlets/templates/main_content.htm',
                sell_main_content: 'modules/sell/templates/main_content.htm',
                landing_main_content: 'modules/landing/templates/main_content.htm',
                general_main_content: 'modules/general/templates/main_content.htm'
             });

function initApp(DbUtil, Schema_SQLs, Initialization_SQLs){
    /*
    for(var i = 0; i < Schema_SQLs.length; i++){
        DbUtil.executeSql(Schema_SQLs[i], params:[]);
    }*/
    var SQLs = Schema_SQLs.concat(Initialization_SQLs);
    
    var db = DbUtil.openDb();
    db.transaction(function(tx){
                        for(var i = 0; i < SQLs.length; i++){
                            tx.executeSql(SQLs[i],
                                          [],
                                          function(tx, results){
                                          },
                                          function(tx, e){
                                            console.log("Error:" + e.message);
                                          });// end of tx.executeSql
                        }
                   });
};

app.controller('AppCtrl', function($rootScope, $scope, $timeout, $ionicModal, Menus, $ionicSideMenuDelegate, App_URLs){
               
               $rootScope.ion_header_bar_template = "modules/landing/templates/header_bar.htm";
               $rootScope.ion_content_template = App_URLs.landing_main_content;
  
               // Called to select the given project
               $scope.selectProject = function(project, index){
               };
               
               $scope.submenuClick = function(submenuTitle) {
                    $rootScope.active_submenu = submenuTitle;
               
                    // Sell
                    if (submenuTitle == 'Sell') {
                        $rootScope.ion_header_bar_template = "modules/sell/templates/header_bar.htm";
                        $rootScope.ion_content_template = "modules/sell/templates/main_content.htm";
                    }
               
                    // Products
                    if (submenuTitle == 'Products') {
                        $rootScope.ion_header_bar_template = "modules/products/products/templates/header_bar.htm";
                        $rootScope.ion_content_template = "modules/products/products/templates/main_content.htm";
                    } else if (submenuTitle == 'Types'){
                        $rootScope.ion_header_bar_template = "modules/products/productTypes/templates/header_bar.htm";
                        $rootScope.ion_content_template = "modules/products/productTypes/templates/main_content.htm";
                    } else if (submenuTitle == 'Supplier'){
                        $rootScope.ion_header_bar_template = "modules/products/suppliers/templates/header_bar.htm";
                        $rootScope.ion_content_template = "modules/products/suppliers/templates/main_content.htm";
                    } else if (submenuTitle == 'Brands'){
                        $rootScope.ion_header_bar_template = "modules/products/brands/templates/header_bar.htm";
                        $rootScope.ion_content_template = "modules/products/brands/templates/main_content.htm";
                    } else if (submenuTitle == 'Tags'){
                        $rootScope.ion_header_bar_template = "modules/products/tags/templates/header_bar.htm";
                        $rootScope.ion_content_template = "modules/products/tags/templates/main_content.htm";
                    }
               
                    // Setup
                    if (submenuTitle == 'Sales Taxes') {
                        $rootScope.ion_header_bar_template = "modules/salesTax/templates/header_bar.htm";
                        $rootScope.ion_content_template = "modules/salesTax/templates/main_content.htm";
                    } else if (submenuTitle == 'General') {
                        $rootScope.ion_header_bar_template = "modules/general/templates/header_bar.htm";
                        $rootScope.ion_content_template = "modules/general/templates/main_content.htm";
                    } else if (submenuTitle == 'Outlets and Registers') {
                        $rootScope.ion_header_bar_template = "modules/outlets/outlets/templates/header_bar.htm";
                        $rootScope.ion_content_template = "modules/outlets/outlets/templates/main_content.htm";
                    } else if (submenuTitle == 'Quick Keys'){
                        $rootScope.ion_header_bar_template = "modules/quickKeys/templates/header_bar.htm";
                        $rootScope.ion_content_template = App_URLs.layout_main_content;
                    }
               };

               
               $scope.toggle_side_menu = function() {
                    $ionicSideMenuDelegate.toggleLeft();
               };
               
               $rootScope.$on('$includeContentLoaded',
                              function(event, url){
                                if (url == App_URLs.landing_main_content){
                                    // Load or initialize menus
                                    $scope.menus = Menus.all();
                                }
                              }); // end of on
               
});


app.factory('Menus', function(){
            return {
                all: function() {
                    return [
                            {
                                title: "",
                                submenus: [
                                            {title:"Sales Reports", icon: "ion-ios-pie"},{title:"Inventory Reports", icon: "ion-ios-pie-outline"}
                                           ]
                            },
                            {
                                title: "",
                                submenus: [{title: "Sell", icon: "ion-ios-cart"}]
                            },
                            {
                                title: "",
                                submenus: [
                                           {title:"Products", icon: "ion-tshirt-outline"},
                                           {title:"Stock Control", icon: "ion-ios-circle-outline"}, {title:"Types", icon: "ion-ios-circle-outline"}, {title:"Supplier", icon: "ion-ios-circle-outline"}, {title:"Brands", icon: "ion-ios-circle-outline"}, {title:"Tags", icon: "ion-ios-circle-outline"}]
                            },
                            {
                                title: "",
                                submenus: [
                                           {title:"General", icon: "ion-ios-gear"},
                                           {title:"Outlets and Registers", icon: "ion-ios-circle-outline"},
                                           {title:"Quick Keys", icon: "ion-ios-circle-outline"}, {title:"Sales Taxes", icon: "ion-ios-circle-outline"}]
                            }
                            ];
                } // end of all
            } // end of return
});
