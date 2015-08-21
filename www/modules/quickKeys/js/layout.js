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
               
                    // prepare the edit key popover
                    $ionicPopover.fromTemplateUrl('modules/quickKeys/templates/key-po.htm',
                                                  {
                                                    scope: $scope
                                                  }).then(function(popover){
                                                    $scope.key_popover = popover;
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
                        var callback = function(tx, results){
                            $rootScope.ion_content_template = App_URLs.layout_add_edit;
                        };
                        Layouts.create_layout({name: "New Layout"}, callback);
                    };
               
                    $scope.layout_form_submit_click = function (layout) {
                        console.log("layout_form_submit_click");
                        if (angular.isDefined(layout.id)){
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
               
                    $scope.add_product_click = function (group, productStr) {
                        console.log("add_product_click group=" + group.id);
                        var product = angular.fromJson(productStr);
               
                        var key = {layout_group_id: group.id, product_id: product.id, color: 'red', display_name: product.name};
                        $scope.layout.active_group['keys'].push(key);
               
                        Layouts.create_layout_key(group, key);
                    };
               
                    $scope.layout_form_cancel_click = function(){
                        $rootScope.ion_content_template = App_URLs.layout_main_content;
                    };
               
                    $scope.group_text_click = function(group){
                        console.log("group_text_mousedown=" + angular.toJson(group));
               
                        $scope.layout.active_group_id = group.id;
                        for (var i = 0; i < $scope.layout.groups.length; i++){
                            if ($scope.layout.groups[i].id == group.id){
                                $scope.layout.active_group = $scope.layout.groups[i];
                            }
                        }
                    };
               
                    $scope.get_display_color = function (color) {
                        console.log("get_display_color");
                        if (color.toUpperCase() == 'RED'){
                            return "#FFA49C";
                        } else if (color.toUpperCase() == 'PURPLE') {
                            return "#B9A8F8";
                        } else if (color.toUpperCase() == 'BLUE') {
                            return "#ADC6F3";
                        } else if (color.toUpperCase() == 'GREEN') {
                            return "#AAD2A4";
                        } else {
                            return color;
                        }
                    }; // end of get_display_color
               
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
                        $scope.new_group_popover.scope.group = {name: '', layout_id: $scope.layout.id};
                        $scope.new_group_popover.show($event);
                    };
               
                    $scope.key_click = function($event, key) {
                        console.log("key_click=" + angular.toJson(key));
                        $scope.colors = [
                                            {color: "white", selected: key.color == "white"},
                                            {color: "red", selected: key.color == "red"},
                                            {color: "orange", selected: key.color == "orange"},
                                            {color: "cyan", selected: key.color == "cyan"},
                                            {color: "green", selected: key.color == "green"},
                                            {color: "blue", selected: key.color == "blue"},
                                            {color: "purple", selected: key.color == "purple"}
                                         ];
                        $scope.key_popover.scope.key = key;
                        $scope.key_popover.show($event);
                    }; // key_click
               
                    $scope.hide_key_popover = function(){
                        $scope.key_popover.hide();
                    }; // hide_key_popover
               
                    $scope.remove_key_from_the_active_group = function(key) {
                        var keys = $scope.layout.active_group.keys;
                        for (var i = 0; i < keys.length; i++){
                            if (keys[i].id == key.id){
                                keys.splice(i, 1);
                            }
                        }
                    } // end of remove_key_from_the_active_group
               
                    $rootScope.$on('$includeContentLoaded', function(event, url){
                        if(url == App_URLs.layout_add_edit){
                            $scope.product_to_be_add = "";
                            Tags.all(tag_callback);
                            Products.all_summary(product_callback);
                            if (angular.isDefined($rootScope.layout_id_for_edit)){
                                Layouts.get_layout_for_edit_with_default_callback($rootScope.layout_id_for_edit);
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
                            Layouts.get_layout_for_edit_with_default_callback(group.layout_id);
                        };
                        Layouts.delete_group(group.id, callback_fun);
                        $scope.$parent.hide_group_popover();
                    };
               
               }); // end of editGroupCtrl

app.controller('addGroupCtrl', function($scope, Layouts){
                    $scope.add_click = function(group){
                        var callback_fun = function() {
                            Layouts.get_layout_for_edit_with_default_callback(group.layout_id);
                        };
                        Layouts.create_layout_group(group, callback_fun);
                        $scope.$parent.hide_new_group_popover();
                    }; // end of add_click
               
                    $scope.cancel_click = function(){
                        $scope.$parent.hide_new_group_popover();
                    }; // end of cancel_click
               });

app.controller('editKeyCtrl', function($scope, Layouts){
                    $scope.delete_click = function(key) {
                        console.log("delete click..." + angular.toJson(key));
                        var callback = function(){
                            $scope.$parent.remove_key_from_the_active_group(key);
                            $scope.$parent.hide_key_popover();
                        };
                        Layouts.delete_key(key.id, callback);
                    }; // delete_click
               
               
                    $scope.color_click = function(color){
                        var colors = $scope.colors;
                        for (var i = 0; i < colors.length; i++){
                            colors[i].selected = false;
                        }
                        color.selected = true;
                        $scope.key.color = color.color;
                    }; // end of color_click
               
                    $scope.done_click = function(key) {
                        console.log("done click=" + angular.toJson(key));
                        var callback = function(tx, results){
                            $scope.$parent.hide_key_popover();
                        };
                        Layouts.update_layout_key(key, callback);
                    }; // done_click
               });