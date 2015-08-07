app.controller('layoutCtrl',
               function($rootScope, $scope, App_URLs, Layouts) {
               
                    if ($rootScope.ion_content_template == App_URLs.layout_main_content_url){
               console.log("inside if="+$rootScope.ion_content_template);

                        Layouts.all_with_default_callback();
                    }
               
                    $scope.add_new_layout_click =
                        function () {
                            console.log("add_new_layout_click");
                            $rootScope.ion_content_template = App_URLs.layout_add_edit_url;
                        };
               
                    $scope.layout_form_submit_click =
                        function (layout) {
                            Layouts.create_layout(layout);
                        };
               
                    $scope.delete_click =
                        function(id) {
                            Layouts.delete_layout(id);
                        };
               
               }); // end of layoutCtrl

var layout = angular.module('layout', ['ionic', 'util']);

layout.factory('Layouts',
               function(DbUtil) {
                    return {
                        all_with_default_callback : function () {
                            var self = this;
                            var selectSql = "select id, name, date(creation_date) as creation_date from layouts";
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
                        create_layout : function(layout) {
                            console.log("layout.name=" + layout.name);
                            var self = this;
                            var insertSql = "insert into layouts (name, creation_date) values (?, datetime('now'))";
               
                            var callback_function = function(tx, results){
                                var layout_id = results.insertId;
                                console.log("results.insertId=" + results.insertId);
                                self.create_layout_group(layout_id);
                            };
                            var json = {sql: insertSql, params:[layout.name], callback: callback_function};
                            DbUtil.executeSql(json);
                        }, // end of create_layout
                        parse_results_summary : function (results) {
                            var ret = [];
                            var rows = results.rows;
                            for(i = 0; i < rows.length; i++){
                                ret.push({
                                            id: rows.item(i).id,
                                            name: rows.item(i).name,
                                            creation_date: rows.item(i).creation_date
                                         });
                            }
                            return ret;
                        }, // end of parse_results_summary
                        get_layout: function (id){
                            var selectSql = "select * from layouts where id = ? ";
                            var callback_function = function(tx, results) {
                                var layout = parse_results_summary(results)[0];
               
                            };
                            var json = {sql: selectSql, params:[], callback: callback_function};
                            DbUtil.executeSql(json);
                        }, // end of get_layout
                        create_layout_group: function(layout_id){
                            var callback_function = function (tx, results) {};
                            var insertSql = "insert into layout_groups (name, layout_id) values (?, ?)";
                            var json = {sql: insertSql, params: ["group_name", layout_id], callback: callback_function};
                            DbUtil.executeSql(json);
                        }, // end of create_layout_group
                        get_layout_group : function (layout_id) {
               
                        }, // end of get_layout_group
                        delete_layout : function(id) {
                            var self = this;
                            var deleteSql = "delete from layouts where id = ? ";
                            var callback_function = function () {
                                self.delete_orphaned_groups();
                                self.all_with_default_callback();
                            };
                            var json = {sql: deleteSql, params:[id], callback: callback_function};
                            DbUtil.executeSql(json);
                        }, // end of delete_layout
                        delete_orphaned_groups : function(){
                            var deleteSql = "delete from layout_groups where layout_id not in (select id from layouts)";
                            var json = {sql: deleteSql, params:[]};
                            DbUtil.executeSql(json);
                        }, // end of delete_orphaned_groups
                    } // end of return
               }); // end of Layouts