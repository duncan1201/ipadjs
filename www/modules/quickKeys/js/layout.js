app.controller('layoutCtrl',
               function($rootScope, $scope, App_URLs, Layouts, Products, Tags) {
               
                    var self = this;
               
               if (!angular.isDefined($rootScope.layout_id_for_edit)){
               $rootScope.layout_id_for_edit = null;
               }
               
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

