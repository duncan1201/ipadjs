app.controller('tagCtrl',
               function($scope, $ionicModal, Tags) {
                    Tags.all_with_default_callback();
                    $ionicModal.fromTemplateUrl('tags-popup.html',
                                                function(modal) {
                                                    $scope.tagModal = modal;
                                                }, {
                                                    scope: $scope
                                                });
               
                    $scope.add_new_tag_click = function(){
                        $scope.tagModal.show();
                    };
               
                    $scope.tag_form_submit_click = function(tag) {
                        console.log("tag_form_submit_click");
                        Tags.create_tag(tag);
                        $scope.tagModal.hide();
                    };
               
                    $scope.tag_popup_cancel_click = function(){
                        $scope.tagModal.hide();
                    };
               
                    $scope.delete_click = function(id){
                        Tags.delete_tag(id);
                    };
               }); // end of tagCtrl

var tag = angular.module('tag', ['ionic', 'util']);

tag.factory('Tags',
            function(DbUtil){
                return {
                    all: function(callback_function) {
                        var self = this;
                        var selectSql = "select * from tags";
                        var json = {
                            sql: selectSql,
                            params: [],
                            callback: callback_function
                        };
                        DbUtil.executeSql(json);
                    }, // end of all
                    all_with_default_callback : function() {
                        var self = this;
                        var callback_function =
                            function(tx, results) {
                                var tags = self.parse_results(results);
                                var scope = angular.element(document.querySelector('#tags_main_content')).scope();
            
                                scope.$apply(function(){
                                    scope.tags = tags;
                                });
                            };
                        self.all(callback_function);
                    }, // end of all_with_default_callback
                    create_tag : function(tag) {
                        var self = this;
                        var callback_function =
                            function(tx, results){
                                self.all_with_default_callback();
                            };
                        var insertSql = "insert into tags (name) values (?)";
                        var json = {
                                        sql: insertSql,
                                        params: [tag.name],
                                        callback:callback_function
                                    };
                        DbUtil.executeSql(json);
                    }, // end of create_tag
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
                        var callback_function =
                            function(tx, results) {
                                self.all_with_default_callback();
                            };
                        var deleteSql = "delete from tags where id = ?";
                        var json = {
                            sql: deleteSql,
                            params:[id],
                            callback:callback_function
                        };
                        DbUtil.executeSql(json);
                    } // end of delete_tag
                }
            });