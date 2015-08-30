app.controller('supplierCtrl',
               function($rootScope, $scope, $ionicPopup, Suppliers, App_URLs, Products, Util){
               
                    $rootScope.$on('$includeContentLoaded', function(event, url){
                        if(url == App_URLs.supplier_add_edit){
                            if(angular.isDefined($scope.edit_supplier_id)){
                                Suppliers.get_supplier_with_default_callback($scope.edit_supplier_id);
                            }
                        } else if (url == App_URLs.supplier_main_content) {
                            Suppliers.all_summary_default_callback();
                        }
                    });
               
                    $scope.new_supplier_click = function() {
                        console.log("new supplier click");
                        $rootScope.ion_content_template = App_URLs.supplier_add_edit;
                    };
               
                    $scope.edit_supplier_click = function(id){
                        console.log("edit supplier click:" + id);
                        $rootScope.ion_content_template = App_URLs.supplier_add_edit;
                        $scope.edit_supplier_id = id;
                    };
               
                    $scope.supplier_form_submit_click = function(supplier) {
                        var callback = function(tx, rlts){
                            $scope.$apply(function(){
                                $scope.edit_supplier_id = null;
                            });
                            $rootScope.$apply(function(){
                                $rootScope.ion_content_template = App_URLs.supplier_main_content;
                            });
               
                        }; // end of callback
                        if (angular.isDefined(supplier.id)){
                            Suppliers.update_supplier(supplier, callback);
                        } else {
                            Suppliers.create_new_supplier(supplier, callback);
                        }
                    };
               
                    $scope.same_as_physical_address_click = function(){
                        console.log("same_as_physical_address_click");
                    };
               
                    $scope.delete_supplier_click = function(id){
                        var callback = function(tx, rlts) {
                            var count = rlts.rows.item(0).count;
                            console.log("delete supplier click callback=" + count);
                            if (count == 0) {
                                var _title = "Are you sure?";
                                var _templateUrl = "modules/common/templates/delete_confirm.htm";
                                var confirmPopup = $ionicPopup.confirm({title: _title, templateUrl: _templateUrl});
               
                                confirmPopup.then(function(res){
                                    if(res){
                                        Suppliers.delete_supplier(id);
                                    }
                                }); // end of then
                            } else {
                                var _templateUrl = "modules/products/suppliers/templates/delete_alert.htm";
                                Util.alert({title: "Cannot delete", templateUrl: _templateUrl, timeout: 2500});
                            }
                        }; // callback
               
                        Products.is_supplier_in_use(id, callback);
                    };
               });

var supplier = angular.module('supplier', ['ionic', 'util']);

