import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Login from './pages/Login'
import Register from './pages/Register'
import Subject from './pages/Subject'
import Main from './pages/Main'
import Article from './pages/Article'
import FormArticle from './pages/FormArticle'
import SubjectView from './pages/SubjectView'
import ContentSubject from './pages/ContentSubject'
import ContentView from './pages/ContentView'


export default function Routes(){
    return (
        <Switch>
            <Route path="/" exact component={Main}/>
            <Route path="/Login" component={Login}/>
            <Route path="/Register" component={Register}/>
            <Route path="/Subject" component={Subject}/>
            <Route path="/Article" component={Article}/>
            <Route path="/FormArticle" component={FormArticle}/>
            <Route path="/SubjectView" component={SubjectView}/>
            <Route path="/ContentSubject" component={ContentSubject}/>
            <Route path="/ContentView" component={ContentView}/>
        </Switch>
    );
}