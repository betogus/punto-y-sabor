import {View, Text, FlatList} from 'react-native'
import React from 'react'
import MenuCard from "@/components/MenuCard";
import {MenuItem} from "@/type";

const MenuList = ({items, title, loading}: any) => {
    return (
        <View>
            <Text className="text-2xl font-bold my-4">{title}</Text>
            <FlatList
                data={items ?? []}
                keyExtractor={(item) => item.$id + "-horizontal"}

                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerClassName="px-5"
                renderItem={({ item }) => (
                    <View className="mr-3">
                        <MenuCard item={item as unknown as MenuItem} />
                    </View>
                )}
                ListEmptyComponent={() => !loading && <Text>No items found.</Text>}
            />
        </View>
    )
}
export default MenuList
