/**
 * 标绘功能的事件处理模块
 */
var PLOT = {
	plotImgMap:new Map(),//存放标绘在地图上的图片
	draw:null,
	source: new ol.source.Vector(),
	plotPic:null,
	gBHPicGroup:"",//标绘图标组名
	gCurDrawPicture:"",//图标路径
	showHideDrawBox:function(){//显示隐藏标绘界面
		$("#DrawBoxDiv").html("");
		PLOT.createDrawBox("","");
	    if($("#DrawBoxDiv").css("display")!="none"){
	    	$("#DrawBoxDiv").css("display","none");
			$("#SaveDrawDiv").css("display","none");
		}else{
			$("#DrawBoxDiv").css("display","block");
			$("#SaveDrawDiv").css("display","block");
		}
	},
	createDrawBoxHTML:function(){
		var ix='<table class="title" >';
		ix+='<tr><td valign="center">';
		ix+='<strong>&nbsp;基础绘图工具</strong>'	;    
		ix+='</td><td align="right">';
		ix+='<img class="close" src="../img/close.png" title="关闭" onclick="$(\'#DrawBoxDiv\').css(\'display\',\'none\');"></img>&nbsp;</td></tr>';
		ix+='</table>';
		ix+='<table class="content" border="0" cellSpacing="0" cellPadding="0">';
		ix+='<tr><td><div id="drawBrushDiv" class="drawBrush">';
		ix+='<table><tr><td style="height:30px;"></td></tr>';
		ix+='<tr><td><img id="bhObj_0" src="../img/RedMark.png" title="标点" class="drawPicStyle3"/></td></tr>';
		ix+='<tr><td><img id="bhObj_1" src="../img/FGreen.png" title="小旗帜" class="drawPicStyle3"/></td></tr>';
		ix+='<tr><td><img id="bhObj_2" src="../img/circle.png" title="画圆形" class="drawPicStyle3"/></td></tr>';
		ix+='<tr><td><img id="bhObj_3" src="../img/polyline.png" title="画折线" class="drawPicStyle3"/></td></tr>';
		ix+='</table></div></td>';
		ix+='<td><div class="selBH">&nbsp;选择图标组：&nbsp;'+
			'<select id="selBHGroup" class="DefineTopicTextCtl" onchange="PLOT.showSelGroupPic()"></select></div>' +
				'<div id="drawPicDiv" class="drawPic"></div>' +
				'</td>';
	    ix+='<tr></table>';
		return ix;
	},
	createDrawBox:function(){//创建标绘内容
		 	var html = PLOT.createDrawBoxHTML();
			$("#DrawBoxDiv").append(html);
	   		var OptionResults = "<option value='01常用'>01常用</option>";
	   		var FileNames = "<span title='A100箭头1' class='drawPicStyle' id='bht_0'><img picWidth='39' picHeight='29' src='../img/plot/箭头.png' class='drawPicStyle2'></img><br>箭头1</span>";
	   		FileNames += "<span title='A106矩形' class='drawPicStyle' id='bht_1'><img picWidth='156' picHeight='156'  src='../img/plot/矩形.png' class='drawPicStyle2'></img><br>矩形</span>";
	   		FileNames += "<span title='A108圆形' class='drawPicStyle' id='bht_2'><img picWidth='156' picHeight='156'  src='../img/plot/圆形.png' class='drawPicStyle2'></img><br>圆形</span>";
			$("#selBHGroup").append(OptionResults); 
			$("#drawPicDiv").append(FileNames); 
			//图标组的鼠标点击事件
			$(".drawPicStyle").mousedown(function(event){
				$(".drawPicStyle").removeClass("drawPicSelected");
				$(this).addClass("drawPicSelected");
				gBHisDeleteObj=false;
				var $spanId = $(this).attr("id");
				var picObj = $("#"+$spanId+" img")[0];
				PLOT.addPlot(PLOT.getImgInfo(picObj));
			});
			//画笔图标的悬浮事件样式控制
			$(".drawPicStyle3").hover(function(){
				$(this).addClass("drawPicOver");
			},function(){
				$(this).removeClass("drawPicOver");
			});
			//画笔图标的鼠标点击事件
			$(".drawPicStyle3").mousedown(function(event){
				$(".drawPicStyle3").removeClass("drawPicSelected");
				$(this).addClass("drawPicSelected");
				switch($(this).attr("id")){
					case "bhObj_0"://标一个点图标
						PLOT.addPlot(PLOT.getImgInfo(this));
						break;
					case "bhObj_1"://标一个小旗帜
						PLOT.addPlot(PLOT.getImgInfo(this));
						break;
					case "bhObj_2"://画圆形
						PLOT.drawPlot(2);
						break;
					case "bhObj_3"://画折线
						PLOT.drawPlot(3);
						break;
					default:
						break;
				}
			});
	},
	addPlot:function(imgurl){//标绘操作
    	PLOT.plotPic = imgurl;
    	DRAWMAP.map.on("singleclick",function(event){ 
    		if(PLOT.plotPic){
    			var coordinate = event.coordinate;//获取当前鼠标移动后的坐标信息
    			PLOT.addIcon(PLOT.plotPic,coordinate);//在地图中加入图片
    			PLOT.plotPic = null;
    		}
		});
	},
	getImgInfo:function(picObj){//获取图片信息（宽高、路径）
		var src = $(picObj).attr("src");
		var width="80",height="80";
	    var imgObj = new Image();
	    imgObj.src = src;
	   	if(imgObj.width != 0 && imgObj.height != 0){
	   		width = imgObj.width;
	   		height = imgObj.height;
	   	}
		return [width,height,src];
	},
	addIcon:function(imgurl,lonLat){//在地图中加入图片
    	var lng = parseFloat(lonLat[0]);
    	var lat = parseFloat(lonLat[1]);
    	var point = new ol.geom.Point([lng, lat]);//转换点坐标对象
    	var featureId  = Util.randomString(10);
		var feature= new ol.Feature({
			geometry: point,
			labelPoint: point,
			name: "plot"
		});
		feature.setId(featureId);
		var featureSource =  new ol.source.Vector();
		featureSource.addFeature(feature);
    	var style = new ol.style.Style({
			fill: new ol.style.Fill({
				color: 'rgba(255, 255, 255, 0.2)'
		    }),
		    stroke: new ol.style.Stroke({
		    	color: '#ffcc33',
		    	width: 2
		    }),
		    image:new ol.style.Icon({
		        offset: [0, 0],
		        opacity: 1.0,
		        rotateWithView: true,
		        rotation: 0.0,
		        scale: 1.0,
		        size: [imgurl[0], imgurl[1]],
		        src: imgurl[2]
		      })
		});
    	var getLayer= new ol.layer.Vector({
    			source: featureSource,
    			style: style
    		});
    	if(DRAWMAP.map){
			DRAWMAP.map.addLayer(getLayer);
			PLOT.plotImgMap.put(featureId,getLayer);
		}
	},
	drawPlot:function(flag){//画笔操作，比如画圆、画矩形
		if(PLOT.draw){
			DRAWMAP.map.removeInteraction(PLOT.draw);
			PLOT.draw = null;
		}
	    var value = "";
        switch(parseInt(flag)){
       	case 2://画圆形
       		value = "Circle";
       		break;
       	case 3://画折线
       		value = "LineString";
       		break;
        }
        var sourceId  = Util.randomString(10);
 		PLOT.source.set("id",sourceId);
 		PLOT.source.set("name","plot");
        PLOT.draw = new ol.interaction.Draw({ 
           source: PLOT.source,
           type:(value),
           geometryFunction: null,
           maxPoints: null
         });
         if(DRAWMAP.map){
        	 DRAWMAP.map.addInteraction(PLOT.draw);
        	 PLOT.plotImgMap.put(sourceId,PLOT.plotLayer());
         }
         //画笔绘图结束
         PLOT.draw.on("drawend", function(evt) {
  		    DRAWMAP.map.removeInteraction(PLOT.draw);
  		    DRAWMAP.map.addLayer(PLOT.plotLayer());//添加动态画图的图层
  		 }, this);
	},
	 plotLayer: function(){//返回layer图层
		return new ol.layer.Vector({
			source: PLOT.source,
			style: new ol.style.Style({
				fill: new ol.style.Fill({
					color: 'rgba(255, 255, 255, 0.2)'
			    }),
			    stroke: new ol.style.Stroke({
			    	color: '#ffcc33',
			    	width: 2
			    }),
			    image: new ol.style.Circle({
			    	radius: 7,
			    	fill: new ol.style.Fill({
			    		color: '#ffcc33'
			    	})
			    })
			})
		});
	}	
}

