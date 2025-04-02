import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import ListaCadastro from '../components/ListaCadastro'; // Importar ListaCadastro
import * as DbCategoria from '../services/dbCategoria';  // Importe o serviço de banco de dados

export default function TelaCRUDCategoria() {
  const [categorias, setCategorias] = useState([]);
  const [nome, setNome] = useState('');
  const [editandoId, setEditandoId] = useState(null);

  // Função para carregar as categorias do banco de dados
  const carregarCategorias = async () => {
    try {
      const categoriasDoBanco = await DbCategoria.obtemTodasCategorias();
      setCategorias(categoriasDoBanco);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar as categorias.');
      console.error(error);
    }
  };

  // Função para salvar ou atualizar a categoria
  const salvarCategoria = async () => {
    if (!nome) return;

    const novaCategoria = {
      codigo: editandoId || Date.now().toString(), // Usando 'codigo' como chave única
      nome,
    };

    if (editandoId !== null) {
      const sucesso = await DbCategoria.alteraCategoria(novaCategoria);
      if (sucesso) {
        Alert.alert('Sucesso', 'Categoria atualizada.');
      } else {
        Alert.alert('Erro', 'Falha ao atualizar categoria.');
      }
    } else {
      const sucesso = await DbCategoria.adicionaCategoria(novaCategoria);
      if (sucesso) {
        Alert.alert('Sucesso', 'Categoria adicionada.');
      } else {
        Alert.alert('Erro', 'Falha ao adicionar categoria.');
      }
    }

    setNome('');
    setEditandoId(null);
    carregarCategorias(); // Recarrega a lista de categorias após a operação
  };

  // Função para editar uma categoria
  const editarCategoria = (categoria) => {
    setNome(categoria.nome);
    setEditandoId(categoria.codigo); // Armazenar o código da categoria para edição
  };

  // Função para excluir uma categoria
  const excluirCategoria = async (codigo) => {
    const sucesso = await DbCategoria.excluiCategoria(codigo);
    if (sucesso) {
      Alert.alert('Sucesso', 'Categoria excluída.');
    } else {
      Alert.alert('Erro', 'Falha ao excluir categoria.');
    }
    carregarCategorias(); // Recarrega a lista de categorias após a exclusão
  };

  // Carregar categorias quando a tela for montada
  useEffect(() => {
    carregarCategorias();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Cadastro de Categorias</Text>
      <TextInput
        placeholder="Nome da Categoria"
        style={styles.input}
        value={nome}
        onChangeText={setNome}
      />
      <Button title={editandoId ? 'Atualizar' : 'Adicionar'} onPress={salvarCategoria} />
      
      {/* Usando ListaCadastro para listar as categorias */}
      <ListaCadastro
        dados={categorias}
        onEdit={editarCategoria}
        onDelete={excluirCategoria}
      />
    </View>
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
  lista: {
    marginTop: 20,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
});
