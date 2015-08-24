var sale = angular.module('sale', ['ionic', 'util', 'salesTax']);

sale.factory('Sales', function(DbUtil, SalesTaxes){
                return {
                    get_current_sale : function() {
                        var stmt = "select * from sales where status = 'current'";
                        var sale_callback = function (tx, results) {
                            var rows = results.rows;
                            if (rows.length > 0){
                                var sale = rows.item(0);
                                var sale_id = sale.id;
             
                                console.log("rows.item(0)=" + angular.toJson(sale));
                                var ret = {id: sale.id, sales_tax_name: sale.sales_tax_name, sales_tax_rate: sale.sales_tax_rate, total_tax: sale.total_tax, total: sale.total};
             
                                var stmt_items = "select * from sale_items where sale_id = ?";
                                var items_callback = function(tx, rlts) {
                                    var rows = rlts.rows;
             
                                    console.log("items_callback.length=" + rows.length);
                                    var sale_items = [];
                                    for ( var i = 0; i < rows.length; i++){
                                        var sale_item = rows.item(i);
                                        sale_items.push({id: sale_item.id, quantity: sale_item.quantity, unit_price: sale_item.unit_price, name: sale_item.name});
                                    }
                                    ret['items'] = sale_items;
                                    var scope = angular.element(document.querySelector('#sell_main_content')).scope();
                                    scope.$apply(function(){
                                        scope.current_sale = ret;
                                    });
                                }; // end of items_callback
                                var json_items = {sql: stmt_items, params:[sale_id], callback: items_callback};
                                DbUtil.executeSql(json_items);
                            } // end if
                        }; // end of sale_callback
                        var json = {sql: stmt, params:[], callback: sale_callback};
                        DbUtil.executeSql(json);
                    }, // get_current_sale
                    create_sale: function (callback_fun) {
             
                        var subquery = "select s.name as sales_tax_name, s.rate as sales_tax_rate, datetime('now') as creation_date from sales_taxes s where s.id in (select sales_tax_id from outlets o where o.is_current = 1)";

                        var stmt = "insert into sales (sales_tax_name, sales_tax_rate, creation_date) " + subquery;
             
                        var json_create = {sql: stmt, params:[], callback: callback_fun};
                        DbUtil.executeSql(json_create);
                    }, // end of create_sale
                    add_sale_item: function (sale_id, key, callback_fun) {
                        // add sale item
                        var stmt = "insert into sale_items (name, quantity, unit_price, sale_id) values (?, 1, 9.9, ?)";
                        var json_insert = {sql: stmt, params:[key.display_name, sale_id]};
             
                        // update total
                        var json_total = this.create_update_total_json(sale_id);
             
                        // update total tax
                        var json_total_tax = this.create_update_total_tax_json(sale_id);
             
                        // sqls execution
                        DbUtil.executeSqls([json_insert, json_total, json_total_tax], callback_fun);
                    }, // end of add_sale_item
                    delete_sale_item: function (sale_id, item_id) {
                        var self = this;
                        // delete sale item
                        var stmt = 'delete from sale_items where id = ?';
                        var json_delete = {sql: stmt, params:[item_id]};
             
                        // update total
                        var json_total = this.create_update_total_json(sale_id);
             
                        // update total tax
                        var json_total_tax = this.create_update_total_tax_json(sale_id);
             
                        var callback_fun = function() {
                            self.get_current_sale();
                        } ; // end of callback_fun
             
                        DbUtil.executeSqls([json_delete, json_total, json_total_tax],
                                           callback_fun);
                    }, // delete_sale_item
                    create_update_total_json: function(sale_id) {
                        var total_query = "select sum(unit_price * quantity) from sale_items where sale_id = " + sale_id;
                        var stmt = "update sales set total = (" + total_query + ") where id = ?";
                        var ret = {sql: stmt, params:[sale_id]};
                        return ret;
                    }, // end create_update_total_json
                    create_update_total_tax_json: function(sale_id) {
                        var tax_rate_query = "(select sales_tax_rate from sales where id = " + sale_id + ")";
                        var total_tax_query = "select sum(unit_price * quantity) * " +tax_rate_query +" from sale_items where sale_id = " + sale_id;
                        var stmt = "update sales set total_tax = (" + total_tax_query + ") where id = ?";
                        var ret = {sql: stmt, params:[sale_id]};
                        return ret;
                    } // create_update_total_tax_json
                } // end of return
             });