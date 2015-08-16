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
                        }; // end pf callback_function
                        var json = {sql: selectSql, params:[], callback: callback_function};
                        DbUtil.executeSql(json);
                    }, // end of all_with_default_callback
                    update_layout: function (layout) {
                        console.log(angular.toJson(layout));
                        var callback_fun = function(tx, results) {
                            console.log(angular.toJson(results));
                        }; // end of callback_fun
                        var update_sql = "update layouts set name = ? where id = ?";
                        var json = {sql: update_sql, params:[layout.name, layout.id], callback: callback_fun};
                        DbUtil.executeSql(json);
                    }, // end of update_layout
                    update_group: function(group, callback_fun){
                        var update_sql = "update layout_groups set name = ? where id = ?";
                        var json = {sql: update_sql, params:[group.name, group.id], callback: callback_fun};
                        DbUtil.executeSql(json);
                    }, // end of update_group
                    create_layout : function(layout) {
                        var self = this;
                        var insertSql = "insert into layouts (name, creation_date) values (?, datetime('now'))";
               
                        var callback_function = function(tx, results){
                            console.log("results.insertId2=" + results.insertId);
                            self.create_layout_group({name: "group 1", layout_id: results.insertId});
                        }; // end of callback_function
                        var json = {sql: insertSql, params:[layout.name], callback: callback_function};
                        DbUtil.executeSql(json);
                    }, // end of create_layout
                    create_layout_group: function(group, callback_function){
                        var insertSql = "insert into layout_groups (name, is_active, layout_id) values (?, ?, ?)";
                        var json = {sql: insertSql, params: [group.name, 1, group.layout_id], callback: callback_function};
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
                            console.log("get_layout_group_for_edit len=" + rows.length);
               
                            layout["groups"] = [];
                            for(i = 0; i < rows.length; i++){
                                var item = rows.item(i);
                                layout["groups"].push({id: item.id, name: item.name, is_active: item.is_active, layout_id: item.layout_id});
               
                                if (layout["groups"][i].is_active == 1){
                                    console.log("active.item.name="+item.name);
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
                            group['keys'] = [];
                            var rows = results.rows;
                            for (var i = 0; i < rows.length; i++){
                                var item = rows.item(i);
                                group['keys'].push({id: item.id});
                            }
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
                        }; // end of callback_function
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
                    }, // end of delete_orphaned_keys
                    delete_group : function(id, callback_fun) {
                        var self = this;
                        var deleteGroupSql = "delete from layout_groups where id = ?";
                        var json = {sql: deleteGroupSql, params:[id], callback: callback_fun};
                        DbUtil.executeSql(json);
               
                        var deleteKeySql = "delete from layout_group_keys where layout_group_id = ?";
                        DbUtil.executeSql({sql: deleteKeySql, params: [id]});
                    } // end of delete_group
               } // end of return
            }); // end of Layouts