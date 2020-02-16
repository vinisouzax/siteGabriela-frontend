import React, { useEffect } from 'react';
import './main.css';

export default function Main(){

    useEffect(() =>{
        document.getElementById("loader").style.display = "none";
    },[])

    return (
        <>
            <div className="container">
                <div className="row"></div>        
                    <div className="centering">
                        <div className="card card-signin my-5 spacing">
                            <div className="fb-profile">
                                <img align="left" className="fb-image-lg proportionWallpaper" src={require('../../assets/superficies.png')} alt="Wallpaper"/>
                                <div className="fb-profile-text">
                                    <h1>Gabriela Silva</h1>   
                                    <p>
                                        Meu nome é Gabriela, sou licencianda no curso de Licenciatura em Matemática, 
                                        pelo IFSULDEMINAS - Campus Passos. O meu site contém pdfs com 
                                        conteúdos, exercícios resolvidos, artigos correlatos das áreas de
                                        Análise na Reta e R^n e Geometria Diferencial apresentados de forma didática e de fácil compreensão. <strong>Seja bem-vindo(a)!</strong>
                                    </p>
                                </div>
                                {<img align="center" className="fb-image-profile thumbnail" src={require('../../assets/gabriela.jpg')} alt="Gabriela Silva"/>}                                 
                                <hr></hr>
                                <footer class="page-footer font-small blue footerMain">
                                    <div class="footer-copyright text-center py-3">
                                    Contato: gabrielageodif@gmail.com.
                                    © {(new Date().getFullYear())} Copyright.
                                    </div>
                                </footer>                            
                            </div>
                        </div>
                    </div>
            </div>

        </> 

    );
}