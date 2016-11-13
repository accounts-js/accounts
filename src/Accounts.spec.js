/* eslint-disable no-unused-expressions */

import chai, { expect } from 'chai';
import sinonChai from 'sinon-chai';
import chaiAsPromised from 'chai-as-promised';
import 'localstorage-polyfill';
import Accounts from './Accounts';
import createStore from './createStore';

chai.use(sinonChai);
chai.use(chaiAsPromised);

describe('Accounts', () => {
  beforeEach(() => {
    Accounts.store = createStore({
      reducers: {
        accounts: Accounts.reducer,
      },
    });
  });
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
  describe('addError', () => {
    it('adds an error to a field', () => {
      Accounts.addError({
        form: 'login',
        field: 'user',
        error: 'error',
      });
      const errors = Accounts.store.getState().accounts.forms.login.fields.user.errors;
      expect(errors).to.eql(['error']);
    });
    it('adds an error to a form', () => {
      Accounts.addError({
        form: 'login',
        error: 'error',
      });
      const errors = Accounts.store.getState().accounts.forms.login.errors;
      expect(errors).to.eql(['error']);
    });
  });
  describe('hasError', () => {
    it('returns true if field has error', () => {
      Accounts.addError({
        form: 'login',
        field: 'user',
        error: 'error',
      });
      expect(Accounts.hasError('login')).to.eql(true);
    });
    it('return true if has no errors', () => {
      expect(Accounts.hasError('login')).to.eql(false);
    });
    it('returns true if form has error', () => {
      Accounts.addError({
        form: 'login',
        error: 'error',
      });
      expect(Accounts.hasError('login')).to.eql(true);
    });
  });
  describe('clearErrors', () => {
    it('clears all errors on a form', () => {
      Accounts.setField({
        form: 'login',
        field: 'user',
        value: 'user1',
      });
      Accounts.addError({
        form: 'login',
        field: 'user',
        error: 'field error',
      });
      Accounts.addError({
        form: 'login',
        error: 'form error',
      });
      const beforeClearForm = Accounts.store.getState().accounts.forms.login;
      expect(beforeClearForm.fields.user.value).to.eql('user1');
      Accounts.clearErrors('login');
      const afterClearForm = Accounts.store.getState().accounts.forms.login;
      expect(afterClearForm.errors).to.eql([]);
      expect(afterClearForm.fields.user.errors).to.eql([]);
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
