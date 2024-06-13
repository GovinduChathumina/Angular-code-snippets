mainApp.controller('PaymethodController', function($scope, $window, PaymethodService,$timeout ){
 
$scope.is_create = true;
$scope.successMessage = false;
$scope.methodData = {};
    
$scope.store_id_global = localStorage.getItem('store_id');

$scope.status = [
    {
      id:1,
      name: 'Active'
    },
    {
      id:2,
      name: 'DeActive'
    }];

$scope.getMethods = function()
{
    PaymethodService.getAllMethods().then(function(response){
    $scope.methods=response.data.data.data;
  });	

}


$scope.edit = function(id){
    $scope.is_create = false;
    PaymethodService.getPaymentData(id).then(function(response){
      $scope.methodData=response.data.data;  
    });	
  }


$scope.getMethods();

$scope.back = function()
{
  $scope.is_create = true;
  $scope.methodData = {};
}

$scope.update = function(methodData,type) {
    PaymethodService.updateMethod(methodData).then(function(response){      
    if(response.statusText == 'OK'){
       $scope.methodData = {};
       $scope.getMethods();
      $scope.is_create = true;
      if(type == '1')
      {
        $scope.successMessageInfo = "Payment Method created successfully";
      }
      else
      {
        $scope.successMessageInfo = "Payment Method  updated successfully";
      }

     
      $scope.successMessage = true;
      $timeout(function () {
        $scope.successMessage = false;
    }, 3500);

    
    }
  });	
}
  
});
