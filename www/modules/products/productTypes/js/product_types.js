app.controller('productTypeCtrl',
               function($rootScope, $scope, $ionicModal, ProductTypes){
               
                    $ionicModal.fromTemplateUrl('modules/products/productTypes/templates/product-types-popup.htm',
                                                function(modal) {
                                                    $scope.productTypeModal = modal;
                                                }, {
                                                    scope: $scope
                                                });
               
                    ProductTypes.all_summary_with_default_callback();
               
                    $scope.add_new_product_type_click = function(){
                        //console.log("add_new_product_type_click");
                        $scope.productTypeModal.show();
                    };
               
                    $scope.product_type_popup_cancel_click = function() {
                        $scope.productTypeModal.hide();
                    };
               
                    $scope.delete_click = function(id) {
                        ProductTypes.delete_product_type(id);
                    };
               
                    $scope.product_type_form_submit_click = function(product_type) {
                        if (!angular.isDefined(product_type.id)){
                            console.log("product_type_form_submit_click NOT defined");
                            ProductTypes.create_product_type_w_default_callback(product_type);
                            $scope.productTypeModal.hide();
                        } else {
                            console.log("product_type_form_submit_click DEfined");
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
                            delete_product_type : function(id){
                                var self = this;
                                var callback_fun = function (tx, results) {
                                    self.all_summary_with_default_callback();
                                };
                                var json = {sql: "delete from product_types where id = ?", params:[id], callback: callback_fun};
                                DbUtil.executeSql(json);
                            } // end of delete_product_type
                        }
                     });