import React from 'react';
import { Image, Text, View } from 'react-native';

const URL = process.env.EXPO_PUBLIC_ELECTRO_URL;

interface Props {
    _id: string;
    descripcion: string;
    precio_venta: number;
    stock: number;
    img?: string;
    cod_fabrica: string;
    rubro?: string;
}

const ProductoCard = ({_id, descripcion, precio_venta, stock, cod_fabrica, rubro}: Props) => {
  return (
    <View className='rounded-lg border border-gray-300 gap-5 '>

        <View className='flex-row gap-4 mb-2'>
            <View className='items-center justify-center bg-white'>
                <Image
                source={{uri: `${URL}productos/${_id}/image`}}
                className='h-28 w-28 rounded-lg' />
            </View>
            
            <View className='flex-1 min-w-0'>
                <Text className='text-md font-medium text-black'>{descripcion}</Text>
                
                <View className='flex-row px-2 justify-between'>
                    <Text className='text-xl text-gray-500'>Codigo: </Text>
                    <Text className='text-xl text-gray-500'>{_id}</Text>
                </View>

                <View className='flex-row px-2 justify-between'>
                    <Text className='text-xl text-gray-500'>Fabrica: </Text>
                    <Text className='text-xl text-gray-500'>{cod_fabrica}</Text>
                </View>

                <View>
                    <Text className='text-yellow-600 text-2xl font-medium'>$ {precio_venta.toFixed(2)}</Text>
                    <View className='flex-row px-2 justify-between'>
                        <Text className='text-md text-white px-2 py-1 rounded-full  bg-black'>Stock: {stock}</Text>
                        <Text className='inline-flex border-yellow-200 bg-yellow-50 text-yellow-800 rounded-full px-2.5 items-center text-xs font-medium'>{rubro}</Text>
                    </View>
                </View>

            </View>
        </View>


    </View>
  )
}

export default ProductoCard