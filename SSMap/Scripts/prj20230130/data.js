window.app = window.app || {};
//window.app.siteRoot = helper.misc.getScriptPath("Scripts/gis/Main") || '';
//window.app.wra01idsSiteRoot = 'http://localhost:20087/';
//var _siteRootStartWra01Map = window.app.siteRoot.toUpperCase().indexOf("WRA01MAP");
//if (_siteRootStartWra01Map >= 0)
//    window.app.wra01idsSiteRoot = window.app.siteRoot.substring(0, _siteRootStartWra01Map) + 'Wra01ids' + window.app.siteRoot.substring(_siteRootStartWra01Map + "WRA01MAP".length);
(function (window) {
    if (app.siteRoot == undefined) app.siteRoot = '';
    //alert("app.siteRoot:" + app.siteRoot);
    var getData = function (url, paras, callback, option) {
        dou.helper.data.get(url, callback, option);
    };
    var getCacheData= function (url, callback,option) { //由平台透過ajax取Viewer request資料
        dou.helper.data.get(url, callback, option, true);
    }
    var get污水legend = function (callback) {
        getData(datahelper.sewerserver +'legend?f=pjson', undefined, function (d) {
            callback(JSON.parse( d).layers)
        });
    }
    var getlegend = function (_server, callback) {
        getCacheData((_server.substr(_server.length - 2) == '/' ? _server : _server + '/') + 'legend?f=pjson', function (d) {
            callback(JSON.parse(d).layers)
        });
    }
    var getlayerinfo = function (_server, callback) {
        getCacheData((_server.substr(_server.length - 2) == '/' ? _server : _server + '/') + 'layers?f=pjson', function (d) {
            callback(JSON.parse(d).layers) 
        });
    }
    var getAll人孔Data = function (callback) {
        serverquery(datahelper.sewerserver + datahelper.sewerlayers._人孔,
            ['MH_NO', 'MH_HT', 'G_LEVEL', 'MH_TYPE', 'MHC_DIA', 'CONS_TIT', 'DIST', 'VILLAGE'],
            undefined, false, callback);
    }
    var getAll管線Data = function (callback) {
        serverquery(datahelper.sewerserver + datahelper.sewerlayers._管線,
            ['SEWER_NO', 'UMH_NO', 'DMH_NO', 'SEWER_LH', 'DIA', 'CONS_TIT', 'DIST', 'VILLAGE'],
            undefined, false, callback);
    }
    var getAll陰井Data = function (callback) {
        serverquery(datahelper.sewerserver + datahelper.sewerlayers._陰井,
            ['CB_NO', 'CB_HT', 'G_LEVEL', 'CB_TYPE', 'CBC_WIDTH', 'CONS_TIT', 'DIST', 'VILLAGE'],
            //['*'],
            undefined, false, callback);
    }
    var getAll連接管Data = function (callback) {
        serverquery(datahelper.sewerserver + datahelper.sewerlayers._連接管,
            ['SWER_NO', 'UCB_NO', 'DCB_NO', 'SEWER_LH', 'DIA', 'CONS_TIT', 'DIST', 'VILLAGE'],
            undefined, false, callback);
    }
    var getAll用戶接管Data = function (callback) {
        serverquery(datahelper.sewerserver + datahelper.sewerlayers._已接管用戶,
            ['FID', 'USER_NANE', 'MONTH', 'USER_ADDER', 'WATER_NU', 'DIST', 'VILLAGE'],
            undefined, false, callback);
    }
    var serverquery = function (layer, outFields, where, returnGeometry, callback) {
        var query = L.esri.query({
            url: layer
        });
        query.fields(outFields);
        if (where)
            query.where(where);
        query.returnGeometry(returnGeometry || false);
        query.run(function (error, featureCollection, response) {
            callback(error, featureCollection);
            //if (!error) {
            //    console.log('Found ' + featureCollection.features.length + ' features');
            //}
        });
    }

    window.datahelper = window.datahelper || {};
    datahelper.sewerserver = 'http://210.59.253.2:6080/arcgis/rest/services/lotung/lotGIS/MapServer/';
    datahelper.sewerserver_noname = 'http://210.59.253.2:6080/arcgis/rest/services/lotung/lotGIS_noname/MapServer'; //羅東已接管用戶，隱藏有個資相關資訊
    datahelper.districtserver = 'http://210.59.253.2:6080/arcgis/rest/services/lotung/village/MapServer/';
    datahelper.markserver = 'http://210.59.253.2:6080/arcgis/rest/services/lotung/denotification_main/MapServer/';
    datahelper.yilansewerserver = 'http://210.59.253.2:6080/arcgis/rest/services/lotung/yilanGIS/MapServer';
    datahelper.sewerlayers = {
        _人孔: 0,
        _管線: 1,
        _陰井: 2,
        _連接管: 3,
        _已接管用戶: 4,
        _陰井清疏 :5
    }
    datahelper.getAll人孔Data = getAll人孔Data;
    datahelper.getAll管線Data = getAll管線Data;
    datahelper.getAll陰井Data = getAll陰井Data;
    datahelper.getAll連接管Data = getAll連接管Data;
    datahelper.getAll用戶接管Data = getAll用戶接管Data;
    datahelper.get污水legend = get污水legend;
    //datahelper.getlegend = getlegend;
    datahelper.query = serverquery;
    datahelper.getData = getData;
    datahelper.getlegend = getlegend;
    datahelper.getlayerinfo = getlayerinfo;
})(window); 

