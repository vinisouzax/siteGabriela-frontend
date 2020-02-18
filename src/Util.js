import jwt_decode from 'jwt-decode';

const fileTypes = [
    'application/pdf'
];

export function initialize(history){
    const authorization = localStorage.getItem('61757468');

    if(!authorization){
        history.push('./Login')
    }else{
        let auth_decode = jwt_decode(authorization);

        let obj = [{permission: auth_decode.permission,
            authorization,
            user_id: auth_decode.user_id,
            user_name: auth_decode.user_name
        }];

        if(obj[0].permission !== 1){
            history.push('/')
        }
        
        return obj;
    }
}
  
export function validFileType(file) {
    return fileTypes.includes(file.type);
}

export function returnFileSize(number) {
    if(number < 1024) {
        return number + 'bytes';
    } else if(number >= 1024 && number < 1048576) {
        return (number/1024).toFixed(1) + 'KB';
    } else if(number >= 1048576) {
        return (number/1048576).toFixed(1) + 'MB';
    }
}