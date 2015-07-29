(function(){

  var lazyload = angular.module('lazyload' , []);

  lazyload.directive('uiLazyload' , function(){
     return {
       restrict : 'EA',
       link : function(scope , ele , attrs){
         console.log(ele)
       }
     }
  })
})()

