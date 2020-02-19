import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { Link } from 'react-router-dom';

export default function Sidebar(){
    const [subjects, setSubjects] = useState([]);

    useEffect(() =>{
        document.getElementById("loader_middle").style.display = "block";

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
            document.getElementById("loader_middle").style.display = "none";
        }

        loadSubjects();
    }, []);

    return (
        <>
            {subjects.map(subject => (
                <Link to={{ pathname: `/ContentView`, state: { subject: subject.subject_id} }}
                    key={subject.subject_id}
                    className="list-group-item list-group-item-action bg-light">
                        {subject.name}
                </Link>
            ))}
        </>
    );
}