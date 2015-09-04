app.controller('outletCtrl', function($scope, $rootScope, App_URLs, Outlets, SalesTaxes) {
               
               $scope.edit_click = function(id) {
                    $rootScope.outlet_id_for_edit = id;
                    $rootScope.ion_content_template = App_URLs.outlet_add_edit;
               }; // end of edit_click
               
               $scope.outlet_form_submit_click = function(outlet) {
                    if (outlet.id == ''){
                    } else {
                        var callback = function(tx, rlts) {
               $rootScope.$apply(function(){
                                 $rootScope.ion_content_template = App_URLs.outlet_main_content;
                                 });
               
                        };
                        Outlets.update_outlet(outlet, callback);
                    }
               };
               
               $scope.isDefined = function(val){
                    return angular.isDefined(val);
               };
               
               $rootScope.$on('$includeContentLoaded', function(event, url){
                    if(url == App_URLs.outlet_main_content){
                            var callback_fun = function(tx, results) {
                                var rows = results.rows;
                                var ret = [];
                                for (var i = 0; i < rows.length; i++){
                                   var item = rows.item(i);
                                   console.log(angular.toJson(item));
                                   ret.push({id: item.id, name: item.name, sales_tax: item.sales_tax, register_name: item.register_name});
                                }
                                   console.log("ret.length=" + ret.length);
                                   $scope.$apply(function(){
                                                 $scope.outlets = ret;
                                    }) ;
                                   
                            };
                            Outlets.all(callback_fun);
                    } else if (url == App_URLs.outlet_add_edit){
                              
                        var sales_tax_callback = function(tx, rlts) {
                            var rows = rlts.rows;
                            var ret = [];
                            for (var i = 0; i < rows.length; i++){
                                var item = rows.item(i);
                                ret.push({id: item.id, name: item.name, rate: item.rate});
                            }
                            $scope.$apply(function(){
                                $scope.sales_taxes = ret;
                            });
                              
                            var outlet_callback = function(tx, rlts) {
                                $rootScope.outlet_id_for_edit = null;
                                var rows = rlts.rows;
                                if (rows.length > 0){
                                    var item = rows.item(0);
                                    console.log("outlet_callback=" + angular.toJson(item));
                                    var ret = {id: item.id,
                                        name: item.name,
                                        sales_tax_id: item.sales_tax_id
                                    };
                                    $scope.$apply(function(){
                                        $scope.outlet = ret;
                                    });
                                }
                            }; // end of outlet_callback
                              
                            Outlets.get_outlet($rootScope.outlet_id_for_edit, outlet_callback);
                        };
                        SalesTaxes.all(sales_tax_callback);
                    }
                }); // end of on
               
            });