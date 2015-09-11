app.controller('customerCtrl', function($rootScope, $scope, $ionicModal, Customers, App_URLs, DbUtil){
               
               $scope.add_click = function(){
                    $rootScope.ion_content_template = 'modules/customers/customers/templates/add_edit_customer.htm';
               };
               
               $rootScope.$on('$includeContentLoaded', function(event, url){
                    if(url == 'modules/customers/customers/templates/main_content.htm'){
                              
                    }
                }); // end of on
               
});