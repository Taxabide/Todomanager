import React, {useRef} from 'react';
import {StyleSheet, Animated, TouchableWithoutFeedback} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Colors, BorderRadius, IconSize} from '../theme';

interface FloatingButtonProps {
  onPress: () => void;
  icon?: string;
  color?: string;
  bottom?: number;
  right?: number;
}

export const FloatingButton: React.FC<FloatingButtonProps> = ({
  onPress,
  icon = 'plus',
  color = Colors.primary,
  bottom = 24,
  right = 24,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.9,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  return (
    <TouchableWithoutFeedback
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}>
      <Animated.View
        style={[
          styles.container,
          {backgroundColor: color, bottom, right, transform: [{scale: scaleAnim}]},
        ]}>
        <Icon name={icon} size={IconSize.xl} color={Colors.white} />
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.shadow,
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 99,
  },
});
