var users = { 'uksmiss@gmail.com' : {id:1, email:"uksmiss@gmail.com", password:"1234"}};

// Comprobar si el usuario esta registrado en users
// Si falla o hay errores se ejecuta callback (error)
exports.autenticar = function(login, password, callback){
	if(users[login]){
		if(password === users[login].password){
			callback(null, users[login]);
		}
		else { callback(new Error('Contraseña incorrecta'));}
	} else { callback(new Error('No existe ningún usuario con ese email'));}
};