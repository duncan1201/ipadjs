app.constant('Drop_SQLs', [
                           'Drop table if exists settings',
                           'Drop table if exists sales_taxes',
                           'Drop table if exists suppliers',
                           'Drop table if exists product_types',
                           'Drop table if exists products',
                           'Drop table if exists brands',
                           'Drop table if exists tags',
                           'Drop table if exists customers',
                           'Drop table if exists cgroups',
                           'Drop table if exists layouts',
                           'Drop table if exists layout_groups',
                           'Drop table if exists layout_group_keys',
                           'Drop table if exists outlets',
                           'Drop table if exists registers',
                           'Drop table if exists sales',
                           'Drop table if exists sale_items',
                           'Drop table if exists orders'
                           ])
.constant('Schema_SQLs',
             [
              /* settings table */
              'Create table if not exists settings(id integer primary key, tag varchar(50), name varchar(50) unique, value varchar(50))',
              
              /* sales tax table */
              'Create table if not exists sales_taxes(id INTEGER PRIMARY KEY, name VARCHAR(50) NOT NULL, rate real DEFAULT 0, system_generated BOOLEAN DEFAULT 0)',
              
              /* suppliers table */
              'Create table if not exists suppliers(id integer primary key, name varchar(100) NOT NULL, default_markup integer, desc varchar(255), company varchar(100), contact_name varchar(100), phone varchar(100), mobile varchar(100), fax varchar(50), email varchar(50), website varchar(50), physical_street varchar(50), physical_street2 varchar(50), physical_city varchar(50), physical_postcode varchar(50), physical_state varchar(50), physical_country varchar(50), postal_street varchar(50), postal_street2 varchar(50), postal_city varchar(50), postal_postcode varchar(50), postal_state varchar(50), postal_country varchar(50))',
              
              /* product types */
              'Create table if not exists product_types(id integer primary key, name varchar(50), desc varchar(100))',
              
              /* products table */
              'Create table if not exists products(id integer primary key, product_name varchar(100), product_handle varchar(100), desc varchar(255), creation_date datetime, active boolean default 1, tags_string varchar(200), product_type_id integer, brand_id integer, supplier_id integer, supply_price real, markup real, sales_tax_id integer,  retail_price_excluding_tax real, retail_price_including_tax real, stock_keeping_unit  varchar(100), current_stock integer NOT NULL DEFAULT 0, reorder_point integer, reorder_amount integer, foreign key (brand_id) references Brands(id), foreign key (supplier_id) references Suppliers(id))',
              
              /* brands table */
              'Create table if not exists brands(id integer primary key, name varchar(50), desc varchar(100))',
              
              /* tags table */
              'Create table if not exists tags(id integer primary key, name varchar(50))',
              
              /* customers */
              'Create table if not exists customers(id integer primary key, first_name varchar(50), last_name varchar(50), company varchar(50), cgroup_id integer, date_of_birth date, gender varchar(10))',
              
              /* customer groups */
              'Create table if not exists cgroups(id integer primary key, group_id varchar(50), name varchar(50))',
              
              /* Layout */
              'Create table if not exists layouts(id integer primary key, name varchar(50), creation_date datetime)',
              
              /* Layout -> layout_groups */
              'Create table if not exists layout_groups(id integer primary key, name varchar(50), is_active boolean default 0, layout_id integer)',
              
              /* Layout -> layout_keys */
              'Create table if not exists layout_group_keys(id integer primary key, layout_group_id integer, product_id integer, color varchar(50), display_name varchar(50))',
              
              /* outlets */
              'Create table if not exists outlets(id integer primary key, name varchar(50), is_current boolean, sales_tax_id integer, register_id integer, street varchar(50), city varchar(50), postcode varchar(20), state varchar(50), country varchar(50))',
              
              /* registers */
              'Create table if not exists registers(id integer primary key, name varchar(50), layout_id integer)',
              
              /* 
                sales
                valid status includes:
                -current
                -void
                -parked
                -paid
               */
              'Create table if not exists sales (id integer primary key, sales_tax_name varchar(50), sales_tax_rate real, subtotal real DEFAULT 0, total_tax real DEFAULT 0, total real DEFAULT 0, creation_date datetime, status varchar(50) DEFAULT "current")',
              
              /* sale_items */
              'Create table if not exists sale_items (id integer primary key, quantity integer, unit_price_excluding_tax real, unit_price_including_tax real, name varchar(50), sale_id integer, product_id integer)',
              
              /* orders */
              'Create table if not exists orders (id integer primary key, name varchar(50), supplier_id integer, due_at datetime)',
              ])
.constant('Initialization_SQLs', [

            'insert into layouts (id, name, creation_date) values (1, "Default Quick Keys", datetime("now"))',
            'insert into layout_groups (id, name, is_active, layout_id) values (1, "Group 1", 1, 1)',
            'insert into sales_taxes (id, name, rate, system_generated) values (1, "No Tax", 0, 1)',
            'insert into registers (id, name, layout_id) values (1, "Main Register", 1)',
            'insert into outlets(id, name, is_current, sales_tax_id, register_id) values (1, "Main outlet", 1, 1, 1)',
            
            'insert into settings (tag, name, value) values ("store_settings", "default_currency", upper("SGD"))',
            'insert into settings (tag, name, value) values ("store_settings", "display_prices", upper("Tax exclusive"))',
            'insert into settings (tag, name, value) values ("address", "physical_city", upper("Singapore"))'
          ]);



