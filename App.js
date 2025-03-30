// App.js
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import { CartProvider } from './context/CartContext';

import { createTable as createTableProdutos } from './services/dbProduto';
import { createTable as createTableVendas, recriarTabelasVenda, reiniciarTabelasVenda } from './services/dbVenda';
import { createTable as createTableCategorias } from './services/dbCategoria';

import TelaProdutos from './screens/telaProdutos';
import TelaCRUDProduto from './screens/telaCRUDProduto';
import TelaCRUDCategoria from './screens/telaCRUDCategoria';
import TelaCarrinho from './screens/telaCarrinho';
import TelaHistoricoVendas from './screens/telaHistoricoVendas';
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

export default function App() {
  const [dbReady, setDbReady] = useState(false);

  useEffect(() => {
    const setupDatabase = async () => {
      try {
        await createTableCategorias();
        await createTableProdutos();
        await createTableVendas();
        setDbReady(true);
      } catch (error) {
        console.error('Erro ao configurar o banco de dados:', error);
      }
    };

    setupDatabase();
  }, []);

  if (!dbReady) {
    return <Text>Carregando banco de dados...</Text>;
  }

  return (
    <CartProvider>
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
    </CartProvider>
  );
}
