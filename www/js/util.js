var util = angular.module('util', ['ionic']);

util.factory('DbUtil',
             function(){
                return {
                    openDb : function(){
                        var db = openDatabase('mydb1', '1.0', 'Test DB', 2 * 1024 * 1024);
                        return db;
                    }, // end of openDb
                    // {sql: "", params:[], callback: function}
                    executeSql: function(json) {
                        var db = this.openDb();
                        db.transaction(function(tx){
                                            var error_callback =
                                                function(tx, e) {
                                                    console.log("Error:" + e.message);
                                                };
                                            if (angular.isDefined(json.sql) && angular.isDefined(json.params) && angular.isDefined(json.callback)){
                                                tx.executeSql(json.sql, json.params, json.callback, error_callback);
                                            } else if (angular.isDefined(json.sql) && angular.isDefined(json.params)){
                                                tx.executeSql(json.sql, json.params, null, error_callback);
                                            } else if (angular.isDefined(json.sql)){
                                                tx.executeSql(json.sql, [], null, error_callback);
                                            }
                                       
                                       }); // end of db.transaction
                    } // end of executeSql
                }
            }); // end of DbUtil
