import React, { useState, Fragment, useEffect } from 'react';
import api from '../../../services/api';
import { MDBDataTable } from 'mdbreact';
import { FaPlus, FaPen, FaExchangeAlt } from "react-icons/fa";
import { Button, Modal } from 'react-bootstrap';
import swal from 'sweetalert';
import {initialize} from '../../../Util';

export default function User({ history }){
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [cPassword, setCPassword] = useState('');
    const [permission, setPermission] = useState('');
    const [user_id, setUserId] = useState('');
    const [users, setUsers] = useState([]);
    const [show, setShow] = useState(false);
    const [change, setChange] = useState(0);
    const submitButton = React.createRef(null);
    
    const handleShow = () => setShow(true);
    
    const handleClose = () => { 
        setShow(false); 
        setUserId(''); 
        setName('');
        setEmail('');
        setPassword('');
        setCPassword('');
        setPermission('');
    };

    useEffect((history) =>{
        document.getElementById("loader").style.display = "block";
        
        let auth = initialize(history);

        async function edit(event, id) {
            event.preventDefault();
            
            if(!auth){
                history.push('/Login');
            }else{
    
                let response = await api.get(`/users/${id}`, {
                    headers: {authorization: auth[0].authorization},
                });
    
                response = response.data;
    
                if(response.result.length > 0){
                    setName(response.result[0].name);
                    setEmail(response.result[0].email);
                    setPassword(response.result[0].password);
                    setCPassword(response.result[0].password);
                    setPermission(response.result[0].permission);
                    setUserId(id);
                    setShow(true);
                }
            }
        } 
    
        async function del(event, id) {
            event.preventDefault();
            const willDelete = await swal({
                title: "Você tem certeza que irá alterar o status de ativação?",
                icon: "warning",
                dangerMode: true,
            });
            if (willDelete) {
                let response = await api.delete(`/users/${id}`, 
                {headers: { authorization: auth[0].authorization }});
        
                response = response.data;
                
                if(response.result.length > 0){
                    swal("Alteração realizada com sucesso");
                    setChange(change+1);
                }else{
                    document.getElementById("message").innerHTML = "Não foi possível alterar!";
                } 
            }
        }
    
        function returnEditHtml(id){
            const editHtml = <Fragment>
                                <button 
                                    onClick={(e) => {edit(e, id)}} 
                                    type="button" 
                                    className="btn btn-warning"><FaPen />
                                </button>
                            </Fragment>
    
            return editHtml;
        }
    
        function returnDeleteHtml(id){
            const deleteHtml =  <Fragment>
                                    <button 
                                        onClick={(e) => {del(e, id)}}
                                        type="button" 
                                        className="btn btn-danger"><FaExchangeAlt />
                                    </button>
                                </Fragment>
    
            return deleteHtml;
        }

        async function loadUsers(){

            let response = await api.get('/users', 
            {headers: { authorization: auth[0].authorization }});

            response = response.data;

            if(response.result.length > 0){
                let data = [];
                for(let i = 0; i < response.result.length; i++){
                    data.push({
                        name: response.result[i].name,
                        email: response.result[i].email,
                        permission: response.result[i].permission,
                        active: (response.result[i].active) ? 'Ativo' : 'Inativo',
                        editar: returnEditHtml(response.result[i].user_id),
                        status: returnDeleteHtml(response.result[i].user_id)
                    });
                }
                setUsers(data);
            }

            document.getElementById("loader").style.display = "none";
        }

        loadUsers();
    }, [change]);

    
    const data = {
        columns: [
        {
            label: 'Nome',
            field: 'name',
            sort: 'asc',
        },
        {
            label: 'Email',
            field: 'email',
            sort: 'asc',
        },
        {
            label: 'Permission',
            field: 'permission',
            sort: 'asc',
        },
        {
            label: 'Ativo',
            field: 'active',
            sort: 'asc',
        },
        {
            label: 'Editar',
            field: 'editar',
            sort: 'asc',
        },
        {
            label: 'Status',
            field: 'status',
            sort: 'asc',
        },
        ],
        rows: users
    };

    async function handleSubmit(event) {
        event.preventDefault();

        document.getElementById("btn_submit").disabled = true;

        let auth = initialize(history);

        if(password === cPassword){
            if(!user_id){
                let response = await api.post('/users', {name, email, password, permission});
                response = response.data;
                
                if(response.result.length > 0){
                    handleClose();
                    swal("Cadastro realizado com sucesso");
                    setChange(change+1);
                }else{
                    document.getElementById("message").innerHTML = "Não foi possível cadastrar!";
                }
            }else{
                let response = await api.put(`/users/${user_id}`, {name, email, password, permission},  
                {headers: { authorization: auth[0].authorization }});

                response = response.data;

                if(response.result.length > 0){
                    handleClose();
                    swal("Edição realizada com sucesso");
                    setChange(change+1);
                }else{
                    document.getElementById("message").innerHTML = "Não foi possível atualizar cadastro!";
                }
            }
        }else{
            document.getElementById("message").innerHTML = "Senha diferente da sua confirmação!";
        }
        
    }
    
    return (
        <>
            <div className="container">
                <div className="row"></div>        
                    <div className="centering">
                        <div className="card card-signin my-5 spacing">
                            <h3 className="colorTitle">Disciplinas</h3>
                        <button onClick={handleShow}
                            className="btn btn-success col-lg-2 tableAdd">
                            <FaPlus />
                        </button>  
                        <MDBDataTable
                            striped
                            bordered
                            small
                            data={data}
                        />
                        </div>
                    </div>
            </div>

            <Modal show={show} onHide={handleClose} animation={false}>
                <Modal.Header closeButton>
                    <Modal.Title>Disciplina</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form className="form-signin" onSubmit={handleSubmit}>
                        <div className="form-label-group">
                            <input type="text" 
                            id="inputName" 
                            className="form-control" 
                            placeholder="Nome da disciplina" required 
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

                        <div className="form-label-group margin">
                            <select type="text" 
                            id="selectPermission" 
                            className="form-control selectCircle" required
                            value={permission}
                            onChange={event => setPermission(event.target.value)}>
                            <option value=''>
                                Selecione a permissão
                            </option>
                            <option value='2'> Comum</option>
                            <option value='1'> Administrador</option>
                            </select>
                        </div>

                        <div id="message" align='center'></div>

                        <button ref={submitButton} type="submit" hidden></button>
                                    
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Fechar
                    </Button>
                    <Button variant="primary" id="btn_submit"
                        onClick={e => { submitButton.current.click(); }}>
                        Salvar
                    </Button>
                </Modal.Footer>
            </Modal>
        </> 
        
    );
}