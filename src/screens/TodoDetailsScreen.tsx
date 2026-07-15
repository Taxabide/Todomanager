import React, {useState, useMemo} from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Modal,
  KeyboardAvoidingView,
  Platform,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AppStackParamList, Todo, Priority, FilterMode, SortMode} from '../types';
import {useTodos} from '../hooks/useTodos';
import {useDebounce} from '../hooks/useDebounce';
import {searchItems, filterTodos, sortTodos, getPriorityColor} from '../utils/helpers';
import {validateTitle, validateDescription} from '../utils/validators';
import {Header} from '../components/Header';
import {TodoCard} from '../components/TodoCard';
import {SearchBar} from '../components/SearchBar';
import {FloatingButton} from '../components/FloatingButton';
import {EmptyState} from '../components/EmptyState';
import {Input} from '../components/Input';
import {Button} from '../components/Button';
import {Colors, Spacing, Typography, BorderRadius, IconSize} from '../theme';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type Props = NativeStackScreenProps<AppStackParamList, 'TodoDetails'>;

export const TodoDetailsScreen: React.FC<Props> = ({route, navigation}) => {
  const {listId, listTitle} = route.params;
  const {lists, addNewTodo, editTodo, removeTodo, toggleTodoComplete} = useTodos();

  const list = lists.find(l => l.id === listId);
  const todos = list?.todos || [];

  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 300);
  const [filterMode, setFilterMode] = useState<FilterMode>(FilterMode.ALL);
  const [sortMode, setSortMode] = useState<SortMode>(SortMode.NEWEST);
  const [showOptions, setShowOptions] = useState(false);

  // Modal State
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  
  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>(Priority.NONE);
  const [dueDate, setDueDate] = useState('');
  
  const [errors, setErrors] = useState<{title?: string; description?: string}>({});

  const processedTodos = useMemo(() => {
    let result = searchItems(todos, debouncedSearch);
    result = filterTodos(result, filterMode);
    result = sortTodos(result, sortMode);
    return result;
  }, [todos, debouncedSearch, filterMode, sortMode]);

  const handleOpenModal = (todo?: Todo) => {
    if (todo) {
      setEditingTodo(todo);
      setTitle(todo.title);
      setDescription(todo.description);
      setPriority(todo.priority);
      setDueDate(todo.dueDate || '');
    } else {
      setEditingTodo(null);
      setTitle('');
      setDescription('');
      setPriority(Priority.NONE);
      setDueDate('');
    }
    setErrors({});
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setEditingTodo(null);
  };

  const handleSaveTodo = async () => {
    const titleValidation = validateTitle(title);
    const descValidation = validateDescription(description);

    if (!titleValidation.isValid || !descValidation.isValid) {
      setErrors({
        title: titleValidation.error,
        description: descValidation.error,
      });
      return;
    }

    const formattedDueDate = dueDate ? new Date(dueDate).toISOString() : null;

    if (editingTodo) {
      await editTodo(listId, {
        ...editingTodo,
        title,
        description,
        priority,
        dueDate: formattedDueDate,
      });
    } else {
      await addNewTodo(listId, title, description, priority, formattedDueDate);
    }
    handleCloseModal();
  };

  const renderPrioritySelector = () => {
    const priorities = [
      {value: Priority.NONE, label: 'None'},
      {value: Priority.LOW, label: 'Low'},
      {value: Priority.MEDIUM, label: 'Medium'},
      {value: Priority.HIGH, label: 'High'},
    ];

    return (
      <View style={styles.priorityContainer}>
        <Text style={styles.inputLabel}>Priority</Text>
        <View style={styles.priorityRow}>
          {priorities.map(p => {
            const isSelected = priority === p.value;
            const color = getPriorityColor(p.value);
            return (
              <TouchableOpacity
                key={p.value}
                style={[
                  styles.priorityButton,
                  isSelected && {borderColor: color, backgroundColor: `${color}15`},
                ]}
                onPress={() => setPriority(p.value)}>
                <View style={[styles.priorityDot, {backgroundColor: color}]} />
                <Text
                  style={[
                    styles.priorityText,
                    isSelected && {color, fontWeight: '600'},
                  ]}>
                  {p.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  };

  const renderOptionsRow = () => (
    <View style={styles.optionsRow}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.chipGroup}>
          <Text style={styles.chipGroupLabel}>Filter:</Text>
          {(Object.values(FilterMode) as FilterMode[]).map(mode => (
            <TouchableOpacity
              key={`filter-${mode}`}
              style={[styles.chip, filterMode === mode && styles.chipActive]}
              onPress={() => setFilterMode(mode)}>
              <Text
                style={[
                  styles.chipText,
                  filterMode === mode && styles.chipTextActive,
                ]}>
                {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.divider} />
        <View style={styles.chipGroup}>
          <Text style={styles.chipGroupLabel}>Sort:</Text>
          {(Object.values(SortMode) as SortMode[]).map(mode => (
            <TouchableOpacity
              key={`sort-${mode}`}
              style={[styles.chip, sortMode === mode && styles.chipActive]}
              onPress={() => setSortMode(mode)}>
              <Text
                style={[
                  styles.chipText,
                  sortMode === mode && styles.chipTextActive,
                ]}>
                {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );

  if (!list) {
    return (
      <View style={styles.container}>
        <Header title="List not found" onBack={() => navigation.goBack()} />
        <EmptyState
          icon="alert-circle-outline"
          title="List Not Found"
          subtitle="This list may have been deleted."
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header
        title={listTitle}
        onBack={() => navigation.goBack()}
        rightIcon={showOptions ? 'filter-variant-minus' : 'filter-variant'}
        onRightPress={() => setShowOptions(!showOptions)}
      />

      <View style={styles.searchContainer}>
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search todos..."
        />
      </View>

      {showOptions && renderOptionsRow()}

      <FlatList
        data={processedTodos}
        renderItem={({item}) => (
          <TodoCard
            todo={item}
            onToggle={() => toggleTodoComplete(listId, item.id)}
            onPress={() => handleOpenModal(item)}
            onDelete={() => removeTodo(listId, item.id)}
          />
        )}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <EmptyState
            icon={todos.length === 0 ? 'clipboard-text-outline' : 'file-search-outline'}
            title={todos.length === 0 ? 'No tasks yet' : 'No matches found'}
            subtitle={
              todos.length === 0
                ? 'Add your first task to this list.'
                : 'Try adjusting your search or filters.'
            }
          />
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
          <ScrollView
            contentContainerStyle={styles.modalScroll}
            bounces={false}
            keyboardShouldPersistTaps="handled">
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>
                  {editingTodo ? 'Edit Task' : 'New Task'}
                </Text>
                <TouchableOpacity onPress={handleCloseModal} style={styles.closeButton}>
                  <Icon name="close" size={24} color={Colors.textSecondary} />
                </TouchableOpacity>
              </View>

              <Input
                label="Task Title"
                placeholder="What needs to be done?"
                value={title}
                onChangeText={t => {
                  setTitle(t);
                  if (errors.title) setErrors({...errors, title: undefined});
                }}
                error={errors.title}
                autoFocus={!editingTodo}
              />

              <Input
                label="Description (Optional)"
                placeholder="Add details..."
                value={description}
                onChangeText={t => {
                  setDescription(t);
                  if (errors.description) setErrors({...errors, description: undefined});
                }}
                error={errors.description}
                multiline
                numberOfLines={3}
                style={styles.textArea}
              />

              <Input
                label="Due Date (Optional)"
                placeholder="YYYY-MM-DD"
                value={dueDate}
                onChangeText={setDueDate}
                leftIcon="calendar"
              />

              {renderPrioritySelector()}

              <View style={styles.modalActions}>
                <Button
                  title="Cancel"
                  variant="outline"
                  onPress={handleCloseModal}
                  style={styles.modalButton}
                />
                <Button
                  title="Save"
                  onPress={handleSaveTodo}
                  style={styles.modalButton}
                />
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  searchContainer: {
    paddingBottom: Spacing.xs,
  },
  optionsRow: {
    backgroundColor: Colors.surface,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
    marginBottom: Spacing.sm,
  },
  chipGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  chipGroupLabel: {
    ...Typography.caption,
    color: Colors.textSecondary,
    fontWeight: '600',
    marginRight: Spacing.xs,
  },
  divider: {
    width: 1,
    height: 24,
    backgroundColor: Colors.border,
    marginHorizontal: Spacing.md,
  },
  chip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surfaceSecondary,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  chipActive: {
    backgroundColor: Colors.primarySurface,
    borderColor: Colors.primaryLight,
  },
  chipText: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  chipTextActive: {
    color: Colors.primaryDark,
    fontWeight: '600',
  },
  listContent: {
    flexGrow: 1,
    paddingTop: Spacing.sm,
    paddingBottom: 100,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: Colors.overlay,
    justifyContent: 'flex-end',
  },
  modalScroll: {
    flexGrow: 1,
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
  textArea: {
    height: 80,
    textAlignVertical: 'top',
    paddingTop: Spacing.md,
  },
  inputLabel: {
    ...Typography.bodySm,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  priorityContainer: {
    marginBottom: Spacing.xxl,
  },
  priorityRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    flexWrap: 'wrap',
  },
  priorityButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    gap: Spacing.sm,
  },
  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  priorityText: {
    ...Typography.bodySm,
    color: Colors.textSecondary,
  },
  modalActions: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  modalButton: {
    flex: 1,
  },
});
