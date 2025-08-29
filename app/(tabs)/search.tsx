import {View, Text, Button, FlatList} from 'react-native'
import React, {useEffect} from 'react'
import {SafeAreaView} from "react-native-safe-area-context";
import seed from "@/lib/seed";
import useAppwrite from "@/lib/useAppwrite";
import {getCategories, getMenu} from "@/lib/appwrite";
import {useLocalSearchParams} from "expo-router";
import CartButton from "@/components/CartButton";
import cn from "clsx";
import MenuCard from "@/components/MenuCard";
import {Category, MenuItem} from "@/type";
import Filter from "@/components/Filter";
import SearchBar from "@/components/SearchBar";

const Search = () => {
    const {category, query} = useLocalSearchParams<{query: string, category: string}>()
    const {data, refetch, loading} = useAppwrite({ fn: getMenu, params: { category, query, limit: 6 }})
    const {data: categories}  = useAppwrite({ fn: getCategories })

    useEffect(() => {
        refetch({category, query, limit: 6})
    }, [category, query])

    return (
        <SafeAreaView className="bg-white h-full">
            <View className="m-5 gap-5">
            <SearchBar />
            <Filter categories={categories as unknown as Category[]} />
                <Text className="paragraph-bold mt-3 mb-2">Popular Items</Text>
                <FlatList
                data={data ?? []}
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
        </SafeAreaView>

    )
}
export default Search
