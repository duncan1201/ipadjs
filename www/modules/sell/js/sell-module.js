var sale = angular.module('sale', ['ionic', 'util']);

sale.factory('Sales', function(DbUtil){
                return {
                    create_sale: function (callback_fun) {
                        var stmt = "insert into sales (creation_date) values (datetime('now'))";
                        var json = {sql: stmt, params:[], callback: callback_fun};
                        DbUtil.executeSql(json);
                    }, // end of create_sale
                    add_sale_item: function (sale_id, key, callback_fun) {
                        // add sale item
                        var stmt = "insert into sale_items (name, quantity, unit_price, sale_id) values (?, 1, 9.9, ?)";
                        var json = {sql: stmt, params:[key.display_name, sale_id]};
             
                        // update total
                        var json2 = this.create_update_total_json();
             
                        var jsons = [json, json2];
             
                        // sqls execution
                        DbUtil.executeSqls(jsons, callback_fun);
                    }, // end of add_sale_item
                    delete_sale_item: function (sale_id, item_id) {
                        // delete sale item
                        var stmt = 'delete sale_items where id = ?';
                        var json = {sql: stmt, params:[item_id]};
             
                        //
                        var json2 = create_update_total_json(sale_id);
             
                        DbUtil.executeSqls(jsons, callback_fun);
                    }, // delete_sale_item
                    create_update_total_json: function(sale_id) {
                        var total_query = "select sum(unit_price) from sale_items where sale_id = " + sale_id;
                        var stmt = "update sales set total = (" + total_query + ") where id = ?";
                        var ret = {sql: stmt, params:[sale_id]};
                        return ret;
                    } // end create_update_total_json
                } // end of return
             });