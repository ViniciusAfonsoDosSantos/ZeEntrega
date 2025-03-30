// screens/TelaCarrinho.js
import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';

export default function TelaCarrinho() {
  const [carrinho, setCarrinho] = useState([
    { id: 1, nome: 'Camisa', preco: 50 },
    { id: 2, nome: 'Tênis', preco: 120 },
  ]);

  const total = carrinho.reduce((sum, item) => sum + item.preco, 0);

  const removerItem = (id) => {
    setCarrinho(carrinho.filter((item) => item.id !== id));
  };

  const efetivarCompra = () => {
    if (carrinho.length === 0) {
      Alert.alert('Carrinho vazio', 'Adicione produtos antes de finalizar a compra.');
      return;
    }
    // Aqui você pode salvar a venda no banco de dados SQLite futuramente
    Alert.alert('Compra realizada', `Total de R$${total.toFixed(2)}`);
    setCarrinho([]);
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.nome}>{item.nome}</Text>
      <Text style={styles.preco}>R${item.preco.toFixed(2)}</Text>
      <TouchableOpacity onPress={() => removerItem(item.id)} style={styles.botaoRemover}>
        <Text style={styles.botaoTexto}>Remover</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Carrinho de Compras</Text>
      <FlatList
        data={carrinho}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
      />
      <View style={styles.resumo}>
        <Text style={styles.total}>Total: R${total.toFixed(2)}</Text>
        <TouchableOpacity onPress={efetivarCompra} style={styles.botaoFinalizar}>
          <Text style={styles.botaoTexto}>Finalizar Compra</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f9f9f9',
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
    elevation: 2,
  },
  nome: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  preco: {
    fontSize: 14,
    color: '#555',
  },
  botaoRemover: {
    marginTop: 8,
    backgroundColor: '#F44336',
    padding: 8,
    borderRadius: 5,
    alignSelf: 'flex-start',
  },
  botaoTexto: {
    color: '#fff',
    fontWeight: 'bold',
  },
  resumo: {
    marginTop: 20,
    alignItems: 'center',
  },
  total: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  botaoFinalizar: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 8,
  },
});
