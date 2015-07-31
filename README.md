#angular-lazyload


### 关于
* 基于angular 编写的可复用图片懒加载指令

### 思路
* 图片的src不要使用真实地址， 用一个属性保存在元素上
* 把所有需要使用延迟加载的图片元素放到一个数组中
* 初始化的时候检查数组中的元素是否在出视范围内 ,可视范围内即加载
* 给window绑定滚动事件来检查图片是否需要加载
* 加载完成的img从列队中删除

### 应用场景
* 当过多的图片还没出现在视野的时候就已经下载，可以使用`angular-imglazyload` 来避免这种无谓的请求提高性能


### 安装
- 项目使用可以直接 `bower install angular-imglazyload` 下载至项目使用 ，学习的同学可参照下面步骤
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

```
#### Q&A
@febobo

