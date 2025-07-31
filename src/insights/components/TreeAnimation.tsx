import React, { useEffect, useRef } from 'react';
import { Animated, Image, StyleSheet, View } from 'react-native';

const stageImages = {
  0: require('../../assets/tree/0.png'),
  20: require('../../assets/tree/20.png'),
  40: require('../../assets/tree/40.png'),
  60: require('../../assets/tree/60.png'),
  80: require('../../assets/tree/80.png'),
  100: require('../../assets/tree/100.png'),
};

const getClosestStage = (percentage: number) => {
  if (percentage <= 0) return 0;
  if (percentage <= 20) return 20;
  if (percentage <= 40) return 40;
  if (percentage <= 60) return 60;
  if (percentage <= 80) return 80;
  return 100;
};

const TreeGrowth = ({ percentage }: { percentage: number }) => {
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const previousStage = useRef(getClosestStage(percentage));

  const currentStage = getClosestStage(percentage);

  useEffect(() => {
    if (previousStage.current !== currentStage) {
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      previousStage.current = currentStage;
    }
  }, [currentStage]);

  return (
    <View style={styles.container}>
      <Animated.Image
        source={stageImages[currentStage]}
        style={[styles.image, { opacity: fadeAnim }]}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 300,
    width: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    height: '100%',
    width: '100%',
  },
});

export default TreeGrowth;
