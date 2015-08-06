app.controller('productCtrl',
               function($rootScope, $scope, Products, Suppliers, Brands, App_URLs){
               
                    var brands_callback =
                        function(tx, results){
                            var brands = Brands.parse_results(results);
                            $scope.$apply(function(){
                                          brands.unshift({id:-1, brand_name: "+add brand", desc: ""});
                                          $scope.brands = brands;
                                          });
                        };
               
                    var suppliers_callback =
                        function(tx, results){
                            var suppliers = Suppliers.parse_suppliers_summary(results);
                            $scope.$apply(function(){
                                          
                                          suppliers.unshift({id:-1, name: "+add supplier", default_markup: 1, desc: ""});
                                          $scope.suppliers = suppliers;
                        });
                    }; // end of suppliers_callback
               
                    if ($rootScope.main_content == App_URLs.product_main_content_url){
                        Products.all_summary_with_default_callback();
                    }
               
                    $rootScope.$on('$includeContentLoaded',
                                   function(event, url){
                                        if(url == App_URLs.product_add_edit_url){
                                            console.log("product_add_edit_url");
                                            Brands.all(brands_callback);
                                            Suppliers.all_summary(suppliers_callback);
                                        }
                                   });
               
                    $scope.add_new_supplier_choose =
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
                        $rootScope.ion_content_template = App_URLs.product_add_edit_url;
                    };
               
                    $scope.product_form_submit_click = function(product) {
                        console.log("product_form_submit_click");
                        $rootScope.ion_content_template = App_URLs.product_main_content_url;
                        Products.create_product(product);
                    };
               
                    $scope.product_form_cancel_click = function() {
                        $rootScope.ion_content_template = App_URLs.product_main_content_url;
                    };
               }); // end of controller

var product = angular.module('product', ['ionic', 'util']);

product.factory('Products',
                function(DbUtil){
                    return {
                        all_summary_with_default_callback: function(){
                            var callback_function =
                                function(tx, results) {
                                    var rows = results.rows;
                                    var ret = [];
                                    for(i = 0; i < rows.length; i++) {
                                        ret.push({
                                            id: rows.item(i).id,
                                            product_name: rows.item(i).product_name,
                                            brand_name: rows.item(i).brand_name,
                                            supplier_name: rows.item(i).supplier_name
                                        });
                                    }
                
                                    var scope = angular.element(document.querySelector('#products_main_content')).scope();
                                    scope.$apply(function(){
                                        scope.products = ret;
                                    });

                                };
                            var selectSql = "select p.id, p.product_name, p.product_handle, p.desc, s.name as supplier_name, b.name as brand_name from products p left join suppliers s on p.supplier_id = s.id left join brands b on p.brand_id = b.id";
                            var json = {
                                sql: selectSql,
                                params:[],
                                callback: callback_function};
                            DbUtil.executeSql(json);
                        }, // end of all_summary_with_default_callback
                        create_product : function (product) {
                            console.log("create_product.product_name=" + product.product_name);
                            console.log("create_product.handle=" + product.product_handle);
                            console.log("create_product.desc=" + product.desc);
                            console.log("create_product.supplier.id=" + product.supplier.id);
                            console.log("create_product.brand.id=" + product.brand.id);
                            var self = this;
                            var callback_function =
                                function(){
                                    self.all_summary_with_default_callback();
                                };
                            var insertSql = "insert into products (product_name, product_handle, desc, brand_id, supplier_id, supply_price, markup) values (?, ?, ?, ?, ?, ?, ?)";
                            var json = {
                                sql: insertSql,
                                params: [product.product_name, product.product_handle, product.desc, product.brand.id, product.supplier.id, product.supply_price, product.markup],
                                callback: callback_function};
                            DbUtil.executeSql(json);
                        } // end of create_product
                    };
                }); // end of product.factory