app.controller('tagCtrl',
               function($scope, $ionicModal) {
               
                    $ionicModal.fromTemplateUrl('tags-popup.html',
                                                function(modal) {
                                                    $scope.tagModal = modal;
                                                }, {
                                                    scope: $scope
                                                });
               
                    $scope.add_new_tag_click = function(){
                        $scope.tagModal.show();
                    };
               
                    $scope.tag_form_submit_click = function() {
               
                    };
               
                    $scope.tag_popup_cancel_click = function(){
                        $scope.tagModal.hide();
                    };
               }); // end of tagCtrl

var tag = angular.module('tag', ['ionic', 'util']);