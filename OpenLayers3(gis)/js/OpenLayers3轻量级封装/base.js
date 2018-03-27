/** 
 * FROM：xph   
 */  
(function($){  
      
    var defaultPrams = {  
            centerCoordinate:[116.388888888889,40.1438888888889]//地图中心点[经度,纬度]  
            ,zoom:10                                            //地图加载级别  
            ,id:'map'                                           //容器ID  
            ,maxZoom:10                                         //最大放大级别  
            ,minZoom:10                                         //最小缩放级别  
            ,url:""                                             //离线地图加载路径  
            ,zoomShowOrHide:true                                //右上角地图+-控制  
            ,showOLpage:true      
    }  
      
    var map  
      
    /** 
     * OL画图 
     */  
    $.fn.drawMap = function(params){  
        defaultPrams = $.extend({},defaultPrams, params);  
        var offlineMapPath = defaultPrams.url;  
          
        //设置离线地图路径  
        var source = new  ol.source.XYZ({  
                  url:offlineMapPath  
          });  
          
        var mapLayer = new ol.layer.Tile({  
            source: source,  
            visible:true  
        });  
          
        /*默认属性*/  
        map = new ol.Map({  
            layers: [  
                mapLayer  
            ],  
            view: new ol.View({  
                center: ol.proj.transform(defaultPrams.centerCoordinate, 'EPSG:4326', 'EPSG:3857'),  
                zoom:defaultPrams.zoom,  
                minZoom:defaultPrams.min,  
                maxZoom:defaultPrams.max   
            }),  
            target: defaultPrams.id,  
            controls:ol.control.defaults({  
                zoom:defaultPrams.zoomShowOrHide,   
                attribution:defaultPrams.showOLpage  
            })  
      });  
    }  
      
    /** 
     * 画线 
     */  
    $.fn.drawLine = function(param){  
          
        var x = ol.proj.transform(param.startCoordinate,'EPSG:4326', 'EPSG:3857');  
        var y = ol.proj.transform(param.endCoordinate,'EPSG:4326', 'EPSG:3857');  
          
          
        var lineFeature = new ol.Feature({  
            geometry:new ol.geom.LineString([x,y]),  
            featuretype:'line'  
        });  
          
        lineFeature.setId(param.id);  
          
        var sourceVector = new ol.source.Vector({  
            features:[lineFeature]  
            });  
        sourceVector.set("name","sourceVector")  
          
        var lineLayer=new ol.layer.Vector({  
            source:sourceVector,  
            style:new ol.style.Style({  
                    stroke:new ol.style.Stroke({  
                        width:param.width,  
                        color:param.color  
                    })  
                }),  
            maxResolution:param.maxResolution,  
            name:param.layerName,  
            zIndex:param.zIndex  
        });  
          
        map.addLayer(lineLayer);  
    }  
      
    /** 
     * 画点 
     */  
    $.fn.drawPoint = function(param){  
          
        var f =  new ol.Feature({  
            geometry:new ol.geom.Point( ol.proj.transform(param.pointCoordinate,'EPSG:4326', 'EPSG:3857')),  
            featuretype:'point'  
        });  
          
        f.setId(param.id);  
          
          
        var sourceVector = new ol.source.Vector({  
                features:[f]  
                });  
        sourceVector.set("name","sourceVector")  
        var layer =  new ol.layer.Vector({  
            source:sourceVector,  
            style:new ol.style.Style({  
                image:new ol.style.Icon({  
                    src:param.pagePath,  
                    scale:param.scale  
                })            
            }),  
            name:param.layerName,  
            zIndex:param.zIndex  
        });  
          
         map.addLayer(layer);  
    }  
      
    /** 
     * 删除元素 
     */  
    $.fn.removeLayer = function(param){  
        map.getLayers().getArray().forEach(function(e) {  
            var layerName =  e.get('name');  
            if(layerName = param.layerName){  
                var sourceVector= e.getSource();  
                var keys =sourceVector.getKeys();  
                if(keys.length>0){  
                    var f =  sourceVector.getFeatureById(param.id);  
                    if(f){  
                        sourceVector.removeFeature(f);  
                    }  
                }  
            }  
        });  
    }  
      
      
    /** 
     * 移动地图 
     */  
    $.fn.moveTo = function(param){  
        //获取视图  
        var view  = map.getView();  
        var destination = ol.proj.transform(param.movetoCoordinate,'EPSG:4326', 'EPSG:3857')  
        view.animate({  
              center: destination,  
              duration: 1000  
            });  
    }  
      
    /** 
     * 右键事件 
     */  
    $.fn.rightEvent = function(fn){  
        $(map.getViewport()).on("contextmenu",fn);    
    }  
      
    /** 
     * 点击事件 
     * fn:回调函数 
     */  
    $.fn.clickEvent = function(fn){  
        map.on("singleclick",fn)  
    }  
      
    /** 
     *悬浮事件  
     */  
    $.fn.mouseOnEvent = function(fn){  
        map.on("pointermove",fn);  
    }  
      
    /** 
     * 清除所有 
     */  
    $.fn.clearAll = function(){  
        map.getLayers().getArray().forEach(function(e) {  
                var sourceVector= e.getSource();  
                var keys =sourceVector.getKeys();  
                if(keys.length>0){  
                    var features =  sourceVector.getFeatures();  
                    features.forEach(function(f){  
                        sourceVector.removeFeature(f);  
                    })  
                }  
        });  
    }  
      
      
})(jQuery);  