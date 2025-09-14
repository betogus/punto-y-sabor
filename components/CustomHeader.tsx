import { useRouter } from "expo-router";
import { Image, Text, TouchableOpacity, View } from "react-native";

import { CustomHeaderProps } from "@/type";
import {images} from "@/constants";

const CustomHeader = ({ title }: CustomHeaderProps) => {
    const router = useRouter();

    return (
        <View className="custom-header">
            <TouchableOpacity style={{position: "absolute", left: 10}} onPress={() => router.back()}>
                <Image
                    source={images.arrowBack}
                    className="size-5"
                    resizeMode="contain"
                />
            </TouchableOpacity>

            {title && <Text className="base-semibold text-dark-100">{title}</Text>}

        </View>
    );
};

export default CustomHeader;