import React, {useEffect, useState} from 'react';
import api from '../../../services/api';
import './styles.css'

export default function ArticleView(props){

    const [articles, setArticles] = useState([]);

    useEffect(() =>{

        async function loadArticles(){
            let response = await api.get('/articles');
            response = response.data;
            
            if(response.result.length > 0){
                let data = [];
                for(let i = 0; i < response.result.length; i++){
                    if(response.result[i].active === true && 
                        response.result[i].content_id === props.location.state.content){
                        data.push({
                            article_id: response.result[i].article_id,
                            name: response.result[i].name
                        });
                    }
                }
                setArticles(data);
            }
            
        }

        loadArticles();
 
    }, [props]);

    return (
        <>
            {articles.map(article => (
                <div className="container articleContainer" key={article.article_id}>
                    <div className="row articleRow">
                        <div className="span12">
                            <div className="row">
                                <div className="span8">
                                    <h4><strong><a href="/#">{article.name}</a></strong></h4>
                                </div>
                            </div>
                            <div className="row">

                            </div>
                            <div className="row">
                                <div className="span8">
                                    <p></p>
                                    <p>
                                    <i className="icon-user"></i> by <a href="/#">John</a> 
                                    | <i className="icon-calendar"></i> Sept 16th, 2012
                                    | <i className="icon-comment"></i> <a href="/#">3 Comments</a>
                                    | <i className="icon-share"></i> <a href="/#">39 Shares</a>
                                    | <i className="icon-tags"></i> Tags : <a href="/#"><span className="label label-info">Snipp</span></a> 
                                    | <a href="/#"><span className="label label-info">Bootstrap</span></a> 
                                    | <a href="/#"><span className="label label-info">UI</span></a> 
                                    | <a href="/#"><span className="label label-info">growth</span></a>
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