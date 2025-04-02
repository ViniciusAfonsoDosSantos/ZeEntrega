import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';

export default function ListaCadastro({ dados, onEdit, onDelete }) {
  const renderItem = ({ item }) => {
    // Verifica se é um produto ou uma categoria e ajusta a renderização
    const isProduto = item.hasOwnProperty('descricao');  // Verifica se é um produto
    const nome = isProduto ? item.descricao : item.nome; // Para produto ou categoria
    const preco = isProduto ? item.preco : null; // Só para produtos
    const categoria = isProduto ? item.categoria : null; // Só para produtos

    return (
      <View style={styles.itemContainer}>
        <View>
          <Text style={styles.titulo}>{nome}</Text>
          {isProduto && (
            <>
              <Text style={styles.descricao}>Preço: {preco}</Text>
              <Text style={styles.descricao}>Categoria: {categoria}</Text>
            </>
          )}
        </View>
        <View style={styles.botoes}>
          <TouchableOpacity onPress={() => onEdit(item)} style={styles.botaoEditar}>
            <Text style={styles.botaoTexto}>Editar</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onDelete(item.codigo)} style={styles.botaoExcluir}>
            <Text style={styles.botaoTexto}>Excluir</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <FlatList
      data={dados}
      keyExtractor={(item, index) => `${item.codigo}-${index}`}  // Combina código com índice para garantir a chave única
      renderItem={renderItem}
      contentContainerStyle={styles.flatListContainer}  // Garantir que o FlatList ocupe o espaço correto
    />
  );
}

const styles = StyleSheet.create({
  itemContainer: {
    backgroundColor: '#fff',
    padding: 12,
    marginVertical: 6,
    marginHorizontal: 16,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    elevation: 2,
  },
  titulo: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  descricao: {
    fontSize: 14,
    color: '#555',
  },
  botoes: {
    justifyContent: 'space-around',
  },
  botaoEditar: {
    backgroundColor: '#4CAF50',
    borderRadius: 5,
    padding: 6,
    marginBottom: 4,
  },
  botaoExcluir: {
    backgroundColor: '#F44336',
    borderRadius: 5,
    padding: 6,
  },
  botaoTexto: {
    color: '#fff',
    fontWeight: 'bold',
  },
  flatListContainer: {
    flexGrow: 1,  // Certifique-se de que o FlatList ocupe o espaço disponível
  },
});
