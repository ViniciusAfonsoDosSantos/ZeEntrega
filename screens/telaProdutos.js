// screens/TelaProdutos.js
import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';

export default function TelaProdutos() {
  const [produtos, setProdutos] = useState([
    { id: 1, nome: 'Camisa', preco: 50, categoria: 'Roupas' },
    { id: 2, nome: 'Tênis', preco: 120, categoria: 'Calçados' },
    { id: 3, nome: 'Boné', preco: 30, categoria: 'Acessórios' },
  ]);
  const [carrinho, setCarrinho] = useState([]);

  const adicionarAoCarrinho = (produto) => {
    setCarrinho([...carrinho, produto]);
    Alert.alert('Adicionado!', `${produto.nome} foi adicionado ao carrinho.`);
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <View>
        <Text style={styles.nome}>{item.nome}</Text>
        <Text style={styles.detalhe}>Preço: R${item.preco.toFixed(2)}</Text>
        <Text style={styles.detalhe}>Categoria: {item.categoria}</Text>
      </View>
      <TouchableOpacity onPress={() => adicionarAoCarrinho(item)} style={styles.botaoComprar}>
        <Text style={styles.botaoTexto}>Comprar</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Produtos Disponíveis</Text>
      <FlatList
        data={produtos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    padding: 16,
  },
  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  itemContainer: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    elevation: 2,
  },
  nome: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  detalhe: {
    fontSize: 14,
    color: '#666',
  },
  botaoComprar: {
    backgroundColor: '#2196F3',
    borderRadius: 5,
    padding: 10,
    justifyContent: 'center',
  },
  botaoTexto: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
