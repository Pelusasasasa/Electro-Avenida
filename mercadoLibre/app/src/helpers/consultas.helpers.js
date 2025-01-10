import axios from "axios";
const URL = process.env.REACT_APP_URL;

export const responder = async(id, res) => {
    const consulta = (await axios.post(`${URL}consultasML/forId/${id}`, {text: res.value})).data;
    return consulta;
};

export const traerConsulta = async(id) => {
    const consulta = (await axios.get(`${URL}consultasML/forId/${id}`)).data;
    return consulta;
};

export const traerConsultas = async() => {
    try {
        const consultas = (await axios.get(`${URL}consultasML/consultas`)).data;
        
        return consultas
    } catch (error) {
        return error
    }
};

