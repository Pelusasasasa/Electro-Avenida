import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2"

import { ponerActivo, responderConsulta } from "../../store/consultas/thunks";
import { respondiendo } from "../../store/consultas/consultasSlice";
import {traerPublicacion} from "../../helpers/publicaciones.helpers";


export const ConsultaItem = ({id, date_created, text, item_id ,status}) => {
    
    const {active} = useSelector(state => state.consultas);
    const dispatch = useDispatch();

    const [producto, setProducto] = useState({});

    
    const traerProducto = async(e) => {
        const elem = await traerPublicacion(item_id);
        setProducto(elem)
    };

    const click = async(e) => {
        let id = '';

        if (e.target.nodeName === 'TD'){
            id = e.target.parentNode.id;
            
            dispatch( await ponerActivo(id) );
        };
    };

    const responder = async() => {
        dispatch(respondiendo());

        const res = await Swal.fire({
            title: 'Responder Consulta',
            input: 'text',
            confirmButtonText: 'Enviar', 
            showCancelButton: true
        });


        dispatch(responderConsulta(active.id ,res));

        
    };

    const verRespuesta = async(e) => {
        let id = '';

        id = e.target.parentNode.parentNode.id;

        const res = await dispatch( await ponerActivo(id) );

        const {date_created, text} = res.answer;

        Swal.fire({
            title: `<h3>${date_created.slice(0,10).split('-', 3).reverse().join('/')}</h3>`,
            html: `<p>${text}</p>`,
            icon: 'info',
            confirmButtonText: 'Aceptar'
            

        })
    };
    let estado = '';

    if (status === 'ANSWERED'){
        estado = 'RESPONDIDO';
    }else if (status === 'UNANSWERED'){
        estado = 'NO RESPONDIDO';
    };

    useEffect(() => {
        traerProducto()
    }, []);

  return (
    <tr onClick={click} id={id} className={`cursor-pointer ${active.id === id ? 'bg-blue-300' :  status === 'ANSWERED' ? 'hover:bg-green-400' : 'hover:bg-red-400'} }`}>
        <td className={`border ${status === 'ANSWERED' ? 'border-green-500' : 'border-red-400'}`}>{date_created.slice(0, 10).split('-', 3).reverse().join('/')}</td>
        <td className={`border ${status === 'ANSWERED' ? 'border-green-500' : 'border-red-400'}`}>{producto.descripcion}</td>
        <td className={`border ${status === 'ANSWERED' ? 'border-green-500' : 'border-red-400'}`}>{text}</td>
        <td className={`border ${status === 'ANSWERED' ? 'border-green-500' : 'border-red-400'}`}>{estado}</td>
        <td className={`border ${status === 'ANSWERED' ? 'border-green-500' : 'border-red-400'}`}>
            <button className="w-full bg-gray-500 text-white font-bold"  onClick={estado === 'RESPONDIDO' ? verRespuesta : responder}>{estado === 'RESPONDIDO' ? 'Ver Respuesta' : 'Responder'}</button>
        </td>
    </tr>
  )
}
