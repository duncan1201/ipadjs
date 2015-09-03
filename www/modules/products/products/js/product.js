app.controller('productCtrl',
               function($rootScope, $scope, $ionicModal, $ionicSideMenuDelegate, Products, Tags, ProductTypes, Suppliers, Brands, App_URLs, Util){
                    var self = this;
               
                    var tags_callback = function(tx, results){
                        var rows = results.rows;
                        var tags = [];
                        for(var i = 0; i < rows.length; i++) {
                            var item = rows.item(i);
                            tags.push({id: item.id, name: item.name});
                        }
                        $scope.$apply(function(){
                            tags.unshift({id:-1, name: "+add tag"});
                            $scope.tags = tags;
                        }); // end of apply
               
                    }; // end of tags_callback
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
               
                    var brands_callback = function(tx, results){
                        var brands = Brands.parse_results(results);
                        $scope.$apply(function(){
                            brands.unshift({id:-1, brand_name: "+add brand", desc: ""});
                            $scope.brands = brands;
                        });
                    }; // end of brands_callback
               
                    var suppliers_callback = function(tx, results){
                        var suppliers = Suppliers.parse_suppliers_summary(results);
                        $scope.$apply(function(){
                            suppliers.unshift({id:-1, name: "+add supplier", default_markup: 1, desc: ""});
                            $scope.suppliers = suppliers;
                        });
                    }; // end of suppliers_callback
               
                    if ($rootScope.ion_content_template == App_URLs.product_main_content){
                        Products.all_summary();
                        // initialize the filter
                        if (!angular.isDefined($scope.filter)){
                            $scope.filter = {
                                tag:"",
                                product_type:"",
                                brand:"",
                                supplier:""
                            };
                        } // end of if
                    }
               
                    $rootScope.$on('$includeContentLoaded', function(event, url){
                        if(url == App_URLs.product_add_edit){
                            Brands.all(brands_callback);
                            Suppliers.all_summary(suppliers_callback);
                            ProductTypes.all_summary(product_types_callback);
                            Tags.all(tags_callback);
                                   
                            if (Util.is_undefined_or_null($rootScope.product_id_for_edit)){
                                $scope.product = {supply_price: 0, markup: 0, retail_price: 0, current_stock: 0};
                            } else {
                                Products.get_product($rootScope.product_id_for_edit);
                            }
                        } else if (url == App_URLs.product_main_content) {
                            Brands.all(brands_callback);
                            Suppliers.all_summary(suppliers_callback);
                            ProductTypes.all_summary(product_types_callback);
                            Tags.all(tags_callback);
                            if(!angular.isDefined($scope.tag_to_be_add)){
                                $scope.tag_to_be_add = "";
                            }
                        }
                    }); // end of on
               
                    $scope.brand_change = function(brand_id){
                        if (brand_id == "-1"){ // + new brand
                            $scope.brandModal.show();
                        }
                    };
               
                    $scope.supplier_change = function(){
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
               
                    $scope.tag_remove_click = function(tag){
                        console.log("tag_remove_click...=" + tag);
                        var index = $scope.product.tags.indexOf(tag);
                        if(index > -1){
                            $scope.product.tags.splice(index, 1);
                        }
                    };
               
                    $scope.add_tag_click = function(tag_to_be_add){
                        if (tag_to_be_add != "" && tag_to_be_add != "-1" && $scope.product.tags.indexOf(tag_to_be_add) < 0){
                            $scope.product.tags.push(tag_to_be_add);
                        }
                    }; // end of add_tag_click
               
                    $scope.deactivate_click = function(id) {
                        Products.set_product_active(id, 0);
                    };
               
                    $scope.activate_click = function(id){
                        Products.set_product_active(id, 1);
                    };
               
                    $scope.supply_price_change = function() {
                        calcuate_retail_price();
                    };
               
                    $scope.markup_change = function() {
                        calcuate_retail_price();
                    };
               
                    var calcuate_retail_price = function(){
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
               
                    $scope.product_tag_change = function(){};
               
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
               
                    $scope.toggle_side_menu = function() {
                        $ionicSideMenuDelegate.$getByHandle('main-side-menu').toggleLeft();
                    };
               }); // end of controller

app.filter('productFilter', function(){
    
    return function(products, conditions) {
           var filtered = [];
           angular.forEach(products,
                           function(product){
                                var pass = true;
                           //console.log("conditions.tag=" + conditions.tag);
                           //console.log("conditions.product_type=" + conditions.product_type);
                                if (pass && conditions.tag != ""){
                           if (product.tags.indexOf(conditions.tag) < 0){
                           pass = false;
                           }
                                }
                           
                                if (pass && conditions.product_type != ""){
                                    if (product.product_type != conditions.product_type){
                                        pass = false;
                                    }
                                }
                           
                                if (pass && conditions.brand != ""){
                                    if (product.brand_name != conditions.brand){
                                        pass = false
                                    }
                                }
                           
                                if (pass && conditions.supplier != ""){
                                    if (product.supplier_name != conditions.supplier){
                                        pass = false;
                                    }
                                }
                           
                                if(pass){
                                    filtered.push(product);
                                }
                           });
                    return filtered;
                };
           }); // end of productFilter
