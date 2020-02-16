import React, {useEffect, useState} from 'react';
import api from '../../../services/api';
import { FaFilePdf, FaUserAlt } from "react-icons/fa";
import './styles.css'

export default function ArticleView(props){

    const [articles, setArticles] = useState([]);

    useEffect(() =>{
        document.getElementById("loader").style.display = "block";

        async function loadArticles(){
            let response = await api.get('/articles');
            response = response.data;
            
            if(response.result.length > 0){
                let data = [];
                for(let i = 0; i < response.result.length; i++){
                    if(response.result[i].active === true && 
                        response.result[i].content_id === props.location.state.content){

                        let id = response.result[i].article_id;
                        let response_pdf = await api.get(`/pdfs/${id}`);

                        response_pdf = response_pdf.data;

                        let data_pdf = [];
                        if(response_pdf.result.length > 0){
                            data_pdf = response_pdf.result;
                        }

                        data.push({
                            article_id: response.result[i].article_id,
                            name: response.result[i].name,
                            user_name: response.result[i].user_name,
                            pdfs: data_pdf
                        });
                    }
                }
                setArticles(data);
            }

            document.getElementById("loader").style.display = "none";
            
        }
        loadArticles();
 
    }, [props]);

    async function addView(event, pdf){
        let id = pdf.pdf_id;
        await api.post(`/pdfs/${id}`, {views: (pdf.views+1)});
    }

    return (
        <>
            {articles.map(article => (
                <div className="container articleContainer" key={article.article_id}>
                    <div className="row articleRow">
                        <div className="span12">
                            <div className="row">
                                <div className="span8">
                                    <h4 className="articleTitle">
                                        <strong>{article.name.toUpperCase()}</strong>
                                    </h4>
                                </div>
                            </div>
                            <div className="row">
                                <ul className="list-group">
                                    {article.pdfs.map(pdf => (
                                        <li className="list-group-item pdfItem" key={pdf.pdf_id}>
                                            <a className="pdfLink" 
                                            target="_blank" 
                                            rel="noopener noreferrer" 
                                            onClick={event => addView(event, pdf)}
                                            href={pdf.pdf_url}>
                                                <FaFilePdf /> {pdf.name}
                                            </a>
                                            &nbsp; | {pdf.views} Downloads
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="row">
                                <div className="span8">
                                    <p></p>
                                    <p className="details">
                                    <i className="icon-user"></i> <FaUserAlt /> by {article.user_name}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </> 
        
    );
}