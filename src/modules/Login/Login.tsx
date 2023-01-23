export interface LoginProps{
    isLoggedIn:Boolean;
    characterName:string | null;
    loginUrl:string;
}

function Login(props:LoginProps){
    return (
        <div className="Login">
            {
                props.isLoggedIn ? 
                <div>
                    <span>Logged in as {props.characterName}</span>
                </div> : 
                <div>
                    <span>Input your data manually or <a href={props.loginUrl}>Log in</a></span>
                </div>
            }
        </div>
    )
}

export default Login;