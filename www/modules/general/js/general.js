app.controller('GeneralCtrl', function($scope, Generals){
               
               // initialize the store settings
               $scope.storename = Generals.getStorename();
               $scope.currency_values = [{
                                       id: 1,
                                       label: 'Singapore Dollars'
                                       }, {
                                       id: 2,
                                       label: 'US Dollars'
                                       }];
               
               $scope.selected_currency = $scope.currency_values[0];
               
               $scope.display_prices_values = [
                    {
                        id: 1,
                        label: "Tax inclusive"
                    }, {
                        id: 2,
                        label: "Tax exclusive"
                    }
               ];
               $scope.selected_display_price = $scope.display_prices_values[0];
               $scope.contact_name = Generals.getContactName();
               $scope.website = Generals.getWebsite();
               
               $scope.saveStoreSettingsClick = function () {
                    window.alert("save store settings click");
               };
               
               $scope.cancelStoreSettingsClick = function() {
                    window.alert("cancel store setings click");
               };
               

               
        });

var general = angular.module('general', ['ionic']);

general.factory('Generals', function(){
            return {
                getContactName: function() {
                    return "Leong";
                },
                
                getWebsite: function() {
                    return "www.iprocreation.com";
                },
                
                getStorename: function(){
                    return "iprocreation"
                }
            }
        });

