var MYMAP = {
	map: null, // 地图对象
	init: function(_layer, _config) {
		// 初始地图对象
		MYMAP.map = new ol.Map({
			layers: [_layer],
			loadTilesWhileAnimating: true,
			target: document.getElementById("map"),
			controls: ol.control.defaults({
				attributionOptions: ({
					collapsible: false
				})
			}),
			view: new ol.View({
				center: _config.center,
				zoom: _config.zoom,
				maxZoom: _config.maxZoom,
				minZoom: _config.minZoom,
			}),
			interactions: ol.interaction.defaults({
				doubleClickZoom: false
			})
		});
		//添加手工定位标记图层
		MYMAP.map.addLayer(MARKER.markLayer());
	}
}


/**
 * 手工定位
 */
var MARKER = {
	//距离确认数据源
	source: new ol.source.Vector(),
	draw: null,
	closeElement: null, //关闭按钮
	spanElement: null, //显示数据（距离或是面积）
	measureTooltipElement: null,
	measureTooltip: null,
	//距离确认
	marker: function() {
		MARKER.clear();
		if(MARKER.draw) {
			MYMAP.map.removeInteraction(MARKER.draw);
			MARKER.draw = null;
		}
		MARKER.draw = new ol.interaction.Draw({
			source: MARKER.source,
			type: "Point",
			style: new ol.style.Style({
				image: new ol.style.Icon({
					offset: [0, 0],
					opacity: 1.0,
					rotateWithView: true,
					rotation: 0.0,
					scale: 1.0,
					size: [32, 32],
					src: "images/icons/marker.png"
				})
			})
		});
		MARKER.draw.on("drawstart", function(evt) {

		}, this);
		//手工定位结束后展示坐标信息
		MARKER.draw.on("drawend", function(evt) {
			MARKER.measureTooltipElement.className = 'tooltip tooltip-static';
			var feature = evt.feature;
			MARKER.sketch = null;
			MARKER.measureTooltipElement = null;
			MARKER.closeElement.style.display = 'block';
			MARKER.closeElement.className = 'show';
			MYMAP.map.un("pointermove", MARKER.pointerMoveHandler);
			MYMAP.map.removeInteraction(MARKER.draw);
			var posXY = document.getElementById("poxXY").innerText;
			var posXYArray = posXY.split(",");
			var XPos = posXYArray[0];
			var YPos = posXYArray[1];
		}, this);
		MYMAP.map.addInteraction(MARKER.draw);
		MARKER.createMeasureTooltip(); //创建显示信息的div
		MYMAP.map.on("pointermove", MARKER.pointerMoveHandler);
	},
	//清除所有数据
	clear: function() {
		MARKER.source.clear();
		MYMAP.map.removeOverlay(MARKER.measureTooltip);
		MYMAP.map.un("pointermove", MARKER.pointerMoveHandler);
	},
	//创建显示信息的div
	createMeasureTooltip: function() {
		if(MARKER.closeElement) {
			MARKER.closeElement.parentNode.removeChild(MARKER.closeElement);
		}
		if(MARKER.measureTooltipElement) {
			MARKER.measureTooltipElement.parentNode.removeChild(MARKER.measureTooltipElement);
		}
		MARKER.measureTooltipElement = document.createElement('div');
		MARKER.spanElement = document.createElement("span");
		MARKER.spanElement.id = "poxXY";
		MARKER.closeElement = document.createElement('span'),
			MARKER.closeElement.innerHTML = '✖';
		MARKER.closeElement.style.display = 'none';
		MARKER.closeElement.addEventListener('click', function() {
			MARKER.clear();
		}, false);
		MARKER.measureTooltipElement.appendChild(MARKER.closeElement);
		MARKER.measureTooltipElement.appendChild(MARKER.spanElement);
		MARKER.measureTooltipElement.className = 'tooltip tooltip-measure';
		MARKER.measureTooltip = new ol.Overlay({
			element: MARKER.measureTooltipElement,
			offset: [0, -25],
			positioning: 'bottom-center'
		});
		MYMAP.map.addOverlay(MARKER.measureTooltip);
	},
	//鼠标移动事件
	pointerMoveHandler: function(evt) {
		if(evt.dragging) {
			return;
		}
		var tooltipCoord = evt.coordinate;
		var output = tooltipCoord
		var msg = output[0].toFixed(6) + " , " + output[1].toFixed(6);
		MARKER.spanElement.innerHTML = msg;
		MARKER.measureTooltip.setPosition(evt.coordinate);
	},
	markLayer: function() {
		return new ol.layer.Vector({
			source: MARKER.source,
			style: new ol.style.Style({
				image: new ol.style.Icon({
					offset: [0, 0],
					opacity: 1.0,
					rotateWithView: true,
					rotation: 0.0,
					scale: 1.0,
					size: [32, 32],
					src: "../img/marker.png"
				})
			})
		});
	}
}