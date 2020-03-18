window.fbAsyncInit = function() {
    FB.init({
        appId      : '596724407548790',
        cookie     : true,
        xfbml      : true,
        version    : 'v6.0'
    });

    FB.AppEvents.logPageView(); 
};

(function(d, s, id){
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {return;}
    js = d.createElement(s); js.id = id;
    js.src = "https://connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

document.getElementById('loginbtn').addEventListener('click', loginWithFaceBook, false)

function loginWithFaceBook(){
    FB.login( response=>{
        console.log(response);
        const {authResponse:{accessToken, userID}}= response;
        var name=""

        FB.api('/me', async function(response) {
            name= response.name;
            $.ajax({
                url: '/login-with-facebook',
                data: {
                    accessToken: accessToken,
                    userID: userID,
                    name: name
                },
                method: 'POST',
                success : function(data){
                    window.location.replace(data.link);
                    alert(JSON.stringify(data.message));
                },
                error:function(err){
                    alert(JSON.stringify(err.responseText));
                }
            });
            console.log(name);
        });
       
    },{scope: 'public_profile,email'})
    return false;
}