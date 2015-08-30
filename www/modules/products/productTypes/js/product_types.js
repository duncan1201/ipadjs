app.controller('productTypeCtrl',
               function($rootScope, $scope, $ionicModal, $ionicPopup, ProductTypes, Products, Util){
               
                    $ionicModal.fromTemplateUrl('modules/products/productTypes/templates/product-types-popup.htm',
                                                function(modal) {
                                                    $scope.productTypeModal = modal;
                                                }, {
                                                    scope: $scope
                                                });
               
                    ProductTypes.all_summary_with_default_callback();
               
                    $scope.add_new_product_type_click = function(){
                        $scope.popup_title = "Create product type"
                        $scope.productTypeModal.show();
                    };
               
                    $scope.product_type_popup_cancel_click = function() {
                        $scope.productTypeModal.hide();
                    };
               
                    $scope.edit_click = function(id) {
                        var callback = function(tx, rlts) {
                            var rows = rlts.rows;
                            if (rows.length > 0) {
                                var item = rows.item(0);
                                $scope.popup_title = "Edit product type";
                                $scope.product_type = {id: item.id, name: item.name, desc: item.desc};
                                $scope.productTypeModal.show();
                            }
                        }; // callback
                        ProductTypes.get_product_type(id, callback);
                    }; // end edit_click
               
                    $scope.delete_click = function(id) {
                        var callback = function(tx, rlts){
                            var count = rlts.rows.item(0).count;
                            if (count == 0){
                                var _title = "Are you sure?";
                                var _templateUrl = "modules/common/templates/delete_confirm.htm";
                                var confirmPopup = $ionicPopup.confirm({title: _title, templateUrl: _templateUrl});
               
                                confirmPopup.then(function(res){
                                    if(res){
                                        ProductTypes.delete_product_type(id);
                                    }
                                }); // end of then
                            } else {
                                var _templateUrl = "modules/products/productTypes/templates/delete_alert.htm";
                                Util.alert({title:"Cannot delete", templateUrl: _templateUrl, timeout:2500});
                            }
                        };
                        Products.is_type_in_use(id, callback);
                    };
               
                    $scope.product_type_form_submit_click = function(product_type) {
                        if (!angular.isDefined(product_type.id)){
                            console.log("product_type_form_submit_click NOT defined");
                            ProductTypes.create_product_type_w_default_callback(product_type);
                            $scope.productTypeModal.hide();
                        } else {
                            var callback = function(tx, rlts){
                                product_type.name = "";
                                product_type.desc = "";
                                ProductTypes.all_summary_with_default_callback();
                                $scope.productTypeModal.hide();
                            };
                            ProductTypes.update_product_type(product_type, callback);
                        }
                    };
               });

var productType = angular.module('productType', ['ionic', 'util']);

productType.factory('ProductTypes',
                    function(DbUtil) {
                        return {
                            all_summary : function(callback_fun) {
                                var query = "select * from product_types ";
                                var json = {sql: query, params:[], callback: callback_fun};
                                DbUtil.executeSql(json);
                            }, // end of all_summary
                            all_summary_with_default_callback : function() {
                                var self = this;
                                var callback_fun = function(tx, results){
                                    var rows = results.rows;
                                    console.log("all_summary_with_default_callback=" + rows.length);
                                    var ret = [];
                                    for (var i = 0; i < rows.length; i++){
                                        var item = rows.item(i);
                                        ret.push({id:item.id, name: item.name, desc: item.desc});
                                    }
                                    var scope = angular.element(document.querySelector('#product_types_main_content')).scope();
                    
                                    scope.$apply(function(){
                                        scope.product_types = ret;
                                    });
                                }; // end of callback_fun
                                self.all_summary(callback_fun);
                            }, // end of all_summary
                            create_product_type: function(product_type, callback_fun) {
                                var query = "insert into product_types (name, desc) values (?, ?)";
                                var json = {sql: query, params:[product_type.name, product_type.desc], callback: callback_fun};
                                DbUtil.executeSql(json);
                            }, // end of create_product_type
                            create_product_type_w_default_callback: function(product_type) {
                                var self = this;
                                //console.log("create_product_type");
                                var callback_fun = function(tx, results){
                                    product_type.name = "";
                                    product_type.desc = "";
                                    self.all_summary_with_default_callback();
                                };
                                self.create_product_type(product_type, callback_fun);
                            }, // create_product_type_w_default_callback
                            update_product_type : function(product_type, external_callback) {
                                var stmt = "update product_types set name = ?, desc = ? where id = ?";
                                var _callback = external_callback;
                                var json = {sql: stmt, params:[product_type.name, product_type.desc, product_type.id], callback: _callback};
                                DbUtil.executeSql(json);
                            }, // end of update_product_type
                            delete_product_type : function(id){
                                var self = this;
                                var callback_fun = function (tx, results) {
                                    self.all_summary_with_default_callback();
                                };
                                var json = {sql: "delete from product_types where id = ?", params:[id], callback: callback_fun};
                                DbUtil.executeSql(json);
                            }, // end of delete_product_type
                            get_product_type : function(id, external_callback) {
                                var stmt = "select * from product_types where id = ?";
                                var _callback = external_callback;
                                var json = {sql: stmt, params:[id], callback: _callback};
                                DbUtil.executeSql(json);
                            } // end of get_product_type
                        }
                     });