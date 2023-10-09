import React from 'react';
import { Text, View, StyleSheet } from 'react-native';

const MyEvents = ({ params }) => {
  return (
    <View style={styles.container}>
      <Text style={{ color: '#000', fontSize: 30 }}>My Favourites</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MyEvents;
