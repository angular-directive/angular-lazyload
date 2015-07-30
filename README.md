#angular-lazyload


### 关于
* 基于angular 编写的可复用图片懒加载指令

### 思路
* img的src不要使用真实， 用一个属性保存在元素上
* 把所有需要使用延迟加载的元素放到一个数组中 
* 初始化的时候检查数组中的元素是否在出视范围内 ,可视范围内即加载
* 加载完成的img从列队中删除


### 安装
```
克隆项目到本地
git clone https://github.com/angular-directive/angular-lazyload.git

要跑demo环境要求
node , bower , npm , gulp

安装
npm install && bower install

运行
gulp serve

```

### 使用
###html
```
<body   ng-app="demo" ng-controller="demoCtro" class="row text-center">
   <div class="content">
     <img src="" ng-repeat="item in imgs track by $index" data-ui-lazyload="{{item}}" />
   </div>
</body>

```

###js
```

  // 在你的module里添加lazyload依赖就好
  var app = angular.module('demo' , ['lazyload']);
  app.controller('demoCtro' , function($scope){

  }

```
#### Q&A
@febobo

