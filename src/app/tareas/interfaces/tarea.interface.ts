export interface TareaResponse {
    mensaje?: string;
    ok:       boolean;
    tarea:    Tarea;
}

export interface Tarea {
    id?:              string;
    titulo?:          string;
    descripcion:      string;
    finalizada:       boolean;
    fechaCreacion:    string;
    fechaVencimiento: string;
    usuario:          usuario            
}

export interface usuario{
    id: string;
    username: string;
}

export interface FormEvent {
    accion: Accion;
    tareaId?: string;
}

export enum Accion {
    Crear =      1,
    Actualizar = 2,
    Borrar =     3
}


export interface Filtro {
    busqueda?: string;
    usuario?: string;
    finalizada?: string;
    orden?: string;
}