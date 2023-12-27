var $_select_tit = $('#select-tit')//.selectpicker();
window.getData = function (callback) {
    app.data.tits = [];
    app.data.dists = [];
    datahelper.getAll連接管Data(function (error, featureCollection) {
        var asdd = featureCollection.features;
        $.each(featureCollection.features, function () {
            app.data.datas.push(this.properties);
            var _tit = this.properties['CONS_TIT'];
            var _dist = this.properties['DIST'];
            if (_tit && app.data.tits.indexOf(_tit) < 0)
                app.data.tits.push(_tit);
            if (_dist && app.data.dists.indexOf(_dist) < 0)
                app.data.dists.push(_dist);
        }); 
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
    { field: 'SWER_NO', title: '連接管編號', halign: "center", align: 'left' },
    { field: 'UCB_NO', title: '上游陰井編號', halign: "center", align: 'left' },
    { field: 'DCB_NO', title: '下游陰井編號', halign: "center", align: 'left' },
    { field: 'SEWER_LH', title: '管線長度', halign: "center", align: 'right' },
    { field: 'DIA', title: '管徑', halign: "center", align: 'center' },
    //{ field: 'CONS_TIT', title: '工程名稱', halign: "center", align: 'right' },
    //{ field: 'DIST', title: '鄉鎮村里', halign: "center", align: 'right' }
];

window.queryGeometry = function (row, callback) {
    datahelper.query(datahelper.sewerserver + datahelper.sewerlayers._連接管, ['*'], "SWER_NO='" + row.SWER_NO + "'", true, function (e, d) {
        callback(e, d);
    });
}
window.mapLayers = [datahelper.sewerlayers._連接管]; 
//window.geostyle ={ color: 'blue', weight: 10 };
