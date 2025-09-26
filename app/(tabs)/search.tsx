import {View, Text, Button, FlatList} from 'react-native'
import React, {useEffect} from 'react'
import {SafeAreaView} from "react-native-safe-area-context";
import seed from "@/services/appwrite/seed";
import useAppwrite from "@/services/appwrite/useAppwrite";
import {useLocalSearchParams} from "expo-router";
import CartButton from "@/components/CartButton";
import cn from "clsx";
import MenuCard from "@/components/MenuCard";
import {Category, MenuItem} from "@/type";
import Filter from "@/components/Filter";
import SearchBar from "@/components/SearchBar";
import {getAllMenus, getCategories, getMostPopularMenu, getTopRatedMenu} from "@/services/appwrite";
import MenuList from "@/components/MenuList";
import LoadingView from "@/components/LoadingView";

const Search = () => {
    const {category, query} = useLocalSearchParams<{query: string, category: string}>()
    const {data, refetch, loading} = useAppwrite({ fn: getAllMenus, params: { category, query, limit: 6 }})
    const {data: categories}  = useAppwrite({ fn: getCategories })

    const {data: popularItems} = useAppwrite({fn: getMostPopularMenu })
    const {data: topItems} = useAppwrite({fn: getTopRatedMenu})

    useEffect(() => {
        refetch({category, query, limit: 6})
    }, [category, query])

    if (loading) {
        return <LoadingView message="Cargando productos..." />;
    }

    return (
        <SafeAreaView className="bg-white h-full">
            <View className="m-5 gap-5">
            <SearchBar />
            <Filter categories={categories as unknown as Category[]} />
                <MenuList items={popularItems} title="Los más populares" loading={loading} />
                <MenuList items={topItems} title="Los más valorados" loading={loading}/>
            </View>
        </SafeAreaView>

    )
}
export default Search
