// components/ListaCadastro.js
import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';

export default function ListaCadastro({ dados, onEdit, onDelete }) {
  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <View>
        <Text style={styles.titulo}>{item.nome}</Text>
        {item.preco && <Text style={styles.descricao}>Preço: R${item.preco.toFixed(2)}</Text>}
        {item.categoria && <Text style={styles.descricao}>Categoria: {item.categoria}</Text>}
      </View>
      <View style={styles.botoes}>
        <TouchableOpacity onPress={() => onEdit(item)} style={styles.botaoEditar}>
          <Text style={styles.botaoTexto}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onDelete(item.id)} style={styles.botaoExcluir}>
          <Text style={styles.botaoTexto}>Excluir</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <FlatList
      data={dados}
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderItem}
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
});
