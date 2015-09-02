app.controller('sellCtrl', function($scope, $rootScope, $ionicSideMenuDelegate, $ionicPopover, $ionicPopup,App_URLs, Layouts, Sales) {
               
              
               // start of init method
               if (!angular.isDefined($scope.current_sale)) {
                    $scope.current_sale = {id: "", items: [], total: 0};
               }
               
               if (!angular.isDefined($scope.current_tab)) {
                    $scope.current_tab = 'current sale';
               }
               // end of init method
               
               // prepare the quantity_popover
               $ionicPopover.fromTemplateUrl('modules/sell/templates/quantity_po.htm',
                                            {
                                                scope: $scope
                                            }).then(function(popover) {
                                                     $scope.quantity_popover = popover;
                                            });
               
               $scope.sale_item_quantity_click = function ($event, sale_id, sale_item) {
                    console.log("sale_item_quantity_click=" + sale_id);
                    $scope.quantity_popover.scope.sale_item = sale_item;
                    $scope.quantity_popover.show($event);
               }; // end of sale_item_quantity_click
               
               $scope.sale_item_delete_click = function (sale_id, sale_item_id) {
                    Sales.delete_sale_item(sale_id, sale_item_id);
               }; // end of sale_item_delete_click
               
               $scope.toggle_side_menu = function () {
                    console.log("toggle_side_menu");
                    $ionicSideMenuDelegate.toggleLeft(false);
               };
               
               $scope.group_text_click = function(group) {
                    $scope.layout.active_group_id = group.id;
                    for (var i = 0; i < $scope.layout.groups.length; i++){
                        if ($scope.layout.groups[i].id == group.id){
                            $scope.layout.active_group = $scope.layout.groups[i];
                        }
                    }
               }; // end of group_text_click
               
               $scope.key_click = function(key){
                    console.log("key click..." + angular.toJson(key));
               
                    if ($scope.current_sale.id == ''){
                        var callback_fun = function(tx, results) {
                            $scope.current_sale.id = results.insertId;
                            Sales.add_sale_item($scope.current_sale.id, key, function(tx, rlts){
                                Sales.get_current_sale();
                            });
                        }; // end of callback_fun
               
                        Sales.create_sale(callback_fun);
                    } // end if
                    else {
                        Sales.add_sale_item($scope.current_sale.id, key, function(tx, rlts){
                            Sales.get_current_sale();
                        });
                    } // end of else
               }; // end of key_click
               
               $rootScope.$on('$includeContentLoaded', function(event, url){
                    if(url == App_URLs.sell_main_content){
                        
                        var scope = angular.element(document.querySelector('#sell_main_content')).scope();
                              
                        // callback for get_current_layout
                        var layout_callback = function(tx, results) {
                            var rows = results.rows;
                            
                            if (rows.length > 0) {
                                var item = rows.item(0);
                                var last_callback = function() {
                              
                                    var self = this;

                                    console.log("scope == null ?" + (scope == null));
                                    scope.$apply(function(){
                                           scope.layout = self.layout_obj;
                                    });
                                }
                                console.log("before get_layout_group_keys_for_edit...");
                                Layouts.get_layout_for_edit(item.id, last_callback);
                            }
                        }; // end of layout_callback
                        
                        Layouts.get_current_layout(layout_callback);
                              
                        //
                        var parked_sale_callback = function(tx, rlts) {
                            var rows = rlts.rows();
                            
                            console.log("get_parked_sales: rows.length=" + rows.length);
                        }; // end of parked_sale_callback
                        Sales.get_parked_sales(parked_sale_callback);
                    }
                }); // end of on
               
               $scope.hide_quantity_popover = function () {
                    $scope.quantity_popover.hide();
               } // end of hide_quantity_popover
               
               $scope.isDefined = function(e) {
                    return angular.isDefined(e);
               };
               
               $scope.tab_click = function(tab_name){
               
                    if (tab_name == 'current sale'){
                        angular.element(document.querySelector('#current_sale_tab')).addClass('selected');
                        angular.element(document.querySelector('#retrieve_sale_tab')).removeClass('selected');
                    } else {
                        angular.element(document.querySelector('#current_sale_tab')).removeClass('selected');
                        angular.element(document.querySelector('#retrieve_sale_tab')).addClass('selected');
                    }
                    $scope.current_tab = tab_name;
               }; // end of tab_click
               
               $scope.is_current_sale_tab_shown = function() {
                    return $scope.current_tab == 'current sale';
               }
               
               $scope.is_retrieve_sale_tab_shown = function() {
                    return $scope.current_tab == 'retrieve sale';
               }
               
               $scope.park_click = function(sale_id) {
                    var callback = function(tx, rlts) {
                        Sales.get_current_sale();
                        Sales.get_parked_sales();
                    }; // end of callback
                    Sales.update_sale_status(sale_id, 'parked', callback);
               } ; // end of park_click
               
               $scope.void_click = function(sale_id){
                    console.log("void click=" + sale_id);
               
                    var _title = "Are you sure?";
                    var _templateUrl = "modules/sell/templates/void_sale_confirm.htm";
                    var confirmPopup = $ionicPopup.confirm({
                                                      title: _title,
                                                      templateUrl: _templateUrl,
                                                      });
                    confirmPopup.then(function(res) {
                        if(res) {
                            console.log('You are sure');
                            Sales.update_sale_status(sale_id, 'void');
                        } else {
                            console.log('You are not sure');
                        }
                    }); // end of then
               
               }; // end of void_click
               
               $scope.open_sale_click = function (sale_id) {
                    var self = this;
                    var callback = function(tx, rlts){
                        var count = rlts.rows.length;
                        if(count == 0){
                            console.log("open sale click.count == 0");
                            self.tab_click('current sale');
                            Sales.update_sale_status(sale_id, 'current');
                        } else {
                            var park_tap = function(e){
                                console.log("park tapped haha=");
                            }; // end of park_tap
               
                            var _title = "Loading a Saved Sale";
                            var _templateUrl = "modules/sell/templates/open_sale_confirm.htm";
                            var confirmPopup = $ionicPopup.confirm({
                                                      title: _title,
                                                      templateUrl: _templateUrl,
                                                      buttons:[
                                                               {text: 'Cancel'},
                                                               {
                                                                    text: 'Void',
                                                                    onTap: function(e){console.log('void tap===')}
                                                               },
                                                               {
                                                                    text: 'Park',
                                                                    type: 'button-positive',
                                                                    onTap: function(e){}
                                                               }]
                                                      });

                        } // end of else
                    }; // end of callback
               
                    Sales.get_current_sale(callback);
                    console.log("open_sale_click=" + sale_id);
                }; // end of open_sale_click
               
               $scope.pay_click = function() {
                    var callback = function(tx, rlts){
               
                    };//end of callback
               
                    Sales.update_sale_status(sale_id, "paid", callback);
               }; // end of pay_click
               
}); // sellCtrl

app.controller('itemQuantiyCtrl', function($scope, Sales){
               $scope.done_click = function(sale_item){
                    console.log("done click..." + angular.toJson(sale_item));
                    var callback = function (tx, rlts) {
                        console.log("itemQuantityCtrl.callback...");
                        Sales.get_current_sale();
                        $scope.$parent.hide_quantity_popover();
                    } ; // end of callback_fun
               
                    Sales.update_item_quantity(sale_item.sale_id, sale_item.id, sale_item.quantity, callback);
               } // end of done_click
}); // itemQuantiyCtrl