app.controller('layoutCtrl',
               function($rootScope, $scope, App_URLs, Layouts) {
               
                    if ($rootScope.ion_content_template == App_URLs.layout_main_content_url){
                        Layouts.all_with_default_callback();
                    }
               
                    $scope.add_new_layout_click =
                        function () {
                            $rootScope.ion_content_template = App_URLs.layout_add_edit_url;
                        };
               
                    $scope.layout_form_submit_click =
                        function (layout) {
                            Layouts.create_layout(layout);
                        };
               
                    $scope.edit_click =
                        function(id) {
                            Layouts.get_layout_for_edit(id);
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
                        get_layout_for_edit: function (id){
                            var myDb = DbUtil.openDb();
                            var self = this;
                            var selectSql = "select * from layouts where id = ? ";
               var layout = null;
                            var callback_function = function(tx, results) {
                                self.layout = self.parse_results_summary(results)[0];
                                console.log("edit-layout.name=" + self.layout.name);
                                self.get_layout_group_for_edit(layout);
                            };
                            var json = {sql: selectSql, params:[id], callback: callback_function, db: myDb};
                            DbUtil.executeSql(json);
               
               var groupsSql = "select * from layout_groups where layout_id = ?";
               var group_callback = function(tx, results){};
               json = {sql: groupsSql, params:[layout.id], callback: group_callback};
                        }, // end of get_layout
                        create_layout_group: function(layout_id){
                            var callback_function = function (tx, results) {};
                            var insertSql = "insert into layout_groups (name, layout_id) values (?, ?)";
                            var json = {sql: insertSql, params: ["group_name", layout_id], callback: callback_function};
                            DbUtil.executeSql(json);
                        }, // end of create_layout_group
                        get_layout_group_for_edit : function (layout) {
               /*
                            console.log("layout.id=" + layout.id);
                            var self = this;
                            var callback_function = function (tx, results) {
                                var rows = results.rows;
                                console.log("results length=" + results.rows.length);
                                var groups = [];
                                for(i = 0; i < rows.length; i++){
                                    groups.push({name: rows.item(i).name});
                                    console.log("rows.item(i).name="+rows.item(i).name);
                                    self.get_layout_group_keys_for_edit(group);
                                }
                                layout["groups"] = groups;
                            };
                            var selectSql = "select * from layout_groups where layout_id = ?";
                            var json = {sql: selectSql, params:[layout.id], callback:callback_function};
                            DbUtil.executeSql(json);*/
                        }, // end of get_layout_group_for_edit
                        get_layout_group_keys_for_edit : function(group){
                            var callback_function = function(tx, results) {
               console.log("get_layout_group_keys_for_edit" + results.rows.length);
                            };
               
                            var selectSql = "select * from layout_group_keys where group_id = ?";
                            var json = {sql: selectSql, params:[group.id], callback: callback_function};
                            DbUtil.executeSql(json);
                        }, // end of get_layout_group_keys_for_edit
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
                            var self = this;
                            var callback_function = function() {
                                self.delete_orphaned_keys();
                            };
                            var deleteSql = "delete from layout_groups where layout_id not in (select id from layouts)";
                            var json = {sql: deleteSql, params:[], callback: callback_function};
                            DbUtil.executeSql(json);
                        }, // end of delete_orphaned_groups
                        delete_orphaned_keys : function() {
                            var deleteSql = "delete from layout_keys where layout_group_id not in (select id from layout_groups)";
                            var json = {sql: deleteSql, params:[]};
                            DbUtil.executeSql(json);
                        } // end of delete_orphaned_keys
                    } // end of return
               }); // end of Layouts