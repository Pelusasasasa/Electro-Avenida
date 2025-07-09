
import { store } from '@/store/store'
import { Stack } from 'expo-router'
import React from 'react'
import { Provider } from 'react-redux'
import '../global.css'

const _layout = () => {

  return (
    <Provider store={store}>
        <Stack>
        <Stack.Screen
          options={{
            headerShown: false
          }}
          name='listado'
        />
      </Stack>
    </Provider>
  )
}

export default _layout