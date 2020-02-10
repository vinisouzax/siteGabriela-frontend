import React from 'react';

export default function SubjectView(props){
    console.log(props.location.state);
    return (
        <>
            <div>{props.location.state.subject}</div>
        </> 
        
    );
}