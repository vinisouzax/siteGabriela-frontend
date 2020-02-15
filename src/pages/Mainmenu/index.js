import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import jwt_decode from 'jwt-decode';

export default function Mainmenu(){
    const [ permission, setPermission ] = useState('');
    const [ auth, setAuth ] = useState('');

    useEffect(() =>{
        async function loadUser(){

            const authorization = localStorage.getItem('61757468');
            
            if(!authorization){

            }else{
                let auth_decode = jwt_decode(authorization);
                const response = await api.get(`/users/${auth_decode.user_id}`, {
                    headers: {authorization},
                });

                setPermission(response.data.result[0].permission);
                setAuth(authorization);
            }
        }

        loadUser();
    }, []);

    function logout(event){
        localStorage.removeItem('61757468');
    }

    return (
        <>
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <ul className="navbar-nav ml-auto mt-2 mt-lg-0">
                    <li className="nav-item">
                        <a className="nav-link" href="./">Home <span className="sr-only">(current)</span></a>
                    </li>
                    {(permission === 1) ?  
                    <li className="nav-item dropdown">
                        <a className="nav-link dropdown-toggle" href="/#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        Gerência
                        </a>
                        <div className="dropdown-menu dropdown-menu-right" aria-labelledby="navbarDropdown">
                            <a className="dropdown-item" href="./Subject">Disciplinas</a>
                            <a className="dropdown-item" href="./ContentSubject">Conteúdos Disciplinas</a>
                            <a className="dropdown-item" href="./Article">Artigos</a>
                        </div>
                    </li> : ''
                    }
                    <li className="nav-item dropdown">
                        <a className="nav-link dropdown-toggle" href="/#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        Usuário
                        </a>
                        <div className="dropdown-menu dropdown-menu-right" aria-labelledby="navbarDropdown">
                            {(!auth) ? <a className="dropdown-item" href="./Login">Login</a> :
                            <> 
                                <a className="dropdown-item" href="./Register">Cadastro</a>
                                <a className="dropdown-item" 
                                onClick={event => logout(event)}
                                href="./">Sair</a>
                            </>
                            }
                        </div>
                    </li>
                </ul>
            </div>
        </>
    );
}