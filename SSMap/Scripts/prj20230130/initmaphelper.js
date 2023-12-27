
var app = app || { map: undefined, fitBounds : undefined};
$.AppConfigOptions.require.all(function () {
    var _mapOptions = $.extend({ zoomControl: false, trackResize: true, maxZoom: 22 }, window.mapOptions || {});
    //var p1 = helper.gis.TWD97ToWGS84(315660.135, 2719827.132);
    //var p2 = helper.gis.TWD97ToWGS84(337765.74, 2734113);
    var p1 = helper.gis.TWD97ToWGS84(308526.472053125, 2735598.9275072925);
    var p2 = helper.gis.TWD97ToWGS84(344899.402946875, 2736949.8255906254);
    app.fitBounds = [[p1.lat, p1.lon], [p2.lat, p2.lon]];
    app.map = L.map(document.getElementById('map'), _mapOptions).fitBounds(app.fitBounds);//.setView([51.505, -0.09], 13);
     
    $.initGisMenu(window.mainMenueId || 'mainmenu'); //初始化menu 
    //底圖
    $.MapBaseLayerDefaultSettings.tiles.MAP_TYPE_ROADMAP.options.maxZoom =
    $.MapBaseLayerDefaultSettings.tiles.MAP_TYPE_SATELLITE_HYBRID.options.maxZoom =
    $.MapBaseLayerDefaultSettings.tiles.MAP_TYPE_PHYSICAL_HYBRID.options.maxZoom =
    $.MapBaseLayerDefaultSettings.ext.TGOS.通用版電子地圖.options.maxZoom =
    $.MapBaseLayerDefaultSettings.ext.TGOS.TGOS電子地圖.options.maxZoom = _mapOptions.maxZoom;

    delete $.MapBaseLayerDefaultSettings.tiles.MAP_TYPE_PHYSICAL_HYBRID;

    $.MapBaseLayerDefaultSettings.tiles['通用版'] = $.MapBaseLayerDefaultSettings.ext.TGOS.通用版電子地圖;
    $.MapBaseLayerDefaultSettings.ext.TGOS.通用版電子地圖.name = "通用版";
    //$.MapBaseLayerDefaultSettings.tiles['TGOS電子地圖:'] = $.MapBaseLayerDefaultSettings.ext.TGOS.TGOS電子地圖;
    //$.MapBaseLayerDefaultSettings.ext.TGOS.TGOS電子地圖.name = "TGOS";

    $.MapBaseLayerDefaultSettings.tiles['通用版'] = { //override原有的通用版 20210510
        id: "tgos通用版",
        name: "通用版",
        type: "WebTiledLayer",
        url: document.location.protocol + "//wmts.nlsc.gov.tw/wmts/EMAP5/default/GoogleMapsCompatible/${level}/${row}/${col}",///TOGS範例https://api.tgos.tw/TGOS_MAP_API/Docs/Example/94
        options: { subDomains: ["", "", ""], maxZoom: _mapOptions.maxZoom }
    };
    $.MapBaseLayerDefaultSettings.tiles['工程底圖'] = {
        id: "工程底圖",
        name: "工程底圖",
        type: "WebTiledLayer",
        beforeShow: function () { return false},
        url: "http://210.59.253.2:6080/arcgis/rest/services/lotung/engineerbasemap/MapServe",
        options: { subDomains: ["", "", ""] }
    }
    $("#basemapDiv").MapBaseLayer({ map: app.map });

    app.map.createPane('engineerbasemap').style.zIndex = 201;
    var engineerbasemap = L.esri.dynamicMapLayer({
        url: "http://210.59.253.2:6080/arcgis/rest/services/lotung/engineerbasemap/MapServer",
        opacity: 1,
        useCors: false,
        pane: 'engineerbasemap'
    });//.addTo(app.map);
    setTimeout(function () {
        $('#basemapDiv .btn').on('click', function () {
            $('#map').removeClass('blackstyle');
            if ($(this).attr('data-gtype') == '工程底圖') {
                $('#map').addClass('blackstyle');
                engineerbasemap.addTo(app.map);
            }
            else
                engineerbasemap.remove();
        })
    }, 1000);
    afterInitMap();
});

