'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('myApp.services', []).
    service('LifeGameUtil', function() {
        return {
            range : function(from, to){
                var ret = [];
                for( var i=0, len=to-from; i<len; i++ ){
                    ret.push(from+i);
                }
                return ret;
            },
            flat_map : function(array, f) {
                return array.reduce(function(acc, i){
                    return acc.concat(f(i));
                }, []);
            }
        };
    }).
    service('Point', function() {
        function Point(x, y){
            this.x = x;
            this.y = y;
            this.isTheSameTo = function(it){
                return x == it.x && y == it.y ;
            }
            this.toString = function() {
                return "(" + x + ", " + y + ")";
            }
            this.neighboring = function(){
                return [
                    new Point(x-1, y+1), new Point(x, y+1), new Point(x+1, y+1),
                    new Point(x-1, y), new Point(x+1, y),
                    new Point(x-1, y-1), new Point(x, y-1), new Point(x+1, y-1)
                    ];
            }
            
        }
        return function(x, y) { return new Point(x, y); };
    }).
    factory('World', ['Point', 'LifeGameUtil', function(point, util) {
        return new function world() {
            this.aliveCells = [ point(3, 4) ]; 

            this.aliveAt = function(x, y){
                var there = point(x, y);
                return this.aliveCells.some( function(here) {
                    return there.isTheSameTo(here);
                });
            }

            this.next = function() {
                var target = util.flat_map(this.aliveCells, function(here){
                    return here.neighboring();
                }).concat(this.aliveCells);

                var me = this;
                var nextCells = target.filter(function(i){
                    var n = me.aliveCellNumAround(i.x, i.y);
                    //console.log(n);
                    return (!me.aliveAt(i.x, i.y) && me.willBornAt(i.x, i.y)) ||
                        (me.aliveAt(i.x, i.y) && me.willStillAliveAt(i.x, i.y) );
                });
                //console.log(nextCells);
                //this.aliveCells  =  nextCells;
            }
            this.aliveCellNumAround = function(x, y){
                var them = point(x, y).neighboring();
                var me = this;
                return them.filter(function(here){
                    console.log(here.toString(), me.aliveAt(here));
                    return me.aliveAt(here);
                }).length;
            }
            this.willBornAt = function(x, y){
                var num = this.aliveCellNumAround(x, y);
                return num == 3;
            }
            this.willStillAliveAt = function(x, y){
                var num = this.aliveCellNumAround(x, y);
                return num == 2 || num == 3;
            }
            this.willDieAt = function(x, y){
                var num = this.aliveCellNumAround(x, y);
                return num < 2 || num > 3;
            }
            this.invert = function(x, y) {
                var here = point(x, y);
                if( this.aliveAt(x, y) ){
                    this.aliveCells = this.aliveCells.filter(function(it){
                        return ! it.isTheSameTo(here);
                    });
                }else{
                    this.aliveCells.push(here);
                }
            }


        }
    }]).
    value('version', '0.1');
