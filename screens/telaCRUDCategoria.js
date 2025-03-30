// screens/TelaCRUDCategoria.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView } from 'react-native';
import ListaCadastro from '../components/ListaCadastro';

export default function TelaCRUDCategoria() {
  const [categorias, setCategorias] = useState([]);
  const [nome, setNome] = useState('');
  const [editandoId, setEditandoId] = useState(null);

  const salvarCategoria = () => {
    if (!nome) return;

    if (editandoId !== null) {
      setCategorias((prev) =>
        prev.map((item) =>
          item.id === editandoId ? { ...item, nome } : item
        )
      );
      setEditandoId(null);
    } else {
      setCategorias([...categorias, {
        id: Date.now(),
        nome,
      }]);
    }

    setNome('');
  };

  const editarCategoria = (categoria) => {
    setNome(categoria.nome);
    setEditandoId(categoria.id);
  };

  const excluirCategoria = (id) => {
    setCategorias(categorias.filter((item) => item.id !== id));
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.titulo}>Cadastro de Categorias</Text>
      <TextInput placeholder="Nome da Categoria" style={styles.input} value={nome} onChangeText={setNome} />
      <Button title={editandoId ? 'Atualizar' : 'Adicionar'} onPress={salvarCategoria} />
      <ListaCadastro dados={categorias} onEdit={editarCategoria} onDelete={excluirCategoria} />
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
});
