app.controller('supplierCtrl', function($scope){
               
                    $scope.new_supplier_click = function() {
                        window.alert("new supplier click");
                    }
               
               });

var supplier = angular.module('supplier', ['ionic', 'util']);

salesTax.factory('Suppliers', function(DbUtil){
                    return {
                        all: function(){
                            return "I love you";
                        }
                    }
                 });