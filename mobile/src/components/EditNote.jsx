import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { updateNote, reset, isEdit, getNoteById } from '../store/notesSlice';

const EditNote = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const route = useRoute();
  const id = route.id;
  const { isLoading, isUpdate, isError, message } = useSelector(
    (state) => state.noteState
  );

  const { note } = route.params || {};

  const [title, setTitle] = useState(note?.title || '');
  const [content, setContent] = useState(note?.content || '');

  useEffect(() => {
    if (id || !isEdit) {
      dispatch(getNoteById(id));
    }
  }, [id, isEdit, dispatch]);

  useFocusEffect(
    React.useCallback(() => {
      dispatch(reset());
    }, [dispatch])
  );

  useEffect(() => {
    if (isUpdate) {
      Alert.alert('Başarılı', 'Not başarıyla güncellendi.', [
        {
          text: 'Tamam',
          onPress: () => {
            navigation.goBack();
          },
        },
      ]);
    }

    if (isError && message) {
      Alert.alert('Hata', message);
    }
  }, [isUpdate, isError, message, navigation]);

  const handleUpdate = () => {
    if (title === note.title && content === note.content) {
      Alert.alert('Bilgi', 'Herhangi bir değişiklik yapmadınız.', [
        {
          text: 'Tamam',
          onPress: () => navigation.goBack(), 
        },
      ]);
      return;
    }

    if (!title.trim() || !content.trim()) {
      Alert.alert('Hata', 'Lütfen başlık ve içerik giriniz.');
      return;
    }

    const updateData = {
      ...note,
      title,
      content,
    };

    dispatch(updateNote(updateData));
  };

  if (!note) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Not bulunamadı</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.buttonText}>Geri Dön</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Başlık"
        value={title}
        onChangeText={setTitle}
        editable={!isLoading}
      />
      <TextInput
        style={[styles.input, styles.contentInput]}
        placeholder="İçerik"
        value={content}
        onChangeText={setContent}
        multiline
        editable={!isLoading}
      />
      <TouchableOpacity 
        style={[styles.button, isLoading && styles.disabledButton]} 
        onPress={handleUpdate}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Güncelle</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  contentInput: {
    height: 200,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#ccc',
    opacity: 0.7,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  errorText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
  },
});

export default EditNote;