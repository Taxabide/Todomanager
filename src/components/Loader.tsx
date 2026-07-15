import React from 'react';
import {View, ActivityIndicator, StyleSheet, Text} from 'react-native';
import {Colors, Typography, Spacing} from '../theme';

interface LoaderProps {
  message?: string;
  fullScreen?: boolean;
  size?: 'small' | 'large';
  color?: string;
}

export const Loader: React.FC<LoaderProps> = ({
  message,
  fullScreen = false,
  size = 'large',
  color = Colors.primary,
}) => {
  if (fullScreen) {
    return (
      <View style={styles.fullScreen}>
        <View style={styles.loaderCard}>
          <ActivityIndicator size={size} color={color} />
          {message && <Text style={styles.message}>{message}</Text>}
        </View>
      </View>
    );
  }

  return (
    <View style={styles.inline}>
      <ActivityIndicator size={size} color={color} />
      {message && <Text style={styles.message}>{message}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  fullScreen: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.overlay,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
  },
  loaderCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: Spacing.xxxl,
    alignItems: 'center',
    shadowColor: Colors.shadow,
    shadowOffset: {width: 0, height: 8},
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 8,
    minWidth: 120,
  },
  inline: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xxxl,
  },
  message: {
    ...Typography.bodySm,
    color: Colors.textSecondary,
    marginTop: Spacing.md,
    textAlign: 'center',
  },
});
