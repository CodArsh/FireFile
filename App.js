import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  FlatList,
  StatusBar,
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import database from '@react-native-firebase/database';

export default function App() {
  useEffect(() => {
    realDB();
  }, []);
  const [inputText, setInputText] = useState(null);
  const [list, setList] = useState(null);
  const [update, setUpdate] = useState(false);
  const [realIndex, setRealIndex] = useState(0);

  // CREATE function
  const handleInsert = () => {
    try {
      if (inputText !== '') {
        const index = list.length;
        database().ref(`todo/${index}`).set({
          value: inputText,
        });
        setInputText('');
      }
    } catch (err) {
      console.log(err);
    }
  };

  // READ function
  const realDB = async () => {
    try {
      const todoRef = database().ref('todo');
      todoRef.on('value', snapshot => {
        setList(snapshot.val());
      });
    } catch (err) {
      console.log(err);
    }
  };

  // UPDATE function
  const handleUpdate = () => {
    try {
      if (inputText !== '') {
        database().ref(`todo/${realIndex}`).update({
          value: inputText,
        });
        setInputText('');
        setUpdate(false);
      }
    } catch (err) {
      console.log(err);
    }
  };

  // DELETE function
  const handleDelete = (value, index) => {
    Alert.alert('Are you sure ?', `You want to delete ${value}.`, [
      {
        text: 'Cancel',
        onPress: () => {
          return null;
        },
      },
      {
        text: 'Ok',
        onPress: () => {
          try {
            database().ref(`todo/${index}`).remove();
            setInputText('');
            setUpdate(false);
          } catch (err) {
            console.log(err);
          }
        },
      },
    ]);
  };
  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <View style={{alignItems: 'center', marginVertical: 15}}>
        <TextInput
          value={inputText}
          style={styles.input}
          placeholder="enter any text"
          onChangeText={e => setInputText(e)}
        />
        {!update ? (
          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => handleInsert()}>
            <Text style={{color: 'white'}}>Insert</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.addBtn, {backgroundColor: 'black'}]}
            onPress={() => handleUpdate()}>
            <Text style={{color: 'white'}}>Update</Text>
          </TouchableOpacity>
        )}
      </View>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={list}
        renderItem={item => {
          if (item?.item !== null) {
            return (
              <TouchableOpacity
                style={[styles.card]}
                onLongPress={() => handleDelete(item?.item?.value, item.index)}
                onPress={() => (
                  setUpdate(true),
                  setInputText(item?.item?.value),
                  setRealIndex(item.index)
                )}>
                <Text>{item?.item?.value}</Text>
              </TouchableOpacity>
            );
          }
        }}
      />
    </View>
  );
}

const {width} = Dimensions.get('screen');
const styles = StyleSheet.create({
  container: {flex: 1, alignItems: 'center'},
  input: {
    width: width - 30, // remove 30 pixels from 'SCREEN WIDTH
    borderWidth: 1,
    borderColor: 'black',
    marginTop: 15,
    borderRadius: 20,
  },
  addBtn: {
    backgroundColor: '#0099ff',
    width: 70,
    padding: 5,
    alignItems: 'center',
    borderRadius: 5,
    marginTop: 15,
  },
  cardContainer: {
    marginVertical: 10,
  },
  card: {
    backgroundColor: 'white',
    elevation: 3,
    width: width - 40,
    padding: 20,
    borderRadius: 10,
    marginVertical: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
// getDB() FUNCTION CALL
// USING FIRESTORE DB
// const getDB = async () => {
//   try {
//     const all_data = await firestore()
//       .collection('testing')
//       .doc('v5dUxFzLoLOmGcJGRyKX')
//       .get();
//     setData(all_data._data);
//   } catch (err) {
//     console.log('Error : ', err);
//   }
// };
