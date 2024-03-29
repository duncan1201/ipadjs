
var product = angular.module('product', ['ionic', 'util']);

product.factory('Products',
                function(DbUtil){
                    return {
                        all_summary: function(_callback){
                
                            var stmt = "select p.* , date(p.creation_date) as creation_date, pt.name as product_type_name ,  s.name as supplier_name, b.name as brand_name from products p left join suppliers s on p.supplier_id = s.id left join brands b on p.brand_id = b.id left join product_types pt on pt.id = p.product_type_id";
                
                            var callback_fun = null;
                            if (angular.isDefined(_callback)){
                                callback_fun = _callback;
                            } else {
                                callback_fun = function(tx, results) {
                                    var rows = results.rows;
                                    var ret = [];
                                    for(var i = 0; i < rows.length; i++) {
                                        var item = rows.item(i);
                                        ret.push({
                                            id: item.id,
                                            product_name: item.product_name,
                                            creation_date: item.creation_date,
                                            active: item.active,
                                            tags: item.tags_string == null? []: item.tags_string.split(",").sort(),
                                            product_type: item.product_type_name,
                                            brand_name: item.brand_name,
                                            supplier_id: item.supplier_id,
                                            supplier_name: item.supplier_name,
                                            retail_price_excluding_tax: item.retail_price_excluding_tax,
                                            retail_price_including_tax: item.retail_price_including_tax,
                                            current_stock: item.current_stock
                                        });
                                    } // end of for
                
                                    var scope = angular.element(document.querySelector('#products_main_content')).scope();
                                    scope.$apply(function(){
                                        scope.products = ret;
                                    });
                                }; // end of callback_function
                            } // else
                        var json = { sql: stmt, params:[], callback: callback_fun};
                        DbUtil.executeSql(json);
                    }, // end of all_summary
                    create_product : function (product) {
                        console.log("create_product.product_name=" + product.product_name);
                        console.log("create_product.desc=" + product.desc);
                        var self = this;
                        var callback_function = function(){
                            self.all_summary();
                        };
                        var insertSql = "insert into products (product_name, product_handle, desc, creation_date, product_type_id, brand_id, supplier_id, supply_price, markup, retail_price_excluding_tax, retail_price_including_tax, stock_keeping_unit, current_stock, reorder_point, reorder_amount) values (?, ?, ?, datetime('now'), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
                        var json = {
                            sql: insertSql,
                            params: [product.product_name, product.product_handle, product.desc, product.product_type_id, product.brand_id, product.supplier_id, product.supply_price, product.markup, product.retail_price_excluding_tax, product.retail_price_including_tax, product.stock_keeping_unit, product.current_stock == null? 0: product.current_stock, product.reorder_point, product.reorder_amount],
                            callback: callback_function};
                        DbUtil.executeSql(json);
                    }, // end of create_product
                    get_product : function(id) {
                        var self = this;
                        var callback_fun = function(tx, results){
                            var rows = results.rows;
                            if(rows.length > 0){
                                console.log("get_product.json="+angular.toJson(rows.item(0)));
                                var item = rows.item(0);
                                //item.tags_string;
                                var ret = {
                                    id: item.id,
                                    product_name: item.product_name,
                                    product_handle: item.product_handle,
                                    desc: item.desc,
                                    active: item.active,
                                    tags:item.tags_string == null? []: item.tags_string.split(","),
                                    product_type_id: item.product_type_id,
                                    brand_id: item.brand_id,
                                    supplier_id: item.supplier_id,
                                    supply_price: item.supply_price,
                                    markup: item.markup,
                                    retail_price_excluding_tax: item.retail_price_excluding_tax,
                                    sales_tax_id: item.sales_tax_id,
                                    retail_price_including_tax: item.retail_price_including_tax,
                                    stock_keeping_unit: item.stock_keeping_unit,
                                    current_stock: item.current_stock,
                                    reorder_point: item.reorder_point,
                                    reorder_amount: item.reorder_amount
                                };
                                //console.log("ret.json="+angular.toJson(ret));
                                var scope = angular.element(document.querySelector('#product_add_edit')).scope();
                                scope.$apply(function(){
                                    scope.product = ret;
                                });
                            }// end of if
                        }; // end of callback_fun
                        var query = "select p.* from products p left join suppliers s on s.id = p.supplier_id left join brands b on b.id = p.brand_id where p.id = ? ";
                        var json = {sql: query, params:[id], callback: callback_fun};
                        DbUtil.executeSql(json);
                    }, // end of get_product
                    update_product: function(product) {
                        console.log("update_product.json=" + angular.toJson(product));
                        var self = this;
                        var callback_fun = function() {
                
                        }; // end of callback_fun
                        var update_sql = "update products set product_name = ?, product_handle = ?, desc = ?, tags_string = ?, product_type_id = ?, brand_id = ?, supplier_id = ?, supply_price = ?, markup = ?, retail_price_excluding_tax = ?, sales_tax_id = ?, retail_price_including_tax = ?, stock_keeping_unit = ?, current_stock = ?, reorder_point = ?, reorder_amount = ? where id = ?";
                        var json = {
                            sql: update_sql,
                            params:[product.product_name, product.product_handle, product.desc,product.tags.join(","), product.product_type_id, product.brand_id, product.supplier_id, product.supply_price, product.markup, product.retail_price_excluding_tax, product.sales_tax_id, product.retail_price_including_tax, product.stock_keeping_unit, product.current_stock, product.reorder_point, product.reorder_amount,product.id],
                            callback: callback_fun
                        };
                        DbUtil.executeSql(json);
                    }, // end of update_product,
                    set_product_active: function(id, active){ // activate: 0 or 1
                        var self = this;
                        var _callback = function (tx, results) {
                            self.all_summary();
                        };
                        var updateSql = "update products set active = ? where id = ?";
                        var json = {sql: updateSql, params:[active, id], callback: _callback};
                        DbUtil.executeSql(json);
                    }, // end of deactivate_product
                    is_brand_in_use : function(brand_id, _callback){
                        var stmt = "select count(*) as count from products where brand_id = ?";
                        var json = {sql: stmt, params: [brand_id], callback: _callback};
                        DbUtil.executeSql(json);
                    }, // end of is_brand_in_use
                    is_supplier_in_use : function(supplier_id, _callback) {
                        var stmt = "select count(*) as count from products where supplier_id = ?";
                        var json = {sql: stmt, params:[supplier_id], callback: _callback};
                        DbUtil.executeSql(json);
                    }, // end of is_supplier_in_use
                    is_type_in_use : function(type_id, _callback) {
                        var stmt = "select count(*) as count from products where product_type_id = ?";
                        var json = {sql: stmt, params:[type_id], callback: _callback};
                        DbUtil.executeSql(json);
                    }, // end of is_type_in_use
                    // [{product_id:, quantity}]
                    update_products_quantity : function(p_qtys) {
                        var jsons = [];
                        for(var i = 0; i < p_qtys.length; i++){
                            var p_qty = p_qtys[i];
                            var stmt = "update products set current_stock = current_stock - ? where id = ?";
                
                            var json = {sql: stmt, params:[p_qty.quantity, p_qty.product_id]};
                            jsons.push(json);
                        }
                        DbUtil.executeSqls(jsons);
                    } // update_products_quantity
                };
            }); // end of product.factory