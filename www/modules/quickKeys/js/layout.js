app.controller('layoutCtrl',
               function($rootScope, $scope, App_URLs, Layouts) {
               
               Layouts.all_with_default_callback();
               
               $scope.add_new_layout_click =
                    function () {
                        console.log("add_new_layout_click");
                        $rootScope.ion_content_template = App_URLs.layout_add_edit_url;
                    };
               
               $scope.layout_form_submit_click =
                    function (layout) {
                        Layouts.create_layout(layout);
                    };
               
               }); // end of layoutCtrl

var layout = angular.module('layout', ['ionic', 'util']);

layout.factory('Layouts',
               function(DbUtil) {
                    return {
                        all_with_default_callback : function () {
                            var self = this;
                            var selectSql = "select * from layouts";
                            var callback_function = function(tx, results) {
                                var ret = self.parse_results_summary(results);
                                var scope = angular.element(document.querySelector('#layouts_main_content')).scope();
                                scope.$apply(function(){
                                    scope.layouts = ret;
                                });
                            };
                            var json = {sql: selectSql, params:[], callback: callback_function};
                            DbUtil.executeSql(json);
                        }, // end of all_with_default_callback
                        create_layout : function() {
                            var self = this;
                            var insertSql = "insert into layouts (name, creation_date) values (?, datetime('now'))";
               
                            var callback_function = function(tx, results){
                                var layout_id = results.insertId;
               console.log("results.insertId=" + results.insertId);
                            };
                            var json = {sql: insertSql, params:[layout.name], callback: callback_function};
                            DbUtil.executeSql(json);
                        }, // end of create_layout
                        parse_results_summary : function (results) {
                            var ret = [];
                            for(i = 0; i < results.rows.length; i++){
                                ret.push({id: results.rows.item(i).id, name: results.rows.item(i).name});
                            }
                            return ret;
                        } // end of parse_results_summary
                    } // end of return
               }); // end of Layouts