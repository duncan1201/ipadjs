var customers = angular.module('customer', ['ionic', 'util']);

customers.factory('Customers', function(DbUtil){
                return {
                  all: function(_callback) {
                    var stmt = "select * from customers";
                    var json = {sql: stmt, params:[], callback: _callback};
                  } // end of all
                }
                });