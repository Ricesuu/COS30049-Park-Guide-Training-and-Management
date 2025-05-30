import React from "react";
import { View, Image, Dimensions } from "react-native";
import Carousel from "react-native-reanimated-carousel";

export default function ImageCarousel({ images }) {
    const { width } = Dimensions.get("window");

    if (!images || images.length === 0) return null;

    return (
        <View className="h-[40vh] w-full">
            <Carousel
                width={width}
                height={width * 1.0}
                autoPlay
                autoPlayInterval={4000}
                data={images}
                scrollAnimationDuration={800}
                renderItem={({ item }) => (
                    <Image
                        source={item}
                        resizeMode="cover"
                        className="w-full h-full object-cover"
                    />
                )}
                loop
                enabled={false} // 👈 disables user swipe/scroll
            />
        </View>
    );
}
