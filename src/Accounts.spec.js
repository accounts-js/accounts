/* eslint-disable no-unused-expressions */

import chai, { expect } from 'chai';
import sinonChai from 'sinon-chai';
import chaiAsPromised from 'chai-as-promised';
import 'localstorage-polyfill';
import Accounts from './Accounts';

chai.use(sinonChai);
chai.use(chaiAsPromised);

describe('Accounts', () => {
  it('throws error on invalid keys', () => {
    () => Accounts.ui.config({
      'bad key': 'bad value',
    }).should.throw.error;
  });
  it('redirect hooks must be strings or functions', () => {
    () => Accounts.ui.config({
      onSignedInHook: () => null,
    }).should.be.ok;
    () => Accounts.ui.config({
      onSignedInHook: '',
    }).should.be.ok;
    () => Accounts.ui.config({
      onSignedInHook: {},
    }).should.throw.error;
  });
  describe('validateLogin', () => {
    it('empty username and password', () => {
      const isValid = Accounts.validateLogin({ user: '', password: '' });
      const { user, password } = Accounts.store.getState().accounts.forms.login.fields;
      expect(isValid).to.eql(false);
      expect(user.errors).to.include.members(['A username or email is required.']);
      expect(password.errors).to.include.members(['Password is required.']);
    });
  });
  describe('setLoading', () => {
    it('set loading', () => {
      Accounts.setLoading(true);
      const isLoading = Accounts.store.getState().accounts.isLoading;
      expect(isLoading).to.eql(true);
    });
  });
  describe('setField', () => {
    it('sets field value', () => {
      Accounts.setField({
        form: 'login',
        field: 'user',
        value: 'user1',
      });
      const form = Accounts.store.getState().accounts.forms.login;
      expect(form.fields.user.value).to.eql('user1');
    });
  });
  describe('clearForm', () => {
    it('clears form', () => {
      Accounts.setField({
        form: 'login',
        field: 'user',
        value: 'user1',
      });
      let form = Accounts.store.getState().accounts.forms.login;
      expect(form.fields.user.value).to.eql('user1');
      Accounts.clearForm('login');
      form = Accounts.store.getState().accounts.forms.login;
      expect(form).to.eql({
        fields: {
          user: {
            value: '',
            errors: [],
          },
          password: {
            value: '',
            errors: [],
          },
        },
        errors: [],
      });
    });
  });
});