supplier.factory('Suppliers', function($rootScope, DbUtil, App_URLs){
        return {
            all_summary: function(_callback){
                 var stmt = 'select id, name, default_markup, desc from suppliers';
                 var json = {sql: stmt, params:[], callback: _callback};
                 DbUtil.executeSql(json);
            }, // end of all_summary
            all_summary_default_callback: function(){
                 var self = this;
                 
                 //var db = DbUtil.openDb();
                 var call_back = function(tx, results){
                 
                    var scope = angular.element(document.querySelector('#suppliers_main_content')).scope();
                 
                    scope.$apply(function(){
                                    scope.suppliers = self.parse_suppliers_summary(results);
                                 });
                 }; // end of call_back
                 
                 self.all_summary(call_back);
                 
            }, // end of all_summary_default_callback
            parse_suppliers_summary: function(results){
                 var rows = results.rows;
                 var ret = [];
                 for(i = 0; i < rows.length; i++){
                    var item = rows.item(i);
                    ret.push({id: item.id, name: item.name, default_markup: item.default_markup, desc: item.desc});
                 }
                 return ret;
            }, // end of parse_suppliers_summary
            create_new_supplier: function(supplier, external_callback) {
                 var self = this;
                
                 console.log("create_new_supplier=" + angular.toJson(supplier));
                 var stmt = 'insert into suppliers (name, default_markup, desc, company, contact_name, phone, mobile, fax, email, website, physical_street, physical_street2, physical_city, physical_postcode, physical_state, physical_country, postal_street, postal_street2, postal_city, postal_postcode, postal_state, postal_country) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';

                 var callback_fun = external_callback;
                 var json = {sql: stmt, params:[supplier.name, supplier.default_markup, supplier.desc, supplier.company, supplier.contact_name, supplier.phone, supplier.mobile, supplier.fax, supplier.email, supplier.website, supplier.physical_street, supplier.physical_street2, supplier.physical_city, supplier.physical_postcode, supplier.physical_state, supplier.physical_country, supplier.postal_street, supplier.postal_street2, supplier.postal_city, supplier.postal_postcode, supplier.postal_state, supplier.postal_country], callback: callback_fun};
                 DbUtil.executeSql(json);
            }, // end of create_new_supplier
            get_supplier: function(id, callback_fun){
                 var query = 'select * from suppliers where id = ?';
                 var json = {sql: query, params: [id], callback: callback_fun};
                 DbUtil.executeSql(json);
            }, // end of get_supplier
            get_supplier_with_default_callback: function(id){
                 var callback_fun = function(tx, results){
                    if (results.rows.length > 0){
                        var item = results.rows.item(0);
                 var ret = {id: item.id, name: item.name, default_markup: item.default_markup, desc: item.desc, company: item.company, contact_name: item.contact_name, phone: item.phone, mobile: item.mobile, fax: item.fax, email: item.email, website: item.website, physical_street: item.physical_street, physical_street2: item.physical_street2, physical_city: item.physical_city, physical_postcode: item.physical_postcode, physical_state: item.physical_state, physical_country: item.physical_country, postal_street: item.postal_street, postal_street2: item.postal_street2, postal_city: item.postal_city, postal_postcode: item.postal_postcode, postal_state: item.postal_state, postal_country: item.postal_country};
                        console.log("get supplier:" + angular.toJson(ret));
                        var scope = angular.element(document.querySelector('#add_edit_supplier')).scope();
                        scope.$apply(function(){
                              scope.supplier = ret;
                        });
                    }
                 };// end of callback_fun
                 this.get_supplier(id, callback_fun);
                 
            }, // end of get_supplier_with_default_callback
            delete_supplier: function(id){
                 var self = this;
                 var db = DbUtil.openDb();
                 db.transaction(function(tx){
                                    var deleteSql = "delete from suppliers where id = ?";
                                    tx.executeSql(deleteSql,
                                                  [id],
                                                  function(tx, results){
                                                    self.all_summary_default_callback();
                                                  });
                                }); // end of db.transcation
            }, // end of delete_supplier
            update_supplier: function(supplier, external_callback) {
                 console.log("update_supplier=" + angular.toJson(supplier));
                 var self = this;
                 var _callback = external_callback;
                 var stmt = "update suppliers set name = ?, default_markup = ?, desc = ?, company = ?, contact_name = ?, phone = ?, mobile = ?, fax = ?, email = ?, website = ?, physical_street = ?, physical_street2 = ?, physical_city = ?, physical_postcode = ?, physical_state = ?, physical_country = ?, postal_street = ?, postal_street2 = ?, postal_city = ?, postal_postcode = ?, postal_state = ?, postal_country = ?  where id = ?";
                 var json = {sql: stmt, params:[supplier.name, supplier.default_markup, supplier.desc, supplier.company, supplier.contact_name, supplier.phone, supplier.mobile, supplier.fax, supplier.email, supplier.website, supplier.physical_street, supplier.physical_street2, supplier.physical_city, supplier.physical_postcode, supplier.physical_state, supplier.physical_country, supplier.postal_street, supplier.postal_street2, supplier.postal_city, supplier.postal_postcode, supplier.postal_state, supplier.postal_country, supplier.id], callback: _callback};
                 DbUtil.executeSql(json);
            } // end of update_supplier
        }// end of return
});