app.controller('sellCtrl', function($scope, $rootScope, $ionicSideMenuDelegate, $ionicPopover, $ionicPopup, App_URLs, Layouts, Products, Sales, Generals, Util) {
               
              
               // start of init method
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
                    Sales.delete_sale_item(sale_id, this.is_price_include_tax(), sale_item_id);
               }; // end of sale_item_delete_click
               
               $scope.toggle_side_menu = function () {
                    console.log("toggle click=" + angular.toJson($ionicSideMenuDelegate));
                    $ionicSideMenuDelegate.toggleLeft();
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
                    var self = this;
                    if ($scope.current_sale.id == ''){
                        var callback_fun = function(tx, results) {
                            $scope.current_sale.id = results.insertId;
                            Sales.add_sale_item($scope.current_sale.id, self.is_price_include_tax(), key, function(tx, rlts){
                                Sales.get_current_sale();
                            });
                        }; // end of callback_fun
               
                        Sales.create_sale(callback_fun);
                    } // end if
                    else {
                        Sales.add_sale_item($scope.current_sale.id, self.is_price_include_tax(), key, function(tx, rlts){
                            Sales.get_current_sale();
                        });
                    } // end of else
               }; // end of key_click
               
               $scope.is_price_include_tax = function(){
                    if (angular.isDefined($scope.store_settings)){
                        return $scope.store_settings['display_prices'].id == 'TAX INCLUSIVE';
                    } else {
                        return false;
                    }
               };
               
               $rootScope.$on('$includeContentLoaded', function(event, url){
                    if(url == App_URLs.sell_main_content){
                              
                        // callback for get_current_layout
                        var layout_callback = function(tx, results) {
                            var rows = results.rows;
                            
                            if (rows.length > 0) {
                                var item = rows.item(0);
                                var last_callback = function() {
                              
                                    var self = this;

                                    $scope.$apply(function(){
                                           $scope.layout = self.layout_obj;
                                    });
                                }
                                console.log("before get_layout_group_keys_for_edit...");
                                Layouts.get_layout_for_edit(item.id, last_callback);
                            }
                        }; // end of layout_callback
                        
                        // generals_callback
                        var store_settings_callback = function(tx, rlts) {
                            var store_settings = Generals.parse_store_settings(rlts);
                            $scope.store_settings = store_settings;
                        }; // end of generals_callback
                              
                        Layouts.get_current_layout(layout_callback);
                              
                        // get current sale
                        Sales.get_current_sale();
                              
                        Generals.get_store_settings(store_settings_callback);
                              
                        // parked sale callback
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
                    Sales.switch_tab(tab_name, false);
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
                            var c = function(){
                                Sales.get_current_sale();
                                Sales.get_parked_sales();
                            };
                            Sales.update_sale_status(sale_id, 'current', c);
                            //Sales.get_parked_sales();
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
                                        onTap: function(e){
                                            Sales.close_current_sale_and_open_parked_sale(sale_id, 'void');
                                        }
                                    },
                                    {
                                        text: 'Park',
                                        type: 'button-positive',
                                        onTap: function(e){
                                            Sales.close_current_sale_and_open_parked_sale(sale_id,'parked');
                                        }
                                    }]
                            });

                        } // end of else
                    }; // end of callback
               
                    Sales.get_current_sale(callback);
                    console.log("open_sale_click=" + sale_id);
                }; // end of open_sale_click
               
               $scope.get_text_style = function(group_count){
                    var total = 499;
                    var ret = Math.floor(total / group_count - 1);
                    console.log("get_text_style=" + ret);
                    return {'width': ret + 'px','box-sizing':'border-box'};
               };
               
               $scope.pay_click = function(sale_id) {
                    var callback = function() {
                        Sales.get_current_sale();
                        Sales.get_parked_sales();
                    };
                    Sales.update_sale_status(sale_id, "paid", callback); // paid
               
                    var get_sale_items_callback = function(tx, rlts){
                        var rows = rlts.rows;
                        var ret = [];
                        for(var i = 0; i < rows.length; i++){
                            var item = rows.item(i);
                            ret.push({product_id: item.product_id, quantity: item.quantity});
                        }
                        Products.update_products_quantity(ret);
                    };//end of get_sale_items_callback
                    Sales.get_sale_items_product_id_n_qty(sale_id, get_sale_items_callback);
               }; // end of pay_click
               
               $scope.get_unit_price_for_ui = function(sale_item){
                    if (this.is_price_include_tax()){
                        return sale_item.unit_price_including_tax;
                    } else {
                        return sale_item.unit_price_excluding_tax;
                    }
               };// end of get_unit_price_for_display
               
               $scope.get_display_color = function(color){
                    return Util.get_display_color(color);
               };
               
}); // sellCtrl

app.controller('itemQuantiyCtrl', function($scope, Sales){
               $scope.done_click = function(sale_item){
                    console.log("done click..." + angular.toJson(sale_item));
                    var callback = function (tx, rlts) {
                        console.log("itemQuantityCtrl.callback...");
                        Sales.get_current_sale();
                        $scope.$parent.hide_quantity_popover();
                    } ; // end of callback_fun
               
                    Sales.update_item_quantity(sale_item.sale_id, $scope.$parent.is_price_include_tax(), sale_item.id, sale_item.quantity, callback);
               } // end of done_click
}); // itemQuantiyCtrl