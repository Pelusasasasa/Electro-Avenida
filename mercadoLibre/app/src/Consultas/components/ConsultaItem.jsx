import Swal from "sweetalert2"

export const ConsultaItem = ({id, date_created, text, status}) => {
    
    const active = {}
    const responder = async() => {
        const res = await Swal.fire({
            title: 'Responder Consulta',
            input: 'text',
            confirmButtonText: 'Enviar', 
            showCancelButton: true
        });

        
    }
    let estado = '';

    if (status === 'ANSWERED'){
        estado = 'RESPONDIDO';
    }else if (status === 'UNANSWERED'){
        estado = 'NO RESPONDIDO';
    };

  return (
    <tr className={`cursor-pointer ${active.id === id ? 'bg-blue-300' :  status === 'ANSWERED' ? 'hover:bg-green-400' : 'hover:bg-red-400'} }`}>
        <td className={`border ${status === 'ANSWERED' ? 'border-green-500' : 'border-red-400'}`}>{date_created.slice(0, 10).split('-', 3).reverse().join('/')}</td>
        <td className={`border ${status === 'ANSWERED' ? 'border-green-500' : 'border-red-400'}`}>{text}</td>
        <td className={`border ${status === 'ANSWERED' ? 'border-green-500' : 'border-red-400'}`}>{estado}</td>
        <td className={`border ${status === 'ANSWERED' ? 'border-green-500' : 'border-red-400'}`}>
            <button className="w-full bg-gray-500 text-white font-bold"  onClick={responder}>Responder</button>
        </td>
    </tr>
  )
}
