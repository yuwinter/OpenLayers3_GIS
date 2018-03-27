OpenLayers.Control.LTOverviewMap = OpenLayers.Class(OpenLayers.Control.OverviewMap, {
    initialize: function (options) {
        this.minRatio = 10;
        this.maxRatio = 10;
        this.minRectSize = 10;
		this.size = new OpenLayers.Size(180, 120);
		this.maximized=true;
        options = OpenLayers.Util.extend({
            mapOptions: {
                projection: new OpenLayers.Projection("EPSG:900913"),
                displayProjection: new OpenLayers.Projection("EPSG:4326"),
                units: "m",
                maxResolution: 156543.0339,
                maxExtent: new OpenLayers.Bounds(109.69336887, 20.2352793,
             117.18931829666676, 25.528473333333334)
            }
        }, options);
        OpenLayers.Control.OverviewMap.prototype.initialize.apply(this, [options]);

    },
    /**
     * 将鹰眼中心点设置和Map相同
     */
    setOvMapCenter: function () {
        this.ovmap.setCenter(this.map.getExtent().getCenterLonLat());
    },
    /*
     *更新地图范围到鹰眼图的图框
     */
    updateMapToRect: function () {
        OpenLayers.Control.OverviewMap.prototype.updateMapToRect.apply(this, arguments);
        this.ovmap.setCenter(this.map.getExtent().getCenterLonLat());
    },
    /*
     *创建Map对象
     */
    createMap: function () {
        OpenLayers.Control.OverviewMap.prototype.createMap.apply(this, arguments);
        this.ovmap.events.register('moveend', this, this.updateRectToMap);
        this.ovmap.events.register('zoomend', this, this.updateRectToMap);
    },
    /*
     *绘制鹰眼图组件
     */
    draw: function () {
        OpenLayers.Control.prototype.draw.apply(this, arguments);
        if (!(this.layers.length > 0)) {
            if (this.map.baseLayer) {
                var layer = this.map.baseLayer.clone();
                this.layers = [layer];
            } else {
                this.map.events.register("changebaselayer", this, this.baseLayerDraw);
                return this.div;
            }
        }

        // create overview map DOM elements
        this.element = document.createElement('div');
        this.element.className = this.displayClass + 'Element';
        this.element.style.display = 'none';

        this.mapDiv = document.createElement('div');
        this.mapDiv.style.width = this.size.w + 'px';
        this.mapDiv.style.height = this.size.h + 'px';
        this.mapDiv.style.position = 'relative';
        this.mapDiv.style.overflow = 'hidden';
        this.mapDiv.id = OpenLayers.Util.createUniqueID('overviewMap');

        this.extentRectangle = document.createElement('div');
        this.extentRectangle.style.position = 'absolute';
        this.extentRectangle.style.zIndex = 1000; //HACK
        this.extentRectangle.className = this.displayClass + 'ExtentRectangle';
        this.mapDiv.appendChild(this.extentRectangle);

        this.element.appendChild(this.mapDiv);

        this.div.appendChild(this.element);
        // Optionally add min/max buttons if the control will go in the
        // map viewport.
        if (!this.outsideViewport) {
            this.div.className += " " + this.displayClass + 'Container';
            var imgLocation = OpenLayers.Util.getImagesLocation();
            // maximize button div
            var img = imgLocation + 'overexpand.gif';
            this.maximizeDiv = OpenLayers.Util.createAlphaImageDiv(
            this.displayClass + 'MaximizeButton', null, new OpenLayers.Size(18, 18), img, 'absolute');
            this.maximizeDiv.style.display = 'none';
            this.maximizeDiv.className = this.displayClass + 'MaximizeButton';
            OpenLayers.Event.observe(this.maximizeDiv, 'click', OpenLayers.Function.bindAsEventListener(this.maximizeControl, this));
            this.div.appendChild(this.maximizeDiv);
            // minimize button div
            var img = imgLocation + 'overcontract.gif';
            this.minimizeDiv = OpenLayers.Util.createAlphaImageDiv('OpenLayers_Control_minimizeDiv', null, new OpenLayers.Size(18, 18), img, 'absolute');
            this.minimizeDiv.style.display = 'none';
            this.minimizeDiv.className = this.displayClass + 'MinimizeButton';
            OpenLayers.Event.observe(this.minimizeDiv, 'click', OpenLayers.Function.bindAsEventListener(this.minimizeControl, this));
            this.div.appendChild(this.minimizeDiv);

            var eventsToStop = ['dblclick', 'mousedown'];

            for (var i = 0, len = eventsToStop.length; i < len; i++) {

                OpenLayers.Event.observe(this.maximizeDiv, eventsToStop[i], OpenLayers.Event.stop);

                OpenLayers.Event.observe(this.minimizeDiv, eventsToStop[i], OpenLayers.Event.stop);
            }

            this.minimizeControl();
        } else {
            // show the overview map
            this.element.style.display = '';
        }
        if (this.map.getExtent()) {
            this.update();
        }

        this.map.events.register('moveend', this, this.update);
        this.map.events.register('zoomend', this, this.update);
        this.map.events.register('dragend', this, this.update);

        this.map.events.register('moveend', this, this.setOvMapCenter);
        this.map.events.register('zoomend', this, this.setOvMapCenter);
        this.map.events.register('dragend', this, this.setOvMapCenter);
	    if (this.maximized) {
            this.maximizeControl();
        }
        return this.div;
    },
    CLASS_NAME: "OpenLayers.Control.LTOverviewMap"
});