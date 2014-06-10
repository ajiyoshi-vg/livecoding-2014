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
            }
            , flat_map : function(array, f) {
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

            this.uniq = function(points){
                var sorted = points.sort(function(a, b){
                    if( a.isTheSameTo(b) ){
                        return 0;
                    }else if( a.x > b.x ){
                        return -1;
                    }else{
                        return 1;
                    }
                });

                return sorted.reduce(function(acc, i){
                    if( acc.length == 0 ){
                        return [i];
                    }
                    var last = acc[acc.length-1];
                    if( i.isTheSameTo(last) ){
                        return acc;
                    }else{
                        return acc.concat(i);
                    }
                }, []);
            }

            this.next = function() {
                var target = this.uniq( util.flat_map(this.aliveCells, function(here){
                    return here.neighboring();
                }).concat(this.aliveCells) );

                var me = this;
                var nextCells = target.filter(function(i){
                    var n = me.aliveCellNumAround(i.x, i.y);
                    return (!me.aliveAt(i.x, i.y) && me.willBornAt(i.x, i.y)) ||
                        (me.aliveAt(i.x, i.y) && me.willStillAliveAt(i.x, i.y) );
                });
                console.log(nextCells.map(function(i){ return i.toString(); }).join(" "));
                this.aliveCells  =  this.uniq( nextCells );
            }
            this.aliveCellNumAround = function(x, y){
                var them = point(x, y).neighboring();
                var me = this;
                return them.filter(function(here){
                    return me.aliveAt(here.x, here.y);
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
