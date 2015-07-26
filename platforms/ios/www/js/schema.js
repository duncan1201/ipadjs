var mySchemas = angular.module('schemas', ['ionic']);

mySchemas.factory('Schemas', function(){
                return {
                    init: function() {
                        var db = window.sqlitePlugin.openDatabase({name: "my.db", createFromLocation: 2});
                        db.transaction(function(tx){
                                       var sqls = [
                                                   'Create table if not exists sales_taxes(id integer primary key, name text, rate real)'
                                                   'Create table if not exists general_setup(id integer primary key, key text, value text)'
                                                   ];
                                       
                               tx.executeSql('Create table if not exists sales_taxes(id integer primary key, name text, rate real)');
                               });
                        }
                    }
                });