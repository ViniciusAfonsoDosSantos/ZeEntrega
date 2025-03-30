import React, { useState, useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import * as DbService from '../services/dbProduto';
import { CartContext } from '../context/CartContext';
import { useFocusEffect } from '@react-navigation/native';

export default function TelaProdutos() {
  const [produtos, setProdutos] = useState([]);
  const { adicionarAoCarrinho } = useContext(CartContext);

  const carregarProdutos = async () => {
    try {
      const dadosProdutos = await DbService.obtemTodosProdutos();
      setProdutos(dadosProdutos);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar os produtos.');
      console.error(error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      carregarProdutos();
    }, [])
  );

  const handleComprar = (produto) => {
    adicionarAoCarrinho(produto);
    Alert.alert('Adicionado!', `${produto.descricao} foi adicionado ao carrinho.`);
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <View>
        <Text style={styles.nome}>{item.descricao}</Text>
        <Text style={styles.detalhe}>Preço: R${item.preco.toFixed(2)}</Text>
        <Text style={styles.detalhe}>Categoria: {item.categoria}</Text>
      </View>
      <TouchableOpacity onPress={() => handleComprar(item)} style={styles.botaoComprar}>
        <Text style={styles.botaoTexto}>Comprar</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Produtos Disponíveis</Text>
      <FlatList
        data={produtos}
        keyExtractor={(item) => item.codigo.toString()}
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
