app.controller('outletCtrl', function($scope, $rootScope, App_URLs, Outlets) {
               
                    $rootScope.$on('$includeContentLoaded', function(event, url){
                        if(url == App_URLs.outlet_main_content){
                            var callback_fun = function(tx, results) {
                                var rows = results.rows;
                                var ret = [];
                                for (var i = 0; i < rows.length; i++){
                                   var item = rows.item(i);
                                   console.log(angular.toJson(item));
                                   ret.push({id: item.id, name: item.name, sales_tax: item.sales_tax, register_name: item.register_name});
                                }
                                   console.log("ret.length=" + ret.length);
                                   $scope.$apply(function(){
                                                 $scope.outlets = ret;
                                                 }) ;
                                   
                            };
                            Outlets.all(callback_fun);
                        }
                    }); // end of on
               
               });