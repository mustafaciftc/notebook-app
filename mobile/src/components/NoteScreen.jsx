import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, Modal, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { getAllNotes, deleteNote, reset } from '../store/notesSlice';
import moment from 'moment';

const NoteScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { noteTable, isLoading, isError, message } = useSelector((state) => state.noteState);

  const [noteToDelete, setNoteToDelete] = useState(null);
  const [isDeletingNote, setIsDeletingNote] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    dispatch(getAllNotes());
  }, [dispatch]);

  useEffect(() => {
    if (isError && message) {
      Alert.alert('Hata', message);
      dispatch(reset()); 
    }
  }, [isError, message, dispatch]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      dispatch(getAllNotes());
    });

    return unsubscribe;
  }, [navigation, dispatch]);

  const handleAddNote = () => {
    navigation.navigate('AddNote');
  };

  const handleEditNote = (note) => {
    navigation.navigate('EditNote', { note });
  };

  const handleDeleteNote = (note) => {
    setNoteToDelete(note); 
    setShowDeleteModal(true); 
  };

  const cancelDelete = () => {
    setNoteToDelete(null);
    setShowDeleteModal(false);
  };

  const confirmDelete = async () => {
    if (!noteToDelete) return;

    setIsDeletingNote(true); 
    
    try {
      await dispatch(deleteNote(noteToDelete._id || noteToDelete.id)).unwrap();
      
      Alert.alert(
        'Başarılı', 
        'Not başarıyla silindi.',
        [{ text: 'Tamam' }]
      );
      
      dispatch(getAllNotes());
    } catch (error) {
      Alert.alert(
        'Hata', 
        'Not silinirken bir hata oluştu. Lütfen tekrar deneyin.',
        [{ text: 'Tamam' }]
      );
    } finally {
      setIsDeletingNote(false);
      setNoteToDelete(null);
      setShowDeleteModal(false);
    }
  };

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  const confirmLogout = () => {
    setShowLogoutModal(false);
    
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  const renderNoteItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.noteItem}
      onPress={() => handleEditNote(item)} 
      activeOpacity={0.7}
    >
      <View style={styles.noteContent}>
        <Text style={styles.noteTitle} numberOfLines={2}>
          {item.title || 'Başlıksız Not'} 
        </Text>
        <Text style={styles.noteText} numberOfLines={3}>
          {item.content || 'İçerik bulunmuyor'} 
        </Text>
        <Text style={styles.noteDate}>
          {moment(item.createdAt).format('DD.MM.YYYY HH:mm')}
        </Text>
      </View>
      
      <View style={styles.noteActions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.editButton]}
          onPress={() => handleEditNote(item)}
          activeOpacity={0.7}
        >
          <Text style={styles.actionButtonText}>✏️ Düzenle</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => handleDeleteNote(item)} 
          activeOpacity={0.7}
        >
          <Text style={styles.actionButtonText}>🗑️ Sil</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Notlar yükleniyor...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>Notlarım</Text>
        </View>
        
        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.addButton}
            onPress={handleAddNote}
            activeOpacity={0.7}
          >
            <Text style={styles.addButtonText}>+ Not Ekle</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
            activeOpacity={0.7}
          >
            <Text style={styles.logoutButtonText}>🚪 Çıkış</Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={noteTable || []} 
        keyExtractor={(item, index) => 
          item._id?.toString() || item.id?.toString() || index.toString()
        }
        renderItem={renderNoteItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.listContainer,
          { flexGrow: 1 } 
        ]}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>📝 Not bulunamadı</Text>
            <Text style={styles.emptySubText}>
              İlk notunuzu oluşturmak için "Not Ekle" butonuna dokunun
            </Text>
          </View>
        )}
      />

      <Modal
        animationType="fade" 
        transparent={true} 
        visible={showDeleteModal}
        onRequestClose={cancelDelete} 
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Notu Sil</Text>
            
            <Text style={styles.modalMessage}>
              Bu notu silmek istediğinizden emin misiniz?
            </Text>
            
            {noteToDelete && (
              <View style={styles.notePreview}>
                <Text style={styles.notePreviewTitle} numberOfLines={1}>
                  "{noteToDelete.title || 'Başlıksız Not'}"
                </Text>
                <Text style={styles.notePreviewContent} numberOfLines={2}>
                  {noteToDelete.content || 'İçerik bulunmuyor'}
                </Text>
              </View>
            )}

            <Text style={styles.modalWarning}>
              ⚠️ Bu işlem geri alınamaz!
            </Text>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={cancelDelete}
                activeOpacity={0.7}
                disabled={isDeletingNote} 
              >
                <Text style={styles.cancelButtonText}>İptal</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.modalButton, 
                  styles.confirmDeleteButton,
                  isDeletingNote && styles.disabledButton 
                ]}
                onPress={confirmDelete}
                activeOpacity={0.7}
                disabled={isDeletingNote} 
              >
                {isDeletingNote ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.confirmDeleteButtonText}>Sil</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="fade"
        transparent={true}
        visible={showLogoutModal}
        onRequestClose={cancelLogout}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Çıkış Yap</Text>
            
            <Text style={styles.modalMessage}>
              Uygulamadan çıkış yapmak istediğinizden emin misiniz?
            </Text>

            <Text style={styles.logoutWarning}>
              🔒 Tekrar giriş yapmanız gerekecek
            </Text>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={cancelLogout}
                activeOpacity={0.7}
              >
                <Text style={styles.cancelButtonText}>İptal</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.confirmLogoutButton]}
                onPress={confirmLogout}
                activeOpacity={0.7}
              >
                <Text style={styles.confirmLogoutButtonText}>Çıkış Yap</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5', 
  },
  
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  
  headerLeft: {
    flex: 1,
  },
  
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  
  addButton: {
    backgroundColor: '#007AFF', 
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  
  logoutButton: {
    backgroundColor: '#FF3B30',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  
  logoutButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 12,
  },
  
  listContainer: {
    padding: 16,
  },
  
  noteItem: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5, 
  },
  
  noteContent: {
    marginBottom: 12,
  },
  
  noteTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  
  noteText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 8,
  },
  
  noteDate: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
  },
  
  noteActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    minWidth: 80,
    alignItems: 'center',
  },
  
  editButton: {
    backgroundColor: '#34C759',
  },
  
  deleteButton: {
    backgroundColor: '#FF3B30',
  },
  
  actionButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  
  emptySubText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    paddingHorizontal: 20,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', 
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  modalContent: {
    backgroundColor: '#fff',
    margin: 20,
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 8,
    minWidth: Dimensions.get('window').width * 0.8, 
  },
  
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
    textAlign: 'center',
  },
  
  modalMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 22,
  },
  
  notePreview: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    width: '100%',
    borderLeftWidth: 4,
    borderLeftColor: '#FF3B30', 
  },
  
  notePreviewTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  
  notePreviewContent: {
    fontSize: 12,
    color: '#666',
    lineHeight: 16,
  },
  
  modalWarning: {
    fontSize: 14,
    color: '#FF3B30',
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: '500',
  },
  
  logoutWarning: {
    fontSize: 14,
    color: '#FF9500',
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: '500',
  },
  
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44, 
  },
  
  cancelButton: {
    backgroundColor: '#6c757d',
  },
  
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  
  confirmDeleteButton: {
    backgroundColor: '#FF3B30',
  },
  
  confirmDeleteButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  
  confirmLogoutButton: {
    backgroundColor: '#FF3B30',
  },
  
  confirmLogoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  
  disabledButton: {
    backgroundColor: '#ccc',
    opacity: 0.7,
  },
});

export default NoteScreen;