//RETIRAR - SO BASEAR



import {
    Text, TouchableOpacity, View, Image
} from 'react-native';

import styles from './styles';
import iconTelefone from '../../img/phone.png';
import iconEdit from '../../assets/edit.png';
import iconDelete from '../../assets/delete.png';

export default function Contato({ contato, removerElemento, editar }) {
    return (
        <View style={styles.contato} >

            <Text style={styles.listaNome}> {contato.nome}</Text>
            <View style={styles.dadosListaTelefone}>

                <Image source={iconTelefone} style={styles.iconTelefone} />
                <Text style={styles.listaTelefone} >{contato.telefone} </Text>
            </View>

            <View style={styles.dadosBotoesAcao}>
                <TouchableOpacity onPress={() => removerElemento(contato.id)}>
                    <Image source={iconDelete} style={styles.icone} />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => editar(contato.id)}>
                    <Image source={iconEdit} style={styles.icone} />
                </TouchableOpacity>

            </View>
        </View>
    );

};