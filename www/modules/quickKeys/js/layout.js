app.controller('layoutCtrl',
               function($rootScope, $scope, $ionicPopover, App_URLs, Layouts, Products, Tags) {
               
                    var self = this;
               
                    if (!angular.isDefined($rootScope.layout_id_for_edit)){
                        $rootScope.layout_id_for_edit = null;
                    }
               
                    // prepare the group_popover
                    $ionicPopover.fromTemplateUrl('modules/quickKeys/templates/group-po.htm',
                                                  {
                                                    scope: $scope
                                                }).then(function(popover) {
                                                     $scope.group_popover = popover;
                                                });
               
                    // prepare the new group popover
                    $ionicPopover.fromTemplateUrl('modules/quickKeys/templates/new_group_po.htm',
                                                  {
                                                    scope: $scope
                                                }).then(function(popover){
                                                    $scope.new_group_popover = popover;
                                                });
               
                    var product_callback = function(tx, results) {
                        var rows = results.rows;
                        var ret = [];
                        for (var i = 0; i < rows.length; i++){
                            var item = rows.item(i);
                            ret.push({
                                     id: item.id,
                                     name: item.product_name,
                                     type: item.product_type_name
                                     });
                        }
                        var scope = angular.element(document.querySelector('#add_edit_layout')).scope();
                        scope.$apply(function(){
                            scope.products = ret;
                        });

                    }; // end of product_callback
               
                    var tag_callback = function(tx, results) {
                        var rows = results.rows;
                        var ret = [];
                        for (var i = 0; i < rows.length; i++){
                            var item = rows.item(i);
                            ret.push({id:item.id, name:item.name});
                        }
                        var scope = angular.element(document.querySelector('#add_edit_layout')).scope();
                        scope.$apply(function(){
                            scope.tags = ret;
                        });
                    };// end of tag_callback
               
                    $scope.add_new_layout_click = function () {
                        $rootScope.ion_content_template = App_URLs.layout_add_edit;
                    };
               
                    $scope.layout_form_submit_click = function (layout) {
                        console.log("layout_form_submit_click");
                        if (angular.isDefined(layout.id)){
                            console.log("angular.isDefined()...");
                            Layouts.update_layout(layout);
                        }else{
                            Layouts.create_layout(layout);
                        }
                    };
               
                    $scope.edit_click = function(id) {
                        $rootScope.layout_id_for_edit = id;
                        $rootScope.ion_content_template = App_URLs.layout_add_edit;
                    };
               
                    $scope.delete_click = function(id) {
                        Layouts.delete_layout(id);
                    };
               
                    $scope.add_product_click = function (productStr) {
                        var product = angular.fromJson(productStr);
                        console.log("add_product_click.name=" + product.name);
               
                        var key = {id: 1, layout_group_id: 1, product_id: 1, color: 'red', display_name: product.name};
                        $scope.layout['groups'][0]['keys'].push(key);
                    };
               
                    $scope.layout_form_cancel_click = function(){
                        $rootScope.ion_content_template = App_URLs.layout_main_content;
                    };
               
                    $scope.group_text_click = function(group){
                        console.log("group_text_mousedown");
                        $scope.layout.active_group_id = group.id;
                    };
               
                    $scope.group_icon_click = function($event, group){
                        console.log("group_icon_click=" + angular.toJson(group));
                        $scope.group_popover.scope.group = group;
                        $scope.group_popover.show($event);
                    };
               
                    $scope.hide_group_popover = function(){
                        $scope.group_popover.hide();
                    };
               
                    $scope.hide_new_group_popover = function() {
                        $scope.new_group_popover.hide();
                    };
               
                    $scope.new_group_click = function($event){
                        console.log("new group click");
                        $scope.new_group_popover.scope.group = {name: "", layout_id: $scope.layout.id};
                        $scope.new_group_popover.show($event);
                    };
               
                    $rootScope.$on('$includeContentLoaded', function(event, url){
                        if(url == App_URLs.layout_add_edit){
                            console.log("onload layout_add_edit_url");
                            $scope.product_to_be_add = "";
                            Tags.all(tag_callback);
                            Products.all_summary(product_callback);
                            if (angular.isDefined($rootScope.layout_id_for_edit)){
                                Layouts.get_layout_for_edit($rootScope.layout_id_for_edit);
                            }
                        } else if (url == App_URLs.layout_main_content) {
                            Layouts.all_with_default_callback();
                        }
                    });
               
               }); // end of layoutCtrl

app.controller('editGroupCtrl', function($scope, Layouts){
               
                    $scope.done_click = function(group){
                        console.log("done click - group.name=" + group.name);
                        var callback_fun = function (tx, results) {
               
                        }; // callback_fun
                        Layouts.update_group(group, callback_fun);
                        $scope.$parent.hide_group_popover();
                    };
               
                    $scope.delete_group_click = function(group){
                        console.log("delete group click - editGroupCtrl=" + group.layout_id);
                        var callback_fun = function(tx, results) {
                            Layouts.get_layout_for_edit(group.layout_id);
                        };
                        Layouts.delete_group(group.id, callback_fun);
                        $scope.$parent.hide_group_popover();
                    };
               
               }); // end of editGroupCtrl

app.controller('addGroupCtrl', function($scope, Layouts){
                    $scope.add_click = function(group){
                        console.log("group.name=" + group.name);
                        var callback_fun = function() {
                            Layouts.get_layout_for_edit(group.layout_id);
                        };
                        Layouts.create_layout_group(group, callback_fun);
                        $scope.$parent.hide_new_group_popover();
                    }; // end of add_click
               
                    $scope.cancel_click = function(){
                        $scope.$parent.hide_new_group_popover();
                    }; // end of cancel_click
               });

