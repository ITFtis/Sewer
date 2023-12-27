var $_select_type = $('#select-type');//.selectpicker();
var $_select_tit = $('#select-tit')//.selectpicker();
window.getData = function (callback) {
    app.data.types = [];
    app.data.tits = [];
    app.data.dists = [];
    datahelper.getAll陰井Data(function (error, featureCollection) {
        var asdd = featureCollection.features;
        $.each(featureCollection.features, function () {
            app.data.datas.push(this.properties);
            var _type = this.properties['CB_TYPE']; 
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
            $_select_tit.selectpicker('destroy').selectpicker({ dropupAuto: false, size: 10, container: 'body', liveSearch: true, mobile: false, windowPadding: 30, noneResultsText: '無符合 {0} 資料' });
        callback();
    });
};

window.fieldOptions = [
    { field: 'CB_NO', title: '陰井編號', halign: "center", align: 'left' },
    { field: 'CB_HT', title: '管底高程', halign: "center", align: 'right' },
    { field: 'G_LEVEL', title: '人孔高程', halign: "center", align: 'right' },
    { field: 'CB_TYPE', title: '陰井形式', halign: "center", align: 'center' },
    { field: 'CBC_WIDTH', title: '孔蓋尺寸', halign: "center", align: 'right' }
];

window.queryGeometry = function (row, callback) {
    datahelper.query(datahelper.sewerserver + datahelper.sewerlayers._陰井, ['*'], "CB_NO='" + row.CB_NO + "'", true, function (e, d) {
        callback(e, d);
    });
}
window.mapLayers = [datahelper.sewerlayers._陰井];
window.icon = {
    iconUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAAXNSR0IB2cksfwAAAAlwSFlzAAAOxAAADsQBlSsOGwAAAGFJREFUOI3t0VEKwCAMA9AUvKKn9JD1a8NprLTIYMz8GfDR0oTNSQf8JqikkyioAKC5kcrdU9QCB+x6W6g5YY8R1DVhKO+CUvjas3VXoADQHm0w95UfKOndEy4/R0FXfghWXCIV/pt6sWIAAAAASUVORK5CYII=',
}
