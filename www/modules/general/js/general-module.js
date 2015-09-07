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
                
                    var stmt_sales_tax_id = "insert or replace into settings (tag, name, value) values ('store_settings', 'sales_tax_id', ?)";
                    var json_sales_tax_id = {sql: stmt_sales_tax_id, params:[store_settings.sales_tax_id]};
                
                    var callback_fun = function (tx, rlts) {
                        self.get_store_settings();
                    };
                    DbUtil.executeSqls([json_currency, json_storename, json_d_prices, json_sales_tax_id], callback_fun);
                }, // end of save_store_settings
                get_store_settings: function (external_callback) {
                    var self = this;
                    var stmt = "select * from settings where tag = 'store_settings'";
                    var callback_fun = null;
                    if (angular.isDefined(external_callback)){
                        callback_fun = external_callback;
                    } else {
                        callback_fun = function(tx, rlts) {
                            var ret = self.parse_store_settings(rlts);
                            var scope = self.get_scope();
                            scope.$apply(function() {
                                scope.store_settings = ret;
                            });
                        };
                    }
                    var json = {sql:stmt, params:[], callback:callback_fun};
                    DbUtil.executeSql(json);
                }, // end of get_store_settings
                parse_store_settings : function(rlts) {
                    var ret = {sales_tax_id: ''};
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
                        } else if (name == 'SALES_TAX_ID') {
                            ret['sales_tax_id'] = item.value;
                        }
                    }
                    return ret;
                }, // end of parse_store_settings
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
                save_address : function(address) {
                    // physical street1
                    var stmt_physical_street1 = "insert or replace into settings (tag, name, value) values ('address', 'physical_street1', ?)";
                
                    var json_physical_street1 = {sql: stmt_physical_street1, params:[address.physical_street1]};
                
                // physical street2
                var stmt_physical_street2 = "insert or replace into settings (tag, name, value) values ('address', 'physical_street2', ?)";
                
                var json_physical_street2 = {sql: stmt_physical_street2, params:[address.physical_street2]};
                
                // physical suburb
                var stmt_physical_suburb = "insert or replace into settings (tag, name, value) values ('address', 'physical_suburb', ?)";
                
                var json_physical_suburb = {sql: stmt_physical_suburb, params:[address.physical_suburb]};
                
                // physical city
                var stmt_physical_city = "insert or replace into settings (tag, name, value) values ('address', 'physical_city', ?)";
                
                var json_physical_city = {sql: stmt_physical_city, params:[address.physical_city]};
                
                // physical postcode
                var stmt_physical_postcode = "insert or replace into settings (tag, name, value) values ('address', 'physical_postcode', ?)";
                
                var json_physical_postcode = {sql: stmt_physical_postcode, params:[address.physical_postcode]};
                
                // postal street1
                var stmt_postal_street1 = "insert or replace into settings (tag, name, value) values ('address', 'postal_street1', ?)";
                
                var json_postal_street1 = {sql: stmt_postal_street1, params:[address.postal_street1]};
                
                // postal street2
                var stmt_postal_street2 = "insert or replace into settings (tag, name, value) values ('address', 'postal_street2', ?)";
                
                var json_postal_street2 = {sql: stmt_postal_street2, params:[address.postal_street2]};
                
                // postal suburb
                var stmt_postal_suburb = "insert or replace into settings (tag, name, value) values ('address', 'postal_suburb', ?)";
                
                var json_postal_suburb = {sql: stmt_postal_suburb, params:[address.postal_suburb]};
                
                // postal city
                var stmt_postal_city = "insert or replace into settings (tag, name, value) values ('address', 'postal_city', ?)";
                
                var json_postal_city = {sql: stmt_postal_city, params:[address.postal_city]};
                
                // postal postcode
                var stmt_postal_postcode = "insert or replace into settings (tag, name, value) values ('address', 'postal_postcode', ?)";
                
                var json_postal_postcode = {sql: stmt_postal_postcode, params:[address.postal_postcode]};
                
                DbUtil.executeSqls([json_physical_street1, json_physical_street2, json_physical_suburb, json_physical_city, json_physical_postcode, json_postal_street1, json_postal_street2, json_postal_suburb, json_postal_city, json_postal_postcode]);
                
                }, // end of save_address
                get_address: function() {
                    var self = this;
                    var stmt = "select * from settings where tag = 'address'";
                    var callback_fun = function(tx, rlts){
                        var ret = {};
                        var rows = rlts.rows;
                
                        for(var i = 0; i < rows.length; i++){
                            var item = rows.item(i);
                            ret[item.name.toLowerCase()] = item.value;
                        }
                        console.log("ret=" + angular.toJson(ret));
                        var scope = self.get_scope();
                        scope.$apply(function() {
                            scope.address = ret;
                        });
                    }; // end of callback_fun
                    var json = {sql: stmt,  params:[], callback: callback_fun};
                    DbUtil.executeSql(json);
                }, // end of get_address
                get_scope: function () {
                    var scope = angular.element(document.querySelector('#general_main_content')).scope();
                    return scope;
                } // end of get_scope
            }
        });

