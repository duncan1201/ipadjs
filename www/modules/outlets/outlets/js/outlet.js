app.controller('outletCtrl', function($scope, $rootScope, App_URLs, Outlets, SalesTaxes, Registers, Util) {
               
               $scope.add_click = function(){
                    $rootScope.outlet_id_for_edit = null;
                    $rootScope.ion_content_template = App_URLs.outlet_add_edit;
               };
               
               $scope.edit_click = function(id) {
                    $rootScope.outlet_id_for_edit = id;
                    $rootScope.ion_content_template = App_URLs.outlet_add_edit;
               }; // end of edit_click
               
               $scope.delete_click = function(id){
               
               };// end of delete_click
               
               $scope.outlet_form_submit_click = function(outlet) {
                    var callback = function(tx, rlts) {
                        $rootScope.$apply(function(){
                            $rootScope.ion_content_template = App_URLs.outlet_main_content;
                                 });
                    }; // end of callback
                    if (!angular.isDefined(outlet.id)){
               console.log("create_outlet");
                        Outlets.create_outlet(outlet, callback);
                    } else {
               console.log("update_outlet");
                        Outlets.update_outlet(outlet, callback);
                    }
               };
               
               $scope.cancel_click = function() {
                    $rootScope.ion_content_template = App_URLs.outlet_main_content;
               };
               
               $scope.isDefined = function(val){
                    return angular.isDefined(val);
               };
               
               $rootScope.$on('$includeContentLoaded', function(event, url){
                    if(url == App_URLs.outlet_main_content){
                            var callback_fun = function(tx, results) {
                                $scope.$apply(function(){
                                    $scope.outlets = Outlets.parse_rlts(results);
                                }) ;
                            };
                            Outlets.all(callback_fun);
                    } else if (url == App_URLs.outlet_add_edit){
                        var register_callback = function(tx, rlts){
                            $scope.$apply(function(){
                                          console.log("register_callback...");
                                $scope.registers = Registers.parse_rlts(rlts);
                            });
                            SalesTaxes.all(sales_tax_callback);
                        };
                              
                        var outlet_callback = function(tx, rlts) {
                            $rootScope.outlet_id_for_edit = null;
                            var rows = rlts.rows;
                            if (rows.length > 0){
                                var item = rows.item(0);
                                var ret = Outlets.parse_rlts(rlts)[0];
                                $scope.$apply(function(){
                                    $scope.outlet = ret;
                                });
                              }
                        }; // end of outlet_callback
                              
                              
                        var sales_tax_callback = function(tx, rlts) {
                            $scope.$apply(function(){
                                $scope.sales_taxes = SalesTaxes.parse_rlts(rlts);
                            });
                            
                            if (!Util.is_undefined_or_null($rootScope.outlet_id_for_edit)){
                                Outlets.get_outlet($rootScope.outlet_id_for_edit, outlet_callback);
                            } else {
                                console.log("outlet_id_for_edit is_undefined_or_null");
                            }
                        }; // end of sales_tax_callback
                              
                        Registers.all(register_callback);
                    }
                }); // end of on
               
            });