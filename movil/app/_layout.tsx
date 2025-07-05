import React from 'react'

import { productos } from '@/data/productos'
import { Stack } from 'expo-router'
import '../global.css'

const _layout = () => {

  console.log(productos);
  return (
    <Stack>
      <Stack.Screen
        options={{
          headerShown: false
        }}
        name='listado'
      />
    </Stack>
  )
}

export default _layout