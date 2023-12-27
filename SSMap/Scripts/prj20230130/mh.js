var $_input_no = $('#input-no');
var $_select_type = $('#select-type');//.selectpicker();
var $_select_tit = $('#select-tit')//.selectpicker();
var $_input_dist = $('#input-dist');
window.getData = function (callback) {
    app.data.types = [];
    app.data.tits = [];
    app.data.dists = [];
    datahelper.getAll人孔Data(function (error, featureCollection) {
        var asdd = featureCollection.features;
        $.each(featureCollection.features, function () {
            app.data.datas.push(this.properties);
            var _type = this.properties['MH_TYPE'];
            var _tit = this.properties['CONS_TIT'];
            var _dist = this.properties['DIST'];
            if (_type && app.data.types.indexOf(_type) < 0)
                app.data.types.push(_type);
            if (_tit && app.data.tits.indexOf(_tit) < 0)
                app.data.tits.push(_tit);
            if (_dist && app.data.dists.indexOf(_dist) < 0)
                app.data.dists.push(_dist);
        });

        app.data.types.sort(function (a, b) {
            return a.localeCompare(b, "zh-hant");
        });
        $('<option value="">--</option>').appendTo($_select_type);
        $.each(app.data.types, function () {
            $('<option value="' + this + '">' + this + '</option>').appendTo($_select_type);
        });
        //$_select_type.selectpicker({ liveSearch: true, container: 'body' });

        app.data.tits.sort(function (a, b) {
            return a.localeCompare(b, "zh-hant");
        });
        $('<option value="">--</option>').appendTo($_select_tit);
        $.each(app.data.tits, function () {
            $('<option value="' + this + '">' + this + '</option>').appendTo($_select_tit);
        });
    
        if (Popper)
            $_select_tit.selectpicker('destroy').selectpicker({ dropupAuto: false, size: 10, container: 'body', liveSearch: true, mobile: false, windowPadding:30, noneResultsText: '無符合 {0} 資料' });
        callback();
    });
};

window.fieldOptions = [  
    //{ title: '序', halign: "center", align: 'center', formatter: function (v, d, i) { return i + 1; } },
    { field: 'MH_NO', title: '人孔編號', halign: "center", align: 'left' },
    { field: 'MH_HT', title: '管底高程', halign: "center", align: 'right' },
    { field: 'G_LEVEL', title: '人孔高程', halign: "center", align: 'right' },
    { field: 'MH_TYPE', title: '人孔形式', halign: "center", align: 'center' },
    { field: 'MHC_DIA', title: '孔蓋尺寸', halign: "center", align: 'right' },
    //{ field: 'INFO', title: '檢視', halign: "center", align: 'center', formatter: function () { return '<span class="info glyphicon glyphicon-info-sign"></span>' }, events: window.operateEvents },
];

window.queryGeometry = function (row, callback) {
    datahelper.query(datahelper.sewerserver + datahelper.sewerlayers._人孔, ['*'], "MH_NO='" + row.MH_NO + "'", true, function (e, d) {
        callback(e, d);
    });
}
window.mapLayers = [datahelper.sewerlayers._人孔]; 
//window.icon = {
//    iconUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAAXNSR0IB2cksfwAAAAlwSFlzAAAOxAAADsQBlSsOGwAAAHVJREFUOI3t00EKACEIBVA/dN/O4ombRUiIWhYthmFcmj0EtdDlKD/oRXNyOAE7VB2PIUkDR2CMSZ4hdQqNO4wwiy47bEtMo6rLb6zN+0AQIzeYPuXk2jDmq+OszAwEEbUQHVj6UkbxODP7ttFh6vMpuBXXwQd9aB7kOh02twAAAABJRU5ErkJggg==',
//}
//window.wname = '污水人孔';

//window.geostyle = function (geoJsonPoint, latlng) {
//    var s = popup._style(geoJsonPoint, latlng);
//    s.fillColor = 'red';
//    return s;
//}