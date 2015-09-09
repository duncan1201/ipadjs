app.constant('General_CNSTs', {
             TAX_INCLUSIVE_ID: 'TAX INCLUSIVE',
             TAX_EXCLUSIVE_ID: 'TAX EXCLUSIVE'
             });

app.controller('GeneralCtrl', function($rootScope, $scope, General_CNSTs, App_URLs, SalesTaxes, Generals, Util){
               
               // initialize the store settings
               
               $scope.currency_values = [{
                                       id: "SGD",
                                       label: 'Singapore Dollars'
                                       }, {
                                       id: "USD",
                                       label: 'US Dollars'
                                       }];
               
               $scope.display_prices_values = [
                    {
                        id: General_CNSTs.TAX_INCLUSIVE_ID,
                        label: "Tax inclusive"
                    }, {
                        id: General_CNSTs.TAX_EXCLUSIVE_ID,
                        label: "Tax exclusive"
                    }
               ];

               $rootScope.$on('$includeContentLoaded', function(event, url){
                    if(url == App_URLs.general_main_content){
                        //Generals.get_store_settings();
                        Generals.get_contact_info();
                        Generals.get_address();
                              
                        var sales_tax_callback = function(tx, rlts) {
                            $scope.$apply(function(){
                                $scope.sales_taxes = SalesTaxes.parse_rlts(rlts);
                            });
                            Generals.get_store_settings();
                        };
                        SalesTaxes.all(sales_tax_callback);
                    }
                }); // end of on
               
               $scope.display_prices_change = function() {
                    console.log("display prices change..." + angular.toJson($scope.store_settings.display_prices.id));
                    if ($scope.store_settings.display_prices.id == 'TAX INCLUSIVE'){
                        var _template_url = "modules/general/templates/display_prices_alert.htm";
                        Util.alert({title: 'Are you sure?', templateUrl: _template_url, timeout: 8000});
                    }
               };
               
               $scope.cancel_store_settings_click = function() {
                    Generals.get_store_settings();
               };
               
               $scope.save_store_settings_click = function (store_settings) {
                    console.log("save store settings click" + store_settings);
                    Generals.save_store_settings(store_settings);
               };
               
               $scope.save_contact_info_click = function (contact_info) {
                    Generals.save_contact_info(contact_info);
               };
               
               $scope.save_address_click = function(address) {
                    console.log("save_address_click=" + address);
                    Generals.save_address(address);
               };
               
               $scope.same_as_physical_address_click = function() {
               console.log("same_as_physical_address_click=");
               };
               
        });