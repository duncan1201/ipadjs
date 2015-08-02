app.controller('supplierCtrl', function($rootScope, $scope, Suppliers){
               
                    Suppliers.all_summary();
               
                    $scope.new_supplier_click = function() {
                        console.log("new supplier click");
                        $rootScope.ion_content_template = "modules/products/suppliers/templates/add_edit_supplier.htm";
                    };
               
                    $scope.edit_supplier_click = function(id){
                        console.log("edit supplier click:" + id);
                        $rootScope.ion_content_template = "modules/products/suppliers/templates/add_edit_supplier.htm";
                        Suppliers.get_supplier(id);
                    };
               
                    $scope.supplier_form_submit_click = function(supplier) {
                        Suppliers.create_new_supplier(supplier);
                    };
               
                    $scope.same_as_physical_address_click = function(){
                        console.log("same_as_physical_address_click");
                    };
               
                    $scope.delete_supplier_click = function(id){
                        console.log("delete click:" + id);
                        Suppliers.delete_supplier(id);
                    };
               
               });

var supplier = angular.module('supplier', ['ionic', 'util']);

salesTax.factory('Suppliers', function(DbUtil){
        return {
            all_summary: function(){
                 var db = DbUtil.openDb();
                 db.transaction(function(tx){
                                tx.executeSql(
                                              'select id, name, default_markup, desc from suppliers',
                                              [],
                                              function(tx, results){
                                              console.log("suppliers rows.length=" + results.rows.length);
                                              var ret = "[";
                                              for(i = 0; i < results.rows.length; i++){
                                                console.log("item.name=" + results.rows.item(i).name);
                                                ret += "{";
                                                ret += "\"id\":" + results.rows.item(i).id + ",";
                                                ret += "\"name\":" + "\"" + results.rows.item(i).name + "\",";
                                                ret += "\"default_markup\":" + "" + results.rows.item(i).default_markup + ",";
                                                ret += "\"desc\":" + "\"" + results.rows.item(i).desc + "\"";
                                                ret += "}"
                                                if( i < results.rows.length - 1){
                                                    ret += ",";
                                                }
                                              }
                                              ret += "]";
                                              console.log(ret);
                                              
                                              var scope = angular.element(document.querySelector('#suppliers_main_content')).scope();
                                              
                                              console.log("scope=" + scope);
                                              scope.$apply(function(){
                                                                scope.suppliers = angular.fromJson(ret);
                                                           });
                                }); // end of tx.executeSql
                }); // end of db.transaction
            }, // end of all_summary
            create_new_supplier: function(new_supplier) {
                 var self = this;
                console.log("Suppliers.save=" + new_supplier.name);
                
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
                                                self.all_summary();
                                                console.log("after creat_new_supplier...");
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
                                                    self.all_summary();
                                                  });
                                }); // end of db.transcation
            } // end of delete_supplier
        }// end of return
});