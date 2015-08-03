var util = angular.module('util', ['ionic']);

util.factory('DbUtil',
             function(){
                return {
                    openDb : function(){
                        var db = openDatabase('mydb1', '1.0', 'Test DB', 2 * 1024 * 1024);
                        return db;
                    }
                }
            }); // end of DbUtil
