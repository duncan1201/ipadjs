app.controller('productCtrl',
               function($scope){
                    $scope.add_new_product_click = function() {
                        console.log("add new product click");
                    };
               }); // end of controller

var product = angular.module('product', ['ionic', 'util']);

product.factory('Products',
                function(DbUtil){
                    return {
                
                    };
                }); // end of product.factory