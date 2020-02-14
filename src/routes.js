import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Login from './pages/Login'
import Register from './pages/Crud/Register'
import Subject from './pages/Crud/Subject'
import Main from './pages/Main'
import Article from './pages/Crud/Article'
import FormArticle from './pages/Crud/FormArticle'
import ArticleView from './pages/SubPage/ArticleView'
import ContentSubject from './pages/Crud/ContentSubject'
import ContentView from './pages/SubPage/ContentView'


export default function Routes(){
    return (
        <Switch>
            <Route path="/" exact component={Main}/>
            <Route path="/Login" component={Login}/>
            <Route path="/Register" component={Register}/>
            <Route path="/Subject" component={Subject}/>
            <Route path="/Article" component={Article}/>
            <Route path="/FormArticle" component={FormArticle}/>
            <Route path="/ArticleView" component={ArticleView}/>
            <Route path="/ContentSubject" component={ContentSubject}/>
            <Route path="/ContentView" component={ContentView}/>
        </Switch>
    );
}