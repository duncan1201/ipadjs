app.controller('outletCtrl',
               function($scope, $rootScope, App_URLs, Outlets, SalesTaxes) {
               
                    $scope.register_form_submit_click = function(register) {
                    }; // end of register_form_submit_click
               
                    $rootScope.$on('$includeContentLoaded', function(event, url) {
                        if (url == App_URLs.register_add_edit){
                                   console.log(App_URLs.register_add_edit);
                        }
                    };// end of on
               
               
               });