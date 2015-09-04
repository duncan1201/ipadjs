var util = angular.module('util', ['ionic']);

util.factory('DbUtil',
             function(){
                return {
                    openDb : function(){
                        var db = openDatabase('mydb1', '', 'Test DB', 2 * 1024 * 1024);
                        return db;
                    }, // end of openDb
                    // {sql: "", params:[], callback: function}
                    executeSql: function(json) {
                        var db = null;
                        if (angular.isDefined(json.db)){
                            db = json.db;
                        }else{
                            db = this.openDb();
                        }
             
                        db.transaction(function(tx){
                                            var error_callback = function(tx, e) {
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
                    }, // end of executeSql
                    executeSqls : function (jsons, callback) {
                        var db = this.openDb();
                        db.transaction(function(tx){
                            var error_callback = function(tx, e){
                                console.log("Error:" + e.message);
                                       console.log("Error:" + angular.toJson(e));
                            };// end of error_callback
                            for(var i = 0; i < jsons.length; i++) {
                                //console.log("jsons[i].sql=" + jsons[i].sql);
                                //tx.executeSql(jsons[i].sql, jsons[i].params, callback, error_callback);
                                       
                                //if (angular.isDefined(jsons[i].params)){
                                    if (i == jsons.length - 1){
                                       //console.log("last sql...");
                                       tx.executeSql(jsons[i].sql, jsons[i].params, callback, error_callback);
                                    } else {
                                       //console.log("NOT last sql...");
                                       tx.executeSql(jsons[i].sql, jsons[i].params, null, error_callback);
                                    }
                                //}
                            }
                            
                        }); // end of db.transaction
                    } // end of executeSqls
                }
            }); // end of DbUtil

util.factory('Util', function($ionicPopup, $timeout) {
             return {
                // json = {title: , templateUrl:, timeout:}
                alert: function(json) {
                    var alert_popup = $ionicPopup.alert({title: json.title,
                                                 templateUrl: json.templateUrl});
                    if(angular.isDefined(json.timeout)){
                        $timeout(function() {
                            alert_popup.close();
                        }, json.timeout);
                    } // end if
                }, // end alert
                is_undefined_or_null : function(val) {
                    return angular.isUndefined(val) || val === null
                }, // end of is_undefined_or_null
                get_display_color : function (color) {
                    //console.log("get_display_color=" + color);
                    if (color.toUpperCase() == 'RED'){
                        return "linear-gradient(#ffbbb5, #FFA49C, #ffbbb5)";
                    } else if (color.toUpperCase() == 'PURPLE') {
                        return "linear-gradient(#c9bcf8, #B9A8F8, #c9bcf8)";
                    } else if (color.toUpperCase() == 'BLUE') {
                        return "linear-gradient(#bed1f3, #ADC6F3, #bed1f3)";
                    } else if (color.toUpperCase() == 'GREEN') {
                        return "linear-gradient(#c2d2bf, #AAD2A4, #c2d2bf)";
                    } else if (color.toUpperCase() == 'ORANGE') {
                        return "linear-gradient(#ffb66e, #ff8b17, #ffb66e)";
                    } else if (color.toUpperCase() == 'CYAN') {
                        return "linear-gradient(#90e0e0, #00e0e0, #90e0e0)";
                    } else {
                        return color;
                    }
                } // end of get_display_color
             } // end
        }); // end of Util