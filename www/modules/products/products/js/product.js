app.controller('productCtrl',
               function($rootScope, $scope, Products, Suppliers){
                    $scope.add_new_product_click = function() {
                        $rootScope.ion_content_template = "modules/products/products/templates/add_edit_product.htm";
                    };
               
                    $scope.product_form_submit_click = function() {
                        console.log("product_form_submit_click");
                    };
               
                    $scope.product_form_cancel_click = function() {
                        $rootScope.ion_content_template = "modules/products/products/templates/main_content.htm";
                    }; 
               }); // end of controller

var product = angular.module('product', ['ionic', 'util']);

product.factory('Products',
                function(DbUtil){
                    return {
                        
                    };
                }); // end of product.factory