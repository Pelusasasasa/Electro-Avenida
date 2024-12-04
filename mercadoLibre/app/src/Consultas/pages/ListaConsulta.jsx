import React from 'react';
import { ConsultaItem } from '../components/ConsultaItem';

const res = {
      "total": 1,
      "limit": 50,
      "questions": [
          {
              "date_created": "2024-12-04T15:58:18.103-04:00",
              "item_id": "MLA1966788456",
              "seller_id": 231090073,
              "status": "ANSWERED",
              "text": "Hola, cuantas necesito para iluminar una habitación de 10x6metros",
              "tags": [],
              "id": 13221614379,
              "deleted_from_listing": false,
              "hold": false,
              "answer": {
                  "text": "Hola, Podes convinar en 2 hileras 3 colgantes y luego trendias que usar focos de una buenta intecidad",
                  "status": "ACTIVE",
                  "date_created": "2024-12-04T16:01:55.992-04:00"
              },
              "from": {
                  "id": 314921953
              }
          }
      ],
      "filters": {
          "limit": 50,
          "offset": 0,
          "api_version": "4",
          "is_admin": false,
          "sorts": [],
          "caller": 231090073,
          "seller": 231090073,
          "client_id": 8351426981367452
      },
      "available_filters": [
          {
              "id": "item",
              "name": "Item",
              "type": "text"
          },
          {
              "id": "from",
              "name": "From user id",
              "type": "number"
          },
          {
              "id": "totalDivisions",
              "name": "total divisions",
              "type": "number"
          },
          {
              "id": "division",
              "name": "Division",
              "type": "number"
          },
          {
              "id": "status",
              "name": "Status",
              "type": "text",
              "values": [
                  "ANSWERED",
                  "BANNED",
                  "CLOSED_UNANSWERED",
                  "DELETED",
                  "DISABLED",
                  "UNANSWERED",
                  "UNDER_REVIEW"
              ]
          }
      ],
      "available_sorts": [
          "item_id",
          "from_id",
          "date_created",
          "seller_id"
      ]
};


export const ListaConsulta = () => {
  console.log(res.questions[0])
  return (
    <section className='w-full bg-yellow-500'>
      <h1 className='text-center font-bold text-2xl mb-2'>Consultas de Mercado Libre</h1>

      <section className='bg-white h-[calc(100vh-120px)] overflow-scroll'>
        <table className='w-full '>
          <thead>
            <tr>
              <th className='border border-black'>Fecha</th>
              <th className='border border-black'>Texto</th>
              <th className='border border-black'>Status</th>
              <th className='border border-black'>Accion</th>
            </tr>
          </thead>
          <tbody>
            {
              res.questions.map( elem => (
                <ConsultaItem {...elem} key={elem.id}/>
              ))
            }
          </tbody>
        </table>
      </section>
    </section>

  )
}
