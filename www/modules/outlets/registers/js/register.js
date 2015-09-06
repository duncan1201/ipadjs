app.controller('registerCtrl',
               function($scope, $rootScope, App_URLs, Registers, Outlets, Layouts) {
               
                    $scope.register_form_submit_click = function(register) {
                        console.log("register_form_submit_click=" + angular.toJson(register));
                        var callback = function(tx, rlts){
                            $rootScope.$apply(function(){
                                $rootScope.ion_header_bar_template = "modules/outlets/outlets/templates/header_bar.htm";
                                $rootScope.ion_content_template = "modules/outlets/outlets/templates/main_content.htm";
                            });
                        }; // end of callback
                        Registers.update_register(register, callback);
                    }; // end of register_form_submit_click
               
                    $scope.cancel_click = function() {
                        //$rootScope.$apply(function(){
                            $rootScope.ion_header_bar_template = "modules/outlets/outlets/templates/header_bar.htm";
                            $rootScope.ion_content_template = "modules/outlets/outlets/templates/main_content.htm";
                        //});
                    }; // end of cancel_click
               
                    $rootScope.$on('$includeContentLoaded', function(event, url) {
                        if (url == App_URLs.register_add_edit){
                            console.log(App_URLs.register_add_edit);
                                   
                            var register_callback = function(tx, rlts){
                                var rows = rlts.rows;
                                $rootScope.register_id_for_edit = null;
                                if(rows.length > 0){
                                   var item = rows.item(0);
                                   console.log("register_callback.item=" + angular.toJson(item));
                                   $scope.$apply(function(){
                                   $scope.register = Registers.parse_rlts(rlts)[0];
                                                 });
                                   
                                }
                            }; // register_callback
                            var layout_callback = function(tx, rlts){
                                $scope.$apply(function(){
                                    $scope.layouts = Layouts.parse_results_summary(rlts);
                                });
                                
                                   
                                   Registers.get_register($rootScope.register_id_for_edit, register_callback);
                            };
                            Layouts.all(layout_callback);
                        }
                    });// end of on
               
               
               });