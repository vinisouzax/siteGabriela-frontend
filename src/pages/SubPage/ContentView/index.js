import React, {useEffect, useState} from 'react';
import api from '../../../services/api';
import { Link } from 'react-router-dom';

export default function ContentView(props){
    const [contents, setContents] = useState([]);
    const [subject_name, setSubject_name] = useState(0);

    useEffect(() =>{

        async function loadContents(){
            let response = await api.get('/contents');
            response = response.data;
            
            if(response.result.length > 0){
                let data = [];
                for(let i = 0; i < response.result.length; i++){
                    if(response.result[i].active === true && 
                        response.result[i].subject_id === props.location.state.subject){
                        setSubject_name(response.result[i].subject_name)
                        data.push({
                            content_id: response.result[i].content_id,
                            name: response.result[i].name,
                            image_url: response.result[i].image_url
                        });
                    }
                }
                setContents(data);
            }
            
        }

        loadContents();
 
    }, [props]);

    return (
        <>
            <div className="container">

                <h1 className="my-4 titleContents">Conteúdos de {subject_name}</h1>

                <div className="row">
                    {contents.map(content => (
                        <div className="col-lg-3 col-md-4 col-sm-6 mb-4" key={content.content_id}>
                            <div className="card h-100">
                                <Link to={{ pathname: `/SubjectView`, state: {content: content.content_id} }}>
                                        <img className="card-img-top" src={content.image_url} alt={content.name}/>
                                </Link>
                                <div className="card-body">
                                    <h4 className="card-title">
                                        <Link to={{ pathname: `/SubjectView`, state: {content: content.content_id} }}>
                                            {content.name}
                                        </Link>
                                    </h4>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </> 
        
    );
}