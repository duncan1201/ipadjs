app.constant('Schema_SQLs',
             [
              /* development purpose */
              'Drop table if exists sales_taxes',
              //'Drop table if exists suppliers',
              //'Drop table if exists product_types',
              //'Drop table if exists products',
              //'Drop table if exists brands',
              //'Drop table if exists tags',
              //'Drop table if exists layouts',
              //'Drop table if exists layout_groups',
              //'Drop table if exists layout_group_keys',
              
              /* sales tax table */
              'Create table if not exists sales_taxes(id INTEGER PRIMARY KEY, name VARCHAR(255) NOT NULL, rate real NOT NULL, system_generated BOOLEAN DEFAULT 0)',
              'insert into sales_taxes (name, rate, system_generated) values ("No Tax", 0, 1)',
              
              /* suppliers table */
              
              'Create table if not exists suppliers(id integer primary key, name varchar(100) NOT NULL, default_markup integer, desc varchar(255), company varchar(100), contact_name varchar(100), phone varchar(100), mobile varchar(100), fax varchar(50), email varchar(50), website varchar(50), physical_street varchar(50), physical_city varchar(50), physical_postcode varchar(50), physical_state varchar(50), physical_country varchar(50), postal_street varchar(50), postal_city varchar(50), postal_postcode varchar(50), postal_state varchar(50), postal_country varchar(50))',
              
              /* product types */
              'Create table if not exists product_types(id integer primary key, name varchar(50), desc varchar(100))',
              
              /* products table */
              'Create table if not exists products(id integer primary key, product_name varchar(100), product_handle varchar(100), desc varchar(255), creation_date datetime, product_type_id integer, brand_id integer, supplier_id integer, supply_price real, markup real, stock_keeping_unit  varchar(100), current_stock integer, reorder_point integer, reorder_amount integer, foreign key (brand_id) references Brands(id), foreign key (supplier_id) references Suppliers(id))',
              
              /* brands table */
              'Create table if not exists brands(id integer primary key, name varchar(50), desc varchar(100))',
              
              /* tags table */
              'Create table if not exists tags(id integer primary key, name varchar(50))',
            
              /* products and tags join table */
              'Create table if not exists products_join_tags(id integer primary key, product_id integer, tag_id integer)',
              
              /* Layout */
              'Create table if not exists layouts(id integer primary key, name varchar(50), creation_date datetime)',
              
              /* Layout -> layout_groups */
              'Create table if not exists layout_groups(id integer primary key, name varchar(50), is_active boolean default 0, layout_id integer)',
              
              /* Layout -> layout_keys */
              'Create table if not exists layout_group_keys(id integer primary key, layout_group_id integer, product_id integer, color varchar(50), display_name varchar(50))'
              
              ]);