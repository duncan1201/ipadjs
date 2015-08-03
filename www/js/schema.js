app.constant('Schema_SQLs',
             [
              /* development purpose */
              'Drop table if exists sales_taxes',
              //'Drop table if exists suppliers',
              'Drop table if exists products',
              
              /* sales tax table */
              'Create table if not exists sales_taxes(id INTEGER PRIMARY KEY, name VARCHAR(255) NOT NULL, rate real NOT NULL, system_generated BOOLEAN DEFAULT 0)',
              'insert into sales_taxes (name, rate, system_generated) values ("No Tax", 0, 1)',
              
              /* suppliers table */
              
              'Create table if not exists suppliers(id integer primary key, name varchar(100) NOT NULL, default_markup integer, desc varchar(255), company varchar(100), contact_name varchar(100), phone varchar(100), mobile varchar(100), fax varchar(50), email varchar(50), website varchar(50), physical_street varchar(50), physical_city varchar(50), physical_postcode varchar(50), physical_state varchar(50), physical_country varchar(50), postal_street varchar(50), postal_city varchar(50), postal_postcode varchar(50), postal_state varchar(50), postal_country varchar(50))',
              
              /* products table */
              'Create table if not exists products(id integer primary key, product_name varchar(100), product_handle varchar(100), desc varchar(255), supplier_id integer)',
              
              /* brands table */
              'Create table if not exists brands(id integer primary key, name varchar(50), desc varchar(100))'
              ]);

var mySchemas = angular.module('schemas', ['ionic']);

mySchemas.factory('Schemas',
                  function(){
                    return {
                        init: function() {
                  
                        //db.transaction(function(tx){
                            //tx.executeSql('insert into sales_taxes values ("Service Tax", 1.1)');
                        //}
                        } // end of init
                    } // end of return
                  });
/*
                  });*/