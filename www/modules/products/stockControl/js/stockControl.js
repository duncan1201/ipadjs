app.controller('stockControlCtrl', function($rootScope, $scope, App_URLs, StockControl){
            
            $scope.order_stock_click = function () {
               $rootScope.ion_content_template = "modules/products/stockControl/templates/add_order.htm";
            };
               
            $scope.new_order_form_submit_click = function (order) {
               StockControl.create_order(order);
            };
               
            $rootScope.$on('$includeContentLoaded', function(event, url){
                if (url == App_URLs.stock_ctrl_main_content){
                           
                }
            });
               
});