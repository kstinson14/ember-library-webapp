import Ember from 'ember';
import Map from 'esri/Map';
import GraphicsLayer from 'esri/layers/GraphicsLayer';
import VectorTileLayer from 'esri/layers/VectorTileLayer';

export default Ember.Route.extend({
  model()
  {
    return this.store.findAll('library');
  }
  });
