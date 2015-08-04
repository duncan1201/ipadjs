app.controller('brandCtrl',
               function($scope, $ionicModal, Brands){
               
                    Brands.all_with_default_callback();
               
                    $ionicModal.fromTemplateUrl('brands-popup.html',
                                                function(modal) {
                                                    $scope.brandModal = modal;
                                                }, {
                                                    scope: $scope
                                                });
               
                    $scope.add_new_brand_click =
                        function () {
                            console.log("add_new_brand_click");
                            $scope.brandModal.show();
                        };
               
                    $scope.brand_popup_cancel_click =
                        function() {
                            $scope.brandModal.hide();
                        };
               
                    $scope.delete_click =
                        function(id) {
                            Brands.delete_brand(id);
                        };
               
                    $scope.brand_name_form_submit_click =
                        function(brand) {
                            if (!angular.isDefined(brand.id)){
                                console.log("brand_name_form_submit_click NOT defined");
                                Brands.create_brand_name(brand);
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
                    all: function(callback_function) {
              
                        var json = {
                            sql: "select * from brands order by name COLLATE NOCASE",
                            params:[],
                            callback: callback_function
                        };
                        DbUtil.executeSql(json);
                    }, // end of all_with_default_callback
                    all_with_default_callback: function() {
                        var self = this;
                        var callback_function =
                            function(tx, results){
                                var ret = self.parse_results(results);
              
                                var scope = angular.element(document.querySelector('#brands_main_content')).scope();
              
                                scope.$apply(function(){
                                                scope.brands = angular.fromJson(ret);
                                            });
                            };
                        self.all(callback_function);
                    }, // end of all_with_default_callback
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
                    create_brand_name : function(brand) {
                        var self = this;
                        var callback_function =
                            function() {
                                brand.brand_name = "";
                                brand.desc = "";
                                self.all_with_default_callback();
                            };
                        var json = {
                                    sql: "insert into brands (name, desc) values (?, ?)",
                                    params:[brand.brand_name, brand.desc],
                                    callback: callback_function};
                        DbUtil.executeSql(json);
                    }, // end of create_brand_name
                    delete_brand: function(id) {
              
                        var self = this;
                        var callback_function =
                            function(tx, results) {
                                self.all_with_default_callback();
                            };
                        var json = {
                            sql: "delete from brands where id = ?",
                            params: [id],
                            callback: callback_function
                        };
                        DbUtil.executeSql(json);
                    }
                }
              }); // end of brand.factory