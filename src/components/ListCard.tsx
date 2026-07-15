import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Colors, Spacing, BorderRadius, Typography, IconSize} from '../theme';
import {TodoList} from '../types';
import {getCompletedCount, formatDate} from '../utils/helpers';
import {ProgressBar} from './ProgressBar';

interface ListCardProps {
  list: TodoList;
  onPress: () => void;
  onLongPress: () => void;
}

export const ListCard: React.FC<ListCardProps> = ({
  list,
  onPress,
  onLongPress,
}) => {
  const totalTodos = list.todos.length;
  const completedTodos = getCompletedCount(list.todos);
  const progress = totalTodos > 0 ? completedTodos / totalTodos : 0;

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      onLongPress={onLongPress}
      activeOpacity={0.7}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Icon
            name="clipboard-text-outline"
            size={IconSize.md}
            color={Colors.primary}
          />
        </View>
        <Icon
          name="chevron-right"
          size={IconSize.md}
          color={Colors.textTertiary}
        />
      </View>

      <Text style={styles.title} numberOfLines={2}>
        {list.title}
      </Text>

      <View style={styles.statsRow}>
        <Text style={styles.statsText}>
          {completedTodos} / {totalTodos} completed
        </Text>
        <Text style={styles.dateText}>{formatDate(list.updatedAt)}</Text>
      </View>

      {totalTodos > 0 && (
        <ProgressBar progress={progress} style={styles.progressBar} />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
    shadowColor: Colors.shadow,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.primarySurface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    ...Typography.h3,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  statsText: {
    ...Typography.bodySm,
    color: Colors.textSecondary,
  },
  dateText: {
    ...Typography.caption,
    color: Colors.textTertiary,
  },
  progressBar: {
    marginTop: Spacing.xs,
  },
});
