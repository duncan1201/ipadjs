app.controller('productCtrl',
               function($rootScope, $scope, Products, Suppliers, Brands, App_URLs){
               
                    var self = this;
                    var product_id_for_edit = null;
               
                    var brands_callback =
                        function(tx, results){
                            var brands = Brands.parse_results(results);
                            $scope.$apply(function(){
                                          brands.unshift({id:-1, brand_name: "+add brand", desc: ""});
                                          $scope.brands = brands;
                                          });
                        }; // end of brands_callback
               
                    var suppliers_callback =
                        function(tx, results){
                            var suppliers = Suppliers.parse_suppliers_summary(results);
                            $scope.$apply(function(){
                                          
                                          suppliers.unshift({id:-1, name: "+add supplier", default_markup: 1, desc: ""});
                                          $scope.suppliers = suppliers;
                        });
                    }; // end of suppliers_callback
               
                    if ($rootScope.ion_content_template == App_URLs.product_main_content){
                        Products.all_summary_with_default_callback();
                    }
               
                    $rootScope.$on('$includeContentLoaded',
                                   function(event, url){
                                   console.log("product_id_for_edit=" + self.product_id_for_edit);
                                        if(url == App_URLs.product_add_edit){
                                            console.log("product_add_edit_url");
                                            Brands.all(brands_callback);
                                            Suppliers.all_summary(suppliers_callback);
                                   
                                            if (angular.isDefined(self.product_id_for_edit)){
                                                Products.get_product(self.product_id_for_edit);
                                            }
                                        }
                                   });
               
                    $scope.brand_change = function(product){
               console.log("brand_change=" + angular.toJson(product));
                    };
               
                    $scope.supplier_change =
                        function(){
                            if (!angular.isDefined($scope.product.markup)){
                                $scope.product.markup = $scope.product.supplier.default_markup;
                            }
                        };
               
                    $scope.supply_price_change =
                        function() {
                            calcuate_retail_price();
                        };
               
                    $scope.markup_change =
                        function() {
                            calcuate_retail_price();
                        };
               
                    var calcuate_retail_price =
                        function(){
                            var markup = $scope.product.markup;
                            var supply_price = $scope.product.supply_price;
                            if (angular.isDefined(markup) && angular.isDefined(supply_price)){
                                console.log("calculating retail price...");
                                $scope.product.retail_price = (1 + markup / 100.0) * supply_price;
                            }
                    };
               
                    $scope.add_new_product_click = function() {
                        $rootScope.ion_content_template = App_URLs.product_add_edit;
                    };
               
                    $scope.product_form_submit_click = function(product) {
                        console.log("product_submit_click=" + angular.toJson(product));
                        $rootScope.ion_content_template = App_URLs.product_main_content;
                        if(angular.isDefined(product.id)){
                            Products.update_product(product);
                        }else{
                            Products.create_product(product);
                        }
                    };
               
                    $scope.edit_click = function(id){
                        self.product_id_for_edit = id;
                        $rootScope.ion_content_template = App_URLs.product_add_edit;
                    };
               
                    $scope.product_form_cancel_click = function() {
                        $rootScope.ion_content_template = App_URLs.product_main_content;
                    };
               }); // end of controller

var product = angular.module('product', ['ionic', 'util']);

