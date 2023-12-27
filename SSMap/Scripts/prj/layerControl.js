var layerControl = function () { //圖層控制
    var $_container = $('#layerControlDiv');
    var popup =  L.dou.popup.popupGeoJson({map:app.map, closeOnClick: true, autoClose: true, className: 'leaflet-infowindow', minWidth: 280 });
    
    var genctrl = function (_server, _meterid, _name, _show) {
        //if (!_server.startsWith(datahelper.proxy))
        //    _server = datahelper.proxy+'?' + _server;
        var $_c = $('<div>').appendTo($_container);
        $('<a class="' + (_show ? '' :'collapsed')+'" data-toggle="collapse" href="#' + _meterid + '" role="button" aria-controls="' + _meterid + '"><label><b class="caret"></b>' + _name + '</label></a>').appendTo($_c);
        var $_metercontainer = $('<div id="' + _meterid + '" class="meter collapse ' + (_show ? 'show' : '') + '">').appendTo($_c);
        datahelper.getlegend(_server, function (ls) {
            $.each(ls, function () {
                var l = this;
                var legendIcons = $.map(this.legend, function (i) {
                    if (i.label == '<all other values>')
                        return;
                    return { 'name': i.label, 'url': 'data:image/png;base64,' + i.imageData, classes: '' }
                }); 
                var $_m=$('<div class="col-md-12" data-layer="' + l.layerId+'"></div>').appendTo($_metercontainer).PinCtrl({
                    map: app.map, name: this.layerName, useLabel: false, useList: false,
                    polyStyles: [{ name: '圖例', strokeColor: '#FF0000', strokeOpacity: 1, strokeWeight: 1, fillColor: '#FF0000', fillOpacity: .7, classes: 'water_normal' }],
                    legendIcons: legendIcons
                }).on($.BasePinCtrl.eventKeys.initUICompleted, function () {
                    var $_this = $(this);
                    $_this.find('.pinswitch').off('change').on('change', function () {
                        $_this.toggleClass('show');
                        changeLayer();
                    });
                    $_m.find('.legend').appendTo($_m.find('.ctrl>.col-12'));
                   $('<div class="col-xs-12"><div class="opacity-slider" title="透明度"></div></div>').appendTo($_m.find('.ctrl')).find('.opacity-slider')
                        .gis_layer_opacity_slider({
                            map: app.map,
                            range: "min",
                            max: 100,
                            min: 5,
                            value: 90,
                            setOpacity: function (_op) {
                                dynamicMapLayer.setOpacity(_op)
                            }
                        });
                })
                //var dynamicMapLayer = L.esri.dynamicMapLayer({//加入主題圖圖層
                //    url: _server,
                //    layers: [l.layerId]
                //})//.addTo(app.map)
                //var sdf = new dynamicMapLayerAutoPopup({ url: _server, layers: [l.layerId] });
                var dynamicMapLayer = L.dou.popup.esri.dynamicMapLayerAutoPopup({ map: app.map, popup: popup, layerOptions: { url: _server, layers: [l.layerId], proxy: datahelper.proxy  } })
                    .dynamicMapLayer;
                dynamicMapLayer.setOpacity(0.9);
                var changeLayer = function () {
                    //var asd = dynamicMapLayer.getLayers();
                    //var _layers = $.map($_c.find('.pinctrl.show'), function (el) {
                    //    return parseInt($(el).attr('data-layer'));
                    //});
                    //dynamicMapLayer.setLayers(_layers);
                    //dynamicMapLayer.redraw();
                    
                    if ($_m.hasClass('show')) {
                        dynamicMapLayer.addTo(app.map);
                        dynamicMapLayer.bringToFront();
                    }else dynamicMapLayer.remove();
                }
                
            });

        });
        
    }
    //genctrl(datahelper.sewerserver, 'sewer-meter', '污水-羅東', true);
    genctrl(datahelper.sewerserver_noname, 'sewer-meter', '污水-羅東', true); //羅東已接管用戶，隱藏有個資相關資訊
    genctrl(datahelper.markserver, 'mark-meter', '污水-標別');
    genctrl(datahelper.yilansewerserver, 'yilan-sewer-meter', '污水-宜蘭');
    
};
