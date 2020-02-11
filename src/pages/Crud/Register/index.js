import React, { useState, useEffect } from 'react';
import api from '../../../services/api';
import './register.css';
import jwt_decode from 'jwt-decode';
import swal from 'sweetalert';

export default function Register({ history }){
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [cPassword, setCPassword] = useState('');
    const [user_id, setUserId] = useState('');
    const [permission, setPermission] = useState('');
    const [auth, setAuth] = useState('');
    
    useEffect(() =>{
        async function loadUser(){

            const authorization = localStorage.getItem('61757468');
            setAuth(authorization);

            if(!authorization){
                history.push('/Login');
            }else{
                let auth_decode = jwt_decode(authorization);

                let response = await api.get(`/users/${auth_decode.user_id}`, {
                    headers: {authorization},
                });

                response = response.data;

                if(response.result.length > 0){
                    setPermission(response.result[0].permission);
                    setName(response.result[0].name);
                    setEmail(response.result[0].email);
                    setUserId(response.result[0].user_id);
                }
            }

        }

        loadUser();
    }, [history]);

    async function handleSubmit(event) {
        event.preventDefault();
       
        if(password === cPassword){
            if(!user_id){
                let response = await api.post('/users', {name, email, password, permission: 2});
                response = response.data;
                
                if(response.result.length > 0){
                    history.push('/');
                    swal("Cadastro realizado com sucesso");
                }else{
                    document.getElementById("message").innerHTML = "Não foi possível cadastrar!";
                }
            }else{
                const willEdit = await swal({
                    title: "Você tem certeza que irá editar seu cadastro?",
                    icon: "warning",
                    dangerMode: true,
                });
                if (willEdit) {
                    let response = await api.put(`/users/${user_id}`, {name, email, password, permission}, 
                    {headers: {authorization: auth}});
    
                    response = response.data;
    
                    if(response.result.length > 0){
                        history.push('/');
                        swal("Edição realizada com sucesso");
                    }else{
                        document.getElementById("message").innerHTML = "Não foi possível atualizar cadastro!";
                    }
                }
            }
        }else{
            document.getElementById("message").innerHTML = "Senha diferente da sua confirmação!";
        }
        
    }

    return (
        
        <>
            <div class="container">
                <div class="row"></div>        
                    <div className="col-lg-10 col-xl-9 mx-auto">
                        <div className="card card-signin flex-row my-5">
                            <div className="card-img-left d-none d-md-flex">
                            </div>
                            <div className="card-body">
                                <h5 className="card-title text-center">Cadastro</h5>
                                <form className="form-signin" onSubmit={handleSubmit}>
                                    <div className="form-label-group">
                                        <input type="text" 
                                        id="inputName" 
                                        className="form-control" 
                                        placeholder="Nome de Usuário" required autofocus
                                        value={name}
                                        onChange={event => setName(event.target.value)}/>
                                        <label htmlFor="inputName"> Nome*</label>
                                    </div>

                                    <div className="form-label-group">
                                        <input type="email" 
                                        id="inputEmail" 
                                        className="form-control" 
                                        placeholder="Email" required
                                        value={email}
                                        onChange={event => setEmail(event.target.value)}/>
                                        <label htmlFor="inputEmail"> Email*</label>
                                    </div>
                        
                                    <hr></hr>

                                    <div className="form-label-group">
                                        <input type="password" 
                                        id="inputPassword" 
                                        className="form-control" 
                                        minLength='6'
                                        placeholder="Senha" required
                                        value={password}
                                        onChange={event => setPassword(event.target.value)}/>
                                        <label htmlFor="inputPassword"> Senha*</label>
                                    </div>
                        
                                    <div className="form-label-group">
                                        <input type="password" 
                                        id="inputConfirmPassword" 
                                        className="form-control" 
                                        placeholder="Confirmar senha" required
                                        value={cPassword}
                                        onChange={event => setCPassword(event.target.value)}/>
                                        <label htmlFor="inputConfirmPassword"> Confirmação de Senha*</label>
                                    </div>

                                    { (!user_id) ? 
                                    <button className="btn btn-lg btn-primary btn-block text-uppercase" 
                                    type="submit">Registrar</button> : 
                                    <button className="btn btn-lg btn-primary btn-block text-uppercase" 
                                    type="submit">Editar</button> }
                                    { (!user_id) ? 
                                    <a className="d-block text-center mt-2 small" href="./Login">Login</a> : '' }
                                    <hr className="my-4"></hr>
                                    <div id="message" align='center'></div>
                                    {/*<button className="btn btn-lg btn-google btn-block text-uppercase" type="submit"><i className="fab fa-google mr-2"></i> Sign up with Google</button>
                                    <button className="btn btn-lg btn-facebook btn-block text-uppercase" type="submit"><i className="fab fa-facebook-f mr-2"></i> Sign up with Facebook</button>*/}
                                </form>
                            </div>
                        </div>
                    </div>
            </div>
        </>
        
    );
}