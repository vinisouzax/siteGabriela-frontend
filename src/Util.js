import jwt_decode from 'jwt-decode';

export function initialize({history}){
    const authorization = localStorage.getItem('61757468');

    if(!authorization){
        history.push('./Login')
    }else{
        let auth_decode = jwt_decode(authorization);

        let obj = [{permission: auth_decode.permission,
            authorization
        }];

        if(obj[0].permission !== 1){
            history.push('/')
        }
        
        return obj;
    }
}