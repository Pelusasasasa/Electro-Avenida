import ProductoCard from '@/components/ProductoCard';
import { productos } from '@/data/productos';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { FlatList, Text, TextInput, View } from 'react-native';

const listado = () => {
  return (
    <View>
        <View className='bg-gradient-to-r bg-yellow-400 from-yellow-400 to-yellow-500 py-3'>
            <View className='flex-row justify-center my-2 text-black p-4 shadow-lg'>
                <Ionicons name='flash-outline' size={30}/>
                <Text className='text-2xl font-medium'>Electron Avenida</Text>
            </View>

            <View className='mx-2 flex-row gap-2'>
                <TextInput className='border flex-1 rounded-lg border-gray-400 bg-white' placeholder='Buscar Por codigo, Descripcion o fabrica'/>
                <Ionicons name='search-outline' size={30} color={'white'} className='bg-black p-2 justify-center rounded-lg'/>
            </View>
        </View>
        <View className='p-4'>
            <Text className='text-xl font-medium'>Productos Encotntrados ({productos.length})</Text>
            <FlatList
            data={productos}
            keyExtractor={item => item._id}
            renderItem={({item}) => (
                <ProductoCard key={item._id} {...item}/>
            )}   
        />
        </View>

    </View>
    )
}

export default listado