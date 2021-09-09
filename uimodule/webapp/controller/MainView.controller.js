sap.ui.define(["com/terebinto/sapui5/controller/BaseController"], function (Controller) {
    "use strict";

    //Variável mapa
    var map;
    //VAriavel com o tokenId da API
    var tokenId = "a871408c3647cb59b80b33387d8a0c67";
    //Proxy criado em nodeJs para eliminar problema de CORS*, pois não temos destinations configuradas
    var proxy ="https://obscure-castle-93063.herokuapp.com/api/mid/proxy";

    return Controller.extend("com.terebinto.sapui5.controller.MainView", {

       onInit: function () {
            this.lat = -49.2908;
            this.long = -25.504;
            this.dataWeather = [];
            this.weather = [];
            this.wind =[];
            map = "";
            
            let data = [
                { name: "São Paulo", id: "Sao Paulo"},
                { name: "Curitiba", id: "Curitiba"},
                { name: "Orlando", id: "Orlando"},
                { name: "Miami", id: "Miami"},
                { name: "Londres", id: "London"}
            ]

            this.getView().setModel(new sap.ui.model.json.JSONModel({
                cities: data
            }), "dataCityModel");

            this.getView().setModel(new sap.ui.model.json.JSONModel({
				selectedCity: "Sao Paulo"
			}), "citySelectedModel");

            this.getView().setModel(new sap.ui.model.json.JSONModel({
				weather: this.weather,
                whind: this.wind
			}), "weatherModel");
           

            this.getMap();
            
        },
        //Inicialização do mapa em tela
        getMap: function (){
            setTimeout(function () {

                map = new ol.Map({
                    target: 'map',
                    layers: [
                    new ol.layer.Tile({
                        source: new ol.source.OSM()
                    })
                    ],
                    controls : ol.control.defaults({
                        attribution : false,
                        zoom : false,
                        }),
                    view: new ol.View({
                    center: ol.proj.fromLonLat([ this.lat, this.long]),
                    zoom: 8
                    })
                });
                console.log(map)
                this.getDataApi();

            }.bind(this), 100);
        },
        //Monta o primeiro dash com os dados de clima retornados da API
        getDash: function(dataWeather) {

        setTimeout(function () {

            var chart = am4core.create("chartdiv", am4charts.XYChart);

            chart.data = [ {
            "measure": "Temperatura",
            "total": dataWeather.temp
            }, {
            "measure": "Mínima",
            "total": dataWeather.temp_min
            }, {
            "measure": "Máxima",
            "total": dataWeather.temp_max
            }, {
            "measure": "Sensação",
            "total": dataWeather.feels_like
            }];
        
            chart.padding(40, 40, 40, 40);
        
            var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
            categoryAxis.renderer.grid.template.location = 0;
            categoryAxis.dataFields.category = "measure";
            categoryAxis.renderer.minGridDistance = 60;
            categoryAxis.renderer.inversed = true;
            categoryAxis.renderer.grid.template.disabled = true;
        
            var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
            valueAxis.min = 0;
            valueAxis.extraMax = 0.1;
        
            var series = chart.series.push(new am4charts.ColumnSeries());
            series.dataFields.categoryX = "measure";
            series.dataFields.valueY = "total";
            series.tooltipText = "{valueY.value}"
            series.columns.template.strokeOpacity = 0;
            series.columns.template.column.cornerRadiusTopRight = 10;
            series.columns.template.column.cornerRadiusTopLeft = 10;
            var labelBullet = series.bullets.push(new am4charts.LabelBullet());
            labelBullet.label.verticalCenter = "bottom";
            labelBullet.label.dy = -10;
            labelBullet.label.text = "{values.valueY.workingValue.formatNumber('#.')}";
            chart.zoomOutButton.disabled = true;
            series.columns.template.adapter.add("fill", function (fill, target) {
            return chart.colors.getIndex(target.dataItem.index);
            });
        }.bind(this), 100);
        },
        //Monta o dash com base na Latitude e longitude selecionada, com os dados de clima retornados da API
        getDashDays: function(days) {

            setTimeout(function () {
    
                var chart = am4core.create("chartdiv2", am4charts.XYChart);
                chart.paddingRight = 20;

                var data = [];
            
                for (var i = 0; i < days.length; i++) {
                var date = new Date(days[i].dt * 1000);
                data.push({ date: date, value: days[i].temp.day });
                }

                chart.data = data;

                var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
                dateAxis.renderer.grid.template.location = 0;
                dateAxis.minZoomCount = 5;


                // this makes the data to be grouped
                dateAxis.groupData = false;
                dateAxis.groupCount = 500;

                var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());

                var series = chart.series.push(new am4charts.LineSeries());
                series.dataFields.dateX = "date";
                series.dataFields.valueY = "value";
                series.tooltipText = "{valueY}";
                series.tooltip.pointerOrientation = "vertical";
                series.tooltip.background.fillOpacity = 0.5;

                chart.cursor = new am4charts.XYCursor();
                chart.cursor.xAxis = dateAxis;

                var scrollbarX = new am4core.Scrollbar();
                scrollbarX.marginBottom = 20;
                chart.scrollbarX = scrollbarX;
            }.bind(this), 100);
        },
        //Chamada da API Weather
        getDataApi: function(){
            this.setBusyDialog("Aguarde", "Carregando dados...");
            
            var city = this.getView().getModel("citySelectedModel").getProperty("/selectedCity");;
            var urlWeather = "https://api.openweathermap.org/data/2.5/weather"
            var allUrl = proxy+'?t=g&jwt=123&u='+urlWeather+'?q='+city+'&appid='+tokenId+'&units=metric'
            var window = this;
            var oModel = this.getView().getModel("weatherModel");

            var aData = jQuery.ajax({
                type : "POST",
                contentType : "application/json",
                crossDomain: true,
                url : allUrl,
                dataType : "json",
                async: false, 
                success : function(data,textStatus, jqXHR) {
                    window.closeBusyDialog();
                    window.weather = data["main"];
                    window.wind = data["wind"];
                    window.lat = data["coord"]["lat"];
                    window.long = data["coord"]["lon"];
                    
                    oModel.setProperty("/weather", window.weather);
                    oModel.setProperty("/wind",  window.wind);

                   
                    if (map){
                        map.setView(new ol.View({
                          center: ol.proj.fromLonLat([window.long, window.lat]),
                          zoom: 8
                        }))
                        //criando a layer PIN
                        var layer = new ol.layer.Vector({
                            source: new ol.source.Vector({
                                features: [
                                    new ol.Feature({
                                        geometry: new ol.geom.Point(ol.proj.fromLonLat([window.long, window.lat]))
                                    })
                                ]
                            })
                        });
                        //Adicionando a layer dentro do mapa
                        map.addLayer(layer);
                        //montando o gráfico conforme resultado da API
                        window.getDash(data["main"]);
                        //montando o grafico dos ultimos 7 dias
                        window.getDataApiWeather(window.lat, window.long);
                    }
                    
                }

            });
        },
        //Chamada da API Weather 7 dias
        getDataApiWeather: function(lat, long){
           
            this.setBusyDialog("Aguarde", "Carregando dados...");
            var urlWeather = "https://api.openweathermap.org/data/2.5/onecall"
            var allUrl = proxy+'?t=g&jwt=123&u='+urlWeather+'&lat='+lat+'&lon='+long+'&appid='+tokenId+'&units=metric'
            var window = this;

            var aData = jQuery.ajax({
                type : "POST",
                contentType : "application/json",
                crossDomain: true,
                url : allUrl,
                dataType : "json",
                async: false, 
                success : function(data,textStatus, jqXHR) {
                    window.closeBusyDialog();
                    console.log(data)
                    window.getDashDays(data["daily"]);
                    
                }

            });
        },
        setBusyDialog: function (aTitle, aMessage) {
			var timestamp = new Date().getTime();
			if (!this.busyDialog) {
				this.busyDialog = new sap.m.BusyDialog("busyDialogID" + this.getView().getId() + timestamp);
			}
			this.busyDialog.setText(aMessage);
			this.busyDialog.setTitle(aTitle);
			this.busyDialog.open();
		},
        closeBusyDialog: function () {
			if (this.busyDialog) {
				this.busyDialog.close();
			}
		},
    });
});