product.factory('Products',
                function(DbUtil){
                    return {
                        all_summary: function(callback_function){
                
                            var selectSql = "select p.id, p.product_name, p.product_handle, p.desc, date(p.creation_date) as creation_date, s.name as supplier_name, b.name as brand_name from products p left join suppliers s on p.supplier_id = s.id left join brands b on p.brand_id = b.id";
                            var json = {
                                sql: selectSql,
                                params:[],
                                callback: callback_function};
                            DbUtil.executeSql(json);
                        }, // end of all_summary
                        all_summary_with_default_callback: function(){
                            var self = this;
                
                            var callback_function =
                                function(tx, results) {
                                    var rows = results.rows;
                                    var ret = [];
                                    for(i = 0; i < rows.length; i++) {
                                        ret.push({
                                            id: rows.item(i).id,
                                            product_name: rows.item(i).product_name,
                                            creation_date: rows.item(i).creation_date,
                                            brand_name: rows.item(i).brand_name,
                                            supplier_name: rows.item(i).supplier_name
                                        });
                                    }
                
                                    var scope = angular.element(document.querySelector('#products_main_content')).scope();
                                    scope.$apply(function(){
                                        scope.products = ret;
                                    });

                                };
                            self.all_summary(callback_function);
                        }, // end of all_summary_with_default_callback
                        create_product : function (product) {
                            console.log("create_product.product_name=" + product.product_name);
                            console.log("create_product.desc=" + product.desc);
                            //console.log("create_product.supplier.id=" + product.supplier.id);
                            console.log("create_product.brand.id=" + product.brand.id);
                            var self = this;
                            var callback_function =
                                function(){
                                    self.all_summary_with_default_callback();
                                };
                            var insertSql = "insert into products (product_name, product_handle, desc, creation_date, brand_id, supplier_id, supply_price, markup) values (?, ?, ?, datetime('now'), ?, ?, ?, ?)";
                            var json = {
                                sql: insertSql,
                                params: [product.product_name, product.product_handle, product.desc, product.brand.id, product.supplier.id, product.supply_price, product.markup],
                                callback: callback_function};
                            DbUtil.executeSql(json);
                        }, // end of create_product
                        get_product : function(id){
                            var self = this;
                            var callback_fun = function(tx, results){
                                var rows = results.rows;
                                console.log("get_product.json="+angular.toJson(rows.item(0)));
                
                                if(rows.length > 0){
                                    var item = rows.item(0);
                                    var ret = {
                                        id: item.id,
                                        product_name: item.product_name,
                                        product_handle: item.product_handle,
                                        desc: item.desc,
                                        supplier_id: item.supplier_id,
                                        brand_id: item.brand_id
                                    };
                                    self.get_product_supplier(ret);
                
                                }// end of if
                            }; // end of callback_fun
                            var query = "select p.* from products p left join suppliers s on s.id = p.supplier_id left join brands b on b.id = p.brand_id where p.id = ? ";
                            var query_with = "with all_tag_ids as (select tag_id from products_join_tags where product_id = ?) select p.* from products p left join suppliers s on s.id = p.supplier_id left join brands b on b.id = p.brand_id where p.id = ?";
                            var json = {sql: query, params:[id], callback: callback_fun};
                            DbUtil.executeSql(json);
                        }, // end of get_product
                        get_product_supplier: function(product){
                            var self = this;
                            var callback_fun = function(tx, results){
                                var rows = results.rows;
                                if (rows.length > 0){
                                    var item = rows.item(0);
                                    console.log("get_product_supplier="+angular.toJson(item));
                                    product['supplier'] = {id: item.id, name: item.name, default_markup: item.default_markup, desc: item.desc};
                                    var scope = angular.element(document.querySelector('#product_add_edit')).scope();
                                    scope.$apply(function(){
                                        scope.product = product;
                                    });
                                } // end of if
                            }; // end of callback_fun
                            var json = {sql: "select * from suppliers where id = ?", params:[product.supplier_id], callback: callback_fun};
                            DbUtil.executeSql(json);
                        },// end of get_product_supplier
                        update_product: function(product) {
                            console.log("update_product.json=" + angular.toJson(product));
                            var self = this;
                            var callback_fun = function() {
                
                            };
                            var update_sql = "update products set product_name = ?, product_handle = ?, desc = ? where id = ?";
                            var json = {sql: update_sql, params:[product.product_name, product.product_handle, product.desc, product.id], callback: callback_fun};
                            DbUtil.executeSql(json);
                        } // end of update_product
                    };
                }); // end of product.factory