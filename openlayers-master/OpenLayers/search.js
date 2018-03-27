/**
 * POI检索服务
 * 支持普通检索，周边检索和多边形检索
 * 
 */

var geometry;
var markslayer;//存放选择出的POI
function search() {
    if (drawPolygnControl instanceof OpenLayers.Control.DrawFeature
			&& drawPolygnControl != null) {
        drawPolygnControl.deactivate();
        map.removeControl(drawPolygnControl);
    }
    if (markslayer != null) {
        markslayer.removeAllFeatures();
        map.removeLayer(markslayer);
    }

    var searchstr = document.getElementById("searchkey").value;
    if (searchstr == null || searchstr == "") {

        alert("请输入搜索关键字！");
        return;
    }

    if (marks != null)
        marks.clearMarkers();

    if (routeLayer != null)
        routeLayer.removeAllFeatures();
    if (stopLayer != null)
        stopLayer.removeAllFeatures();

    //基于位置查找和基于多边形查找功能实现
    if (document.getElementById("nearbySearch").checked
			|| document.getElementById("polygonSearch").checked) {
        geometry = polygonLayer.features[0].geometry;
        markslayer = new OpenLayers.Layer.Vector("WFS", {
            strategies: [new OpenLayers.Strategy.BBOX()],
            protocol: new OpenLayers.Protocol.WFS({
                url: "http://192.168.1.50:8080/geoserver/wfs?",
                featureType: "res2_4m",
                featureNS: "http://www.cxzx.com"
            }),
            styleMap: new OpenLayers.StyleMap({
                externalGraphic: 'img/marker-target.png',
                graphicWidth: 20,
                graphicHeight: 24,
                graphicYOffset: -24,
            }),
            filter: new OpenLayers.Filter.Logical({
                type: OpenLayers.Filter.Logical.AND,
                filters: [new OpenLayers.Filter.Comparison({
                    type: OpenLayers.Filter.Comparison.LIKE,
                    property: "NAME",
                    value: "*" + searchstr + "*"
                }), new OpenLayers.Filter.Spatial({
                    type: OpenLayers.Filter.Spatial.INTERSECTS,
                    value: geometry,//              	
                    projection: 'EPSG:4326'
                })]
            })
        });
        map.addLayer(markslayer);
        addPop();
    }
        //普通检索功能实现
    else {
        markslayer = new OpenLayers.Layer.Vector("WFS", {
            strategies: [new OpenLayers.Strategy.BBOX()],
            protocol: new OpenLayers.Protocol.WFS({
                url: "http://192.168.1.50:8080/geoserver/wfs?",
                featureType: "res2_4m",
                featureNS: "http://www.cxzx.com"
            }),
            styleMap: new OpenLayers.StyleMap({
                externalGraphic: 'img/marker-target.png',
                graphicWidth: 20,
                graphicHeight: 24,
                graphicYOffset: -24,
            }),//					  
            filter: new OpenLayers.Filter.Comparison({
                type: OpenLayers.Filter.Comparison.LIKE,
                property: "NAME",
                value: "*" + searchstr + "*"
            })
        });
        map.addLayer(markslayer);
        addPop();
    }

}//end function search
