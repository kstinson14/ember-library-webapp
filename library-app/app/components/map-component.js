import Ember from 'ember';
import MapView from 'esri/views/MapView';
import SimpleRenderer from 'esri/renderers/SimpleRenderer';
import SimpleMarkerSymbol from 'esri/symbols/SimpleMarkerSymbol';
import FeatureLayer from 'esri/layers/FeatureLayer';
import Locator from 'esri/tasks/Locator';
import arrayUtils from 'dojo/_base/array';
import Point from 'esri/geometry/Point'
export default Ember.Component.extend({
  classNames: ['viewDiv'],
  mapService: Ember.inject.service('map'),


  didInsertElement()
  {
    let map = this.get('map');
    if (!map)
    {
      map = this.get('mapService').loadMap();
      this.set('map', map);
    }
  },

  getFeatureLayer: function(map)
  {
    alert("getfeaturelayer");
    let renderer = new SimpleRenderer({
      symbol: new SimpleMarkerSymbol({
        style: "circle",
        size: 20,
        color: [255, 0, 0, 1],
        outline: {
          width: 1,
          color: '#FF0000',
          style: "solid"
        }
      }),

    });

    let libraries = this.get('libraries');


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
      }
    ];

    var popupTemplate = {
      title: "{title}",
      content: [{}
      ],
      fieldInfos: [{}]
    };

    return this.createLayers(this.createGraphics(libraries, map), fields, renderer, popupTemplate);

  },

  createGraphics: function(libraries, map)
  {
    alert("creategraphics");
    var locator = new Locator("https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer");

    var i = 0;
    alert("cg");
    return arrayUtils.map(libraries, function(library) {
      i++;
      var address = {"SingleLine": library.get('address')};

      var params = {address: address, searchExtent: map.extent};
      locator.outSpatialReference= map.spatialReference;

      locator.addressToLocations(params).then(
        function(candidates)
        {
          alert("geocode");
          let coords = candidates[0].location;
          return {
            geometry: new Point({
              x: -70.25,
              y: 43.65
            }),
            attributes: {
              ObjectID: i,
              title: library.get('name')
            }
          }
        });
      });





  },

  createLayers: function(graphics, fields, renderer, popupTemplate)
  {

    alert("createlayers");
    var layer = new FeatureLayer({
      source: graphics,
      fields: fields,
      objectIdField: "ObjectID",
      renderer: renderer,
      spatialReference: {
        wkid: 4326
      },
      geometryType: "point",
      popupTemplate: popupTemplate
    });
    alert(layer.toString());
    return layer;

  },


  createView: function()
  {
    alert("createview");
    let map = this.get('map');
    this.getFeatureLayer(map).then(function(fLayer){

      map.add(fLayer);
      let view = new MapView({
        map,
        container: this.elementId,
        center: [-70.25, 43.65],
        zoom: 13
      });
      view.then(x => {

        this.set('view', x);


      });
    });


  }.observes('map', 'libraries')


});
