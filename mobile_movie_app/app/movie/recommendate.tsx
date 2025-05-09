import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Link } from 'expo-router'

const Recommendate = () => {
  return (
  <Link href={`/movie/recommendate`} asChild>
      <Text>Recommendate</Text>
    </Link>
  )
}

export default Recommendate

const styles = StyleSheet.create({})