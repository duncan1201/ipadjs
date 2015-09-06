var register = angular.module('register', ['ionic', 'util']);

register.factory('Registers',
            function(DbUtil, App_URLs) {
               return {
                 all: function (_callback) {
                    var stmt = "select r.*, o.name as outlet_name from registers r left join outlets o on r.id = o.register_id";
                    var json = {sql: stmt, params:[], callback: _callback};
                    DbUtil.executeSql(json);
                 }, // end of all
                 get_register : function(id, _callback) {
                    var stmt = "select * from registers where id = ?";
                    var json = {sql: stmt, params:[id], callback: _callback};
                    DbUtil.executeSql(json);
                 }, // end of get_register
                 update_register: function(register, _callback){
                    var stmt = "update registers set name = ?, layout_id = ? where id = ?";
                 
                    var json = {sql: stmt, params:[register.name, register.layout_id, register.id], callback: _callback};
                    DbUtil.executeSql(json);
                 }, // end of update_register
                 parse_rlts : function(rlts) {
                    var rows = rlts.rows;
                    var ret = [];
                    for (var i = 0; i < rows.length; i++) {
                        var item = rows.item(i);
                        ret.push({id: item.id, name: item.name, layout_id: item.layout_id});
                    }
                    return ret;
                 } // end of parse_rlts
               }
            }); // end of Layouts