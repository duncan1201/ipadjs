app.controller('layoutCtrl',
               function($rootScope, $scope, App_URLs, Layouts, Products) {
               
                    var self = this;
                    var layout_id_for_edit = null;
               
                    if ($rootScope.ion_content_template == App_URLs.layout_main_content){
                        Layouts.all_with_default_callback();
                    } else if ($rootScope.ion_content_template == App_URLs.layout_add_edit) {
                        var callback = new function(tx, results) {
                            
                        };
                        Products.all_summary(callback);
                    }
               
               
               
                    $scope.add_new_layout_click =
                        function () {
                            $rootScope.ion_content_template = App_URLs.layout_add_edit;
                        };
               
                    $scope.layout_form_submit_click =
                        function (layout) {
                            console.log("layout_form_submit_click");
                            if (angular.isDefined(layout.id)){
                                console.log("angular.isDefined()...");
                                Layouts.update_layout(layout);
                            }else{
                                Layouts.create_layout(layout);
                            }
                        };
               
                    $scope.edit_click =
                        function(id) {
                            self.layout_id_for_edit = id;
                            $rootScope.ion_content_template = App_URLs.layout_add_edit;
                        };
               
                    $scope.delete_click =
                        function(id) {
                            Layouts.delete_layout(id);
                        };
               
                    $scope.add_product_click =
                        function () {
                            console.log("add_product_click");
                            var key = {id: 1, layout_group_id: 1, product_id: 1, color: 'red', display_name: 'Coffee'};
                            var key2 = {id: 2, layout_group_id: 1, product_id: 2, color: 'red', display_name: 'Teh O'};
                                $scope.layout['groups'][0]['keys'] = [];
                                $scope.layout['groups'][0]['keys'].push(key);
                                $scope.layout['groups'][0]['keys'].push(key2);
                                console.log("add_product_click=" + $scope.layout['groups'][0]);
                        };
               
                    $scope.layout_form_cancel_click = function(){
                        $rootScope.ion_content_template = App_URLs.layout_main_content;
                    };
               
                    $rootScope.$on('$includeContentLoaded',
                        function(event, url){
                            if(url == App_URLs.layout_add_edit){
                                console.log("onload layout_add_edit_url");
                                if (angular.isDefined(self.layout_id_for_edit)){
                                   Layouts.get_layout_for_edit(self.layout_id_for_edit);
                                }
                            }
                        });
               
               }); // end of layoutCtrl

var layout = angular.module('layout', ['ionic', 'util']);

layout.factory('Layouts',
               function(DbUtil, $rootScope, App_URLs) {
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
                        update_layout: function (layout) {
               console.log(angular.toJson(layout));
                            var callback_fun = function(tx, results) {
                                console.log(angular.toJson(results));
                            };
                            var update_sql = "update layouts set name = ? where id = ?";
                            var json = {sql: update_sql, params:[layout.name, layout.id], callback: callback_fun};
                            DbUtil.executeSql(json);
                        }, // end of update_layout
                        create_layout : function(layout) {
                            var self = this;
                            var insertSql = "insert into layouts (name, creation_date) values (?, datetime('now'))";
               
                            var callback_function = function(tx, results){
                                var layout_id = results.insertId;
                                console.log("results.insertId2=" + results.insertId);
                                self.create_layout_group(layout_id);
                            };
                            var json = {sql: insertSql, params:[layout.name], callback: callback_function};
                            DbUtil.executeSql(json);
                        }, // end of create_layout
                        create_layout_group: function(layout_id){
                            var callback_function = function (tx, results) {};
                            var insertSql = "insert into layout_groups (name, is_active, layout_id) values (?, ?, ?)";
                            var json = {sql: insertSql, params: ["group 1", 1, layout_id], callback: callback_function};
                            DbUtil.executeSql(json);
                        }, // end of create_layout_group
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
                            var self = this;
                            var selectSql = "select * from layouts where id = ? ";
                            var layout = null;
                            var callback_function = function(tx, results) {
                            console.log("get_layout_for_edit length=" + results.rows.length);
                                self.layout = self.parse_results_summary(results)[0];
                                console.log("get_layout_for_edit .name=" + self.layout.name);
                                self.get_layout_group_for_edit(self.layout);
                            };
                            var json = {sql: selectSql, params:[id], callback: callback_function};
                            DbUtil.executeSql(json);
                        }, // end of get_layout_for_edit
                        get_layout_group_for_edit : function (layout) {
               
                            console.log("layout.id=" + layout.id);
                            var self = this;
                            var callback_function = function (tx, results) {
                                var rows = results.rows;
                                console.log("get_layout_group_for_edit results len=" + results.rows.length);
               
                                layout["groups"] = [];
                                for(i = 0; i < rows.length; i++){
                                    layout["groups"].push({id: rows.item(i).id, name: rows.item(i).name, is_active: rows.item(i).is_active});
                                    console.log("rows.item(i).name="+rows.item(i).name);
                                    if (layout["groups"][i].is_active == 1){
                                        self.get_layout_group_keys_for_edit(layout, layout["groups"][i]);
                                    }
                                }
                            }; // end of callback_function
                            var selectSql = "select * from layout_groups where layout_id = ?";
                            var json = {sql: selectSql, params:[layout.id], callback:callback_function};
                            DbUtil.executeSql(json);
                        }, // end of get_layout_group_for_edit
                        get_layout_group_keys_for_edit : function(layout, group){
                            var self = this;
                            var callback_function = function(tx, results) {
                                console.log("get_layout_group_keys_for_edit=" + results.rows.length);
                                var scope = angular.element(document.querySelector('#add_edit_layout')).scope();
               
                                scope.$apply(function(){
                                             console.log("self.layout=" + self.layout.id);
                                    scope.layout = self.layout;
                                });
                            }; // end of callback_function
               
                            var selectSql = "select * from layout_group_keys where layout_group_id = ? ";
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
                            var deleteSql = "delete from layout_group_keys where layout_group_id not in (select id from layout_groups)";
                            var json = {sql: deleteSql, params:[]};
                            DbUtil.executeSql(json);
                        } // end of delete_orphaned_keys
                    } // end of return
               }); // end of Layouts