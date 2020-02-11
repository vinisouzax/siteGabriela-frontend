import React from 'react';

export default function SubjectView(props){
    return (
        <>
            <div className="container" style={{backgroundColor: "#fff", marginTop: "10px", borderRadius: "10px"}}>
                <div className="row" style={{marginLeft: '10px', padding: "10px"}}>
                    <div className="span12">
                        <div className="row">
                            <div className="span8">
                                <h4><strong><a href="#">Title of the post</a></strong></h4>
                            </div>
                        </div>
                        <div className="row">
                            <div className="span10">      
                                <p>
                                Lorem ipsum dolor sit amet, id nec conceptam conclusionemque. Et eam tation option. Utinam salutatus ex eum. Ne mea dicit tibique facilisi, ea mei omittam explicari conclusionemque, ad nobis propriae quaerendum sea.
                                </p>
                                <p><a className="btn" href="#">Read more</a></p>
                            </div>
                        </div>
                        <div className="row">
                            <div className="span8">
                                <p></p>
                                <p>
                                <i className="icon-user"></i> by <a href="#">John</a> 
                                | <i className="icon-calendar"></i> Sept 16th, 2012
                                | <i className="icon-comment"></i> <a href="#">3 Comments</a>
                                | <i className="icon-share"></i> <a href="#">39 Shares</a>
                                | <i className="icon-tags"></i> Tags : <a href="#"><span className="label label-info">Snipp</span></a> 
                                <a href="#"><span className="label label-info">Bootstrap</span></a> 
                                <a href="#"><span className="label label-info">UI</span></a> 
                                <a href="#"><span className="label label-info">growth</span></a>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </> 
        
    );
}