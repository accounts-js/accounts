export default class ClientPassword {

	public name: string = 'password';
	
	public client: any;
	
	public link = (client: any): ThisType<ClientPassword> => {
		this.client = client;
		return this
	}

	public login({ username, email, password }): any {
		return this.client.fetch(['password','authenticate'], {
			email,
			password,
			username
		});
	};

	public register({ username, email, password }): any {
		return this.client.fetch(['password','register'], {
			email,
			password,
			username
		});
	};
  
}
