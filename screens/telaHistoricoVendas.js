// screens/TelaHistoricoVendas.js
import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

export default function TelaHistoricoVendas() {
  const [vendas, setVendas] = useState([
    {
      id: 1,
      data: '2025-03-25',
      total: 170,
      itens: [
        { nome: 'Camisa', preco: 50 },
        { nome: 'Tênis', preco: 120 },
      ],
    },
    {
      id: 2,
      data: '2025-03-26',
      total: 30,
      itens: [
        { nome: 'Boné', preco: 30 },
      ],
    },
  ]);

  const renderItem = ({ item }) => (
    <View style={styles.vendaContainer}>
      <Text style={styles.titulo}>Venda #{item.id}</Text>
      <Text style={styles.data}>Data: {item.data}</Text>
      <Text style={styles.total}>Total: R${item.total.toFixed(2)}</Text>
      <Text style={styles.subtitulo}>Produtos:</Text>
      {item.itens.map((produto, index) => (
        <Text key={index} style={styles.item}>- {produto.nome} (R${produto.preco.toFixed(2)})</Text>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Histórico de Vendas</Text>
      <FlatList
        data={vendas}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  vendaContainer: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    marginBottom: 16,
    elevation: 2,
  },
  titulo: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  data: {
    fontSize: 14,
    color: '#555',
  },
  total: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
  },
  subtitulo: {
    fontWeight: 'bold',
    marginTop: 4,
  },
  item: {
    fontSize: 14,
    marginLeft: 8,
    color: '#555',
  },
});
