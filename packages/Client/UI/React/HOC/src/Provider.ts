import * as PropTypes from "prop-types";
import React, { 
	Children,
	Component,
} from 'react';

export default class AccountsProvider extends Component {
	public props;

	constructor(props) {
    super(props)
	}

	public static propTypes = {
		client: PropTypes.object.isRequired
	};

	public static childContextTypes = {
		accounts: PropTypes.object.isRequired
	};

	public getChildContext() {
		return {
			accounts: this.props.client
		};
	}
	
	public render() {
		return Children.only(this.props.children);
	}
}