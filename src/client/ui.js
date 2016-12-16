import { defaultUiConfig } from '../common/defaultConfigs';

const ui = {
  options: { ...defaultUiConfig },
  config(options) {
    // TODO Add validation for options
    this.options = { ...this.options, ...options };
  },
};

export default ui;
