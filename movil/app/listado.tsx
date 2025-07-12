import ProductoCard from '@/components/ProductoCard';
import { useProductoStore } from '@/presentation/hooks/useProductoStore';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Text, TextInput, View } from 'react-native';

const ListadoScreen = () => {
    const { productos, startTraerProductosPorTexto, isLoading } = useProductoStore();
    const [value, setValue] = useState<string>('')
    useEffect(() => {
        startTraerProductosPorTexto(value);
    }, []);

    const handleText = (e: string) => {
        setValue(e)
    }

    const handleProductos = () => {
        startTraerProductosPorTexto(value);
    }


  return (
    <View>
        <View className='bg-gradient-to-r bg-yellow-400 from-yellow-400 to-yellow-500 py-3'>
            <View className='flex-row justify-center my-2 text-black p-4 shadow-lg'>
                <Ionicons name='flash-outline' size={30}/>
                <Text className='text-2xl font-medium'>Electron Avenida</Text>
            </View>

            <View className='mx-2 flex-row gap-2'>
                <TextInput className='border flex-1 rounded-lg border-gray-400 bg-white' placeholder='Buscar Por codigo, Descripcion, fabrica o marca' onChangeText={handleText}/>
                <Ionicons name='search-outline' size={30} color={'white'} className='bg-black p-2 justify-center rounded-lg' onPress={handleProductos}/>
            </View>
        </View>

        {
            isLoading ? (
                <View className='justify-center items-center flex 1 min-h-80'>
                    <ActivityIndicator size='large'  color='007AFF' />
                    <Text>Cargando...</Text>
                </View>
        ) : (
            <View className='p-4'>
                <Text className='text-xl py-2 font-medium'>Productos Encotntrados ({productos?.length})</Text>
                <FlatList
                data={productos}
                keyExtractor={item => item._id}
                renderItem={({item}) => (
                    <ProductoCard key={item._id} {...item}/>
                )}   
            />
            </View>
        )
    }

    </View>
    )
}

export default ListadoScreen