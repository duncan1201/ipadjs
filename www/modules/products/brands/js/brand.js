app.controller('brandCtrl',
               function($scope){
                    $scope.add_new_brand_click =
                        function () {
                            console.log("add_new_brand_click");
                    };
               
               }); // end of brandCtrl
var brand = angular.module('brand', ['ionic', 'util']);

brand.factory('Brands',
              function(){
                return {
                    all: function() {
                        
                    } // end of all
                }
              }); // end of brand.factory