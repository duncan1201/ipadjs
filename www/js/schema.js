var mySchemas = angular.module('schemas', ['starter', 'ionic']);

mySchemas.factory('Schemas', function(){
                return {
                    init: function() {
                  
                        //db.transaction(function(tx){
                            //tx.executeSql('insert into sales_taxes values ("Service Tax", 1.1)');
                        //}
                    }
                }
                });
/*
mySchemas.factory('Schemas', function(){
                    return {
                        init: function() {
                            var db = window.sqlitePlugin.openDatabase({name: "my.db", createFromLocation: 2});
                  
                        }
                    }
                  });*/