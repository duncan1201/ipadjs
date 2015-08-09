app.controller('supplierCtrl',
               function($rootScope, $scope, Suppliers, App_URLs){
                    var main_content_scope = angular.element(document.querySelector('#suppliers_main_content')).scope();

                    if (main_content_scope == $scope){
                        Suppliers.all_summary_default_callback();
                    }
               
                    $rootScope.$on('$includeContentLoaded',
                          function(event, url){
                                   
                            if(url == App_URLs.supplier_add_edit){
                                   if(angular.isDefined($scope.edit_supplier_id)){
                                        Suppliers.get_supplier($scope.edit_supplier_id);
                                   }
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
                        $scope.edit_supplier_id = null;
                        $rootScope.ion_content_template = "modules/products/suppliers/templates/main_content.htm";
                        if (angular.isDefined(supplier.id)){
                            Suppliers.update_supplier(supplier);
                        } else {
                            Suppliers.create_new_supplier(supplier);
                        }
                    };
               
                    $scope.same_as_physical_address_click = function(){
                        console.log("same_as_physical_address_click");
                    };
               
                    $scope.delete_supplier_click = function(id){
                        Suppliers.delete_supplier(id);
                    };
               
               });

var supplier = angular.module('supplier', ['ionic', 'util']);

supplier.factory('Suppliers', function(DbUtil){
        return {
            all_summary: function(success_callback){
                 var db = DbUtil.openDb();
                 
                 db.transaction(function(tx){
                                tx.executeSql(
                                              'select id, name, default_markup, desc from suppliers',
                                              [],
                                              success_callback); // end of tx.executeSql
                                }); // end of db.transaction
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
                 var ret = "[";
                 for(i = 0; i < results.rows.length; i++){
                    //console.log("item.name=" + results.rows.item(i).name);
                    ret += "{";
                    ret += "\"id\":" + results.rows.item(i).id + ",";
                    ret += "\"name\":" + "\"" + results.rows.item(i).name + "\",";
                    ret += "\"default_markup\":" + "" + results.rows.item(i).default_markup + ",";
                    ret += "\"desc\":" + "\"" + results.rows.item(i).desc + "\"";
                    ret += "}";
                    if( i < results.rows.length - 1){
                        ret += ",";
                    }
                 }
                 ret += "]";
                 return angular.fromJson(ret);
            }, // end of parse_suppliers_summary
            create_new_supplier: function(new_supplier) {
                 var self = this;
                
                 console.log(new_supplier.company);
                 console.log(new_supplier.contact_name);
                 console.log(new_supplier.phone);
                var db = DbUtil.openDb();
                 console.log("before inserting into suppliers table");
                 var insertSql = 'insert into suppliers (name, default_markup, desc, company, contact_name, phone, mobile, fax, email, website) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
                db.transaction(function(tx){
                               tx.executeSql(insertSql,
                                             [new_supplier.name, new_supplier.default_markup, new_supplier.desc, new_supplier.company, new_supplier.contact_name, new_supplier.phone, new_supplier.mobile, new_supplier.fax, new_supplier.email, new_supplier.website],
                                             function(tx, results){
                                                self.all_summary_default_callback();
                                             }, function(tx, e){
                                             console.log("error=" + e.message);
                                             });
                }); // end of db.transction
            }, // end of create_new_supplier
            get_supplier: function(id){
                 var db = DbUtil.openDb();
                 
                 db.transaction(function(tx){
                                tx.executeSql('select * from suppliers where id = ?',
                                              [id],
                                              function(tx, results){
                                                if (results.rows.length > 0){
                                                    var item = results.rows.item(0);
                                                    var ret = "{";
                                                    ret += "\"id\":" + item.id + ",";
                                                    ret += "\"name\":\"" + item.name + "\",";
                                                    ret += "\"default_markup\":" + item.default_markup + ",";
                                                    ret += "\"desc\":\"" + item.desc + "\"";
                                                    ret += "}";
                                              console.log("get supplier:" + ret);
                                              var scope = angular.element(document.querySelector('#add_edit_supplier')).scope();
                                              scope.$apply(function(){
                                                           scope.supplier = angular.fromJson(ret);
                                                           });
                                                }
                                              }); // end of tx.executeSql
                                }); // end of db.transction
            }, // end of get_supplier
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
            update_supplier: function(supplier){
                 var call_back = function(){
                                    this.all_summary_default_callback();
                                };
                 
                 var db = DbUtil.openDb();
                 db.transaction(function(tx){
                                    var updateSql = "update suppliers set name = ?, default_markup = ?, desc = ?, company = ? where id = ?";
                                    tx.executeSql(updateSql, [supplier.name, supplier.default_markup, supplier.desc, supplier.company, supplier.id], call_back);
                                });
            } // end of update_supplier
        }// end of return
});