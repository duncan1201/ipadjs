app.controller('tagCtrl',
               function($rootScope, $scope, $ionicModal, Tags, App_URLs) {
               
               
                    $ionicModal.fromTemplateUrl('modules/products/tags/templates/tags-popup.htm',
                                                function(modal) {
                                                    $scope.tagModal = modal;
                                                }, {
                                                    scope: $scope
                                                });
               
                    $scope.add_new_tag_click = function(){
                        $scope.popup_title = "Create tag";
                        $scope.tagModal.show();
                    };
               
                    $scope.tag_form_submit_click = function(tag) {
               
                        if(angular.isDefined(tag.id)){
                            console.log("tag_form_submit_click- isDefined");
                            Tags.update_tag(tag);
                        } else {
                            console.log("tag_form_submit_click- is NOT Defined");
                            Tags.create_tag(tag);
                        }
               
                        $scope.tagModal.hide();
                    };
               
                    $scope.tag_popup_cancel_click = function(){
                        $scope.tagModal.hide();
                    };
               
                    $scope.edit_click = function (id) {
                        //$scope.tagModal.show();
                        var callback = function(tx, rlts) {
                            var rows = rlts.rows;
                            if(rows.length > 0){
                                var item = rows.item(0);
               
                                $scope.popup_title = "Edit tag";
                                $scope.tag = {id: item.id, name: item.name};
                                $scope.tagModal.show();
                            }
                        }; // end of callback
                        Tags.get_tag(id, callback);
                    };
               
                    $scope.delete_click = function(id){
                        Tags.delete_tag(id);
                    };
               
                    $rootScope.$on('$includeContentLoaded', function(event, url){
                        if(url == App_URLs.tag_main_content){
                            Tags.all();
                        }
                    });
               
                    
               }); // end of tagCtrl

var tag = angular.module('tag', ['ionic', 'util']);

tag.factory('Tags',
            function(DbUtil){
                return {
                    all: function(external_callback) {
                        var self = this;
                        var callback_fun = null;
                        if(angular.isDefined(external_callback)){
                            callback_fun = external_callback;
                        } else {
                            callback_fun = function(tx, results) {
                                var tags = self.parse_results(results);
                                var scope = angular.element(document.querySelector('#tags_main_content')).scope();
            
                                scope.$apply(function(){
                                    scope.tags = tags;
                                });
                            };
                        } // else
                        var selectSql = "select * from tags";
                        var json = {
                            sql: selectSql,
                            params: [],
                            callback: callback_fun
                        };
                        DbUtil.executeSql(json);
                    }, // end of all
                    create_tag : function(tag) {
                        var self = this;
                        var callback_function =
                            function(tx, results){
                                self.all();
                            };
                        var insertSql = "insert into tags (name) values (?)";
                        var json = {
                                        sql: insertSql,
                                        params: [tag.name],
                                        callback:callback_function
                                    };
                        DbUtil.executeSql(json);
                    }, // end of create_tag
                    update_tag : function (tag) {
                        var self = this;
                        var stmt = "update tags set name = ? where id = ?";
                        var callback_fun = function(tx, rlts) {
                            self.all();
                        }; // callback_fun
            var json = {sql: stmt, params:[tag.name, tag.id], callback: callback_fun};
                        DbUtil.executeSql(json);
                    }, // end of update_tag
                    parse_results : function(results){
                        var ret = [];
                        var rows = results.rows;
                        for( i = 0; i < rows.length; i++){
                            ret.push({id: rows.item(i).id, name: rows.item(i).name});
                        }
                        return ret;
                    }, // end of parse_results
                    delete_tag : function(id){
                        var self = this;
                        var callback_function = function(tx, results) {
                            self.all();
                        };
                        var deleteSql = "delete from tags where id = ?";
                        var json = {
                            sql: deleteSql,
                            params:[id],
                            callback:callback_function
                        };
                        DbUtil.executeSql(json);
                    }, // end of delete_tag
                    get_tag : function (id, external_callback) {
                        var stmt = "select * from tags where id = ?";
                        var json = {sql: stmt, params:[id], callback: external_callback};
                        DbUtil.executeSql(json);
                    } // get_tag
                }
            });