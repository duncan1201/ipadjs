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
                    update_layout_key : function(key, callback_fun) {
                        var updateSql = "update layout_group_keys set color = ?, display_name = ? where id = ?";
                        var json = {sql: updateSql, params:[key.color, key.display_name, key.id], callback: callback_fun};
                        DbUtil.executeSql(json);
                    }, // end of update_layout_key
                    create_layout : function(layout, callback_fun) {
                        var self = this;
                        var insertSql = "insert into layouts (name, creation_date) values (?, datetime('now'))";
               
                        var callback_function = function(tx, results){
                            $rootScope.layout_id_for_edit = results.insertId;
                            self.create_layout_group({name: "group 1", layout_id: results.insertId}, callback_fun);
                        }; // end of callback_function
                        var json = {sql: insertSql, params:[layout.name], callback: callback_function};
                        DbUtil.executeSql(json);
                    }, // end of create_layout
                    create_layout_group: function(group, callback_function){
                        var insertSql = "insert into layout_groups (name, is_active, layout_id) values (?, ?, ?)";
                        var json = {sql: insertSql, params: [group.name, 1, group.layout_id], callback: callback_function};
                        DbUtil.executeSql(json);
                    }, // end of create_layout_group
                    create_layout_key : function(group, key) {
                        console.log("key=" + angular.toJson(key));
                        var callback_fun = function (tx, results) {
                            //Layouts.get_layout_for_edit(group.layout_id);
                        };
                        var json = {sql: "insert into layout_group_keys (layout_group_id, product_id, color, display_name) values (?, ?, ?, ?)", params:[group.id, key.product_id, "red", key.display_name], callback: callback_fun};
                        DbUtil.executeSql(json);
                    }, // create_layout_key
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
                    get_layout_for_edit_with_default_callback : function(id){
                        var self = this;
                        var last_callback = function () {
                            var self = this;
                            var scope = angular.element(document.querySelector('#add_edit_layout')).scope();
               
                            scope.$apply(function(){
                                         console.log("self.layout=" + self.layout_obj.id);
                                         scope.layout = self.layout_obj;
                            });
                        } ;// end of out_callback
                        self.get_layout_for_edit(id, last_callback);
                    }, // get_layout_for_edit_with_default_callback
                    get_layout_for_edit: function (id, last_callback) {
                        var self = this;
                        var selectSql = "select * from layouts where id = ? ";
                        var layout = null;

                        var callback_function = function(tx, results) {
                            console.log("get_layout_for_edit length=" + results.rows.length);
                            self.layout = self.parse_results_summary(results)[0];
                            self.get_layout_group_for_edit(self.layout, last_callback);
                        };
                        var json = {sql: selectSql, params:[id], callback: callback_function};
                        DbUtil.executeSql(json);
                    }, // end of get_layout_for_edit
                    get_layout_group_for_edit : function (layout, last_callback) {
               
                        console.log("layout.id=" + layout.id);
                        var self = this;
               
                        var group_callback = function (tx, results) {
                            var rows = results.rows;
                            console.log("get_layout_group_for_edit len=" + rows.length);
               
                            layout["groups"] = [];
                            for(i = 0; i < rows.length; i++){
                                var item = rows.item(i);
                                layout["groups"].push({id: item.id, name: item.name, is_active: item.is_active, layout_id: item.layout_id});
               
                                if (layout["groups"][i].is_active == 1){
                                    console.log("active.item.name="+item.name);
                                    var group = layout["groups"][i];
               
                                    self.get_layout_group_keys_for_edit(layout, group, last_callback);
                                }
                            }
                            if (layout["groups"].length > 0){
                                layout.active_group_id = layout["groups"][0].id;
                                layout.active_group = layout["groups"][0];
                            }
                        }; // end of group_callback
                        var selectSql = "select * from layout_groups where layout_id = ?";
                        var json = {sql: selectSql, params:[layout.id], callback:group_callback};
                        DbUtil.executeSql(json);
                    }, // end of get_layout_group_for_edit
                    get_layout_group_keys_for_edit : function(layout, group, last_callback){
                        var self = this;
                        var key_callback = function(tx, results) {

                            group['keys'] = [];
                            var rows = results.rows;
                            for (var i = 0; i < rows.length; i++){
                                var item = rows.item(i);
                                //console.log("get_layout_group_keys_for_edit item=" + angular.toJson(item));
                                group['keys'].push({
                                  id: item.id,
                                  color: item.color,
                                  display_name: item.display_name,
                                  retail_price: item.retail_price,
                                  product_id: item.product_id
                                });
                            }
               
                            if (last_callback != null){
                                last_callback.call({layout_obj: layout});
                            }

                        }; // end of key_callback
                        var selectSql = "select k.*, p.retail_price as retail_price from layout_group_keys k left join products p on p.id = k.product_id where layout_group_id = ? ";
                        var json = {sql: selectSql, params:[group.id], callback: key_callback};
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
                    }, // end of delete_group
                    delete_key : function(id, callback_fun) {
                        var deleteSql = "delete from layout_group_keys where id = ?";
                        var json = {sql: deleteSql, params:[id], callback: callback_fun};
                        DbUtil.executeSql(json);
                    }, // end of delete_key
                    get_current_layout : function (callback_fun) {
                        var subquery = "select r.layout_id from outlets o left join registers r on r.outlet_id = o.id";
                        var query = "select * from layouts where id in (" + subquery + ")";
                        var json = {sql: query, params:[], callback: callback_fun};
                        DbUtil.executeSql(json);
                    } // end of get_current_layout
               } // end of return
            }); // end of Layouts