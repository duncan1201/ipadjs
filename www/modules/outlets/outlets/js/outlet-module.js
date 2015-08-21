var outlet = angular.module('outlet', ['ionic', 'util']);

outlet.factory('Outlets', function(DbUtil){
               
               return {
                    all : function (callback_fun) {
                        var query = "select o.*, (s.name || ' ' || s.rate || '%') as sales_tax , r.name as register_name from outlets o left join sales_taxes s on o.sales_tax_id = s.id left join registers r on r.outlet_id = o.id";
                        var json = {sql: query, params: [], callback: callback_fun};
                        DbUtil.executeSql(json);
                    }, // end of all
               
                    get_current_outlet : function(callback_fun) {
                        var query = "select * from outlets where is_current = 1";
                        var json = {sql: query, params: [], callback: callback_fun};
                        DbUtil.executeSql(json);
                    } // end of get_current_outlet
               };
               
               });