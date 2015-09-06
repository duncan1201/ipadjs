var register = angular.module('register', ['ionic', 'util']);

register.factory('Registers',
            function(DbUtil, App_URLs) {
               return {
                 all: function (_callback) {
                    var stmt = "select r.*, o.name as outlet_name from registers r left join outlets o on r.outlet_id = o.id";
                    var json = {sql: stmt, params:[], callback: _callback};
                    DbUtil.executeSql(json);
                 }
               }
            }); // end of Layouts