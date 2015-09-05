var stockControl = angular.module('stockControl', ['ionic', 'util']);

stockControl.factory('StockControl', function(DbUtil){
    return {
        all: function() {
                     var self = this;
            var stmt = "select * from orders";
            var _callback = function(tx, rlts) {
                var rows = rlts.rows;
                     var ret = [];
                for (var i = 0; i < rows.length; i++) {
                     var item = rows.item(i);
                     ret.push({id: item.id, name: item.name});
                }
                var scope = self.get_main_scope();
                scope.$apply(function(){
                    scope.orders = ret;
                });
            };
            var json = {sql: stmt, params:[], callback: _callback};
            DbUtil.executeSql(json);
        }, // end of all
        get_main_scope : function() {
            var ret = angular.element(document.querySelector('#stock_control_main_content')).scope();
            return ret;
        }, // end of get_scope
        create_order : function(order) {
            var stmt = "";
            var _callback = function (tx, rlts) {
            };
            var json = {sql: stmt, params:[], callback: _callback};
            DbUtil.executeSql(json);
        } // end of create_order
    }
});