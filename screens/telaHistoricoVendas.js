// screens/TelaHistoricoVendas.js
import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, Alert } from 'react-native';
import * as DbVenda from '../services/dbVenda';
import { useFocusEffect } from '@react-navigation/native';

export default function TelaHistoricoVendas() {
  const [vendas, setVendas] = useState([]);

  const carregarVendas = async () => {
    try {
      const vendasDoBanco = await DbVenda.obtemTodasVendas();
      const dbVendasCx = await DbVenda.getDbConnection();

      const vendasComItens = await Promise.all(
        vendasDoBanco.map(async (venda) => {
          const produtosVenda = await DbVenda.obtemProdutosDaVenda(venda.codigo, dbVendasCx);

          const total = produtosVenda.reduce(
            (acc, p) => acc + p.preco * p.quantidade,
            0
          );

          return {
            codigo: venda.codigo,
            data: venda.data,
            itens: produtosVenda,
            total,
          };
        })
      );

      await dbVendasCx.closeAsync();
      setVendas(vendasComItens);

    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar o histórico de vendas.');
      console.error(error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      carregarVendas();
    }, [])
  );

  const renderItem = ({ item }) => (
    <View style={styles.vendaContainer}>
      <Text style={styles.titulo}>Venda #{item.codigo}</Text>
      <Text style={styles.data}>Data: {item.data}</Text>
      <Text style={styles.total}>Total: R${item.total.toFixed(2)}</Text>
      <Text style={styles.subtitulo}>Produtos:</Text>
      {item.itens.map((produto, index) => (
        <Text key={index} style={styles.item}>
          - {produto.descricao} ({produto.quantidade}x) - R${produto.preco.toFixed(2)} cada
        </Text>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Histórico de Vendas</Text>
      <FlatList
        data={vendas}
        keyExtractor={(item) => item.codigo.toString()}
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
