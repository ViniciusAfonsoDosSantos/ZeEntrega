import React, { useState, useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import * as DbService from '../services/dbProduto';
import * as DbCategoria from '../services/dbCategoria'; // import do banco de categorias

import { CartContext } from '../context/CartContext';
import { useFocusEffect } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';  // Importação correta

export default function TelaProdutos() {
  const [produtos, setProdutos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState('');
  const { adicionarAoCarrinho } = useContext(CartContext);

  // Função para carregar produtos do banco de dados
  const carregarProdutos = async () => {
    try {
      const dadosProdutos = await DbService.obtemTodosProdutos();
      setProdutos(dadosProdutos);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar os produtos.');
      console.error(error);
    }
  };

  // Função para carregar as categorias do banco de dados
  const carregarCategorias = async () => {
    try {
      const categorias = await DbCategoria.obtemTodasCategorias(); // Substitua pelo seu método de obter categorias
      setCategorias(categorias);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar as categorias.');
      console.error(error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      carregarProdutos();
      carregarCategorias();
    }, [])
  );

  // Função para filtrar os produtos com base na categoria selecionada
  const filtrarProdutos = () => {
    if (!categoriaSelecionada) {
      return produtos;
    }
    return produtos.filter((produto) => produto.categoria === categoriaSelecionada);
  };

  // Função para adicionar ao carrinho
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

      {/* Filtro de categoria */}
      <Picker
        selectedValue={categoriaSelecionada}
        onValueChange={(itemValue) => setCategoriaSelecionada(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="[Todas as categorias]" value="" />
        {categorias.map((categoria) => (
          <Picker.Item key={categoria.codigo} label={categoria.nome} value={categoria.nome} />
        ))}
      </Picker>

      {/* Lista de produtos filtrados */}
      <FlatList
        data={filtrarProdutos()}
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
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
  },
});
