$(document).ready(function () {
    var $container = $("#positionDiv");
    $container.on($.menuctrl.eventKeys.popu_init_after, function () {
        var featureLayer = undefined;
        var geoJSONLayer = undefined;
        var layerinfo = undefined;
        L.dou.popup.getLayerInfo(datahelper.sewerserver, function (_i) {
            layerinfo = _i;
        });
        var popupoptions = {
            map: app.map, closeOnClick: true, autoClose: true, className: 'leaflet-infowindow', minWidth: 280, geoJSONoptions: { removeOnPopupClose: false }
        };
        var popup = L.dou.popup.popupGeoJson(popupoptions);

        var $districtContainer = $('<div class="container"><div>行政區定位</div></div>').appendTo($container);
        var $towncontainer = $('<div class="input-group"><select class="form-control col-12"></select><div class="input-group-append"><span class="glyphicon glyphicon-map-marker btn btn-outline-info" title="定位"></span></div></div>').appendTo($districtContainer);
        var $townselect = $towncontainer.find('select');
        var $townconfirm = $towncontainer.find('.btn');
        var $villagecontainer = $('<div class="input-group"><select class="form-control col-12"></select><div class="input-group-append"><span class="glyphicon glyphicon-map-marker btn btn-outline-info" title="定位"></span></div></div>').appendTo($districtContainer);
        var $villageselect = $villagecontainer.find('select');
        var $villageconfirm = $villagecontainer.find('.btn');
        datahelper.query(datahelper.districtserver + '0', ['TOWNCODE', 'TOWNNAME'], undefined, false, function (err, geos) {
            $.each(geos.features, function () {
                $('<option value="' + this.properties.TOWNCODE + '">' + this.properties.TOWNNAME + '</option>').appendTo($townselect);
            });
            $townselect.on('change', function () {
                $villageselect.empty();
                var sv = $townselect.val();
                $.each(villages, function () {
                    if (this.TOWNCODE == sv)
                        $('<option value="' + this.FID + '">' + this.VILLNAME + '</option>').appendTo($villageselect);
                });
            });
            var villages = [];
            datahelper.query(datahelper.districtserver + '1', ['FID', 'VILLNAME', 'TOWNCODE'], undefined, false, function (err, geos) {
                villages = $.map(geos.features, function (g) {
                    return g.properties;
                });

                $townselect.val('10002020').trigger('change'); //預設羅東鎮
            });
        });
        var $addressContainer = $('<div class="container"><div>地址、地標定位</div></div>').appendTo($container);
        $addressContainer.addressGeocode({ map: app.map }).on($.addressGeocode.eventKeys.ui_init_completed, function () {
            $addressContainer.find('.btn').addClass('btn btn-outline-info');
        }).on($.addressGeocode.eventKeys.select_change, function () {
            clear();
            enableClearGeoBtn();
        });


        var $mhContainer = $('<div class="container"><div>人孔定位</div></div>').appendTo($container);
        var $mhdselect = $('<div class="col-12 form-inline"><select class="col-6 form-control"></select><select class="col-6 form-control"></select></div>').appendTo($mhContainer);//.find('select');
        var $mh_townselect = $mhdselect.find('select').first();// $('<div class="col-12"><select class="col-6 form-control"></select><select class="col-6 form-control"></select></div>').appendTo($mhContainer).find('select');
        var $mh_villageselect = $mhdselect.find('select').eq(1);//  $('<div class="col-6"><select class="form-control"></select></div>').appendTo($mhContainer).find('select');
        var $mhselectcontainer = $('<div class="input-group"><select class="form-control col-12"></select><div class="input-group-append"><span class="glyphicon glyphicon-map-marker btn btn-outline-info" title="定位"></span></div></div>').appendTo($mhContainer);
        var $mhselect = $mhselectcontainer.find('select');
        var $mhconfirm = $mhselectcontainer.find('.btn');
        datahelper.query(datahelper.sewerserver + datahelper.sewerlayers._人孔, ['FID', 'MH_NO', 'DIST', 'VILLAGE'], undefined, false, function (err, geos) {
            var diss = [];
            var villages = [];
            $.each(geos.features, function () {
                if (diss.indexOf(this.properties.DIST) < 0) {
                    diss.push(this.properties.DIST);
                    $('<option value="' + this.properties.DIST + '">' + this.properties.DIST + '</option>').appendTo($mh_townselect);
                }
            });
            $mh_townselect.on('change', function () {
                villages = [];
                var tv = $mh_townselect.val();
                $mh_villageselect.empty();
                $.each(geos.features, function () {
                    if (this.properties.DIST == tv && villages.indexOf(this.properties.VILLAGE) < 0) {
                        villages.push(this.properties.VILLAGE);
                        $('<option value="' + this.properties.VILLAGE + '">' + this.properties.VILLAGE + '</option>').appendTo($mh_villageselect);
                    }
                });
                $mh_villageselect.trigger('change');
            });
            $mh_villageselect.on('change', function () {
                var vv = $mh_villageselect.val();
                $mhselect.empty();
                $.each(geos.features, function () {
                    if (this.properties.VILLAGE == vv)
                        $('<option value="' + this.properties.FID + '">' + this.properties.MH_NO + '</option>').appendTo($mhselect);
                });
                if (Popper)
                    $mhselect.selectpicker('destroy').selectpicker({ dropupAuto: false, size: 10, container: 'body', liveSearch: true, mobile: false, noneResultsText:'無符合 {0} 資料'});
            });
            $mh_townselect.trigger('change');
        });

        var $sewerContainer = $('<div class="container"><div>管線定位</div></div>').appendTo($container);
        var $sewerdselect = $('<div class="col-12 form-inline"><select class="col-6 form-control"></select><select class="col-6 form-control"></select></div>').appendTo($sewerContainer);
        var $sewer_townselect = $sewerdselect.find('select').first();
        var $sewer_villageselect = $sewerdselect.find('select').eq(1);
        var $sewerselectcontainer = $('<div class="input-group"><select class="form-control"></select><div class="input-group-append"><span class="glyphicon glyphicon-map-marker btn btn-outline-info" title="定位"></span></div></div>').appendTo($sewerContainer);
        var $sewerselect = $sewerselectcontainer.find('select');
        var $sewerconfirm = $sewerselectcontainer.find('.btn');
        datahelper.query(datahelper.sewerserver + datahelper.sewerlayers._管線, ['FID', 'SEWER_NO', 'DIST','VILLAGE'], undefined, false, function (err, geos) {
            var diss = [];
            var villages = [];
            $.each(geos.features, function () {
                if (diss.indexOf(this.properties.DIST) < 0) {
                    diss.push(this.properties.DIST);
                    $('<option value="' + this.properties.DIST + '">' + this.properties.DIST + '</option>').appendTo($sewer_townselect);
                }
            });
            $sewer_townselect.on('change', function () {
                villages = [];
                var tv = $sewer_townselect.val();
                $sewer_villageselect.empty();
                $.each(geos.features, function () {
                    if (this.properties.DIST == tv && villages.indexOf(this.properties.VILLAGE) < 0) {
                        villages.push(this.properties.VILLAGE);
                        $('<option value="' + this.properties.VILLAGE + '">' + this.properties.VILLAGE + '</option>').appendTo($sewer_villageselect);
                    }
                });
                $sewer_villageselect.trigger('change');
            });
            $sewer_villageselect.on('change', function () {
                var vv = $sewer_villageselect.val();
                $sewerselect.empty();
                $.each(geos.features, function () {
                    if (this.properties.VILLAGE == vv)
                        $('<option value="' + this.properties.FID + '">' + this.properties.SEWER_NO + '</option>').appendTo($sewerselect);
                });
                if (Popper)
                    $sewerselect.selectpicker('destroy').selectpicker({ dropupAuto: false, size: 10, container: 'body', liveSearch: true, mobile: false, noneResultsText: '無符合 {0} 資料' });
            });
            $sewer_townselect.trigger('change');
        });

        var $userContainer = $('<div class="container"><div>用戶接管定位</div></div>').appendTo($container);
        var $userselectcontainer = $('<div class="input-group"><select class="form-control"></select><div class="input-group-append"><span class="glyphicon glyphicon-map-marker btn btn-outline-info" title="定位"></span></div></div>').appendTo($userContainer);
        var $userselect = $userselectcontainer.find('select');
        var $userconfirm = $userselectcontainer.find('.btn');
        helper.misc.showBusyIndicator($container);
        datahelper.query(datahelper.sewerserver + datahelper.sewerlayers._已接管用戶, ['FID', 'USER_ADDER '], undefined, false, function (err, geos) {
            helper.misc.hideBusyIndicator($container);
            $.each(geos.features, function () {
                $('<option value="' + this.properties.FID + '">' + this.properties.USER_ADDER + '</option>').appendTo($userselect);
            });
            if (Popper)
                $userselect.selectpicker('destroy').selectpicker({ dropupAuto: false, size: 10, container: 'body', liveSearch: true, mobile: false, noneResultsText: '無符合 {0} 資料' });
        });


        var $clearGeoBtn = $('<div class="container"><button type="button"  class="btn btn-info" style="float:right" disabled>清 除</button></div>').appendTo($container).find('.btn').on('click', function () {
            clear();
        });


        //定位鄉鎮
        $townconfirm.on('click', function () {
            clear();
            var tv = $townselect.val();
            setGeoAndFitbounds(datahelper.districtserver + '0', "TOWNCODE='" + tv + "'", undefined, {width:1, fillColor: 'transparent', dashArray: '6,6,6,3,6,3' });
        });
        //定位村里
        $villageconfirm.on('click', function () {
            clear();
            var tv = $villageselect.val();
            setGeoAndFitbounds(datahelper.districtserver + '1', "FID=" + tv, undefined, { fillColor: 'transparent', dashArray: '1,6' });
        });
        //人孔
        $mhconfirm.on('click', function () {
            clear();
            var mhv = $mhselect.val();
            popupAndFitbounds(datahelper.sewerserver + datahelper.sewerlayers._人孔, "FID=" + mhv);
        });
        //管線定位
        $sewerconfirm.on('click', function () {
            clear();
            var sewerv = $sewerselect.val();
            popupAndFitbounds(datahelper.sewerserver + datahelper.sewerlayers._管線, "FID=" + sewerv);
        });
        //用戶接管定位
        $userconfirm.on('click', function () {
            clear();
            var userv = $userselect.val();
            popupAndFitbounds(datahelper.sewerserver + datahelper.sewerlayers._已接管用戶, "FID=" + userv);
        });
        var popupAndFitbounds = function (layer, where, makerOpts, style) {
            clear();
            enableClearGeoBtn();
            datahelper.query(layer, ['*'], where, true, function (error, fc) {
                geoJSONLayer = L.geoJSON(fc);
                var g = L.geoJSON(fc).getLayers()[0];
                var l = layer.substr(layer.length - 1);
                $.each(fc.features, function () {
                    this.layerinfo = layerinfo[l];
                });
                var _latlng = undefined;
                if (g.getLatLng) {
                    _latlng = g.getLatLng();
                } else {
                    var _lls = g.getLatLngs();
                    _latlng = _lls.length == 2 ? [(_lls[0].lat + _lls[1].lat) / 2, (_lls[0].lng + _lls[1].lng) / 2] :
                        _lls[Math.floor(_lls.length / 2)];
                }
                popup.openPopup(fc.features, _latlng);
                app.map.fitBounds(geoJSONLayer.getBounds());
            });
        }
        var setGeoAndFitbounds = function (layer, where, makerOpts, style) {
            clear();
            enableClearGeoBtn();
            datahelper.query(layer, ['*'], where, true, function (error, fc) {
                geoJSONLayer = L.geoJSON(fc, {
                    pointToLayer: function (geoJsonPoint, latlng) {
                        return L.marker(latlng);
                    },
                    style: function (geoJsonFeature) {
                        return style?style:{ fillColor: 'transparent'}
                    },
                    onEachFeature: function (feature, layer) { }
                }).addTo(app.map);
                app.map.fitBounds(geoJSONLayer.getBounds());
            });
        }
        var clear = function () {
            if (featureLayer)
                featureLayer.remove();
            if (geoJSONLayer)
                geoJSONLayer.remove();
            if (popup)
                popup.clear();
            $addressContainer.addressGeocode('clear');
            $clearGeoBtn.attr('disabled', 'true');
        }

        //開啟 $clearGeoBtn 
        var enableClearGeoBtn = function () {
            setTimeout(function () {
                $clearGeoBtn.attr('disabled', false);
            }, 500);
        }

    });
});