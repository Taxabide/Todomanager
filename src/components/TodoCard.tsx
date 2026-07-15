import React, {useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  PanResponder,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Colors, Spacing, BorderRadius, Typography, IconSize} from '../theme';
import {Todo} from '../types';
import {
  getPriorityColor,
  getPriorityBgColor,
  getPriorityLabel,
  formatDueDate,
  isDueDateOverdue,
} from '../utils/helpers';

interface TodoCardProps {
  todo: Todo;
  onToggle: () => void;
  onPress: () => void;
  onDelete: () => void;
}

export const TodoCard: React.FC<TodoCardProps> = ({
  todo,
  onToggle,
  onPress,
  onDelete,
}) => {
  const translateX = useRef(new Animated.Value(0)).current;
  const deleteOpacity = useRef(new Animated.Value(0)).current;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dx) > 10 && Math.abs(gestureState.dy) < 10;
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dx < 0) {
          translateX.setValue(Math.max(gestureState.dx, -100));
          deleteOpacity.setValue(Math.min(Math.abs(gestureState.dx) / 80, 1));
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx < -80) {
          Animated.timing(translateX, {
            toValue: -100,
            duration: 200,
            useNativeDriver: true,
          }).start();
        } else {
          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: true,
            bounciness: 8,
          }).start();
          Animated.timing(deleteOpacity, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }).start();
        }
      },
    }),
  ).current;

  const resetSwipe = () => {
    Animated.spring(translateX, {
      toValue: 0,
      useNativeDriver: true,
    }).start();
    Animated.timing(deleteOpacity, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const handleDelete = () => {
    resetSwipe();
    onDelete();
  };

  const priorityColor = getPriorityColor(todo.priority);
  const priorityBgColor = getPriorityBgColor(todo.priority);
  const dueDateText = formatDueDate(todo.dueDate);
  const isOverdue = isDueDateOverdue(todo.dueDate) && !todo.completed;

  return (
    <View style={styles.wrapper}>
      <Animated.View style={[styles.deleteBackground, {opacity: deleteOpacity}]}>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={handleDelete}
          activeOpacity={0.8}>
          <Icon name="trash-can-outline" size={IconSize.lg} color={Colors.white} />
          <Text style={styles.deleteText}>Delete</Text>
        </TouchableOpacity>
      </Animated.View>

      <Animated.View
        style={[styles.container, {transform: [{translateX}]}]}
        {...panResponder.panHandlers}>
        <TouchableOpacity
          style={styles.content}
          onPress={onPress}
          activeOpacity={0.7}>
          <TouchableOpacity
            style={[
              styles.checkbox,
              todo.completed && styles.checkboxChecked,
            ]}
            onPress={onToggle}
            activeOpacity={0.7}>
            {todo.completed && (
              <Icon name="check" size={14} color={Colors.white} />
            )}
          </TouchableOpacity>

          <View style={styles.textContainer}>
            <Text
              style={[styles.title, todo.completed && styles.titleCompleted]}
              numberOfLines={1}>
              {todo.title}
            </Text>
            {todo.description ? (
              <Text style={styles.description} numberOfLines={1}>
                {todo.description}
              </Text>
            ) : null}
            <View style={styles.metaRow}>
              <View
                style={[
                  styles.priorityBadge,
                  {backgroundColor: priorityBgColor},
                ]}>
                <View
                  style={[styles.priorityDot, {backgroundColor: priorityColor}]}
                />
                <Text style={[styles.priorityText, {color: priorityColor}]}>
                  {getPriorityLabel(todo.priority)}
                </Text>
              </View>
              {dueDateText ? (
                <View
                  style={[
                    styles.dueDateBadge,
                    isOverdue && styles.dueDateOverdue,
                  ]}>
                  <Icon
                    name="calendar-clock"
                    size={12}
                    color={isOverdue ? Colors.danger : Colors.textSecondary}
                  />
                  <Text
                    style={[
                      styles.dueDateText,
                      isOverdue && styles.dueDateTextOverdue,
                    ]}>
                    {dueDateText}
                  </Text>
                </View>
              ) : null}
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
  },
  deleteBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.danger,
    borderRadius: BorderRadius.lg,
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingRight: Spacing.xl,
  },
  deleteButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteText: {
    ...Typography.caption,
    color: Colors.white,
    marginTop: 2,
    fontWeight: '600',
  },
  container: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    shadowColor: Colors.shadow,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: Spacing.lg,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: BorderRadius.sm,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: Colors.success,
    borderColor: Colors.success,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    ...Typography.bodyMedium,
    color: Colors.text,
    marginBottom: 4,
  },
  titleCompleted: {
    textDecorationLine: 'line-through',
    color: Colors.textTertiary,
  },
  description: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    flexWrap: 'wrap',
  },
  priorityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
    gap: 4,
  },
  priorityDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  priorityText: {
    ...Typography.caption,
    fontWeight: '600',
  },
  dueDateBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dueDateOverdue: {},
  dueDateText: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  dueDateTextOverdue: {
    color: Colors.danger,
    fontWeight: '600',
  },
});
