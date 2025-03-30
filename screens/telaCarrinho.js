import React, { useContext } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { CartContext } from '../context/CartContext';
import * as DbVenda from '../services/dbVenda';

export default function TelaCarrinho() {
  const { carrinho, removerDoCarrinho, limparCarrinho } = useContext(CartContext);

  const total = carrinho.reduce((sum, item) => sum + item.preco * item.quantidade, 0);

  const efetivarCompra = async () => {
    if (carrinho.length === 0) {
      Alert.alert('Carrinho vazio', 'Adicione produtos antes de finalizar a compra.');
      return;
    }

    const codigoVenda = Date.now().toString();
    const dataVenda = new Date().toLocaleString();

    const venda = { codigo: codigoVenda, data: dataVenda };

    try {
      const sucesso = await DbVenda.adicionaVenda(venda, carrinho);
      if (sucesso) {
        Alert.alert('Compra realizada', `Total de R$${total.toFixed(2)}`);
        limparCarrinho();
      } else {
        Alert.alert('Erro', 'Falha ao registrar a venda.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Ocorreu um problema ao salvar a venda.');
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.nome}>{item.descricao}</Text>
      <Text style={styles.preco}>R${item.preco.toFixed(2)}</Text>
      <Text style={styles.quantidade}>Quantidade: {item.quantidade}</Text>
      <TouchableOpacity onPress={() => removerDoCarrinho(item.codigo)} style={styles.botaoRemover}>
        <Text style={styles.botaoTexto}>Remover</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Carrinho de Compras</Text>
      <FlatList
        data={carrinho}
        keyExtractor={(item) => item.codigo.toString()}
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
  container: { flex: 1, padding: 16, backgroundColor: '#f9f9f9' },
  titulo: { fontSize: 22, fontWeight: 'bold', marginBottom: 12 },
  itemContainer: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
    elevation: 2,
  },
  nome: { fontSize: 16, fontWeight: 'bold' },
  preco: { fontSize: 14, color: '#555' },
  quantidade: { fontSize: 14, color: '#000' },
  botaoRemover: {
    marginTop: 8,
    backgroundColor: '#F44336',
    padding: 8,
    borderRadius: 5,
    alignSelf: 'flex-start',
  },
  botaoTexto: { color: '#fff', fontWeight: 'bold' },
  resumo: { marginTop: 20, alignItems: 'center' },
  total: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  botaoFinalizar: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 8,
  },
});
