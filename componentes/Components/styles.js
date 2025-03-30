//RETIRAR - SO BASEAR


import { StyleSheet } from 'react-native';

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
  
  


export default styles;