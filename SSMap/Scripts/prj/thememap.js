window.intUI = window.intUI || function () { };                     //初始化UI
window.getData = window.getData || undefined;                       //取該主題圖所有資料(不含geometry)
window.fieldOptions = window.fieldOptions || undefined;             //欄位定義
window.queryGeometry = window.queryGeometry || undefined;           //查詢單一geometry資料
window.mapLayers = window.mapLayers || undefined;                   //主題圖DYNAMIC LAYER
window.focusZoomLevel = window.focusZoomLevel || 16;                //選table後show indo window zoomlevel
//window.icon = window.icon || undefined;                           //point icon
window.geostyle = undefined;// {color:"#FF0000", weight:6};         //line color
window.operateEvents = window.operateEvents ||                      //點擊table listen event
{
    'click .info': function (e, value, row, index) {
        queryGeometry(row, function (e, fc) {

            var g = L.geoJSON(fc).getLayers()[0];
            $.each(fc.features, function () {
                this.layerinfo = layerinfo[window.mapLayers[0]];
            });
            var _latlng = undefined;
            if (g.getLatLng) {
                _latlng = g.getLatLng();
            } else {
                var _lls = g.getLatLngs();
                _latlng = _lls.length == 2 ? [(_lls[0].lat + _lls[1].lat) / 2, (_lls[0].lng + _lls[1].lng) / 2] :
                    _lls[Math.floor(_lls.length/2)];
            }
            app.map.setView(_latlng, app.map.getZoom());
            popup.openPopup(fc.features, _latlng);
            //popup.paintGeodataToMap(fc.features[0],true);
        });
    }
}

var popup = undefined;
var layerInfo = undefined;
var afterInitMap = function () {
    $('<div class="layer-display-control"><label><input type="checkbox">顯示圖資</label></div>').appendTo($('.popu-ctrl-container')).
        find('input').on('change', function () {
            if ($(this).is(':checked'))
                dynamicMapLayer.addTo(app.map);
            else
                dynamicMapLayer.remove();
    });

    var bodydom = $('body')[0];
    $('#accordion-container  .card-header > .btn').on('click', function () {
        setTimeout(function () {
            bodydom.style.setProperty('--tabletop', ($('#accordion-container').height() + 2)+'px');
        },200);
        setTimeout(function () {
            bodydom.style.setProperty('--tabletop', ($('#accordion-container').height() + 2) + 'px');
        }, 400);
    });

    var dynamicMapLayer = undefined;
   
    app.map.on('zoom', function () {
        if (dynamicMapLayer) dynamicMapLayer.redraw();
    });
    
    app.data = { datas: [] };//

    helper.misc.showBusyIndicator('#data-container');
    getData(function () {
        helper.misc.hideBusyIndicator('#data-container');
        intUI();

        $('#data-container .card-body input').on('keyup', function (e) {
            // Number 13 is the "Enter" key on the keyboard
            if (e.keyCode === 13) {
                // Cancel the default action, if needed
                e.preventDefault();
                // Trigger the button element with a click
                $('.set-filter').trigger('click');
            }
        });

        $('#data-container table').bootstrapTable('destroy').bootstrapTable(
            {
                triped: true,
                virtualScroll: true,
                height: 300,
                columns: fieldOptions,
                data: app.data.datas,
                formatNoMatches: function formatNoMatches() {
                    return '無符合資料!!';
                }
            }
        );
       
        //$_select_tit.selectpicker();
        $('.set-filter').on('click', function () {
            var fdata = app.data.datas;
            $.each($('#data-container .data-field'), function () {
                var v = $(this).val().trim();
                var f = $(this).attr('data-field');
                var ftype = $(this).attr('data-filter-type');
                var islike = false;
                if (ftype) {
                    islike = ftype.toUpperCase() == "LIKE";
                }
                if (v) fdata = $.grep(fdata, function (d) { return d[f] && (islike ? d[f].indexOf(v)>=0: d[f] == v) });
            });
            $('#data-container table').bootstrapTable('load', fdata);

        });
        $('.clear-filter').on('click', function () {
            $('#data-container .data-field').val('');
            $('.set-filter').trigger('click');
        });
    });

    fieldOptions.splice(0, 0, { title: '序', showInInfo:false, halign: "center", align: 'center', formatter: function (v, d, i) { return i + 1; } });
    fieldOptions.push({ field: 'INFO', title: '檢視', showInInfo: false, halign: "center", align: 'center', formatter: function () { return '<span class="info glyphicon glyphicon-map-marker"></span>' }, events: window.operateEvents });

    L.dou.popup.getLayerInfo(datahelper.proxy+'?' +datahelper.sewerserver, function (_i) {
        layerinfo = _i;
        var cl = layerinfo[window.mapLayers[0]];
        var p1 = helper.gis.TWD97ToWGS84(cl.extent.xmin, cl.extent.ymin);
        var p2 = helper.gis.TWD97ToWGS84(cl.extent.xmax, cl.extent.ymax);
        app.fitBounds = [[p1.lat, p1.lon], [p2.lat, p2.lon]];
        app.map.fitBounds(app.fitBounds);//.setView([51.505, -0.09], 13);
    });
    var popupoptions = {
        map: app.map, closeOnClick: true, autoClose: true, className: 'leaflet-infowindow', minWidth: 280, geoJSONoptions: { removeOnPopupClose:false} };
    if (window.geostyle) //line style
        popupoptions.geoJSONoptions = $.extend(popupoptions.geoJSONoptions, { style: geostyle });
    if (window.geopointToLayer)
        popupoptions.geoJSONoptions = $.extend(popupoptions.geoJSONoptions, { pointToLayer: window.geopointToLayer });
    popup = L.dou.popup.popupGeoJson(popupoptions);
    dynamicMapLayer = L.dou.popup.esri.dynamicMapLayerAutoPopup({ map: app.map, popup: popup, layerOptions: { url:datahelper.sewerserver, layers: window.mapLayers, proxy: datahelper.proxy } })
        .dynamicMapLayer;//.addTo(app.map);
    var isfirstloading = true;
    dynamicMapLayer.on('loading', function () {
        if (isfirstloading)
            helper.misc.showBusyIndicator('#map');
    }).on('load', function () {
        if (isfirstloading)
            helper.misc.hideBusyIndicator('#map');
        isfirstloading = false;
    });
}