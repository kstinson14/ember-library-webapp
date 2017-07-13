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


    var graphics = this.createGraphics(map);
    console.log(popupTemplate);
    var l = this.createLayers(graphics, fields, renderer, template);
    map.add(l);


},

createGraphics: function(map)
{

  let libraries = this.get('libraries');
  console.log("test");
  var locator = new Locator("https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer");

  var i = 0;

  var geometryArray = [];
  libraries.forEach(function(library)
  {
    i++;

        geometryArray.push({
          geometry: new Point({
            x: -70.25 + i,
            y: 43.65
          }),
          attributes: {
            ObjectID: i,
            title: library.get('name'),
            address: library.get('address')
          }});
        });

  return geometryArray;


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
