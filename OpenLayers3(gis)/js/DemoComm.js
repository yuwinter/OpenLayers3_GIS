
//加载geoserver中wms服务中的数据
var maplayer= new ol.layer.Image({
				source: new ol.source.ImageWMS({
					url: 'http://localhost:8080/geoserver/CN/wms',  
					params: {'LAYERS': 'layers:RailWay','VERSION':'1.1.0'}, 
					 serverType: 'geoserver'  
				})
			});
		//鹰眼的使用
		//可以通过样式来修改鹰眼停留的位置
		var overviewMapControl = new ol.control.OverviewMap({
        className: 'ol-overviewmap ol-custom-overviewmap',
        layers: [maplayer],
        collapsed: false
      });
       
      //比例尺
       var scaleLineControl = new ol.control.ScaleLine();
       //比例尺js控制样式选择。
         var unitsSelect = document.getElementById('units');
         //也可以默认选择样式：
         //scaleLineControl.setUnits(ol.control.ScaleLineUnits.METRIC);
      function onChange() {
        scaleLineControl.setUnits(unitsSelect.value);
      }
      unitsSelect.addEventListener('change', onChange);
      onChange();
      //放大
      function zoomIn(){
      	var view=map.getView();//获取地图的视图
      	view.setZoom(view.getZoom()+1);//获取地图的缩放级别，加一就是放大
      }
      //缩小
      function zoomOut(){
      	var view=map.getView();
      	view.setZoom(view.getZoom()-1);
      }
      //左平移  其中lonlat的参数是用户输入得到的。
      function moveToLeft(lonlat) {//zoom为11时，平移0.06个经度或维度,具体lonlat值需要自己配置  
	    var view = map.getView();
	    var mapCenter = view.getCenter();  
	    mapCenter[0] -= lonlat * Math.pow(2, 11 - map.getView().getZoom());  
	    view.setCenter(mapCenter);  
	    map.render();//请求地图绘制  
      }  
      //向右平移 其中lonlat的参数是用户输入得到的。
      function moveToRight(lonlat) {//zoom为11时，平移0.06个经度或维度,具体lonlat值需要自己配置  
	    var view = map.getView();
	    var mapCenter = view.getCenter();  
	    mapCenter[0] += lonlat * Math.pow(2, 11 - map.getView().getZoom());  
	    view.setCenter(mapCenter);  
	    map.render();//请求地图绘制  
      }  
      //获取地图大小
      function getSize(){
	   alert(map.getSize());
      }
      //
	 // 创建地图
	  var map=new ol.Map({
			controls: ol.control.defaults().extend([
          overviewMapControl,scaleLineControl
        ]),
			layers: [
				maplayer
			],
			view: new ol.View({
				// 设置成都为地图中心
				//默认投影是球形墨卡托（EPSG：3857）
				center: ol.proj.transform([104, 30], 'EPSG:4326', 'EPSG:3857'),
				zoom: 5
			}),
			target: 'map'
	  });
     //缩放工具条  
        var zoomSilder=new ol.control.ZoomSlider();  
        map.addControl(zoomSilder); 
     //测量工具
      var MeasureTool = new ol.control.MeasureTool({
        sphereradius : 6378137,//sphereradius
      });
      map.addControl(MeasureTool);
