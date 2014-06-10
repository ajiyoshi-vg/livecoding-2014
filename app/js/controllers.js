'use strict';

/* Controllers */

angular.module('myApp.controllers', [])
  .controller('LifeGame', ['$scope', 'LifeGameUtil', 'World', function($scope, util, world) {
      $scope.name = "ajiyoshi";
      $scope.range = util.range;
      $scope.width = 10;
      $scope.height = 8;
      $scope.world = world;
      $scope.aliveAt = world.aliveAt.bind(world);
      $scope.next = world.next.bind(world);
      $scope.invert = world.invert.bind(world);
  }])
  ;
