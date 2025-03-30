// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import TelaProdutos from './screens/telaProdutos';
import TelaCRUDProduto from './screens/telaCRUDProduto';
import TelaCRUDCategoria from './screens/telaCRUDCategoria';
import TelaCarrinho from './screens/telaCarrinho';
import TelaHistoricoVendas from './screens/telaHistoricoVendas';
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName;
            switch (route.name) {
              case 'Produtos':
                iconName = 'pricetags-outline';
                break;
              case 'CRUDProduto':
                iconName = 'create-outline';
                break;
              case 'CRUDCategoria':
                iconName = 'grid-outline';
                break;
              case 'Carrinho':
                iconName = 'cart-outline';
                break;
              case 'Historico':
                iconName = 'time-outline';
                break;
            }
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: 'tomato',
          tabBarInactiveTintColor: 'gray',
        })}
      >
        <Tab.Screen name="Produtos" component={TelaProdutos} />
        <Tab.Screen name="CRUDProduto" component={TelaCRUDProduto} options={{ title: 'Produtos (CRUD)' }} />
        <Tab.Screen name="CRUDCategoria" component={TelaCRUDCategoria} options={{ title: 'Categorias (CRUD)' }} />
        <Tab.Screen name="Carrinho" component={TelaCarrinho} />
        <Tab.Screen name="Historico" component={TelaHistoricoVendas} options={{ title: 'Histórico' }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
