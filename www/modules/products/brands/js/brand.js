app.controller('brandCtrl',
               function($scope, $ionicModal, Brands){
               
                    Brands.all();
               
                    $ionicModal.fromTemplateUrl('modules/products/brands/templates/brands-popup.htm',
                                                function(modal) {
                                                    $scope.brandModal = modal;
                                                }, {
                                                    scope: $scope
                                                });
               
                    $scope.add_new_brand_click = function () {
                        $scope.brand = {};
                        $scope.brandModal.show();
                    };
               
                    $scope.brand_popup_cancel_click = function() {
                        $scope.brandModal.hide();
                    };
               
                    $scope.edit_click = function(id) {
               
                    };
               
                    $scope.delete_click = function(id) {
                        Brands.delete_brand(id);
                    };
               
                    $scope.brand_name_form_submit_click =
                        function(brand) {
                            if (!angular.isDefined(brand.id)){
                                console.log("brand_name_form_submit_click NOT defined");
                                Brands.create_brand_name_w_default_callback(brand);
                                $scope.brandModal.hide();
                            } else {
                                console.log("brand_name_form_submit_click DEfined");
                                //Brands.create_brand_name(brand);
                            }
                        };
               
               }); // end of brandCtrl
var brand = angular.module('brand', ['ionic', 'util']);

brand.factory('Brands',
              function(DbUtil){
                return {
                    all: function(_callback) {
                        var self = this;
                        var callback_fun = null;
                        if(angular.isDefined(_callback)){
                            callback_fun = _callback
                        } else {
                            callback_fun = function(tx, results){
                                var ret = self.parse_results(results);
              
                                var scope = angular.element(document.querySelector('#brands_main_content')).scope();
              
                                scope.$apply(function(){
                                    scope.brands = angular.fromJson(ret);
                                });
                            }; // end of callback_fun
                        } // end of else
                        var json = {
                            sql: "select * from brands order by name COLLATE NOCASE",
                            params:[],
                            callback: callback_fun
                        };
                        DbUtil.executeSql(json);
                    }, // end of all
                    parse_results : function(results){
                        var ret = [];
                        for(i = 0; i < results.rows.length; i++){
                            ret.push({
                                    id: results.rows.item(i).id,
                                    brand_name: results.rows.item(i).name,
                                    desc: results.rows.item(i).desc
                                     });
                        }
                        return ret;
                    }, // end of parse_results
                    create_brand_name : function(brand, callback_function) {
                        var json = {
                                    sql: "insert into brands (name, desc) values (?, ?)",
                                    params:[brand.brand_name, brand.desc],
                                    callback: callback_function};
                        DbUtil.executeSql(json);
                    }, // end of create_brand_name
                    create_brand_name_w_default_callback : function (brand){
                        var self = this;
                        var callback_function = function() {
                            brand.brand_name = "";
                            brand.desc = "";
                            self.all();
                        };
                        var json = {
                            sql: "insert into brands (name, desc) values (?, ?)",
                            params:[brand.brand_name, brand.desc],
                            callback: callback_function};
                        DbUtil.executeSql(json);
                    }, // create_brand_name_w_default_callback
                    delete_brand: function(id) {
              
                        var self = this;
                        var callback_function =
                            function(tx, results) {
                                self.all();
                            };
                        var json = {
                            sql: "delete from brands where id = ?",
                            params: [id],
                            callback: callback_function
                        };
                        DbUtil.executeSql(json);
                    }, // end of delete_brand
                    edit_brand: function(brand) {
                        var stmt = "update brands set name = ?, desc = ? where id = ?";
                        var callback_fun = function() {
              
                        }; // end of callback_fun
                        var json = {sql: stmt, params:[brand.name, brand.desc, brand.id], callback: callback_fun};
                        DbUtil.executeSql(json);
                    } // end of edit_brand
                }
              }); // end of brand.factory