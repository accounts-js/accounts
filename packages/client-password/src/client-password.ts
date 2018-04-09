export default class ClientPassword {

	public name: string = 'password';
	
	public client: any;
	
	public link = (client: any): ThisType<ClientPassword> => {
		this.client = client;
		return this
	}

	public login({ username, email, password }: {[key: string]: string}): any {
		return this.client.fetch(['password','authenticate'], { 
			username, 
			email, 
			password
		});
	};

	public register({ username, email, password }: {[key: string]: string}): any {
		return this.client.fetch(['password','register'], {
			email,
			password,
			username
		});
	};
  
}
