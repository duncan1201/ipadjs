app.directive('tabs', function(){
              return {
              restrict: 'E',
                transclude: true,
                scope:{},
                controller: function($scope){
                    var panes = $scope.panes = [];
              
                    $scope.select = function(pane){
              console.log("scope...panes.length=" + panes.length);
                        console.log("scope...select..." + pane.selected + ";title=" + pane.title);
                        var title = pane.title;
              
                        angular.forEach(panes, function(pane){
                            console.log("each pane = " + (pane.title));
                                        
                                        console.log(" title = " + (title));
                                        //pane.selected = title == pane.title? true: false;
                                        pane.selected = 'true';
                        });
                        //pane.selected = true;
                    }; // end of select
              
                    this.add_pane = function (pane) {
                        if (panes.length === 0) {
                            $scope.select(pane);
                        }
                        panes.push(pane);
                    }; // end of add_pane
                },
                templateUrl: 'modules/sell/templates/tabs.htm'
              };
              }).directive('pane', function(){
                return {
                    require: '^tabs',
                    restrict: 'E',
                    transclude: true,
                    scope:{
                        title: '@'
                    },
                    link: function(scope, element, attrs, tabsCtrl){
                        console.log("link function");
                        tabsCtrl.add_pane(scope);
                    },
                    templateUrl: 'modules/sell/templates/tab_pane.htm'
                }; // end of return
            });

app.controller('sellCtrl', function($scope, $rootScope, $ionicSideMenuDelegate, App_URLs, Layouts) {

               if (!angular.isDefined($scope.sale_items)) {
                    $scope.sale_items = [];
               }
               
               $scope.sale_item_delete_click = function () {
                    console.log("sale_item_delete_click");
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
                    console.log("$scope.sale_item.length=" + $scope.sale_items.length);
                    $scope.sale_items.push({
                            name:key.display_name,
                            quantity: 1,
                            unit_price: key.retail_price
                    });
               }; // end of key_click
               
               $rootScope.$on('$includeContentLoaded', function(event, url){
                    if(url == App_URLs.sell_main_content){
                        
                        // callback for get_current_layout
                        var callback_fun = function(tx, results) {
                            var rows = results.rows;
                            
                            if (rows.length > 0) {
                                var item = rows.item(0);
                                var last_callback = function() {
                              
                                    var self = this;
                                    var scope = angular.element(document.querySelector('#sell_main_content')).scope();
                              console.log("scope == null ?" + (scope == null));
                                    scope.$apply(function(){
                                           scope.layout = self.layout_obj;
                                    });
                                }
                                console.log("before get_layout_group_keys_for_edit...");
                                Layouts.get_layout_for_edit(item.id, last_callback);
                            }
                        }; // end of callback_fun
                              
                        Layouts.get_current_layout(callback_fun);
                    }
                }); // end of on
});