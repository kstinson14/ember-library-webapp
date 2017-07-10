import Ember from 'ember';

export default Ember.Controller.extend({
  emailAddress: '',
  message: '',
  emailIsValid: Ember.computed.match('emailAddress', /^.+@.+\..+$/),
  messageIsValid: Ember.computed('message', function() {
    return this.get('message').toString().length >= 5;
  }),
  emailAndMessageValid: Ember.computed.and('emailIsValid', 'messageIsValid'),

  isDisabled: Ember.computed.not('emailAndMessageValid'),
  actions: {
    sendMessage() {
      const email = this.get('emailAddress');
      const message = this.get('message');
      const newContact = this.store.createRecord('contact', { email: email, message: message });
      newContact.save().then((response) => {
        this.set('responseMessage', `Thank you! Your message has been sent`);
        this.set('emailAddress', '');
        this.set('message', '');
      });

      

    }
  }
});
