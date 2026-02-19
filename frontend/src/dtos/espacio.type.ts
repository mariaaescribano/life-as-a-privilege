
export type Pregunta = {
    idPregunta: string,
    pregunta: string,
    consejo?:string,
};

export type Bloque = {
    title: string,
    icon: any,
    subPreguntas: Pregunta[] 
};

export type ThemeTitleObject = {
    title: string,
    icon: any,
    color: string,
};





