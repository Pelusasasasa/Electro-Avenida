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

  return (
    <tr className={`cursor-pointer ${active.id === id ? 'bg-blue-300' : 'hover:bg-gray-400'}`}>
        <td className='border border-black'>{date_created.slice(0, 10).split('-', 3).reverse().join('/')}</td>
        <td className='border border-black'>{text}</td>
        <td className='border border-black'>{status}</td>
        <td className="border border-black">
            <button className="w-full bg-gray-500 text-white font-bold"  onClick={responder}>Responder</button>
        </td>
    </tr>
  )
}
