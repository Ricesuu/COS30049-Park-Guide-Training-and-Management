import React from "react";
import { Text, Pressable } from "react-native";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
} from "react-native-reanimated";

export default function AnimatedButton({ label, onPress, className = "" }) {
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    return (
        <Pressable
            onPressIn={() => (scale.value = withSpring(0.95))}
            onPressOut={() => (scale.value = withSpring(1))}
            onPress={onPress}
        >
            <Animated.View
                style={animatedStyle}
                className={`rounded py-4 items-center ${className}`}
            >
                <Text className="text-white font-semibold text-base">
                    {label}
                </Text>
            </Animated.View>
        </Pressable>
    );
}
