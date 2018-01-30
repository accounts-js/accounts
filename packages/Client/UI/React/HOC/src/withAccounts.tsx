import * as PropTypes from "prop-types";
import * as React from "react";

const withAccounts = WrappedComponent =>
	class WithAccounts extends React.Component {
		public context
		public props
		public static contextTypes = {
			accounts: PropTypes.object
		};

		public render() {
			const { accounts } = this.context;
			return <WrappedComponent {...this.props} accounts={accounts} />;
		}
	};

export default withAccounts;
