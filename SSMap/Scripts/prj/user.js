var $_input_no = $('#input-no');
var $_select_type = $('#select-type');//.selectpicker();
var $_select_tit = $('#select-tit')//.selectpicker();
var $_input_dist = $('#input-dist');
window.getData = function (callback) {
    datahelper.getAll用戶接管Data(function (error, featureCollection) {
        $.each(featureCollection.features, function () {
            app.data.datas.push(this.properties);
        });
        callback();
    });
};

window.fieldOptions = [ 
    { field: 'USER_NANE', title: '用戶名稱', halign: "center", align: 'left' },
    { field: 'MONTH', title: '建置時間', halign: "center", align: 'left' },
    { field: 'USER_ADDER', title: '用戶地址', halign: "center", align: 'left' },
    { field: 'WATER_NU', title: '匯入人孔名稱', halign: "center", align: 'left' },
];

window.queryGeometry = function (row, callback) {
    datahelper.query(datahelper.sewerserver + datahelper.sewerlayers._已接管用戶, ['*'], "FID=" + row.FID + "", true, function (e, d) {
        callback(e, d);
    });
}
window.mapLayers = [datahelper.sewerlayers._已接管用戶]; 
window.icon = {
    iconUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAAXNSR0IB2cksfwAAAAlwSFlzAAAOxAAADsQBlSsOGwAAAFBJREFUOI3t0UEKACAIBMAV+qKv9JF2EyMwyS6Be1KQAXXgcUaDDVrU1VQFlR0nBI3QE7hgAMAao/8/hYS2GwKFGxrq+2g4u3KI3IDpNFjPBF4AD/4Q8PVXAAAAAElFTkSuQmCC',
}
