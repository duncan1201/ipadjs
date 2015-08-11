app.controller('productCtrl',
               function($rootScope, $scope, $ionicModal, Products, ProductTypes, Suppliers, Brands, App_URLs){
                    var self = this;
                    var product_types_callback = function(tx, results){
                        console.log("product_types_callback.length=" + results.rows.length);
                        var rows = results.rows;
                        var product_types = [];
                        for(var i = 0; i < rows.length; i++){
                            var item = rows.item(i);
                            product_types.push({id: item.id, name: item.name});
                        }
                        $scope.$apply(function(){
                            product_types.unshift({id:-1, name: "+add product type"});
                            $scope.product_types = product_types;
                        }); // end of apply
                    }; // end of product_types_callback
               
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
                                        if(url == App_URLs.product_add_edit){
                                            console.log("product_add_edit=" + $rootScope.product_id_for_edit);
                                            Brands.all(brands_callback);
                                            Suppliers.all_summary(suppliers_callback);
                                            ProductTypes.all_summary(product_types_callback);
                                   
                                            if (angular.isDefined($rootScope.product_id_for_edit)){
                                                Products.get_product($rootScope.product_id_for_edit);
                                            }
                                        }
                                   });
               
                    $scope.brand_change = function(brand_id){
                        console.log("brand_change=" + angular.toJson(brand_id));
                        if (brand_id == "-1"){ // + new brand
                            $scope.brandModal.show();
                        }
                    };
               
                    $scope.supplier_change =
                        function(){
                            if (!angular.isDefined($scope.product.markup)){
                                var callback_fun = function(tx, results){
                                    var rows = results.rows;
                                    if(rows.length > 0){
                                        var scope = angular.element(document.querySelector('#product_add_edit')).scope();
                                        scope.product.markup = rows.item(0).default_markup;
                                    }
                                };
                                Suppliers.get_supplier(1, callback_fun);
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
                        $rootScope.product_id_for_edit = null;
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
                        $rootScope.product_id_for_edit = id;
                        $rootScope.ion_content_template = App_URLs.product_add_edit;
                    };
               
                    $scope.product_form_cancel_click = function() {
                        $rootScope.product_id_for_edit = null;
                        $rootScope.ion_content_template = App_URLs.product_main_content;
                    };
               
                    $scope.isDefined = function(x) {
                        return angular.isDefined(x);
                    };
               
                    // start of brands dialog
                    $ionicModal.fromTemplateUrl('modules/products/brands/templates/brands-popup.htm',
                                                function(modal) {
                                                    $scope.brandModal = modal;
                                                }, {
                                                    scope: $scope
                                                });
               
                    $scope.brand_popup_cancel_click = function(){
                        $scope.brandModal.hide();
                    };
               
                    $scope.brand_name_form_submit_click = function(brand) {
                        var callback_function = function (tx, results) {
                            $scope.product.brand_id = results.insertId;
                            Brands.all(brands_callback);
                        };
                        Brands.create_brand_name(brand, callback_function);
                        $scope.brandModal.hide();
                    };
                    // end of brands dialog
               
                    // start of product type dialog
                    $scope.product_type_change = function(product_type_id) {
                        if (product_type_id == "-1"){
                            $scope.productTypeModal.show();
                        }
                    };
               
                    $ionicModal.fromTemplateUrl('modules/products/productTypes/templates/product-types-popup.htm',
                                                function(modal) {
                                                    $scope.productTypeModal = modal;
                                                }, {
                                                    scope: $scope
                                                });
               
                    $scope.product_type_popup_cancel_click = function () {
                        $scope.productTypeModal.hide();
                    };
               
                    $scope.product_type_form_submit_click = function (product_type) {
                        var callback_fun = function (tx, results) {
                            $scope.product.product_type_id = results.insertId;
                            ProductTypes.all_summary(product_types_callback);
                        };
                        ProductTypes.create_product_type(product_type, callback_fun);
                        $scope.productTypeModal.hide();
                    };
                    // end of product type dialog
               
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
                            var self = this;
                            var callback_function =
                                function(){
                                    self.all_summary_with_default_callback();
                                };
                            var insertSql = "insert into products (product_name, product_handle, desc, creation_date, product_type_id, brand_id, supplier_id, supply_price, markup, stock_keeping_unit, current_stock, reorder_point, reorder_amount) values (?, ?, ?, datetime('now'), ?, ?, ?, ?, ?, ?, ?, ?)";
                            var json = {
                                sql: insertSql,
                                params: [product.product_name, product.product_handle, product.desc, product.product_type_id, product.brand_id, product.supplier_id, product.supply_price, product.markup, product.stock_keeping_unit, product.current_stock, product.reorder_point, product.reorder_amount],
                                callback: callback_function};
                            DbUtil.executeSql(json);
                        }, // end of create_product
                        get_product : function(id){
                            var self = this;
                            var callback_fun = function(tx, results){
                                var rows = results.rows;
                                if(rows.length > 0){
                                    console.log("get_product.json="+angular.toJson(rows.item(0)));
                                    var item = rows.item(0);
                                    var ret = {
                                        id: item.id,
                                        product_name: item.product_name,
                                        product_handle: item.product_handle,
                                        desc: item.desc,
                                        product_type_id: item.product_type_id,
                                        brand_id: item.brand_id,
                                        supplier_id: item.supplier_id,
                                        supply_price: item.supply_price,
                                        markup: item.markup,
                                        stock_keeping_unit: item.stock_keeping_unit,
                                        current_stock: item.current_stock,
                                        reorder_point: item.reorder_point,
                                        reorder_amount: item.reorder_amount
                                    };
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
                
                            };
                            var update_sql = "update products set product_name = ?, product_handle = ?, desc = ?, product_type_id = ?, brand_id = ?, supplier_id = ?, supply_price = ?, markup = ?, stock_keeping_unit = ?, current_stock = ?, reorder_point = ?, reorder_amount = ? where id = ?";
                            var json = {
                                    sql: update_sql,
                                    params:[product.product_name, product.product_handle, product.desc, product.product_type_id, product.brand_id, product.supplier_id, product.supply_price, product.markup, product.stock_keeping_unit, product.current_stock, product.reorder_point, product.reorder_amount,product.id],
                                    callback: callback_fun
                            };
                            DbUtil.executeSql(json);
                        } // end of update_product
                    };
                }); // end of product.factory