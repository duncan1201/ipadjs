var cgroups = angular.module('cgroup', ['ionic', 'util']);

cgroups.factory('CGroups', function(DbUtil){
                return {
                    all: function(external_cb) {
                        var self = this;
                        var stmt = "select * from cgroups";
                        //var stmt = "select * from products";
                        var _callback = null;
                        if (angular.isDefined(external_cb)){
                            _callback = external_cb;
                        } else {
                            _callback = function(tx, rlts){
                                console.log("_callback.rlts=" + angular.toJson(rlts));
                                var scope = self.get_scope();
                                scope.$apply(function(){
                                    scope.cgroups = self.parse_rlts(rlts);
                                });
                            };
                        }
                        var json = {sql:stmt, params:[], callback: _callback};
                        DbUtil.executeSql(json);
                    }, // end of all
                    get_group: function(id, _callback) {
                        var stmt = "select * from cgroups where id = ?";
                        var json = {sql: stmt, params:[id], callback: _callback};
                        DbUtil.executeSql(json);
                    }, // end of get_group
                    parse_rlts: function(rlts) {
                        console.log("rlts=" + angular.toJson(rlts));
                        var rows = rlts.rows;
                        var ret = [];
                        for (var i = 0; i < rows.length; i++) {
                            var item = rows.item(i);
                            ret.push({id: item.id, group_id: item.group_id, name: item.name});
                        }
                        return ret;
                    }, // end of parse_rlts
                    create_group: function(group, _callback) {
                        var stmt = "insert into cgroups (group_id, name) values (?, ?)";
                        var json = {sql:stmt, params:[group.group_id, group.name], callback: _callback};
                        DbUtil.executeSql(json);
                    }, // end of create_group
                    update_group: function(group, _callback){
                        var stmt = "update cgroups set group_id = ?, name = ? where id = ?";
                        var json = {sql: stmt, params:[group.group_id, group.name, group.id], callback: _callback};
                        DbUtil.executeSql(json);
                    }, // end of update_group
                    delete_group: function(id, _callback) {
                        var stmt = "delete from cgroups where id = ?";
                        var json = {sql: stmt, params:[id], callback: _callback};
                        DbUtil.executeSql(json);
                    },
                    get_scope: function() {
                        var ret = angular.element(document.querySelector('#cgroups_main_content')).scope();
                        return ret;
                    }
                }
                });