app.controller('brandCtrl',
               function($scope, $ionicModal, Brands){
               
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
               
                    $scope.brand_name_form_submit_click =
                        function(brand) {
                            if (!angular.isDefined(brand.id)){
                                console.log("brand_name_form_submit_click NOT defined");
                                Brands.create_brand_name(brand);
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
                    all: function() {
                        var callback_function =
                            function(tx, results){
              
                            };
                        var json = {
                                        sql: "select * from brands",
                                        params:[],
                                        callback: callback_function
                                    };
                        DbUtil.executeSql(json);
                    }, // end of all
                    create_brand_name : function(brand) {
                        var callback_function = function(tx, result){
                            window.alert("insert into brands success");
                        };
                        var json = {
                                    sql: "insert into brands (name, desc) values (?, ?)",
                                    params:[brand.brand_name, brand.desc],
                                    callback: callback_function};
                        DbUtil.executeSql(json);
                    } // end of create_brand_name
                }
              }); // end of brand.factory