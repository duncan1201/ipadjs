app.controller('customerGroupCtrl', function($rootScope, $scope, $ionicModal, CGroups, App_URLs){
               
               $ionicModal.fromTemplateUrl('modules/customers/groups/templates/group-popup.htm',
                                           function(modal) {
                                                $scope.customerGroupModal = modal;
                                           }, {
                                                scope: $scope
                                           });
               
               $scope.add_click = function() {
                    console.log('add click...');
                    $scope.popup_title = "Create customer group";
                    $scope.group = {};
                    $scope.customerGroupModal.show();
               };
               
               $scope.group_form_submit_click = function(group) {
                    var callback = function(tx, rlts){
                        console.log("angular.toJson(rlts)=" + angular.toJson(rlts));
                        CGroups.all();
                    };
                    CGroups.create_group(group, callback);
               };
               
               $rootScope.$on('$includeContentLoaded', function(event, url){
                    if(url == 'modules/customers/groups/templates/main_content.htm'){
                        CGroups.all();
                    }
               }); // end of on
});