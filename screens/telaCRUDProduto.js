// screens/TelaCRUDProduto.js
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, Keyboard, StyleSheet } from 'react-native';
import ListaCadastro from '../components/ListaCadastro';
import * as DbProduto from '../services/dbProduto'; // Importando a lógica de dbProduto
import { Picker } from '@react-native-picker/picker';
import * as DbCategoria from '../services/dbCategoria'; // import do banco de categorias
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';



export default function TelaCRUDProduto() {
  const [produtos, setProdutos] = useState([]);
  const [codigo, setCodigo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [preco, setPreco] = useState('');
  const [categoria, setCategoria] = useState('');
  const [editandoId, setEditandoId] = useState(null);
  const [categorias, setCategorias] = useState([]);


  useEffect(() => {
    carregaProdutos();
  }, []);
  
  useFocusEffect(
    useCallback(() => {
      carregaCategorias();
    }, [])
  );
  

  // Função para carregar todos os produtos
  const carregaProdutos = async () => {
    try {
      const dados = await DbProduto.obtemTodosProdutos();
      setProdutos(dados);
    } catch (e) {
      Alert.alert('Erro', e.message);
    }
  };

  const carregaCategorias = async () => {
    try {
      const dados = await DbCategoria.obtemTodasCategorias();
      setCategorias(dados);
    } catch (e) {
      Alert.alert('Erro ao carregar categorias', e.message);
    }
  };

  // Função para salvar ou atualizar produto
  const salvarProduto = async () => {
    if (!descricao || !preco || !categoria) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }

    const novoProduto = {
      codigo: editandoId ? editandoId : Date.now().toString(), // Usando Date.now() para gerar um código único
      descricao,
      preco: parseFloat(preco),
      categoria,
    };

    try {
      let sucesso;
      if (editandoId !== null) {
        // Atualiza produto
        sucesso = await DbProduto.alteraProduto(novoProduto);
      } else {
        // Adiciona novo produto
        sucesso = await DbProduto.adicionaProduto(novoProduto);
      }

      if (sucesso) {
        Alert.alert('Sucesso', 'Produto salvo com sucesso!');
        setCodigo('');
        setDescricao('');
        setPreco('');
        setCategoria('');
        setEditandoId(null);
        carregaProdutos(); // Atualiza a lista de produtos
      } else {
        Alert.alert('Falha', 'Erro ao salvar o produto.');
      }
    } catch (e) {
      Alert.alert('Erro', e.message);
    }
  };

  // Função para editar produto
  const editarProduto = (produto) => {
    setCodigo(produto.codigo);
    setDescricao(produto.descricao);
    setPreco(produto.preco.toString());
    setCategoria(produto.categoria);
    setEditandoId(produto.codigo);
  };

  // Função para excluir produto
  const excluirProduto = async (codigo) => {
    Alert.alert(
      'Atenção',
      'Confirma a remoção deste produto?',
      [
        {
          text: 'Sim',
          onPress: async () => {
            try {
              const sucesso = await DbProduto.excluiProduto(codigo);
              if (sucesso) {
                Alert.alert('Sucesso', 'Produto removido com sucesso!');
                carregaProdutos(); // Atualiza a lista após exclusão
              } else {
                Alert.alert('Falha', 'Erro ao remover o produto.');
              }
            } catch (e) {
              Alert.alert('Erro', e.message);
            }
          },
        },
        {
          text: 'Não',
          style: 'cancel',
        },
      ]
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.titulo}>Cadastro de Produtos</Text>
      <TextInput
        placeholder="Descrição"
        style={styles.input}
        value={descricao}
        onChangeText={setDescricao}
      />
      <TextInput
        placeholder="Preço"
        style={styles.input}
        value={preco}
        onChangeText={setPreco}
        keyboardType="decimal-pad"
      />
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={categoria}
          onValueChange={(itemValue) => setCategoria(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Selecione uma categoria" value="" />
          {categorias.map((cat) => (
            <Picker.Item key={cat.codigo} label={cat.nome} value={cat.nome} />
          ))}
        </Picker>
      </View>

      <TouchableOpacity style={styles.botao} onPress={salvarProduto}>
        <Text style={styles.textoBotao}>{editandoId ? 'Atualizar' : 'Adicionar'}</Text>
      </TouchableOpacity>

      <ListaCadastro dados={produtos} onEdit={editarProduto} onDelete={excluirProduto} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f5f5f5',
    flexGrow: 1,
  },
  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    padding: 10,
    marginBottom: 12,
    borderRadius: 8,
  },
  botao: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: 'center',
  },
  textoBotao: {
    color: '#fff',
    fontSize: 16,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#fff',
    marginBottom: 12,
  },
  picker: {
    height: 50,
    width: '100%',
  },
  
});
