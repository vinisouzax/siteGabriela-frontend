import React, { useState, Fragment, useEffect } from 'react';
import api from '../../services/api';
import { MDBDataTable } from 'mdbreact';
import { FaPlus, FaPen, FaExchangeAlt } from "react-icons/fa";
import { Button, Modal } from 'react-bootstrap';
import swal from 'sweetalert';
import {initialize} from '../../Util';

export default function Article({ history }){
    const [name, setName] = useState('');
    const [article_id, setArticleId] = useState('');
    const [articles, setArticles] = useState([]);
    const [show, setShow] = useState(false);
    const [change, setChange] = useState(0);
    const submitButton = React.createRef(null);
    //const handleShow = () => setShow(true);
    
    const handleClose = () => { 
        setShow(false); 
        setArticleId(''); 
        setName('');
    };

    useEffect((history) =>{
        let auth = initialize({history});

        async function edit(event, id) {
            event.preventDefault();
            
            if(!auth){
                history.push('/Login');
            }else{

                let response = await api.get(`/articles/${id}`, {
                    headers: {authorization: auth[0].authorization},
                });

                response = response.data;

                if(response.result.length > 0){
                    setName(response.result[0].name);
                    setArticleId(id);
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
                let response = await api.delete(`/articles/${id}`, 
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
        
        async function loadArticles(){

            let response = await api.get('/articles/');

            response = response.data;

            if(response.result.length > 0){
                let data = [];
                for(let i = 0; i < response.result.length; i++){
                    data.push({
                        title: response.result[i].title,
                        active: (response.result[i].active) ? 'Ativo' : 'Inativo',
                        editar: returnEditHtml(response.result[i].article_id),
                        status: returnDeleteHtml(response.result[i].article_id)
                    });
                }
                setArticles(data);
            }
        }

        loadArticles();
    }, [change]);
    
    const data = {
        columns: [
        {
            label: 'Título',
            field: 'title',
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
        rows: articles
    };

    async function handleSubmit(event) {
        event.preventDefault();

        let auth = initialize({history});

        if(article_id !== ''){
            let response = await api.put(`/articles/${article_id}`, { name }, 
            {headers: { authorization: auth[0].authorization }});
    
            response = response.data;
            
            if(response.result.length > 0){
                handleClose();
                swal("Edição realizada com sucesso");
                setChange(change+1);
            }else{
                document.getElementById("message").innerHTML = "Não foi possível editar!";
            }
        }else{
            let response = await api.post('/articles', { name }, 
            {headers: { authorization: auth[0].authorization }});
    
            response = response.data;
            
            if(response.result.length > 0){
                handleClose();
                swal("Cadastro realizado com sucesso");
                setChange(change+1);
            }else{
                document.getElementById("message").innerHTML = "Não foi possível cadastrar!";
            }  
        }
        
    }
    
    return (
        <>
            <div className="container">
                <div className="row"></div>        
                    <div className="centering">
                        <div className="card card-signin my-5 spacing">
                            <h3 className="colorTitle">Artigos</h3>
                        <button onClick={(e) => history.push('/FormArticle')}
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
                    <Modal.Title>Novo artigo</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form className="form-signin" onSubmit={handleSubmit}>
                        <div className="form-label-group">
                            <input type="text" 
                            id="inputName" 
                            className="form-control" 
                            placeholder="Nome do artigo" required autofocus
                            value={name}
                            onChange={event => setName(event.target.value)}/>
                            <label htmlFor="inputName"> Nome*</label>
                        </div>

                        <div id="message" align='center'></div>

                        <button ref={submitButton} type="submit" hidden></button>
                                    
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Fechar
                    </Button>
                    <Button variant="primary" 
                        onClick={e => { submitButton.current.click(); }}>
                        Salvar
                    </Button>
                </Modal.Footer>
            </Modal>
        </> 
        
    );
}