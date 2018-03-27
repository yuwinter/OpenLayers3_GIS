var map;

//地图初始化加载
function init()
{
    var bounds = new OpenLayers.Bounds(109.62468672071573, 20.061844970906243,
                        117.35435946391824, 25.528473333333334);//地图的边界
    var options = {
        projection: "EPSG:4326",

        minResolution: "auto",
        maxResolution: "auto",

        numZoomLevels: 20,
        center: new OpenLayers.LonLat(113, 23)
    };


    map = new OpenLayers.Map('map', options);

    //group就是相应的图层组，在Geoserver中该图层组叫 guangdong
    var group = new OpenLayers.Layer.WMS("group",
       //geoserver所在服务器地址
       "http://localhost:8080/geoserver/RailWay/wms",
       {
           layers: "RailWay_New",//图层组名称
           transparent: "true"
       },
        { isBaseLayer: true }
     );
//group就是相应的图层组，在Geoserver中该图层组叫 guangdong
    var group1 = new OpenLayers.Layer.WMS("group",
       //geoserver所在服务器地址
       "http://localhost:8080/geoserver/CN/wms",
       {
           layers: "RailWay",//图层组名称
           transparent: "true"
       },
        { isBaseLayer: true }
     );

      //map.addLayer(group);
     map.addLayer(group1);
     //map.addLayers([group1,group])
   
    
    map.zoomToExtent(bounds);//将地图
}


$(function () {
    init();
})


