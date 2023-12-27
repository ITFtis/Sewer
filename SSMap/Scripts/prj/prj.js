var afterInitMap = function () {
    //測量
    var $_measurDiv = $('#measurDiv').gisdrawtool({ map: app.map, guid: helper.misc.geguid(), mutiDraw: false, singleGraphic: true, types: [$.gisdrawtool.types.POLYLINE, $.gisdrawtool.types.POLYGON], initEvent: $.menuctrl.eventKeys.popu_init_before, colorSelector: false })
        .on($.gisdrawtool.event_key.initUICompleted, function () {
            //取消繪圖標註
            $('#measurDiv .btn-group .btn').on('click', function (ev, s) {
                $('.btn-group .btn.work', $_drawDiv).removeClass('work');//.trigger('click');
                if ($_drawDiv.instance._mapctrl)$_drawDiv.instance._mapctrl.stop();
            });
        });
    //繪圖標註
    var $_drawDiv = $('#drawDiv').gisdrawtool({ map: app.map, guid: helper.misc.geguid() , types: [{ type: 'CIRCLEMAKER', name: ' 點 ', classid: "pointimg" }, $.gisdrawtool.types.POLYLINE, $.gisdrawtool.types.POLYGON, $.gisdrawtool.types.FREEHAND_POLYLINE, { type: $.gisdrawtool.types.POINT.type, name: ' 字 ', classid: "textimg"}], initEvent: $.menuctrl.eventKeys.popu_init_before, colorSelector: true })
        .on($.gisdrawtool.event_key.initUICompleted, function () {
            $_drawDiv.instance._mapctrl.drawGeo[$.gisdrawtool.types.POINT.type] = new L.Draw.Marker(app.map, {
                icon: L.divIcon({
                    html: '<div class="input-group draw-text-contanier" ><input type="text" class="form-control" placeholder="請輸入標註文字"><div class="input-group-append"><span class="input-group-text glyphicon glyphicon-ok"></span></div></div>',
                    className: 'textIcon textIcon-drawing',
                    iconSize: [180, 32],
                    iconAnchor: [90, 12],
                    guid: $_drawDiv.instance._mapctrl.guid
                }),
                repeatMode: true
            });
            $_drawDiv.instance._mapctrl.setStrokeWeight(2);
            $('.btn-group .btn', $_drawDiv).on('click', function (ev, s) {
                if (s != 'pause') { //從下面code呼叫的，文字point
                    if ($(this).hasClass('work'))
                        $_drawDiv[0].workitem = this; //編輯玩文字用到
                    else 
                        $_drawDiv[0].workitem = null;
                }
                //取消測量
                $('.btn-group .btn.work', $_measurDiv).removeClass('work');//.trigger('click');
                if ($_measurDiv.instance._mapctrl)$_measurDiv.instance._mapctrl.stop();
            });
        }).on($.gisdrawtool.event_key.add_graphic, function (evt, g, gs) {
            
            if (g._icon && $(g._icon).hasClass('textIcon-drawing')) {
                var $_c = $(g._icon);
                $_c.removeClass('textIcon-drawing');
                setTimeout(function () {
                    $_c.find('input').focus()
                },100);
                $_c.find('.glyphicon-ok').on('click', function () {
                    if (!$_c.find("input").val()) {
                        alert('請輸入資料!!');
                        return;
                    }
                    $_c.find('.draw-text-contanier').html('<label>' + $_c.find("input").val() + '</label>').addClass('display-label');
                    $_c.find('label').css('color', $_drawDiv.instance._mapctrl.fillColor);                   
                    $_c[0].style.width = 'auto';
                    var usetooltip = true;
                    if (usetooltip) {
                        g.bindTooltip($_c.find('.draw-text-contanier')[0].outerHTML,
                            { direction: 'top', sticky: true, permanent: true });
                        g.openTooltip();
                    }

                    setTimeout(function () {
                        $_c[0].style.marginLeft = -$_c.width() / 2 + 'px';
                        if(usetooltip)
                            $_c.empty();
                    });
                    setTimeout(function () {
                        if ($_drawDiv[0].workitem)
                            $($_drawDiv[0].workitem).trigger('click');
                    });
                });
                $_c.find("input").on('keyup', function (e) {
                    if (e.keyCode === 13)
                        $_c.find('.glyphicon-ok').trigger('click');
                });
                //.get(0).focus();
                setTimeout(function () {
                    $_drawDiv.find('.textimg').trigger('click', 'pause');
                    $_c.find("input").get(0).focus();
                });
            }
        });

    $('#_zoomin').on('click', function () {
        app.map.zoomIn();
    });
    $('#_zoomout').on('click', function () {
        app.map.zoomOut();
    });
    $('#_fullbounds').on('click', function () {
        app.map.fitBounds(app.fitBounds);
    });
    $('#_print').on('click', function () {
        helper.misc.showBusyIndicator();
        domtoimage.toBlob($('#map')[0])
            .then(function (blob) {
                window.saveAs(blob, 'map.png');
                helper.misc.hideBusyIndicator();
            });
    });

    $('#coordinateInfoDiv').CoordinateInfo({ map: app.map, display: $.CoordinateInfo.display.WGS84_TWD97, content_padding: 1, initEvent: $.menuctrl.eventKeys.popu_init_before });

    new layerControl();
}


