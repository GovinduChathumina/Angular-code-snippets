mainApp.controller('ProductController', function($location,VariantTypeService,$q, $scope, $window, ProductService, $timeout, BrandService, CategoryService, SubcategoryService, StocksService) {

  $scope.variantTypeCount = 0;
  $scope.first_param = {
      "varant": "",
      "parameter": ""
  };
  var absUrl = $location.absUrl().split('/');
  $scope.array = absUrl[3];
  $scope.filter1 = '';
  $scope.curPage = 1,
  $scope.var_type_exit = false;
$scope.itemsPerPage = 3,
$scope.maxSize = 5;
  if($scope.array == 'product_view')
  {
    $scope.selected = 1;
  }
  else if($scope.array == 'variant_view')
  {
    $scope.selected = 2;
  }
  else if($scope.array == 'product_create')
  {
    $scope.selected = 3;
  }
  $scope.pageSize = 5;
  $scope.pageMap = {
    "1": []
};

  $scope.tagOptions = [ 'Awesome', 'Neat', 'Stupendous' ];
  $scope.tags = ['Awesome', 'Great'];
  $scope.tagsConfig = {
    delimiter: ',',
    persist: false,
    plugins: ['remove_button'],
    create: function (input) {
      return {
        value: input,
        text: input
      }
    },
    onInitialize: function (selectize) {
      //console.log('Initialized', selectize);

    }
  }

  $scope.variantTypeCounterArray = [];
  $scope.variantTypeCounterArray.push($scope.first_param);
  $scope.combined_variant = [];
  $scope.successMessageSubCategoryBool = false;
  $scope.combined_unit= [];

  var img = document.querySelector("#img_div img");
  $scope.successMessageUpProd = false;
  $scope.locationDataSearch = {};
  $scope.locationDataSearch.name = '';
  $scope.locationDataSearch.bracode = '';
  $scope.locationDataSearch.brand_id = '';
  $scope.locationDataSearch.category_id = '';
  $scope.is_brand_exit = true;
  $scope.is_cat_exit = true;
  $scope.is_unit_exit = true;
  $scope.is_product_exit = true;
  $scope.is_type_exit = true;
  $scope.is_sub_cat_exit = true;
  $scope.productObj = new productInt();
  $scope.product_image = "";
  $scope.is_main = true;
  $scope.successMessage = false;
  $scope.successMessageVar = false;
  $scope.successMessageTypeBool = false;
  $scope.head1 = false;
  $scope.is_main1 = true;
  $scope.amount = /^[0-9]*$/;
  $scope.imageName = '';
  $scope.successMessageVarAdd = false;
  $scope.successMessageBrandBool = false;
  $scope.successMessageCategoryBool = false;
  $scope.successMessageModelBool = false;
  $scope.successMessageFalse = false;
  $scope.is_selected_variant_view = true;
  $scope.varaint_length = false;
  $scope.unit_length = false;
  $scope.successMessageUnitAdd = false;
  $scope.successMessageUnitBool = false;
  $scope.UnitData = {};
  $scope.brandData = {};
  $scope.ration_selected = false;
  $scope.selected_variant = {};
  $scope.successMessageUpVar = false;
  $scope.productModel = {};
  $scope.subcategoryData = {};
  $scope.categoryData = {};
  $scope.variantTypeData = {};
  $scope.variantTypeList;
  $scope.delete_obj = {};
  $scope.delete_product = {};
  $scope.stockData = {};
  $scope.stockData.myDate = new Date();
  $scope.stockData.is_warranty = false;
  $scope.stockData.is_components = false;
  $scope.successMessageUpVarFal = false;
  $scope.stockData.warranty_period = '';
  $scope.stockData.warranty_period = '';
  $scope.model_name = /^[a-zA-Z0-9 ]{3,50}$/;
  $scope.pur_unit = /[^a-zA-Z]/;
  $scope.unit_name = /^[a-zA-Z0-9 ]{1,50}$/;
  $scope.cat_name = /^[a-zA-Z0-9 ]{1,50}$/;


  function productInt() {
    this.product_name;
    this.brand_id;
    this.model_id;
    this.category_id;
    this.sub_category_id;
    this.variant_types;
    this.variantParams;
    this.description = '';
    this.price;
    this.price2;
    this.stock_status;
    this.reorder_level = 0;
    this.notify_time = 0;
    this.is_warranty = false;
    this.is_expiry = false;
    this.web_enable;
    this.api_enable;
    this.columns;
    this.purchase_unit;
}

  $scope.store_id_global = localStorage.getItem('store_id');

  $scope.filteredTodos = []
  ,$scope.currentPage = 1
  ,$scope.numPerPage = 10
  ,$scope.maxSize = 5;

  $scope.makeTodos = function() {
    $scope.todos = [];
    for (i=1;i<=1000;i++) {
      $scope.todos.push({ text:'todo '+i, done:false});
    }
  };
  $scope.makeTodos();

  $scope.numPages = function () {
    return Math.ceil($scope.todos.length / $scope.numPerPage);
  };

  $scope.$watch('currentPage + numPerPage', function() {
    var begin = (($scope.currentPage - 1) * $scope.numPerPage)
    , end = begin + $scope.numPerPage;

    $scope.filteredTodos = $scope.todos.slice(begin, end);
  });


  $scope.status = [{
          id: 1,
          name: 'Active'
      },
      {
          id: 2,
          name: 'Deactive'
      }
  ];

  $scope.getUnits = function() {
    ProductService.getAllUnits($scope.store_id_global).then(function(response) {
        $scope.units = response.data.data.data;
        //$scope.categoryData=response.data;
    });

}
   $scope.getUnits();


   $scope.addUnitDe = function(UnitData) {
    UnitData.location_id = $scope.store_id_global;
      BrandService.createUnit(UnitData).then(function(response) {
          $scope.UnitData = {};
          $scope.successMessageUnit = "Brand created successfully";
          $scope.successMessageUnitBool = true;
          $scope.getUnits();
          $timeout(function() {
              $scope.successMessageUnitBool = false;
          }, 1000);


      });
  }


  $scope.getBrands = function() {
      BrandService.getAllBrand($scope.locationDataSearch.name,$scope.store_id_global,0).then(function(response) {
          $scope.brandList = response.data.data.data;
          //$scope.categoryData=response.data;
      });

  }
  $scope.getBrands();


  $scope.getAllVariants = function(page) {
      ProductService.getAllVariants($scope.locationDataSearch.name, $scope.store_id_global,$scope.locationDataSearch.bracode,$scope.locationDataSearch.brand_id,$scope.locationDataSearch.category_id,page).then(function(response) {
          $scope.variantList = response.data.data.data;
          $scope.total = response.data.data.total;
          $scope.total_page_va = response.data.data.page_arr;
          $scope.current_page = response.data.data.current_page;
          $scope.last_page1 = response.data.data.last_page


      });

  }

//   $scope.numOfPages = function () {
//     return Math.ceil($scope.total / $scope.itemsPerPage);

//     };
  $scope.getAllVariants(1);



  $scope.getAllVariantTypes = function() {


      VariantTypeService.getVariants($scope.locationDataSearch.name).then(function(response) {
        $scope.variantTypeList = response.data.data.data;
        //$scope.categoryData=response.data;
    });

  }
  $scope.getAllVariantTypes();






  $scope.getProductModel = function() {
      ProductService.getModels($scope.locationDataSearch.name).then(function(response) {
          $scope.modelList = response.data.data.data;
          //$scope.categoryData=response.data;
      });


  }
  $scope.getProductModel();



  $scope.getAllCategory = function() {
      CategoryService.getAllCategories($scope.locationDataSearch.name,$scope.store_id_global,0).then(function(response) {
          $scope.categoryList = response.data.data.data;
      });


  }
  $scope.getAllCategory();

  $scope.getAllSubCat = function()
  {
    console.log("test01");
    SubcategoryService.getAllSubCategory($scope.store_id_global,0).then(function(response){
      console.log(response);
      $scope.subCategoryList=response.data.data.data;  
    });	
  }

  $scope.getAllSubCat();

  $scope.updateSubCategory = function(subcategoryData) {
    SubcategoryService.updateCategory(subcategoryData).then(function(response){      
      if(response.data.success=true){
        $scope.subcategoryData = {};
        $scope.is_create = true;
        $scope.successMessageInfo = "Sub Category Updated Successfully";
   
        $scope.successMessage = true;
        $timeout(function () {
          $scope.successMessage = false;
      }, 1500);

      $scope.getAllSubCat();
      }
    });	
  }


  $scope.variantArray = [];

  $scope.image = "";
  $scope.dat_obj = {};

  $scope.addBrand = function(brandData) {
    brandData.store_id = $scope.store_id_global;
      BrandService.createBrand(brandData).then(function(response) {
          $scope.brandData = {};
          $scope.successMessageBrand = "Brand created successfully";
          $scope.successMessageBrandBool = true;
          $scope.getBrands();
          $timeout(function() {
              $scope.successMessageBrandBool = false;
          }, 1000);


      });
  }

  $scope.updateBrandd = function(brandData) {


      BrandService.updateBrand(brandData).then(function(response) {
          $scope.brandData = {};
          $scope.successMessageBrand = "Brand updated created successfully";
          $scope.successMessageBrandBool = true;
          brandData.is_edit = false;
          $scope.getBrands();
          $timeout(function() {
              $scope.successMessageBrandBool = false;
          }, 1000);


      });
  }

  $scope.createeModel = function(productModel) {
      ProductService.createModels(productModel).then(function(response) {
          $scope.productModel = {};
          $scope.successMessageModel = "Model created successfully";
          $scope.successMessageModelBool = true;
          $scope.getProductModel();
          $timeout(function() {
              $scope.successMessageModelBool = false;
          }, 1000);


      });
  }


  $scope.updateModel = function(productModel) {
      ProductService.updateModels(productModel).then(function(response) {
          $scope.productModel = {};
          $scope.successMessageModel = "Model update successfully";
          $scope.successMessageModelBool = true;
          productModel.is_edit = false;
          $scope.getProductModel();
          $timeout(function() {
              $scope.successMessageModelBool = false;
          }, 1000);


      });
  }


  $scope.createCategory = function(categoryData) {
    categoryData.store_id = $scope.store_id_global;
      CategoryService.createCategory(categoryData).then(function(response) {
          $scope.categoryData = {};
          $scope.successMessageCategory = "Category created successfully";
          $scope.successMessageCategoryBool = true;
          $scope.getAllCategory();
          $timeout(function() {
              $scope.successMessageCategoryBool = false;
          }, 1000);


      });
  }


  $scope.updateCategory = function(categoryData) {
      CategoryService.updateCategory(categoryData).then(function(response) {
          $scope.categoryData = {};
          $scope.successMessageCategory = "Category update successfully";
          $scope.successMessageCategoryBool = true;
          categoryData.is_edit = false;
          $scope.getAllCategory();
          $timeout(function() {
              $scope.successMessageCategoryBool = false;
          }, 1000);


      });
  }




  $scope.addVariantType = function() {
      $scope.variantTypeCount++;

      $scope.variantTypeCounterArray.push($scope.first_param);
  }

  $scope.remove = function(index) {

      $scope.variantTypeCounterArray.splice(index, 1);
  }

  $scope.getProductList = function(page) {
      ProductService.getAllStoreProducts($scope.store_id_global,page).then(function(response) {

          $scope.storeProductArray = response.data.data;
          $scope.total_page = response.data.page_arr;
          $scope.current_page = response.data.current_page;
          $scope.last_page = response.data.last_page

      });



  }


  $scope.getclick = function(obj) {
      // ProductService.getAllStocks(id).then(function(response){

      //   $window.location.href="stocksadd/"+id+'/1';


      // });
      $scope.head1 = true;
      $scope.product = obj;

      $scope.stockData.selling_price = $scope.product.regular_price;

      $scope.stockData.selling_price2 = $scope.product.regular_price2;

      $scope.stockData.variant_id = obj.id;
  }

  $scope.getProductList(1);



  var loopPromises = [];
  $scope.saveProduct = function(productObj) {
      productObj.store_id = localStorage.getItem('store_id');
      ProductService.addProductNew(productObj).then(function(response) {

          $scope.productObj = {};
          $scope.productObj.is_warranty = false;
          $scope.successMessageInfo = "Product created successfully";
          $scope.combined_variant = [];
          $scope.varaint_length = false;
          $scope.variantArray = [];

          $scope.productObj.unit_variant = [{
            purchase_unit : '',
            vari : [{
                selling_unit: '',
                ratio: '',
                default: true
            }]

        }];

        $scope.productObj.columns = [{
            variant: '1',
            parameter: ''
        }];


          $scope.successMessage = true;
          $timeout(function() {
              $scope.successMessage = false;

              //document.getElementById('product_view_path').click()
          }, 2500);




      }, function errorCallback(response) {

        $scope.successMessageInfo = "Product creation failed";
        $scope.successMessageFalse = true;
        $timeout(function() {
            $scope.successMessageFalse = false;
            //document.getElementById('product_view_path').click()
        }, 2500);

	});



  }

  $scope.resetProduct = function()
  {


    function productInt() {
        this.product_name;
        this.brand_id;
        this.model_id;
        this.category_id;
        this.sub_category_id;
        this.variant_types;
        this.variantParams;
        this.description = '';
        this.price;
        this.price2;
        this.stock_status;
        this.reorder_level = 0;
        this.notify_time = 0;
        this.is_warranty = false;
        this.is_expiry = false;
        this.web_enable;
        this.api_enable;
        this.columns;
        this.purchase_unit;
    }

    $scope.productObj = new productInt();
    $scope.combined_variant = [];
    $scope.variantArray = [];

    $scope.productObj.unit_variant = [{
        purchase_unit : '',
        vari : [{
            selling_unit: '',
            ratio: '',
            default: true
        }]

    }];

    $scope.productObj.columns = [{
        variant: '1',
        parameter: ''
    }];
  }



  $scope.changeCategory = function(categoryId) {
      ProductService.getSubCategoriesforCategories(categoryId).then(function(response) {

          $scope.subcategoryList = response.data['details'];
          $scope.category_name = response.data['category']['category_name'];
      });
  }


  $scope.viewVariants = function(id) {

      ProductService.getAllVariantProducts(id).then(function(response) {

          $scope.is_main1 = false;
          $scope.variantArray = response.data;

      });
  }

  $scope.backTo = function() {
      $scope.is_main1 = true;
      $scope.is_main = true;
      $scope.variantArray = [];

  }



  $scope.view = function(obj) {
      $scope.is_main = false;
      $scope.product = obj;
      $scope.image = obj.pic;
  }

  $scope.back = function() {
      $scope.is_main = true;
      $scope.viewVariants($scope.product.product_id);
  }

  $scope.uploadFile = function(image) {

      $scope.product.image = image;

      ProductService.addImage($scope.product).then(function(response) {

          $scope.successMessageInfo = "Image Uploaded successfully";
          $scope.imageName = '';
          $scope.successMessage = true;
          $timeout(function() {
              $scope.successMessage = false;
          }, 3500);

      });
  };



  $scope.back1 = function() {
      $scope.head1 = false;
      $scope.is_main = true;
  }


  $scope.addStock = function(data) {

      data.location_id = $scope.store_id_global;
      StocksService.addStockList(data).then(function(response) {
          $scope.successMessageInfo = "Stock add successfully";
          $scope.stockData = {};
          $scope.successMessage = true;
          $timeout(function() {
              $scope.successMessage = false;
              $scope.head1 = false;
              $scope.is_main = true;

          }, 3500);

      });


  }

//   $scope.productObj.columns = [{
//       variant: '',
//       parameter: ''
//   }];
  $scope.productObj.columns = [{
    variant: '1',
    parameter: ''
}];

//   $scope.productObj.columns = [{
//     variant: '1',
//     parameter: ''
// }];

$scope.resetVar = function()
{
    $scope.productObj.columns = [{
        variant: '1',
        parameter: ''
    }];
}

  $scope.productObj.unit_variant = [{
    purchase_unit : '',
    vari : [{
        selling_unit: '',
        ratio: '',
        default: true
    }]

}];

  $scope.addNewColumn = function() {
      var newItemNo = $scope.productObj.columns.length + 1;
      $scope.productObj.columns.push({
          'colId': 'col' + newItemNo
      });
  };


  $scope.addNewUnit = function() {
    var newItemNoo = $scope.productObj.unit_variant[0].vari.length + 1;
    $scope.productObj.unit_variant[0].vari.push({
        'colId': 'col' + newItemNoo
    });
};

$scope.setDefaul = function(index) {
     for(var i=0;i<$scope.productObj.unit_variant[0].vari.length;i++)
     {
        if(i==index)
        {
            $scope.productObj.unit_variant[0].vari[i].default = true;
        }
        else
        {
            $scope.productObj.unit_variant[0].vari[i].default = false;
        }

     }

};


  $scope.removeColumn = function(index) {
      // remove the row specified in index


      if ($scope.productObj.columns.length == 1) {
          $scope.successMessagenewVar = 'unable to delete';
          $scope.successMessageVarAdd = true;
          $timeout(function() {
              $scope.successMessageVarAdd = false;
          }, 1000);
      } else {




          $scope.productObj.columns.splice(index, 1);
      }
  };

  $scope.removeUnit = function(index) {

    if ($scope.productObj.unit_variant[0].vari.length == 1) {
        $scope.successMessagenewUnit = 'cannot delete default value';
        $scope.successMessageUnitAdd = true;
        $timeout(function() {
            $scope.successMessageUnitAdd = false;
        }, 1000);
    } else {
        var item = $scope.productObj.unit_variant[0].vari[index];

            if(item.default)
            {
                if(index == 0)
                {
                    $scope.productObj.unit_variant[0].vari[index+1].default = true;
                }
                else{
                    $scope.productObj.unit_variant[0].vari[index-1].default = true;
                }

            }

                $scope.productObj.unit_variant[0].vari.splice(index, 1);


    }
};



  $scope.generate = function() {
      $scope.combined_variant = [];
      $scope.para_set = [];
      $scope.message = '';
      if ($scope.productObj.columns.length == 0) {
          $scope.successMessageInfoVar = 'add new';
          $scope.imageName = '';
          $scope.successMessageVar = true;
          $timeout(function() {
              $scope.successMessageVar = false;
          }, 500);


      } else {
          for (var i = 0; i < $scope.productObj.columns.length; i++) {
              $scope.is_un = false;
              var para = $scope.productObj.columns[i].parameter;
              var vari = $scope.productObj.columns[i].variant;
              if(vari != '1')
              {
                if (!para || !vari) {
                    $scope.is_un = true;
                    break;
                }
              }

              // var item = para.split(',');
               var item = para;


              $scope.para_set.push(item);

          }

          if ($scope.is_un) {
              $scope.successMessageInfoVar = 'Enter variant/variant param values';
              $scope.imageName = '';
              $scope.successMessageVar = true;
              $timeout(function() {
                  $scope.successMessageVar = false;
              }, 1000);
          } else {

              $scope.details = [];
              $scope.details['data'] = $scope.para_set;
              $scope.productObj.name = $scope.para_set;
              ProductService.generateVariants($scope.productObj).then(function(response) {
                  $scope.productObj.combined_variant = response.data.data;
                  $scope.para_set = [];
                  $scope.varaint_length = true;
              });

          }

      }

  }
  $scope.edit = function(obj) {

      obj.is_edit = true;
  }

  $scope.cancel = function(obj) {

      obj.is_edit = false;
  }


  $scope.clear = function() {
      $scope.locationDataSearch.name = '';
      $scope.locationDataSearch.bracode = '';
      $scope.locationDataSearch.brand_id = '';
      $scope.locationDataSearch.category_id = '';
      $scope.getBrands();
      $scope.getProductModel();
      $scope.getAllCategory();
      $scope.getAllVariantTypes();
      $scope.getAllVariants(1);
  }





  $scope.brandCheck = function(code) {
      BrandService.checkBrand(code,$scope.store_id_global).then(function(response) {
          $scope.is_brand_exit = response.data.data;
      });

  }

  $scope.catCheck = function(code) {
    CategoryService.checkCat(code,$scope.store_id_global).then(function(response) {
        $scope.is_cat_exit = response.data.data;
    });

}


$scope.subCatCheck = function(code) {
    SubcategoryService.checkSubCat(code,$scope.store_id_global,$scope.productObj.category_id).then(function(response) {
        $scope.is_sub_cat_exit = response.data.data;
    });

}


  $scope.UnitCheck = function(code) {
    BrandService.checkUnit(code,$scope.store_id_global).then(function(response) {
        $scope.is_unit_exit = response.data.data;
    });

}

  $scope.viewVariant = function(obj) {
      $scope.is_selected_variant_view = true;
      $scope.selected_variant = obj;
  }

  $scope.editVariant = function(obj) {
    $scope.is_selected_variant_view = false;
    $scope.selected_variant = obj;
    $scope.selected_variant.image_data = '';

    // for(var i=0;i<$scope.selected_variant.variant_unit.length;i++)
    // {
    //     if($scope.selected_variant.variant_unit[i].variant_unit[0].purchase_id == $scope.selected_variant.variant_unit[i].variant_unit[0].unit_id)
    //     {
    //         $scope.selected_variant.variant_unit[i].variant_unit[0].ration_selected = true;
    //     }
    // }


}




  $scope.productCheck = function(id,name) {
    ProductService.getProductSearch(id,name).then(function(response) {
        $scope.is_product_exit = response.data.data;
    });

   }

   $scope.typeCheck = function(name) {
    ProductService.getTypeSearch(name,$scope.store_id_global).then(function(response) {
        $scope.is_type_exit = response.data.data;
    });

   }


   $scope.createType = function(variantTypeData) {
    variantTypeData.store_id = $scope.store_id_global;
    VariantTypeService.createVariantType(variantTypeData).then(function(response) {
        $scope.variantTypeData = {};
        $scope.successMessageType = "variant type created successfully";
        $scope.successMessageTypeBool = true;
        $scope.getAllVariantTypes();
        $timeout(function() {
            $scope.successMessageTypeBool = false;
        }, 1000);


    });
}


$scope.updateType = function(variantTypeData) {
    VariantTypeService.updateVariantType(variantTypeData).then(function(response) {
        $scope.variantTypeData = {};
        $scope.successMessageType = "variant type successfully";
        $scope.successMessageTypeBool = true;
        variantTypeData.is_edit = false;
        $scope.getAllVariantTypes();
        $timeout(function() {
            $scope.successMessageTypeBool = false;
        }, 1000);


    });
}

$scope.addUnit = function(ind)
    {
       // $scope.variant_unit_details = obj.variant_unit;

       $scope.comined_var_index = ind;
    }



    $scope.sellingUnitChange = function(pur,sel,oj)
    {

        if(pur == sel)
        {
            $scope.productObj.unit_variant[0].vari[oj].ratio = 1;
            $scope.productObj.unit_variant[0].vari[oj].ration_selected = true;
        }
        else
        {
            $scope.productObj.unit_variant[0].vari[oj].ratio = '';
            $scope.productObj.unit_variant[0].vari[oj].ration_selected = false;
        }

    }

    $scope.sellingUnitChange1 = function(pur,sel,index,parent_index)
    {

        if(pur == sel)
        {
            $scope.productObj.combined_variant[$scope.comined_var_index].variant_unit[parent_index].vari[index].ratio = 1;
            $scope.productObj.combined_variant[$scope.comined_var_index].variant_unit[parent_index].vari[index].ration_selected = true;
        }
        else
        {

            $scope.productObj.combined_variant[$scope.comined_var_index].variant_unit[parent_index].vari[index].ratio = '';
            $scope.productObj.combined_variant[$scope.comined_var_index].variant_unit[parent_index].vari[index].ration_selected = false;
        }

    }


    $scope.sellingUnitChange2 = function(pur,sel,oj,oj1)
    {

        if(pur == sel)
        {
            $scope.selected_variant.unit_set[oj1].vari[oj].ratio = 1;
            $scope.selected_variant.unit_set[oj1].vari[oj].ration_selected = true;
        }
        else
        {
            $scope.selected_variant.unit_set[oj1].vari[oj].ratio = '';
            $scope.selected_variant.unit_set[oj1].vari[oj].ration_selected = false;
        }

    }


    $scope.addNewVariantUnit = function(index,parant_index) {
        var newItemNo = $scope.productObj.combined_variant[$scope.comined_var_index].variant_unit[parant_index].vari.length + 1;
        $scope.productObj.combined_variant[$scope.comined_var_index].variant_unit[parant_index].vari.push({
            'colId': 'col' + newItemNo
        });
    };

    $scope.addNewVariantUnitEdit = function(index,parant_index) {
       // var newItemNo = $scope.productObj.combined_variant[$scope.comined_var_index].variant_unit[parant_index].vari.length + 1;

        var newItemNo = $scope.selected_variant.unit_set[parant_index].vari.length + 1;
        $scope.selected_variant.unit_set[parant_index].vari.push({
            'colId': 'col' + newItemNo
        });
    };


    $scope.removeVariantUnitEdit = function(index,parant_index) {

        if ($scope.selected_variant.unit_set[parant_index].vari.length == 1) {
            $scope.successMessagenewVar = 'unable to delete';
            $scope.successMessageVarAdd = true;
            $timeout(function() {
                $scope.successMessageVarAdd = false;
            }, 1000);
        } else {

            var item = $scope.selected_variant.unit_set[parant_index].vari[index];

            if(item.default)
            {
                if(index == 0)
                {
                    $scope.selected_variant.unit_set[parant_index].vari[index+1].default = true;
                }
                else
                {
                    $scope.selected_variant.unit_set[parant_index].vari[index-1].default = true;
                }


            }



            $scope.selected_variant.unit_set[parant_index].vari.splice(index, 1);
        }
};



    $scope.addNewVariantUnitItemj = function(parant_index) {

        $scope.productObj.unit_variant_1 = {
            purchase_unit : '',
            vari : [{
                selling_unit: '',
                ratio: ''
            }]

        };

        var newItemNo = $scope.productObj.combined_variant[$scope.comined_var_index].variant_unit.length + 1;
        $scope.productObj.combined_variant[$scope.comined_var_index].variant_unit.push($scope.productObj.unit_variant_1);

    };




      $scope.removeVariantUnit = function(index,parant_index) {

        if ($scope.productObj.combined_variant[$scope.comined_var_index].variant_unit[parant_index].vari.length == 1) {
            $scope.successMessagenewVar = 'unable to delete';
            $scope.successMessageVarAdd = true;
            $timeout(function() {
                $scope.successMessageVarAdd = false;
            }, 1000);
        } else {

            var item = $scope.productObj.combined_variant[$scope.comined_var_index].variant_unit[parant_index].vari[index];

            if(item.default)
            {

                if(index == 0)
                {
                    $scope.productObj.combined_variant[$scope.comined_var_index].variant_unit[parant_index].vari[index+1].default = true;
                }
                else
                {
                    $scope.productObj.combined_variant[$scope.comined_var_index].variant_unit[parant_index].vari[index-1].default = true;
                }


            }



            $scope.productObj.combined_variant[$scope.comined_var_index].variant_unit[parant_index].vari.splice(index, 1);
        }
};

            $scope.setDefault = function(index,parant_index) {
                for(var i=0;i<$scope.productObj.combined_variant[$scope.comined_var_index].variant_unit[parant_index].vari.length;i++)
                {
                if(i==index)
                {
                    $scope.productObj.combined_variant[$scope.comined_var_index].variant_unit[parant_index].vari[i].default = true;

                }
                else
                {
                    $scope.productObj.combined_variant[$scope.comined_var_index].variant_unit[parant_index].vari[i].default = false;
                }

                }

            };

            $scope.setDefaultVar = function(index,parant_index) {
                for(var i=0;i<$scope.selected_variant.unit_set[parant_index].vari.length;i++)
                {
                if(i==index)
                {
                    $scope.selected_variant.unit_set[parant_index].vari[i].default = true;

                }
                else
                {
                    $scope.selected_variant.unit_set[parant_index].vari[i].default = false;
                }

                }

            };




$scope.removeUnitSet = function(index) {

    if ($scope.productObj.combined_variant[$scope.comined_var_index].variant_unit.length == 1) {
        $scope.successMessagenewVar = 'unable to delete';
        $scope.successMessageVarAdd = true;
        $timeout(function() {
            $scope.successMessageVarAdd = false;
        }, 1000);
    } else {
        $scope.productObj.combined_variant[$scope.comined_var_index].variant_unit.splice(index, 1);
    }


};
$scope.cancelUnitAdd = function()
{

    ProductService.generateVariants($scope.productObj).then(function(response) {
        $scope.productObj.combined_variant[$scope.comined_var_index] = response.data.data[$scope.comined_var_index];
        $scope.para_set = [];
        $scope.varaint_length = true;
    });

    // $scope.productObj.combined_variant[$scope.comined_var_index].variant_unit = [{  purchase_unit: '',
    // selling_unit: '',ratio: ''}]

    $('#untiModel').modal('hide');

}

$scope.updateVariantCancel = function()
{
    $scope.getAllVariants(1);
}

$scope.addUnitAdd = function()
{

    $('#untiModel').modal('hide');

}

$scope.updateVariant = function(obj)
{

    ProductService.updateVariants(obj).then(function(response) {
        $scope.selected_variant = {};
        $scope.successMessageInfoUpVar = "Product updated  successfully";
        $scope.successMessageUpVar = true;
        $scope.getAllVariants(1);
        $timeout(function() {
            $scope.successMessageUpVar = false;
            $('#myModal').modal('hide');
        }, 2000);


    }, function errorCallback(response) {

        $scope.successMessageInfoUpVar = "Product Update failed";
        $scope.successMessageUpVarFal = true;
        $timeout(function() {
            $scope.successMessageUpVarFal = false;
            //document.getElementById('product_view_path').click()
        }, 2000);

	});
}

$scope.deleteVariant = function(obj)
    {
        $scope.delete_obj = obj;
    }
    $scope.deletePro = function(obj)
    {
        $scope.delete_product = obj;
    }

    $scope.deleteVar = function()
    {

        ProductService.removeVariant($scope.delete_obj).then(function(response) {
            $scope.delete_obj = {};
            $scope.successMessageInfoUpVar = "Variant deleted  successfully";
            $scope.successMessageUpVar = true;
            $scope.getAllVariants(1);
            $timeout(function() {
                $scope.successMessageUpVar = false;
                $('#confirm-delete').modal('hide');
            }, 1000);


        });
    }



    $scope.deleteProduct = function()
    {
        ProductService.removeProduct($scope.delete_product).then(function(response) {
            $scope.delete_product = {};
            $scope.successMessageInfoUpPro = "Product deleted  successfully";
            $scope.successMessageUpProd = true;
            $scope.getProductList(1);
            $timeout(function() {
                $scope.successMessageUpProd = false;
                $('#confirm-delete-pro').modal('hide');
            }, 1000);


        });
    }


    $scope.createSubCategory = function(subcategoryData) {
        subcategoryData.cat_id = $scope.productObj.category_id;
        subcategoryData.store_id = $scope.store_id_global;
        SubcategoryService.createCategory(subcategoryData).then(function(response){
          if(response.data.success=true){
            $scope.subcategoryData = {};
            $scope.is_create = true;
              $scope.successMessageSubCategory = "Sub Category created successfully";



            $scope.successMessageSubCategoryBool = true;
            $timeout(function () {
              $scope.successMessageSubCategoryBool = false;
              $('#myModal3').modal('hide');
          }, 1000);

          $scope.changeCategory($scope.productObj.category_id);
          }
        });
      }

      $scope.setMaster = function(section) {
        $scope.selected = section;
    }




    $scope.myFilter = function (item) {
        return item.selected === 0;
    };


    $scope.variantChange = function(index1,var1)
    {

        //$scope.filter1 = (!($scope.selectname1&&$scope.selectname1.id)||item.id !=$scope.selectname1.id);

        // $scope.variantTypeList.splice(index, 1);

         var is_ele_exit = false;
        var whatIndex = null;
        angular.forEach($scope.productObj.columns, function(value, index){
            if(!is_ele_exit)
            {

                if(index1 != index)
                {
                    if(value.variant == var1){
                        //filteredEmails.push(email);
                        whatIndex = index;
                        is_ele_exit = true;
                        $scope.var_type_exit = true;
                        $scope.productObj.columns[index1].variant = '';
                        $scope.succvartype = 'Variant Type Already Selected! Please Select Different Type';
                        $timeout(function() {
                            $scope.var_type_exit = false;
                        }, 1000);


                    }
                }


            }

        });


        if(var1 = '1')
        {
            if($scope.productObj.columns[index1].parameter)
            {
                $scope.productObj.columns[index1].parameter = '';
            }
        }



    }


});
