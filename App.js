//RETIRAR - SO BASEAR




import { StatusBar } from 'expo-status-bar';
import {
  Alert, Text, TextInput, TouchableOpacity,
  View, Keyboard, ScrollView, Image
} from 'react-native';
import { useState, useEffect } from 'react';
import styles from './styles';
import Contato from './componentes/Contato';
import * as DbService from './services/dbservice';

export default function App() {

  const [id, setId] = useState();
  const [nome, setNome] = useState();
  const [telefone, setTelefone] = useState();
  const [contatos, setContatos] = useState([]);

  async function processamentoUseEffect() {
    try {
      await DbService.createTable();
      await carregaDados();
    }
    catch (e) {
      console.log(e);
    }
  }


  useEffect(
    () => {
      processamentoUseEffect(); //necessário método pois aqui não pode utilizar await...
    }, []);


  useEffect(
    () => {
      console.log('mudou o telefone e/ou o nome');
    }, [telefone, nome]);


  function createUniqueId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(0, 2);
  }


  async function salvaDados() {
    let novoRegistro = (id == undefined);

    let obj = {
      id: novoRegistro ? createUniqueId() : id,
      nome: nome,
      telefone: telefone,
    };

    try {

      let resposta = false;
      if (novoRegistro)
        resposta = await DbService.adicionaContato(obj);
      else
        resposta = await DbService.alteraContato(obj);

      if (resposta)
        Alert.alert('Sucesso!');
      else
        Alert.alert('Falha!');

      Keyboard.dismiss();
      limparCampos();
      await carregaDados();
    } catch (e) {
      Alert.alert(e);
    }
  }

  async function carregaDados() {
    try {
      console.log('carregando');
      let contatos = await DbService.obtemTodosContatos();
      setContatos(contatos);
    } catch (e) {
      Alert.alert(e.toString());
    }
  }


  function editar(identificador) {
    const contato = contatos.find(contato => contato.id == identificador);

    if (contato != undefined) {
      setId(contato.id);
      setNome(contato.nome);
      setTelefone(contato.telefone);
    }

    console.log(contato);
  }


  async function limparCampos() {
    setNome("");
    setTelefone("");
    setId(undefined);
    Keyboard.dismiss();
  }


  async function efetivaExclusao() {
    try {
      await DbService.excluiTodosContatos();
      await carregaDados();
    }
    catch (e) {
      Alert.alert(e);
    }
  }

  function apagarTudo() {
    if (Alert.alert('Muita atenção!!!', 'Confirma a exclusão de todos os contatos?',
      [
        {
          text: 'Sim, confirmo!',
          onPress: () => {
            efetivaExclusao();
          }
        },
        {
          text: 'Não!!!',
          style: 'cancel'
        }
      ]));
  }


  function removerElemento(identificador) {
    Alert.alert('Atenção', 'Confirma a remoção do contato?',
      [
        {
          text: 'Sim',
          onPress: () => efetivaRemoverContato(identificador),
        },
        {
          text: 'Não',
          style: 'cancel',
        }
      ]);
  }

  async function efetivaRemoverContato(identificador) {
    try {
      await DbService.excluiContato(identificador);
      Keyboard.dismiss();
      limparCampos();
      await carregaDados();
      Alert.alert('Contato apagado com sucesso!!!');
    } catch (e) {
      Alert.alert(e);
    }
  }



  return (
    <View style={styles.container}>
      <Text style={styles.tituloAgenda}>Agenda de Contatos - v1.0</Text>
      <Text /><Text />


      <View style={styles.areaDados}>

        <View style={styles.areaNome}>
          <Text>Nome</Text>
          <TextInput style={styles.caixaTexto}
            onChangeText={(texto) => setNome(texto)}
            value={nome} />
        </View>

        <View style={styles.areaTelefone}>
          <Text>Telefone</Text>
          <TextInput style={styles.caixaTexto}
            onChangeText={(texto) => setTelefone(texto)}
            value={telefone}
            keyboardType='phone-pad' />
        </View>

      </View>


      <View style={styles.areaBotoes}>
        <TouchableOpacity style={styles.botao} onPress={() => salvaDados()}>
          <Text style={styles.textoBotao}>Salvar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.botao} onPress={() => limparCampos()}>
          <Text style={styles.textoBotao}>Cancelar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.botao, styles.botaoApagarTudo]} onPress={() => apagarTudo()}>
          <Text style={styles.textoBotao}>Apagar tudo</Text>
        </TouchableOpacity>
      </View>



      <ScrollView style={styles.listaContatos}>
        {
          contatos.map((contato, index) => (
            <Contato contato={contato} key={index.toString()}
              removerElemento={removerElemento} editar={editar} />
          ))
        }

      </ScrollView>


      <StatusBar style="auto" />
    </View>
  );
}

