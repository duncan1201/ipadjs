app.controller('customerGroupCtrl', function($rootScope, $scope, $ionicModal, CGroups, App_URLs, DbUtil){
               
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
                        $scope.customerGroupModal.hide();
                    };
                    //CGroups.create_group(group, callback);
                    if(angular.isDefined(group.id)){
                        CGroups.update_group(group, callback);
                    } else {
                        CGroups.create_group(group, callback);
                    }
               };
               
               $scope.edit_click = function(id) {
                    var callback = function(tx, rlts){
                        var rows = rlts.rows;
               
                        if(rows.length > 0){
                            var item = rows.item(0);
                            $scope.popup_title = "Edit customer group";
                            $scope.group = {id: item.id, name: item.name, group_id: item.group_id};
                            $scope.customerGroupModal.show();
                        }
                    }; // end of callback
                    CGroups.get_group(id, callback);
               };
               
               $rootScope.$on('$includeContentLoaded', function(event, url){
                    if(url == 'modules/customers/groups/templates/main_content.htm'){
                        CGroups.all();
                    }
               }); // end of on
               
               $scope.cancel_click = function() {
                    $scope.customerGroupModal.hide();
               };
});