app.controller('brandCtrl',
               function($scope, $ionicModal, $ionicPopup, $timeout, Brands, Products, Util){
               
                    Brands.all();
               
                    $ionicModal.fromTemplateUrl('modules/products/brands/templates/brands-popup.htm',
                                                function(modal) {
                                                    $scope.brandModal = modal;
                                                }, {
                                                    scope: $scope
                                                });
               
                    $scope.add_new_brand_click = function () {
                        $scope.popup_title = "Create product brand";
                        $scope.brand = {};
                        $scope.brandModal.show();
                    };
               
                    $scope.brand_popup_cancel_click = function() {
                        $scope.brandModal.hide();
                    };
               
                    $scope.edit_click = function(id) {
                        var callback = function(tx, rlts){
                            var rows = rlts.rows;
                            if(rows.length > 0) {
                                var item = rows.item(0);
                                $scope.popup_title = "Edit product brand";
                                $scope.brand = {id:item.id, brand_name:item.name, desc: item.desc};
                                $scope.brandModal.show();
                            }
                        };
                        Brands.get_brand(id, callback);
                    }; // end of edit_click
               
                    $scope.delete_click = function(id) {
                        console.log("delete_click=" + id);
                        var callback = function(tx, rlts){
                            var count = rlts.rows.item(0).count ;
                            console.log("count=" + count);
                            if (count == 0){ // not in use
                                var _title = "Are you sure?";
                                var _templateUrl = "modules/common/templates/delete_confirm.htm";
                                var confirmPopup = $ionicPopup.confirm({title: _title, templateUrl: _templateUrl});
               
                                confirmPopup.then(function(res){
                                    if(res){
                                        Brands.delete_brand(id);
                                    }
                                }); // end of then
                            } else { // in use
                                var _templateUrl = "modules/products/brands/templates/delete_alert.htm";
                                Util.alert({title: "Can not delete", templateUrl: _templateUrl, timeout: 2500});
                            }
                        }; // callback
                        Products.is_brand_in_use(id, callback);
                        //Brands.delete_brand(id);
                    }; // end of delete_click
               
                    $scope.brand_name_form_submit_click = function(brand) {
                        if (!angular.isDefined(brand.id)){
                            Brands.create_brand_name_w_default_callback(brand);
                            $scope.brandModal.hide();
                        } else {
                            Brands.update_brand(brand);
                            $scope.brandModal.hide();
                        }
                    };
               
               }); // end of brandCtrl
var brand = angular.module('brand', ['ionic', 'util']);

brand.factory('Brands',
              function(DbUtil) {
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
                    update_brand: function(brand) {
                        var self = this;
                        var stmt = "update brands set name = ?, desc = ? where id = ?";
                        var callback_fun = function() {
                            self.all();
                        }; // end of callback_fun
                        var json = {sql: stmt, params:[brand.brand_name, brand.desc, brand.id], callback: callback_fun};
                        DbUtil.executeSql(json);
                    }, // end of edit_brand
                    get_brand : function(id, callback_fun){
                        var stmt = "select * from brands where id = ?";
                        var json = {sql: stmt, params:[id], callback: callback_fun};
                        DbUtil.executeSql(json);
                    } // end of get_brand
                }
              }); // end of brand.factory