import React, { useState, useEffect } from 'react';
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import {initialize} from '../../../Util';
import api from '../../../services/api';
import swal from 'sweetalert';

export default function FormArticle({history}){
    const [title, setTitle] = useState('');
    const [pdfs, setPdfs] = useState('');
    const [txt_dsc, setTxt_dsc] = useState('');
    const [subject, setSubject] = useState('');
    const [subjects, setSubjects] = useState([]);

    let auth = initialize({history});

    useEffect(() =>{
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
    
        loadSubjects();
    }, []);


    async function handleSubmit(event) {
        event.preventDefault();

        let response = await api.post('/articles', {txt_dsc, title, subject} , 
        {headers: { authorization: auth[0].authorization }});

        response = response.data;
        
        if(response.result.length > 0){
            let formData = new FormData();

            for (const key of Object.keys(pdfs)) {
                formData.append('pdfs', pdfs[key]);
            }

            formData.append('subject', response.result[0].subject_id);
            
            response = await api.post('/pdfs', formData, 
            {headers: { authorization: auth[0].authorization }});

            swal("Cadastro realizado com sucesso");
        }else{
            document.getElementById("message").innerHTML = "Não foi possível cadastrar!";
        } 
    }

    return (
        <>
            <div className="container">
                <div className="row"></div>        
                <div className="centering">
                    <div className="card card-signin my-5 spacing">
                        <form className="App spacing" onSubmit={handleSubmit}>
                            <h2>Cadastro</h2>
                            <div className="row">
                                <div className="col">
                                    <div className="form-label-group margin">
                                        <input type="text" 
                                        id="inputTitle" 
                                        className="form-control" 
                                        placeholder="Título do artigo" required
                                        value={title}
                                        onChange={event => setTitle(event.target.value)}/>
                                        <label htmlFor="inputTitle"> Título*</label>
                                    </div>
                                </div>
                                <div className="col">
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
                                </div>
                            </div>
                            <hr></hr>
                            <CKEditor
                                editor={ ClassicEditor }
                                data="<p>Digite a descrição do artigo aqui!</p>"
                                onInit={ editor => {
                                    // You can store the "editor" and use when it is needed.
                                    //console.log( 'Editor is ready to use!', editor );
                                } }
                                onChange={ ( event, editor ) => {
                                    const data = editor.getData();
                                    setTxt_dsc(data);
                                    //console.log( { event, editor, data } );
                                } }
                                onBlur={ ( event, editor ) => {
                                    //console.log( 'Blur.', editor );
                                } }
                                onFocus={ ( event, editor ) => {
                                    //console.log( 'Focus.', editor );
                                } }
                            />
                            <div className="form-group margin">
                                <input type="file" name="pdfs" id="pdfs" onChange={event => setPdfs(event.target.files)} multiple />
                            </div>
                            <button className="btn btn-lg btn-primary btn-block text-uppercase buttonSave margin" 
                                type="submit">Salvar</button>
                        </form>
                    </div>
                </div>
            </div>
        </> 
        
    );
}