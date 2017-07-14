import Ember from 'ember';
import MapView from 'esri/views/MapView';
import SimpleRenderer from 'esri/renderers/SimpleRenderer';
import SimpleMarkerSymbol from 'esri/symbols/SimpleMarkerSymbol';
import FeatureLayer from 'esri/layers/FeatureLayer';
import Locator from 'esri/tasks/Locator';
import arrayUtils from 'dojo/_base/array';
import Point from 'esri/geometry/Point'
import Map from 'esri/Map';
import PopupTemplate from 'esri/PopupTemplate';
import Legend from 'esri/widgets/Legend';


export default Ember.Component.extend({
  classNames: ['viewDiv'],
  map: null,


  didInsertElement()
  {
    var layer, legend;
    var fields = [
      {
        name: "ObjectID",
        alias: "ObjectID",
        type: "oid"
      },
      {
        name: "title",
        alias: "title",
        type: "string"
      },
      {
        name: "address",
        alias: "address",
        type: "string"
      }
    ];
    this.set('fields', fields);
    var popupTemplate = new PopupTemplate(
    );
    var template = {
      title: "{title}",
      content: "<ul><li>{address}</li></ul>",
      fieldInfos: [{
        fieldName: "address",

      }]
    };
    popupTemplate = {
      title: "{title} ",
      content: [{
        type: "fields",
        fieldInfos: [{
          fieldName: "address",
          label: "Location",
          visible: true
        }]
      }],
      fieldInfos: [{}]
    };

    var map = new Map({
      basemap: "dark-gray"
    });
    this.set('map', map);



    var view = new MapView({
      container: this.elementId,
      map: map,
      center: [-70.25, 43.65],
      zoom: 13
    });


    let renderer = new SimpleRenderer({
      symbol: new SimpleMarkerSymbol({
        style: "circle",
        size: 20,
        color: [211, 255, 0, 0],
          outline: {
            width: 1,
            color: "#FF0055",
            style: "solid"
          }
      })
    });
    this.set('renderer', renderer);


    const createGraphics = new Promise((resolve, reject) => {
      let libraries = this.get('libraries');
      var locator = new Locator("https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer");

      var i = 0;
      var totalLibraries = libraries.get('length');
      var geometryArray = [];
      libraries.forEach(function(library)
      {
        i++;
          var address = {"SingleLine":library.get('address')};
          var params = {address: address, searchExtent: map.extent};
          locator.outSpatialReference= map.spatialReference;
          var p = new Point({
            x: -70.25 + i,
            y: 43.65
          });
          locator.addressToLocations(params).then(function(candidates){
            candidates.forEach(function(candidate){
              if (candidate.score > 80)
              {
                p = candidate.location;
              }
            });
            geometryArray.push({
              geometry: p,
              attributes: {
                ObjectID: i,
                title: library.get('name'),
                address: library.get('address')
              }});

              totalLibraries--;

              if (totalLibraries == 0)
              {
                resolve(geometryArray);
              }

            });

          });


    });

    createGraphics.then((geometry) => {

      var l = this.createLayers(geometry, fields, renderer, template);
      map.add(l);
    });



},



createLayers: function(graphics, fields, renderer, popUpTemplate)
{



    var layer = new FeatureLayer({
      source: graphics,
      fields: fields,
      objectIdField: "ObjectID",
      renderer: renderer,
      spatialReference: {
        wkid: 4326
      },
      geometryType: "point",
      popupTemplate: popUpTemplate
    });



    return layer;


}


});
