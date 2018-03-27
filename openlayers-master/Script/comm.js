var map, measureControls;
			var markers;
        function init(){
//          var bounds = new OpenLayers.Bounds(109.62468672071573, 20.061844970906243,
//                      117.35435946391824, 25.528473333333334);//地图的边界
            var bounds = new OpenLayers.Bounds(76.04071044942776, 18.294030661286058,
                        133.13067626919448, 52.99217181377825);//地图的边界
      
   var options = {
        projection: "EPSG:4326",
        minResolution: "auto",
        maxResolution: "auto",
        numZoomLevels: 20,
        center: 'center'
    };

		//实例化比例尺控件  
		OpenLayers.INCHES_PER_UNIT["千米"] = OpenLayers.INCHES_PER_UNIT["km"]; 
		OpenLayers.INCHES_PER_UNIT["米"] = OpenLayers.INCHES_PER_UNIT["m"]; 
		OpenLayers.INCHES_PER_UNIT["英里"] = OpenLayers.INCHES_PER_UNIT["mi"]; 
		OpenLayers.INCHES_PER_UNIT["英寸"] = OpenLayers.INCHES_PER_UNIT["ft"];

		var scaleLineControl = new OpenLayers.Control.ScaleLine({  
			    topOutUnits:"千米",
                topInUnits:"米",
                bottomOutUnits:"英里",
                bottomInUnits:"英寸",
                minWidth:128,
		        units:"metric",                      //设置比例尺单位，有degrees、imperial、us、nautical或metric  
		        className: 'custom-scale-line',      //设置比例尺的样式  
		        target: document.getElementById('scale-line') //显示比例尺的目标容器  
		});
    map = new OpenLayers.Map('map', options);
		
//group就是相应的图层组，在Geoserver中该图层组叫 RailWay
    var group = new OpenLayers.Layer.WMS("group",
       //geoserver所在服务器地址
       "http://localhost:8080/geoserver/CN/wms",
       {
           layers: "RailWay",//图层组名称
           transparent: "true"
       },
        { isBaseLayer: true }
     );
     //这个图层是用于当放大一定范围时，替换成这个图层。后面代码中有相应的设置。
     	var graphic2 = new OpenLayers.Layer.Image(
                'BinJiang City1',
                'data/4_m_citylights_lg.gif',
				//坐标范围
                new OpenLayers.Bounds(-180, -90, 180, 90),
				//图片大小
                new OpenLayers.Size(1024, 768),
                {numZoomLevels: 3}
            );
        //
       map.addLayer(group);
       map.addLayer(graphic2);
       //将地图
			// 注册map点击事件
			//这里显示您点击的位置的经纬度坐标，
			map.events.register("click", map, onMapClick);
			// 注册map点击事件
			//这里的zoomend是地图等级的意思。当你放大到多少的时候。可以选择相应的替换对应的图层。
			map.events.register("zoomend", map, onMapZoom);
            
            //设置鼠标右建事件。
            map.events.register("mousedown", map, onMapMousedown);

			// 放大到全屏
            map.zoomToExtent(bounds);
			
			//加载控件到地图容器  
		    //加载比例尺控件  
		      map.addControl(scaleLineControl);  
			//map.addControl(new OpenLayers.Control.LayerSwitcher());
            //map.addControl(new OpenLayers.Control.MousePosition());
			/********************END 加载图层*********************************/


			/************************加载一般的基础控件********************************/   
                map.addControl(new OpenLayers.Control.PanZoomBar({  //添加平移缩放工具条
                    position: new OpenLayers.Pixel(2, 6)
                }));
//                map.addControl(new OpenLayers.Control.Navigation());  //双击放大,平移
 //               map.addControl(new OpenLayers.Control.Scale($('scale')));  //获取地图比例尺
//                map.addControl(new OpenLayers.Control.MousePosition({element: $('location')}));  //获取鼠标的经纬度
//				map.setCenter(new OpenLayers.LonLat(100.254, 35.25), 1);  //添加平移缩放工具条
				map.addControl(new OpenLayers.Control.OverviewMap());  //添加鹰眼图
//				map.addControl(new OpenLayers.Control.LayerSwitcher({'ascending':false}));  //图层切换工具			
//               map.addControl(new OpenLayers.Control.Permalink('xxx'));  //添加永久链接
//				map.addControl(new OpenLayers.Control.MouseToolbar());
//				map.zoomToMaxExtent();
//				var zb=new OpenLayers.Control.ZoomBox({out:true});
//				var panel = new OpenLayers.Control.Panel({defaultControl: zb});
				map.addControl(panel);
			 /************END************加载一般的基础控件********************************/ 
				
			/*****************************测距、面积Start***************************/
		
            
            // style the sketch fancy
            var sketchSymbolizers = {
                "Point": {
                    pointRadius: 4,
                    graphicName: "square",
                    fillColor: "white",
                    fillOpacity: 1,
                    strokeWidth: 1,
                    strokeOpacity: 1,
                    strokeColor: "#333333"
                },
                "Line": {
                    strokeWidth: 3,
                    strokeOpacity: 1,
                    strokeColor: "#666666",
                    strokeDashstyle: "dash"
                },
                "Polygon": {
                    strokeWidth: 2,
                    strokeOpacity: 1,
                    strokeColor: "#666666",
                    fillColor: "red",
                    fillOpacity: 0.3
                }
            };
            var style = new OpenLayers.Style();
            style.addRules([
                new OpenLayers.Rule({symbolizer: sketchSymbolizers})
            ]);
            var styleMap = new OpenLayers.StyleMap({"default": style});
            
            // allow testing of specific renderers via "?renderer=Canvas", etc
            var renderer = OpenLayers.Util.getParameters(window.location.href).renderer;
            renderer = (renderer) ? [renderer] : OpenLayers.Layer.Vector.prototype.renderers;

            measureControls = {
            	//测距离用的线
                line: new OpenLayers.Control.Measure(
                    OpenLayers.Handler.Path, {
                        persist: true,
                        handlerOptions: {
                            layerOptions: {
                                renderers: renderer,
                                styleMap: styleMap
                            }
                        }
                    }
                ),
                //测面积的设置
                polygon: new OpenLayers.Control.Measure(
                    OpenLayers.Handler.Polygon, {
                        persist: true,
                        handlerOptions: {
                            layerOptions: {
                                renderers: renderer,
                                styleMap: styleMap
                            }
                        }
                    }
                ),//球面测量的设置
                regularPolygon: new OpenLayers.Control.Measure(
                    OpenLayers.Handler.RegularPolygon, {
                        persist: true,
                        handlerOptions: {
                            layerOptions: {
                                renderers: renderer,
                                styleMap: styleMap
                            }
                        }
                    }
                )
            };
            
            var control;
            for(var key in measureControls) {
                control = measureControls[key];
                control.events.on({
                    "measure": handleMeasurements,
                    "measurepartial": handleMeasurements
                });
                map.addControl(control);
            }
            
            //map.setCenter(new OpenLayers.LonLat(0, 0), 3);
        
		/**************************测距、面积End***************************/
			

			/**************************添加图片标注Start***************************/
			markers = new OpenLayers.Layer.Markers( "Markers" );
            map.addLayer(markers);

            var size = new OpenLayers.Size(21,25);
            var offset = new OpenLayers.Pixel(-(size.w/2), -size.h);
            //下面图片代码改动过。
            var icon = new OpenLayers.Icon('./OpenLayers/img/marker.png',size,offset);
            markers.addMarker(new OpenLayers.Marker(new OpenLayers.LonLat(88,46),icon));
			
            var halfIcon = icon.clone();	
            markers.addMarker(new OpenLayers.Marker(new OpenLayers.LonLat(46,45),halfIcon));
			halfIcon.setOpacity(0.5);

            marker = new OpenLayers.Marker(new OpenLayers.LonLat(90,10),icon.clone());
            marker.setOpacity(0.2);
			//鼠标点击事件
            marker.events.register('mousedown', marker, function(evt) { alert(this.icon.url); OpenLayers.Event.stop(evt); });
            markers.addMarker(marker); 
            //map.addControl(new OpenLayers.Control.LayerSwitcher());
            //map.zoomToMaxExtent();
			
			//鼠标悬浮到图标上的事件
			var companyname="白马湖",renshu=502;
			marker.events.register("mouseover", marker, function(evt){
			 var html="<b>  "+companyname+"<br>  当前人数："+renshu+"人</b>";
			 popup1=new OpenLayers.Popup("popup1",
								new OpenLayers.LonLat(90,10),
								new OpenLayers.Size(200,50),
								html,
								false);
			 popup1.setBackgroundColor("#ffffff");
			 popup1.setOpacity(12);
			 popup1.setBorder("1px solid #d91f12");
				map.addPopup(popup1);
			});
			//鼠标移开事件
			marker.events.register("mouseout", marker, function(evt){
			 popup1.hide();
            });
			/**************************添加图片标注End***************************/

		//createPoint();
			//不同级别显示不同图层
			function onMapZoom(e){
			//alert('zoom level:'+map.getZoom());
			//alert('sclse:'+map.getScale());
			if(map.getZoom() == 1){   
　　			//show some layers.... 
				group.setVisibility(true);
				graphic2.setVisibility(false);
		　　}else if(map.getZoom() == 2){
		　　    //hide some lyers...
				//group.setVisibility(false);
				//graphic2.setVisibility(true);
				group.setVisibility(true);
		　　}else{
				group.setVisibility(true);
				graphic2.setVisibility(false);
			}
			}

        }

		//测距、面积
		function handleMeasurements(event) {
            var geometry = event.geometry;
            var units = event.units;
            var order = event.order;
            var measure = event.measure;
            var element = document.getElementById('output');
            var out = "";
           // alert(geometry+"--"+units+"=="+order+"=="+measure.toFixed());
            //当order为1时是线路测量
            if(order == 1) {
                out += "measure: " + measure.toFixed(3) + " " + units;
            } else {
            	//当order为2时是测量面积
                out += "measure: " + measure.toFixed(3) + " " + units + "<sup>2</" + "sup>";
            }
            element.innerHTML = out;
        }

        function toggleControl(_value) {
            for(key in measureControls) {
            	var remove="remove";
                var control = measureControls[key];
                if(_value == key ) {
                    control.activate();
                } else if(_value == remove) {
                	//alert("你点击了取消了");
                    control.deactivate();
                }else{
                	control.deactivate();
                }
            }
        }
		

		function onMapClick(e){
			//alert('click');
			// 显示地图屏幕坐标
	     var str = "[Screen]:" + e.xy.x + "," + e.xy.y;
		 document.getElementById("screen_xy").innerHTML = str;
		 // 屏幕坐标向地图坐标的转换
		 var lonlat = map.getLonLatFromViewPortPx(e.xy);
		 str = "[Map]:" + lonlat.lon + "," + lonlat.lat;
		 document.getElementById("location").innerHTML = str;
		 //生成点图层
		 

		}

			//鼠标右键
			function onMapMousedown(e){
			 if(e.button ==2){
			 	//
			 	$(this).click(toggleControl('remove'))
			      // alert("你点了右键");
			   }else if(e.button ==0){
			       alert("你点了左键");
			   }else if(e.button ==1){
			       alert("你点了滚轮");
			   }
			}
		
		function createPoint(){
		/******************************生成点图层Start***********************************/
			// Create 50 random features, and give them a "type" attribute that
			// will be used for the label text.
			var features = new Array(50);
			for (var i=0; i<features.length; i++) {
				features[i] = new OpenLayers.Feature.Vector(
					new OpenLayers.Geometry.Point(
						(360 * Math.random()) - 180, (180 * Math.random()) - 90
					), {
						type: 5 + parseInt(5 * Math.random())
					}
				);
			}
			/**
			 * 创建一个样式的实例，是一个集规则symbolizers。
       		*使用默认的symbolizer延长所有规则symoblizers。
			 */
			var style = new OpenLayers.Style({
				fillColor: "#ffcc66",
				strokeColor: "#ff9933",
				strokeWidth: 2,
				label: "${type}",
				fontColor: "#333333",
				fontFamily: "sans-serif",
				fontWeight: "bold"
			}, {
				rules: [
					new OpenLayers.Rule({
						minScaleDenominator: 200000000,
						symbolizer: {
							pointRadius: 7,
							fontSize: "9px"
						}
					}),
					new OpenLayers.Rule({
						maxScaleDenominator: 200000000,
						minScaleDenominator: 100000000,
						symbolizer: {
							pointRadius: 10,
							fontSize: "12px"
						}
					}),
					new OpenLayers.Rule({
						maxScaleDenominator: 100000000,
						symbolizer: {
							pointRadius: 13,
							fontSize: "15px"
						}
					})
				]
			});
			// Create a vector layer and give it your style map.
			var points = new OpenLayers.Layer.Vector("Points", {
				styleMap: new OpenLayers.StyleMap(style)
			});
			points.addFeatures(features);
			//map.removeLayer(points);
			map.addLayer(points);
		/******************************生成点图层End***********************************/

		}
		
		//缩小
		function zoomOut(){
			map.zoomOut();
		}
		//放大
		function zoomIn(){
			map.zoomIn();
		}
		//获取地图数据
		function getSize(){
			alert(map.getSize()+",高度为="+map.getSize().h);
		}
		
		//显示标注
		var marker1;
		function addMarker(){
			//此处的图片我也更换过.
			 var url = './OpenLayers/img/slider.png';
                var sz = new OpenLayers.Size(20, 20);  //尺寸大小
                var calculateOffset = function(size) {
                	//此处的w和h是可以直接拿到的,w指的时宽,h指的是高    ;
                                    return new OpenLayers.Pixel(-(size.w/2), -size.h);
                                 };
                var icon = new OpenLayers.Icon(url, sz, null, calculateOffset);
				
				marker1 = new OpenLayers.Marker(new OpenLayers.LonLat(107.71713665829,31.69980226846), icon);
                markers.addMarker(marker1);

               // marker = new OpenLayers.Marker(madrid, icon.clone());
               // markers.addMarker(marker);			
		}
		 function removeMarker() {
                markers.removeMarker(marker1);
         }

		 /*******************多边形获取经纬度坐标系*************************/
		 function test(){
			var getpolygonxy = new OpenLayers.Control();
			OpenLayers.Util.extend(getpolygonxy, {
				draw: function() {
					this.polygon= new OpenLayers.Handler.Polygon(getpolygonxy ,
							{ "done": this.notice },{ "persist": true},
							{ keyMask: OpenLayers.Handler.MOD_SHIFT });
					this.polygon.activate();
				},
				notice: function(bounds) {
					alert(bounds);//坐标信息					
				}
			});
			map.addControl(getpolygonxy);
		 }

