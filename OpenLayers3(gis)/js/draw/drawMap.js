/**
 * 标绘模块的地图（实例化）
 */
var DRAWMAP = {
	map : null, // 地图对象
	draw : null,
	vectorSource : new ol.source.Vector({
		wrapX : false
	}),
	vectorLayer : null,
	init : function(_layer, _config) {
		DRAWMAP.vectorLayer = new ol.layer.Vector({
			source : DRAWMAP.vectorSource,
			zIndex : 1000
		});
		// 初始地图对象
		DRAWMAP.map = new ol.Map({
			layers : [ _layer ],
			loadTilesWhileAnimating : true,
			target : document.getElementById("map"),
			controls : ol.control.defaults({
				attributionOptions : ({
					collapsible : false
				})
			}),
			view : new ol.View({
				center : _config.center,
				zoom : _config.zoom,
				maxZoom : _config.maxZoom,
				minZoom : _config.minZoom,
			}),
			interactions : ol.interaction.defaults({
				doubleClickZoom : false
			})
		});
		DRAWMAP.map.addLayer(DRAWMAP.vectorLayer);
	}
};

