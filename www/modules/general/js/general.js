app.controller('GeneralCtrl', function($rootScope, $scope, App_URLs, Generals){
               
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
                        id: "Tax inclusive".toUpperCase(),
                        label: "Tax inclusive"
                    }, {
                        id: "Tax exclusive".toUpperCase(),
                        label: "Tax exclusive"
                    }
               ];

               
               $rootScope.$on('$includeContentLoaded', function(event, url){
                    if(url == App_URLs.general_main_content){
                        $scope.storename = Generals.getStorename();
                        $scope.contact_name = Generals.getContactName();
                        $scope.website = Generals.getWebsite();
                        Generals.get_store_settings();
                        Generals.get_contact_info();
                        
                    }
                }); // end of on
               
               $scope.save_store_settings_click = function (store_settings) {
                    console.log("save store settings click" + store_settings);
                    Generals.save_store_settings(store_settings);
               };
               
               $scope.save_contact_info_click = function (contact_info) {
                    Generals.save_contact_info(contact_info);
               };
               
        });

var general = angular.module('general', ['ionic', 'util']);

general.factory('Generals', function(DbUtil){
            return {
                
                save_store_settings: function (store_settings) {
                    var self = this;
                
                    var stmt_currency = "insert or replace into settings (tag, name, value) values ('store_settings', 'default_currency', ?)";
                    var json_currency = {sql: stmt_currency, params:[store_settings.default_currency.id]};
                
                    var stmt_storename = "insert or replace into settings (tag, name, value) values ('store_settings', 'storename', ?)";
                    var json_storename = {sql: stmt_storename, params:[store_settings.storename]};
                
                    var stmt_d_prices = "insert or replace into settings (tag, name, value) values ('store_settings', 'display_prices', ?)";
                    var json_d_prices = {sql: stmt_d_prices, params:[store_settings.display_prices.id]};
                
                    var callback_fun = function (tx, rlts) {
                        self.get_store_settings();
                    };
                    DbUtil.executeSqls([json_currency, json_storename, json_d_prices], callback_fun);
                }, // end of save_store_settings
                get_store_settings: function (external_callback) {
                    var self = this;
                    var stmt = "select * from settings where tag = 'store_settings'";
                    var callback_fun = null;
                    if (angular.isDefined(external_callback)){
                        callback_fun = external_callback;
                    } else {
                        callback_fun = function(tx, rlts) {
                            var ret = {};
                            var rows = rlts.rows;
                            for (var i = 0; i < rows.length; i++){
                                var item = rows.item(i);
                                var name = item.name.toUpperCase();
                                if (name == 'DEFAULT_CURRENCY'){
                                    ret['default_currency'] = {id:item.value};
                                } else if (name == 'DISPLAY_PRICES'){
                                    ret['display_prices'] = {id:item.value};
                                } else if (name == 'STORENAME') {
                                    ret['storename'] = item.value;
                                }
                            }
                            var scope = self.get_scope();
                            scope.$apply(function() {
                                scope.store_settings = ret;
                            });
                        };
                    }
                    var json = {sql:stmt, params:[], callback:callback_fun};
                    DbUtil.executeSql(json);
                }, // end of get_store_settings
                get_contact_info: function () {
                    var self = this;
                    var stmt = "select * from settings where tag = 'contact_info'";
                    var callback_fun = function(tx, rlts) {
                        var ret = {};
                        var rows = rlts.rows;
                
                        for (var i = 0; i < rows.length; i++){
                            var item = rows.item(i);
                            ret[item.name.toLowerCase()] = item.value;
                        } // end of for
                        var scope = self.get_scope();
                        scope.$apply(function() {
                            scope.contact_info = ret;
                        });
                    }; // end of callback_fun
                    var json = {sql: stmt, params:[], callback: callback_fun};
                    DbUtil.executeSql(json);
                }, // end of get_contact_info
                save_contact_info: function (contact_info) {
                console.log("contact_info=" + angular.toJson(contact_info));
                    // contact name
                    var stmt_contact_name = "insert or replace into settings (tag, name, value) values ('contact_info', 'contact_name', ?)";
                
                    var json_contact_name = {sql: stmt_contact_name, params:[contact_info.contact_name]};
                
                    // website
                    var stmt_website = "insert or replace into settings (tag, name, value) values ('contact_info', 'website', ?)";
                
                    var json_website = {sql: stmt_website, params:[contact_info.website]};
                
                    // email
                    var stmt_email = "insert or replace into settings (tag, name, value) values ('contact_info', 'email', ?)";
                
                    var json_email = {sql: stmt_email, params:[contact_info.email]};
                
                    // phone
                    var stmt_phone = "insert or replace into settings (tag, name, value) values ('contact_info', 'phone', ?)";
                
                    var json_phone = {sql: stmt_phone, params:[contact_info.phone]};
                
                    DbUtil.executeSqls([json_contact_name, json_website, json_email, json_phone]);
                }, // end of save_contact_info
                get_scope: function () {
                    var scope = angular.element(document.querySelector('#general_main_content')).scope();
                    return scope;
                }, // end of get_scope
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

