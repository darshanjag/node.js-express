

const login = document.getElementById('email');
if(login){
const login =  async(email,password)=>{

    try{
        const res=  await axios({
            method: 'POST',
            url: 'http://localhost:3000/api/v1/users/login',
            data:{
                email,
                password
            }
        });
    if(res.data.status ==='success'){
        alert('logged in successfully');
        window.setTimeout(()=>{
            location.assign('/');
        },1500)
    }

    }catch(err){
        alert(err.response.data.message);
    }

}

document.querySelector('.form').addEventListener('submit', e=>{ 
    e.preventDefault()
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email,password)

})
}


const logout = document.getElementsByClassName('nav__el--logout');
if(logout){
    console.log(Date.now());
const logout = async()=>{
  
    try{
        const res = await axios({
            method: 'GET',
            url: 'http://localhost:3000/api/v1/users/logout',
        });
        if(res.data.status = 'success') location.reload(true);
    }catch(err){
        showAlert('error','error logging out.. try again.')
    }
}
document.querySelector('.nav__el--logout').addEventListener('click',logout)
}