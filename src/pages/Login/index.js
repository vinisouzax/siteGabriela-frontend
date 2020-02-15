import React, { useState, useEffect }  from 'react';
import api from '../../services/api';
import './login.css';

export default function Login({ history }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() =>{
        document.getElementById("loader").style.display = "none";
    },[])

    async function handleSubmit(event) {
        event.preventDefault();

        let response = await api.post('/sessions', { email, password });
        response = response.data;

        if(response.result.length > 0){
            localStorage.setItem('61757468', response.result[0].accessToken);
            history.push('/');
            window.location.reload();
        }else{
            document.getElementById("message").innerHTML = "Email ou senha incorreto!";
        }

        //history.push('/dashboard');
    }

    return (
        
        <>
            <div className="container">
                <div className="row">
                    <div className="col-sm-9 col-md-7 col-lg-5 mx-auto">
                        <div className="card card-signin my-5">
                            <div className="card-body">
                                <h5 className="card-title text-center">Login</h5>
                                <form className="form-signin" onSubmit={handleSubmit}>
                                    <div className="form-label-group">
                                        <input type="email" 
                                        id="inputEmail" 
                                        className="form-control" 
                                        placeholder="Email" required autofocus 
                                        value={email}
                                        onChange={event => setEmail(event.target.value)}/>
                                        <label htmlFor="inputEmail">Email</label>
                                    </div>

                                    <div className="form-label-group">
                                        <input type="password" 
                                        id="inputPassword" 
                                        className="form-control" 
                                        placeholder="Senha" required 
                                        value={password}
                                        onChange={event => setPassword(event.target.value)}/>
                                        <label htmlFor="inputPassword">Senha</label>
                                    </div>

                                    {/*<div className="custom-control custom-checkbox mb-3">
                                        <input type="checkbox" className="custom-control-input" id="customCheck1"/>
                                        <label className="custom-control-label" for="customCheck1">Remember password</label>
                                    </div>*/}
                                    <button className="btn btn-lg btn-primary btn-block text-uppercase" type="submit">Entrar</button>
                                    <a className="d-block text-center mt-2 small" href="./Register">Registrar</a>
                                    <hr className="my-4"></hr>
                                    <div id="message" align='center'></div>
                                    {/*<button className="btn btn-lg btn-google btn-block text-uppercase" type="submit"><i className="fab fa-google mr-2"></i> Sign in with Google</button>
                                    <button className="btn btn-lg btn-facebook btn-block text-uppercase" type="submit"><i className="fab fa-facebook-f mr-2"></i> Sign in with Facebook</button>*/}
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
        
    );
}