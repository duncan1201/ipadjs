var outlet = angular.module('outlet', ['ionic', 'util']);

outlet.factory('Outlets', function(DbUtil){
               
               return {
                    all : function (callback_fun) {
                        var query = "select o.*, (s.name || ' ' || s.rate || '%') as sales_tax , r.name as register_name from outlets o left join sales_taxes s on o.sales_tax_id = s.id left join registers r on r.id = o.register_id";
                        var json = {sql: query, params: [], callback: callback_fun};
                        DbUtil.executeSql(json);
                    }, // end of all
               
                    get_current_outlet : function(callback_fun) {
                        var query = "select * from outlets where is_current = 1";
                        var json = {sql: query, params: [], callback: callback_fun};
                        DbUtil.executeSql(json);
                    }, // end of get_current_outlet
                    get_outlet : function (id, callback_fun) {
                        var stmt = "select * from outlets where id = ?";
                        var json = {sql: stmt, params:[id], callback: callback_fun};
                        DbUtil.executeSql(json);
                    }, // get_outlet
                    update_outlet : function (outlet, callback_fun) {
                        var stmt = "update outlets set name = ?, sales_tax_id = ?, register_id = ? where id = ?";
                        var json = {sql: stmt, params:[outlet.name, outlet.sales_tax_id, outlet.register_id, outlet.id], callback: callback_fun};
                        DbUtil.executeSql(json);
                    }, // end of update_outlet
                    create_outlet : function (outlet, callback_fun) {
                        var stmt = "insert into outlets (name, sales_tax_id, register_id) values (?, ?, ?)";
                        var json = {sql: stmt, params:[outlet.name, outlet.sales_tax_id, outlet.register_id], callback: callback_fun};
                        DbUtil.executeSql(json);
                    }, // end of create_outlet
                    delete_outlet : function(id, _callback) {
                        var stmt = "delete from outlets where id = ?";
                        var json = {sql: stmt, params:[id], callback: _callback};
                        DbUtil.executeSql(json);
                    }, // end of delete_outlet
                    parse_rlts : function (rlts) {
                        var rows = rlts.rows;
                        var ret = [];
                        for (var i = 0; i < rows.length; i++) {
                            var item = rows.item(i);
                            ret.push({id: item.id, name: item.name, sales_tax_id: item.sales_tax_id, register_id: item.register_id, sales_tax: item.sales_tax, register_name: item.register_name});
                        }
                        return ret;
                    } , // end of parse_rlts
                    get_scope : function() {
                        var scope = angular.element(document.querySelector('#outlet_add_edit')).scope();
                        return scope;
                    } // end of get_scope
               };
               
               });