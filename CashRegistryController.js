mainApp.factory('Excel',function($window) {
  var uri = 'data:application/vnd.ms-excel;base64,',
      template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>',
      base64 = function (s) {
          return $window.btoa(unescape(encodeURIComponent(s)));
      },
      format = function (s, c) {
          return s.replace(/{(\w+)}/g, function (m, p) {
              return c[p];
          })
      };
  return {
      tableToExcel: function (tableId, worksheetName) {
          var table = $(tableId),
              ctx = {worksheet: worksheetName, table: table.html()},
              href = uri + base64(format(template, ctx));
          return href;
      }
  };
});

mainApp.controller('CashRegistryController',function(UserService,$scope, $location,$timeout,CashRegistryService,Excel){


  $scope.exportData = function () {
      $('#stores-table').tableExport({ type: 'json', escape: 'false' });
  };

  $scope.exportToExcel=function(tableId) { // ex: '#my-table'
      var exportHref = Excel.tableToExcel(tableId, 'WireWorkbenchDataExport');
      $timeout(function(){
        var a = document.createElement('a');
        a.href=exportHref;
        var from_date=document.getElementById('from').value;
        var to_date=document.getElementById('to').value;
        a.download = from_date+"-"+to_date+".xls";
        document.body.appendChild(a);
        a.click();
        a.remove();
    },100);
  }



  $scope.DataSearch = {};
  $scope.name = "nilaf";
  $scope.successMessage = false;
  $scope.DataSearch.user_id = '';
  $scope.DataSearch.from = '';
  $scope.DataSearch.to = '';
  $scope.DataSearch.brand_id = '';
  $scope.DataSearch.category_id = '';
  $scope.store_id_global = localStorage.getItem('store_id');
  $scope.tt = false;
  $scope.pre = new Date();
  $scope.post = new Date();
  $scope.post.setDate($scope.pre.getDate() + 1);
  $scope.DataSearch.to =$scope.post;
  
  $scope.generate=function(){

   ProductService.genearePdf().then(function(response) {
       var filename = 'test';
       var link = document.createElement('a');

       var blob = new Blob([response], { type: "application/xls" });
       link.href = window.URL.createObjectURL(blob);
       link.download = filename + ".xls";
       link.click();
   });


  }

  $scope.getUsers = function()
  {
    UserService.getAllUsers($scope.store_id_global,3).then(function(response){
     
      $scope.userList=response.data.data.data;
    });

  }


  $scope.getSales = function(page)
  {
    CashRegistryService.getSalesDatas($scope.store_id_global,$scope.DataSearch.bill,$scope.DataSearch.user_id,$scope.DataSearch.from,$scope.DataSearch.to,page).then(function(response){

      $scope.salesList=response.data.data.details.data;
      $scope.total_page = response.data.data.details.page_arr;
      $scope.current_page = response.data.data.details.current_page;
      $scope.last_page = response.data.data.details.last_page


    });

  }

  $scope.getSales(1);
  $scope.getUsers();


$scope.detectLoaded = function () {
  // If this function is called, the template has been loaded...
  return true;
};

$scope.gelineItems = function(data)
{
  $scope.lineItems=data;
}

$scope.closeRegistry = function(cashreg_id) {
  $scope.close_value=document.getElementById('close_amount').value;
  CashRegistryService.updateCashRegistry(cashreg_id,$scope.close_value).then(function(response){      
    if(response.success = true){
      $scope.is_create = true;

        $scope.successMessageInfo = "Cash registry closed successfully";


      $scope.successMessage = true;
      $timeout(function () {
        $scope.successMessage = false;
    }, 1500);


     $scope.getSales(1);
    }
  });
}

$scope.clear = function()
{
  location.reload();
}

/**
* set currency 
*/
$scope.$currency_details=localStorage.getItem("currency");
if($scope.$currency_details=="USD"){
  $scope.$currency_style="$";
}else{
  $scope.$currency_style="Rs";
}

});
