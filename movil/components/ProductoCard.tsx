import React from 'react';
import { Text, View } from 'react-native';

interface Props {
    _id: string;
    descripcion: string;
    precio: number;
    stock: number;
    img: string;
    cod_fabrica: string;
    rubro: string;
}

const ProductoCard = ({_id, descripcion, precio, stock, cod_fabrica, rubro}: Props) => {
    console.log(descripcion);
  return (
    <View className='rounded-lg border border-gray-300 shadow-md hover:shadow-lg transition-shadow'>

        <View className='flex-row gap-4 mb-5'>
            <View></View>
            <View className='flex-1 min-w-0'>
                <Text className='text-xl font-medium text-black'>{descripcion}</Text>
                
                <View className='flex-row px-2 justify-between'>
                    <Text className='text-xl text-gray-500'>Codigo: </Text>
                    <Text className='text-xl text-gray-500'>{_id}</Text>
                </View>

                <View className='flex-row px-2 justify-between'>
                    <Text className='text-xl text-gray-500'>Fabrica: </Text>
                    <Text className='text-xl text-gray-500'>{cod_fabrica}</Text>
                </View>

                <View>
                    <Text className='text-yellow-600 text-3xl font-medium'>$ {precio.toFixed(2)}</Text>
                    <View className='flex-row px-2 justify-between'>
                        <Text className='text-xl text-white px-2 py-1 rounded-full  bg-black'>Stock: {stock}</Text>
                        <Text className='inline-flex border-yellow-200 bg-yellow-50 text-yellow-800 rounded-full px-2.5 items-center text-xs font-medium'>{rubro}</Text>
                    </View>
                </View>

            </View>
        </View>


    </View>
  )
}

export default ProductoCard