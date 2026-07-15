import React, {useEffect, useState, useCallback} from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  Modal,
  KeyboardAvoidingView,
  Platform,
  Text,
  TouchableOpacity,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AppStackParamList, TodoList} from '../types';
import {useTodos} from '../hooks/useTodos';
import {useAuth} from '../hooks/useAuth';
import {useDebounce} from '../hooks/useDebounce';
import {searchItems} from '../utils/helpers';
import {validateTitle} from '../utils/validators';
import {Header} from '../components/Header';
import {ListCard} from '../components/ListCard';
import {SearchBar} from '../components/SearchBar';
import {FloatingButton} from '../components/FloatingButton';
import {EmptyState} from '../components/EmptyState';
import {ConfirmModal} from '../components/ConfirmModal';
import {Input} from '../components/Input';
import {Button} from '../components/Button';
import {Colors, Spacing, Typography, BorderRadius} from '../theme';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type Props = NativeStackScreenProps<AppStackParamList, 'TodoLists'>;

export const TodoListsScreen: React.FC<Props> = ({navigation}) => {
  const {lists, loadLists, addNewList, editList, removeList, isLoading} = useTodos();
  const {user, logout, isLoading: isAuthLoading} = useAuth();

  const userInitials = user?.displayName
    ? user.displayName
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : user?.email
    ? user.email[0].toUpperCase()
    : '?';

  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 300);

  const [isRefreshing, setIsRefreshing] = useState(false);

  // Modal State
  const [modalVisible, setModalVisible] = useState(false);
  const [editingList, setEditingList] = useState<TodoList | null>(null);
  const [listTitle, setListTitle] = useState('');
  const [titleError, setTitleError] = useState<string>();

  // Delete Confirm State
  const [deleteVisible, setDeleteVisible] = useState(false);
  const [listToDelete, setListToDelete] = useState<TodoList | null>(null);

  // Logout Confirm State
  const [logoutVisible, setLogoutVisible] = useState(false);

  const handleLogoutPress = () => {
    setLogoutVisible(true);
  };

  const confirmLogout = async () => {
    setLogoutVisible(false);
    await logout();
  };

  useEffect(() => {
    loadLists();
  }, [loadLists]);

  const onRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await loadLists();
    setIsRefreshing(false);
  }, [loadLists]);

  const filteredLists = searchItems(lists, debouncedSearch);

  const handleOpenModal = (list?: TodoList) => {
    if (list) {
      setEditingList(list);
      setListTitle(list.title);
    } else {
      setEditingList(null);
      setListTitle('');
    }
    setTitleError(undefined);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setEditingList(null);
    setListTitle('');
    setTitleError(undefined);
  };

  const handleSaveList = async () => {
    const validation = validateTitle(listTitle);
    if (!validation.isValid) {
      setTitleError(validation.error);
      return;
    }

    if (editingList) {
      await editList(editingList.id, listTitle);
    } else {
      await addNewList(listTitle);
    }
    handleCloseModal();
  };

  const handleLongPress = (list: TodoList) => {
    setListToDelete(list);
    setDeleteVisible(true);
  };

  const confirmDelete = async () => {
    if (listToDelete) {
      await removeList(listToDelete.id);
      setDeleteVisible(false);
      setListToDelete(null);
    }
  };

  const renderItem = ({item}: {item: TodoList}) => (
    <ListCard
      list={item}
      onPress={() =>
        navigation.navigate('TodoDetails', {
          listId: item.id,
          listTitle: item.title,
        })
      }
      onLongPress={() => handleLongPress(item)}
    />
  );

  return (
    <View style={styles.container}>
      <Header
        title="My Lists"
        rightComponent={
          <View style={styles.avatarBadge}>
            <Text style={styles.avatarText}>{userInitials}</Text>
          </View>
        }
        rightIcon="logout"
        onRightPress={handleLogoutPress}
      />

      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Search lists..."
      />

      <FlatList
        data={filteredLists}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            colors={[Colors.primary]}
          />
        }
        ListEmptyComponent={
          !isLoading ? (
            <EmptyState
              icon={searchQuery ? 'file-search-outline' : 'playlist-plus'}
              title={searchQuery ? 'No results found' : 'No lists yet'}
              subtitle={
                searchQuery
                  ? `No lists matching "${searchQuery}"`
                  : 'Create your first list to get started.'
              }
              action={
                !searchQuery && (
                  <Button
                    title="Create List"
                    onPress={() => handleOpenModal()}
                    icon={<Icon name="plus" size={20} color={Colors.white} />}
                  />
                )
              }
            />
          ) : null
        }
      />

      <FloatingButton onPress={() => handleOpenModal()} />

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={handleCloseModal}>
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingList ? 'Edit List' : 'New List'}
              </Text>
              <TouchableOpacity onPress={handleCloseModal} style={styles.closeButton}>
                <Icon name="close" size={24} color={Colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <Input
              label="List Title"
              placeholder="e.g., Groceries, Work Projects"
              value={listTitle}
              onChangeText={(text) => {
                setListTitle(text);
                if (titleError) setTitleError(undefined);
              }}
              error={titleError}
              autoFocus
            />

            <View style={styles.modalActions}>
              <Button
                title="Cancel"
                variant="outline"
                onPress={handleCloseModal}
                style={styles.modalButton}
              />
              <Button
                title="Save"
                onPress={handleSaveList}
                style={styles.modalButton}
              />
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      <ConfirmModal
        visible={deleteVisible}
        title="Delete List"
        message={`Are you sure you want to delete "${listToDelete?.title}"? All todos inside will be lost.`}
        confirmText="Delete"
        isDanger
        onConfirm={confirmDelete}
        onCancel={() => setDeleteVisible(false)}
      />

      <ConfirmModal
        visible={logoutVisible}
        title="Log Out"
        message="Are you sure you want to log out? You will need to sign in again to access your lists."
        confirmText="Log Out"
        cancelText="Stay"
        isDanger
        isLoading={isAuthLoading}
        onConfirm={confirmLogout}
        onCancel={() => setLogoutVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  listContent: {
    flexGrow: 1,
    paddingTop: Spacing.sm,
    paddingBottom: 100, // Space for FAB
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: Colors.overlay,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    padding: Spacing.xl,
    paddingBottom: Platform.OS === 'ios' ? 40 : Spacing.xl,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  modalTitle: {
    ...Typography.h2,
    color: Colors.text,
  },
  closeButton: {
    padding: Spacing.xs,
  },
  modalActions: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginTop: Spacing.sm,
  },
  modalButton: {
    flex: 1,
  },
  avatarBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.35,
    shadowRadius: 4,
    elevation: 4,
  },
  avatarText: {
    ...Typography.caption,
    color: Colors.white,
    fontWeight: '700',
    fontSize: 13,
    letterSpacing: 0.5,
  },
});
