var MYMAP = {
	map: null, // 地图对象
	overlay: null, // 地图弹出信息窗口
	sphere: new ol.Sphere(6378137), //6378137赤道半径，用于计算距离
	vectorSource: new ol.source.Vector({
		wrapX: false
	}),
	vectorLayer: null,
	icon: {
		"people": "../img/people.png",
		"taxi": "../img/taxi.png",
		"video": "../img/video.png"
	},
	// 图上资源样式处理
	getStyle: function(_feature, _resolution) {
		return [new ol.style.Style({
			stroke: new ol.style.Stroke({
				color: 'red',
				width: 2
			}),
			image: new ol.style.Icon({
				offset: [0, 0],
				opacity: 1.0,
				rotateWithView: true,
				rotation: 0.0,
				scale: 1.0,
				size: [40, 40],
				src: MYMAP.icon[_feature.get("res_type")] //根據res_type的值来决定显示的图标
			})
		})];
	},
	init: function(_layer, _config) {
		MYMAP.vectorLayer = new ol.layer.Vector({
			source: MYMAP.vectorSource,
			style: MYMAP.getStyle,
			zIndex: 1000
		});
		// 初始弹出窗口对象
		MYMAP.overlay = new ol.Overlay(({
			element: document.getElementById("popup"),
			offset: [-5, -15],
			positioning: "center-right",
			autoPan: true,
			autoPanAnimation: {
				duration: 250
			}
		}));
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
			overlays: [MYMAP.overlay],
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
		MYMAP.map.addLayer(MYMAP.vectorLayer);
		//初始化地图上的点击事件
		MYMAP.map.on("click", function(_e) {
			var feature = MYMAP.map.forEachFeatureAtPixel(_e.pixel, function(
				feature, layer) {
				return feature;
			});
			MYMAP.popup(feature);
		});
	},
	//资源弹出窗
	popup: function(_feature) {
		if(_feature) {
			var type = _feature.get("name") ? _feature.get("name") : "unknow";
			//定位弹出框的中心点-开始
			var geometry = _feature.getGeometry();
			var coord = geometry.getCoordinates();
			MYMAP.overlay.setPosition(coord);
			//定位弹出框的中心点-结束
			var titleHtml = "",
				html = "";
			switch(type) {
				case "people":
					var titleHtml = "<table><tr><td><b>人员信息</b>：</td><td>";
					titleHtml += "&nbsp;";
					titleHtml += "</td></tr></table>";
					$("#popup-title").html(titleHtml);
					html += "人员坐标：" + coord;
					var distance = MYMAP.distance([11557761.4071486, 4307993.90607275], coord);
					html += "<br/><br/>与出租车（中心点）距离为：" + distance;
					$("#popup-content").html(html);
					break;
				case "taxi":
					var titleHtml = "<table><tr><td><b>出租车信息</b>：</td><td>";
					titleHtml += "&nbsp;";
					titleHtml += "</td></tr></table>";
					$("#popup-title").html(titleHtml);
					html += "出租车坐标为：" + coord;
					$("#popup-content").html(html);
					break;
			}
		}
	},
	//画三圈
	dispose: function() {
		var point = new ol.geom.Point([11557761.4071486, 4307993.90607275]);

		var taxiFeature = new ol.Feature({
			geometry: point,
			name: "taxi"
		});
		taxiFeature.set("res_type", "taxi");
		MYMAP.vectorSource.addFeature(taxiFeature);

		//画三圈开始
		//300： 代表圆的半径
		var circle300 = new ol.geom.Circle([11557761.4071486, 4307993.90607275], 300);
		var circle200 = new ol.geom.Circle([11557761.4071486, 4307993.90607275], 200);
		var circle100 = new ol.geom.Circle([11557761.4071486, 4307993.90607275], 100);

		var circleFeature300 = new ol.Feature({
			geometry: circle300
		});
		var style300 = new ol.style.Style({
			fill: new ol.style.Fill({
				color: 'rgba(50, 205, 50, 0.3)'
			}),
			stroke: new ol.style.Stroke({
				color: 'rgba(50, 205, 50, 0.6)',
				width: 2
			}),
			image: new ol.style.Circle({
				radius: 7,
				fill: new ol.style.Fill({
					color: '#ffcc33'
				})
			})
		});
		circleFeature300.setStyle(style300);
		MYMAP.vectorSource.addFeature(circleFeature300);

		var circleFeature200 = new ol.Feature({
			geometry: circle200
		});
		var style200 = new ol.style.Style({
			fill: new ol.style.Fill({
				color: 'rgba(255, 165, 0, 0.3)'
			}),
			stroke: new ol.style.Stroke({
				color: 'rgba(255, 165, 0, 0.6)',
				width: 2
			}),
			image: new ol.style.Circle({
				radius: 7,
				fill: new ol.style.Fill({
					color: '#ffcc33'
				})
			})
		});
		circleFeature200.setStyle(style200);
		MYMAP.vectorSource.addFeature(circleFeature200);

		var circleFeature100 = new ol.Feature({
			geometry: circle100
		});
		var style100 = new ol.style.Style({
			fill: new ol.style.Fill({
				color: 'rgba(255, 0, 0, 0.3)'
			}),
			stroke: new ol.style.Stroke({
				color: 'rgba(255, 0, 0, 0.6)',
				width: 2
			}),
			image: new ol.style.Circle({
				radius: 7,
				fill: new ol.style.Fill({
					color: '#ffcc33'
				})
			})
		});
		circleFeature100.setStyle(style100);
		MYMAP.vectorSource.addFeature(circleFeature100);
		//画三圈结束
		var pan = ol.animation.pan({
			duration: 500,
			source: (MYMAP.map.getView().getCenter())
		});
		MYMAP.map.beforeRender(pan);//延迟上图
		MYMAP.map.getView().setCenter(point.getCoordinates());

		//初始化三圈内的坐标点，用于计算
		var peopleFeature100 = new ol.Feature({
			geometry: new ol.geom.Point([11557696.316242, 4307946.730094]),
			name: "people"
		});
		peopleFeature100.set("res_type", "people");
		MYMAP.vectorSource.addFeature(peopleFeature100);

		var peopleFeature200 = new ol.Feature({
			geometry: new ol.geom.Point([11557628.239513, 4307988.531594]),
			name: "people"
		});
		peopleFeature200.set("res_type", "people");
		MYMAP.vectorSource.addFeature(peopleFeature200);

		var peopleFeature300 = new ol.Feature({
			geometry: new ol.geom.Point([11557937.570612, 4308199.927751]),
			name: "people"
		});
		peopleFeature300.set("res_type", "people");
		MYMAP.vectorSource.addFeature(peopleFeature300);
	},
	//用于计算两个坐标点之间的距离
	distance: function(point1, point2) {
		return MYMAP.sphere.haversineDistance(point1, point2);
	}
}