import React from 'react';
import './main.css';

export default function Main(){

    return (
        <>
            <div className="container">
                <div className="row"></div>        
                    <div className="centering">
                        <div className="card card-signin my-5 spacing">
                            <div className="fb-profile">
                                <img align="left" className="fb-image-lg proportionWallpaper" src={require('../../assets/superficies.png')} alt="Wallpaper"/>
                                {<img align="left" className="fb-image-profile thumbnail proportionProfile" src={require('../../assets/gabriela.jpeg')} alt="Gabriela Silva"/>}
                                <div className="fb-profile-text">
                                    <h1>Gabriela Silva</h1>
                                    <p>Meu nome é Gabriela, sou licencianda no curso de Licenciatura em Matemática, 
                                        pelo IFSULDEMINAS - Campus Passos. O meu site contém pdfs com 
                                        conteúdos, exercícios resolvidos, artigos correlatos das áreas de
                                        Análise na Reta e R^n, Geometria Diferencial, Geometria Riemanniana, 
                                        Topologia Diferencial, apresentados de forma didática e de fácil compreensão. <strong>Seja bem-vindo(a)!</strong>

                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
            </div>

        </> 

    );
}