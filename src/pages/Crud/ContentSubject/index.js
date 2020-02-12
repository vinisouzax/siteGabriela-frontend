import React, { useState, Fragment, useEffect, useMemo } from 'react';
import api from '../../../services/api';
import { MDBDataTable } from 'mdbreact';
import { FaPlus, FaPen, FaExchangeAlt } from "react-icons/fa";
import { Button, Modal } from 'react-bootstrap';
import swal from 'sweetalert';
import {initialize} from '../../../Util';
import './styles.css';
import camera from '../../../assets/camera.svg';

export default function CSubject({ history }){
    const [name, setName] = useState('');
    const [subject, setSubject] = useState('');
    const [content_id, setContentId] = useState('');
    const [subjects, setSubjects] = useState([]);
    const [contents, setContents] = useState([]);
    const [show, setShow] = useState(false);
    const [change, setChange] = useState(0);
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const submitButton = React.createRef(null);
    
    const handleShow = () => setShow(true);
    
    const handleClose = () => { 
        setShow(false); 
        setContentId(''); 
        setSubject('')
        setName('');
    };
    
    useMemo(() => {
        const url = image ? URL.createObjectURL(image) : null;
        setPreview(url);
    }, [image]);

    useEffect((history) =>{
        let auth = initialize({history});

        async function edit(event, id) {
            event.preventDefault();
            
            if(!auth){
                history.push('/Login');
            }else{
    
                let response = await api.get(`/contents/${id}`, {
                    headers: {authorization: auth[0].authorization},
                });
    
                response = response.data;
    
                if(response.result.length > 0){
                    setName(response.result[0].name);
                    setContentId(id);
                    setPreview(response.result[0].image_url);
                    setSubject(response.result[0].subject_id);
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
                let response = await api.delete(`/contents/${id}`, 
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

        async function loadContents(){

            let response = await api.get('/contents/');

            response = response.data;

            if(response.result.length > 0){
                let data = [];
                for(let i = 0; i < response.result.length; i++){
                    data.push({
                        name: response.result[i].name,
                        subject: response.result[i].subject_name,
                        active: (response.result[i].active) ? 'Ativo' : 'Inativo',
                        editar: returnEditHtml(response.result[i].content_id),
                        status: returnDeleteHtml(response.result[i].content_id)
                    });
                }
                setContents(data);
            }
        }

        async function loadSubjects(){
            let response = await api.get('/subjects');
            response = response.data;
            
            if(response.result.length > 0){
                let data = [];
                for(let i = 0; i < response.result.length; i++){
                    if(response.result[i].active === true){
                        data.push({
                            subject_id: response.result[i].subject_id,
                            name: response.result[i].name,
                        });
                    }
                }
                setSubjects(data);
            }
            
        }

        loadContents();
        loadSubjects();
    }, [change]);

    
    const data = {
        columns: [
        {
            label: 'Nome',
            field: 'name',
            sort: 'asc',
        },
        {
            label: 'Disciplina',
            field: 'subject',
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
        rows: contents
    };

    async function handleSubmit(event) {
        event.preventDefault();

        let auth = initialize({history});

        if(content_id !== ''){
            let formData = new FormData();

            formData.append('image', image);
            formData.append('name', name);
            formData.append('subject', subject);

            let response = await api.put(`/contents/${content_id}`, formData, 
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
            let formData = new FormData();

            formData.append('image', image);
            formData.append('name', name);
            formData.append('subject', subject);
            
            let response = await api.post('/contents', formData, 
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
                            <h3 className="colorTitle">Conteúdos</h3>
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
                    <Modal.Title>Conteúdo</Modal.Title>
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

                        <div className="form-label-group margin">
                            <select type="text" 
                            id="selectSubject" 
                            className="form-control selectCircle" required
                            value={subject}
                            onChange={event => setSubject(event.target.value)}>
                            <option value=''>
                                Selecione a disciplina
                            </option>
                            {subjects.map(subject => (
                                <option key={subject.subject_id} value={subject.subject_id}>
                                    {subject.name}
                                </option>
                            ))}
                            </select>
                        </div>

                        <label
                            id="image"
                            style={{ backgroundImage: `url(${preview})`, backgroundSize: '238px 190px' }}
                            className={image ? 'has-image' : ''}
                        >
                            <input type="file" name="image" id="image" onChange={event => setImage(event.target.files[0])} />
                            <img src={camera} alt="selecione a imagem" />
                        </label>

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