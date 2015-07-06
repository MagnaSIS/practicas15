function check()
{

    var nombre=document.getElementById("name").value;
    var apellidos=document.getElementById("lastname").value;
    var email=document.getElementById("email").value;

    var password1=document.getElementById("password1").value;
    var password=document.getElementById("password").value;
    var allowedName = /^([a-zA-Z]+[a-zA-Z]$)/;
    var allowedEmail = /^(([a-zA-Z])+(\d{3})+\@ikasle.ehu.eus$)/;
    var allowedTelefono = /^([9]\d{8}$)/;
    var allowedPassword = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;

    if(name==null || name=="" )
    {
        alert("Introduce el nombre");
        return false;
    }if(!allowedName.test(name)){
        alert("Solo se aceptan caracteres de la A a la Z");
        return false;

    }

    if(lastname==null || lastname=="")
    {
        alert("Introduce tu apellido");
        return false;
    }//Los elses no funcionan pro que?
    else if(!allowedName.test(lastname)){
        alert("Solo se aceptan caracteres de la A a la Z");
        return false;

    }

    if(email==null || email=="")
    {
        alert("Campo de correo obligatorio");
        return false;

    } else if(!allowedEmail.test(email)){
        alert("El correo introducido no cumple con el formato de la UPV/EHU");
        return false;
    }



    if(password==null || password=="")
    {
        alert("Campo de password obligatorio");
        return false;
    }else if (password1!=password) {
          alert("El password no coincide");
          return false;
      }else if(!allowedPassword.test(password)){

        alert("at least one number,at least six characters, one lowercase and one uppercase letter ");
        return false;
      }


    return true;
}

function login()
{
    var email=document.getElementById("email").value;
    var password=document.getElementById("password").value;

    if(email==null || email=="")
    {
        alert("Campo de correo obligatorio");
        return false;
    }
    if(password==null || password=="")
    {
        alert("Campo de password obligatorio");
        return false;
    }
    return true;

}

function validar()
{
    var password = document.getElementById("password").value;
    var password1 = document.getElementById("password1").value;

    if(password!=password1){
      alert("Las contraseñas no coinciden");
      return false;

   }else{
     return true;
   }

}
