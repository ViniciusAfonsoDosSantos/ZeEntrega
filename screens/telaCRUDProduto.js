// screens/TelaCRUDProduto.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView } from 'react-native';
import ListaCadastro from '../components/ListaCadastro';

export default function TelaCRUDProduto() {
  const [produtos, setProdutos] = useState([]);
  const [nome, setNome] = useState('');
  const [preco, setPreco] = useState('');
  const [categoria, setCategoria] = useState('');
  const [editandoId, setEditandoId] = useState(null);

  const salvarProduto = () => {
    if (!nome || !preco || !categoria) return;

    if (editandoId !== null) {
      setProdutos((prev) =>
        prev.map((item) =>
          item.id === editandoId ? { ...item, nome, preco: parseFloat(preco), categoria } : item
        )
      );
      setEditandoId(null);
    } else {
      setProdutos([...produtos, {
        id: Date.now(),
        nome,
        preco: parseFloat(preco),
        categoria,
      }]);
    }

    setNome('');
    setPreco('');
    setCategoria('');
  };

  const editarProduto = (produto) => {
    setNome(produto.nome);
    setPreco(produto.preco.toString());
    setCategoria(produto.categoria);
    setEditandoId(produto.id);
  };

  const excluirProduto = (id) => {
    setProdutos(produtos.filter((item) => item.id !== id));
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.titulo}>Cadastro de Produtos</Text>
      <TextInput placeholder="Nome" style={styles.input} value={nome} onChangeText={setNome} />
      <TextInput placeholder="Preço" style={styles.input} value={preco} onChangeText={setPreco} keyboardType="decimal-pad" />
      <TextInput placeholder="Categoria" style={styles.input} value={categoria} onChangeText={setCategoria} />
      <Button title={editandoId ? 'Atualizar' : 'Adicionar'} onPress={salvarProduto} />
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
});
