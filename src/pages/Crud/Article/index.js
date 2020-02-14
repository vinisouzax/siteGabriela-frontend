import React, { useState, Fragment, useEffect } from 'react';
import api from '../../../services/api';
import { MDBDataTable } from 'mdbreact';
import { FaPlus, FaPen, FaExchangeAlt, FaTrash } from "react-icons/fa";
import { Button, Modal } from 'react-bootstrap';
import swal from 'sweetalert';
import {initialize, validFileType} from '../../../Util';
import './styles.css'; 

export default function Article({ history }){
    const [name, setName] = useState('');
    const [article_id, setArticleId] = useState('');
    const [subject, setSubject] = useState('');
    const [content, setContent] = useState('');
    const [subjects, setSubjects] = useState([]);
    const [contents, setContents] = useState([]);
    const [articles, setArticles] = useState([]);
    const [pdfsBD, setPdfsBD] = useState([]);
    const [show, setShow] = useState(false);
    const [change, setChange] = useState(0);
    const [pdfs, setPdfs] = useState('');
    const submitButton = React.createRef(null);
    
    const handleShow = () => setShow(true); 
    
    const handleClose = () => { 
        setShow(false); 
        setArticleId(''); 
        setSubject('');
        setContent('');
        setName('');
        setPdfsBD([]);
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
                    loadContentsUE(response.result[0].subject_id);
                    setName(response.result[0].name);
                    setArticleId(id);
                    setContent(response.result[0].content_id);
                    setSubject(response.result[0].subject_id);

                    response = await api.get(`/pdfs/${id}`);

                    response = response.data;

                    if(response.result.length > 0){
                        let data = [];
                        for(let i = 0; i < response.result.length; i++){
                            data.push({
                                name: response.result[i].name,
                                pdf_url: response.result[i].pdf_url,
                                pdf_id: response.result[i].pdf_id,
                                article_id: response.result[i].pdf_id,
                                active: response.result[i].active
                            });
                        }
                        setPdfsBD(data);
                    }

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

            let response = await api.get('/articles');

            response = response.data;

            if(response.result.length > 0){
                let data = [];
                for(let i = 0; i < response.result.length; i++){
                    data.push({
                        name: response.result[i].name,
                        subject: response.result[i].subject_name,
                        content: response.result[i].content_name,
                        active: (response.result[i].active) ? 'Ativo' : 'Inativo',
                        editar: returnEditHtml(response.result[i].article_id),
                        status: returnDeleteHtml(response.result[i].article_id)
                    });
                }
                setArticles(data);
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

        async function loadContentsUE(subject_id){
            let response = await api.get('/contents');
            response = response.data;
            
            if(response.result.length > 0){
                let data = [];
                for(let i = 0; i < response.result.length; i++){
                    if(response.result[i].active === true && 
                        response.result[i].subject_id === subject_id){
                        data.push({
                            content_id: response.result[i].content_id,
                            name: response.result[i].name,
                        });
                    }
                }
                setContents(data);            
            }  
        }

        loadArticles();
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
            label: 'Conteúdo',
            field: 'content',
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
            let response = await api.put(`/articles/${article_id}`, 
            { name, subject, content }, 
            {headers: { authorization: auth[0].authorization }});
    
            response = response.data;
            
            if(response.result.length > 0){
                let formData = new FormData();
    
                for (const key of Object.keys(pdfs)) {
                    formData.append('pdfs', pdfs[key]);
                }
    
                formData.append('article', response.result[0].article_id);
                
                response = await api.post('/pdfs', formData, 
                {headers: { authorization: auth[0].authorization }});

                handleClose();
                swal("Edição realizada com sucesso");
                setChange(change+1);
            }else{
                document.getElementById("message").innerHTML = "Não foi possível editar!";
            }
        }else{
            let response = await api.post('/articles', 
            { name, subject, content } , 
            {headers: { authorization: auth[0].authorization }});
    
            response = response.data;
            
            if(response.result.length > 0){
                let formData = new FormData();
    
                for (const key of Object.keys(pdfs)) {
                    formData.append('pdfs', pdfs[key]);
                }
    
                formData.append('article', response.result[0].article_id);
                
                response = await api.post('/pdfs', formData, 
                {headers: { authorization: auth[0].authorization }});
                handleClose();
                swal("Cadastro realizado com sucesso"); 
            }else{
                document.getElementById("message").innerHTML = "Não foi possível cadastrar!";
            } 
        }
        
    }

    async function loadContents(subject_id){
        let response = await api.get('/contents');
        response = response.data;
        
        if(response.result.length > 0){
            let data = [];
            for(let i = 0; i < response.result.length; i++){
                if(response.result[i].active === true && 
                    response.result[i].subject_id === subject_id){
                    data.push({
                        content_id: response.result[i].content_id,
                        name: response.result[i].name,
                    });
                }
            }
            setContents(data);            
        }  
    }

    function updateFiles(files){

        const preview = document.querySelector('.preview');

        while(preview.firstChild) {
            preview.removeChild(preview.firstChild);
        }

        const list = document.createElement('ol');
        preview.appendChild(list);

        if(article_id !== ''){

            for(const pdfBD of pdfsBD) {
                const listItem = document.createElement('li');
                const para = document.createElement('p');

                para.textContent = `Arquivo: ${pdfBD.name}.`;
                listItem.appendChild(para);

                list.appendChild(listItem);
            }
        }
        
        if(files.length === 0) {
            const para = document.createElement('p');
            para.textContent = 'Nenhum arquivo selecionado';
            preview.appendChild(para);
        } else {

            setPdfs(files);

            for(const file of files) {
                const listItem = document.createElement('li');
                const para = document.createElement('p');
                if(validFileType(file)) {
                    para.textContent = `Arquivo: ${file.name}.`;
                    //const image = document.createElement('img');
                    //image.src = URL.createObjectURL(file);
        
                    //listItem.appendChild(image);
                    listItem.appendChild(para);
                } else {
                    para.textContent = `Arquivo: ${file.name}: Não é um tipo de arquivo válido. Atualize sua seleção.`;
                    listItem.appendChild(para);
                }
        
                list.appendChild(listItem);
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
                    <Modal.Title>Artigo</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form className="form-signin formArticle" onSubmit={handleSubmit}>
                        <div className="form-label-group">
                            <input type="text" 
                            id="inputName" 
                            className="form-control" 
                            placeholder="Nome do Artigo" required 
                            value={name}
                            onChange={event => setName(event.target.value)}/>
                            <label htmlFor="inputName"> Nome*</label>
                        </div>

                        <div className="form-label-group margin">
                            <select type="text" 
                            id="selectSubject" 
                            className="form-control selectCircle" required
                            value={subject}
                            onChange={event => {setSubject(event.target.value);
                            loadContents(event.target.value)}}>
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

                        <div className="form-label-group margin">
                            <select type="text" 
                            id="selectContent" 
                            className="form-control selectCircle" required
                            value={content}
                            onChange={event => setContent(event.target.value)}>
                            <option value=''>
                                Selecione o conteúdo
                            </option>
                            {contents.map(content => (
                                <option key={content.content_id} value={content.content_id}>
                                    {content.name}
                                </option>
                            ))}
                            </select>

                        </div>

                        <div className="divPdfs">
                            <label htmlFor="pdfs">Escolhas os arquivos (PDF)</label>
                            <input type="file" name="pdfs" id="pdfs" accept=".pdf" onChange={event => updateFiles(event.target.files)} multiple/>
                        </div>
                        <div className="preview">
                            <ol>
                            {
                            pdfsBD.map(pdfBD => (
                                <li key={pdfBD.pdf_id} value={pdfBD.pdf_id}>
                                    <p>{pdfBD.name}</p>
                                </li>
                            ))
                            }
                            </ol>
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