
import React, { useState, useEffect } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import moment from 'moment';
import {
  Text,
  View,
  StyleSheet,
  Button,
  TextInput,
  SafeAreaView,
  ScrollView,
  FlatList,
  ImageBackground,
  TouchableWithoutFeedback,
} from 'react-native';
import styled from 'styled-components/native';
import {  FONTS, SIZES, COLORS, images } from '../constants';
import { McText, McIcon, McAvatar } from '../components';
import * as Location from 'expo-location';

const Home = ({ navigation }) => {

   const [currentDate, setCurrentDate] = useState('');
  const [filteredDataSource, setFilteredDataSource] = useState([]);

  useEffect(() => {
    var date = moment()
                  
                  .format(' hh:mm:ss a');
    setCurrentDate(date);
  }, []);

  useEffect(() => {
    fetch('https://where2go-07jw.onrender.com/api/places')
      .then((response) => response.json())
      .then((responseJson) => {
        setFilteredDataSource(responseJson);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  

  

   const [locationServiceEnabled, setLocationServiceEnabled] = useState(false);

  const [displayCurrentAddress, setDisplayCurrentAddress] = useState(
    ''
  );

  useEffect(() => {
    CheckIfLocationEnabled();
    GetCurrentLocation();
  }, []);

  const CheckIfLocationEnabled = async () => {
    let enabled = await Location.hasServicesEnabledAsync();

    if (!enabled) {
      Alert.alert(
        'Location Service not enabled',
        'Please enable your location services to continue',
        [{ text: 'OK' }],
        { cancelable: false }
      );
    } else {
      setLocationServiceEnabled(enabled);
    }
  };

  const GetCurrentLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert(
        'Permission not granted',
        'Allow the app to use location service.',
        [{ text: 'OK' }],
        { cancelable: false }
      );
    }

    let { coords } = await Location.getCurrentPositionAsync();

    if (coords) {
      const { latitude, longitude } = coords;
      let response = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      for (let item of response) {
        // console.log(item)
        let address = `${item.city}, ${item.country}`;

        setDisplayCurrentAddress(address);

        if (address.length > 0) {
          setTimeout(() => {
            navigation.navigate('Home', { item: address });
          }, 2000);
        }
      }
    }
  };







  const _renderItem = ({ item, index }) => {
    return (
      <TouchableWithoutFeedback
        onPress={() => {
          navigation.navigate('EventDetail', { selectedEvent: item });
        }}>
        <View
          style={{
            marginLeft: index === 0 ? 30 : 20,
            marginRight: index === filteredDataSource.length - 1 ? 30 : 0,
          }}>
          <ImageBackground
            source={{ uri: 'https://where2go-07jw.onrender.com/assets/images/' + item.image }}
            resizeMode="cover"
            borderRadius={SIZES.radius}
            style={{
              width: SIZES.width / 2 + 70,
              height: SIZES.width / 2 + 70,
              justifyContent: 'space-between',
            }}>
            <View
              style={{
                alignItems: 'flex-end',
                marginHorizontal: 15,
                marginVertical: 15,
              }}>
              <DateBox>
              <McText
                body5
                color={COLORS.black}
                style={{ opacity: 0.5, letterSpacing: 0.5 }}>
               Opens At
              </McText>
              <McText body4 color={COLORS.black}>
                {moment(item.startingTime).format('h:mm a')}
              </McText>
            </DateBox>
              </View>
            
            <View
              style={{
                marginLeft: 20,
                marginBottom: 25,
              }}>
              <McText body5 style={{ opacity: 0.5 }}>
                {item.type}
              </McText>
              <McText h2>{item.title}</McText>
            </View>
          </ImageBackground>
        </View>
      </TouchableWithoutFeedback>
    );
  };

  return (
    <ScrollView>
    <SafeAreaView style={styles.container}>
      {/* Header Section */}
      <SectionHeader>
        <View>
          <McText h5 color={COLORS.black} style={{ opacity: 0.5 }}>
            {currentDate}
            </McText>
             <McText h4 color={COLORS.black} style={{ opacity: 0.5 }}>
            {displayCurrentAddress}
          </McText>
        </View>
        <McAvatar source={images.avatar} />
      </SectionHeader>

      {/* Featured Section */}
      <SectionTitle>
        <McText h2 color={COLORS.black}>
          FEATURED PLACES
        </McText>
      </SectionTitle>
      <View>
        <FlatList
          horizontal
          contentContainerStyle={{}}
          showsHorizontalScrollIndicator={false}
          keyExtractor={( item,index ) => 'event_' + item.id}
          data={filteredDataSource}
          renderItem={_renderItem}>
        </FlatList>
      </View>
      {/* Discover Section */}
      <SectionTitle>
        <McText h5 color={COLORS.black}>
          DISCOVER
        </McText>
      </SectionTitle>
      <LinearGradient
        colors={COLORS.linear}
        start={{ x: 0, y: 1 }}
        end={{ x: 1, y: 1 }}
        style={{
          height: 120,
          marginHorizontal: 30,
          borderRadius: SIZES.radius,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <View
          style={{
            flexDirection: 'row',
            marginHorizontal: 30,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View style={{ marginLeft: 2, 
           justifyContent: 'center',
            alignItems: 'center',
          }}>
    
            <McText h3 style={{
            marginLeft: 22,
            alignItems: 'center',
            
            }}>Discover  {'\n'}
            Where2Goo in {'\n'}
              {displayCurrentAddress}
            </McText>
          </View>
        </View>
      </LinearGradient>
    </SafeAreaView>
    </ScrollView>
  );
};

const SectionHeader = styled.View`
padding: 16px ${SIZES.padding};
justify-content: space-between;
align-items: center;
font-color: #000;
flex-direction: row;
`;

const SectionSearch = styled.View`
margin: 4px ${SIZES.padding};
height: 50px;
background-color: ${COLORS.input};
border-radius:15px;
`;

const SearchView = styled.View`
flex-direction: row;
justify-content: space-between;
align-items: center;
margin-left: 9px;
margin-right: 15px;
`;

const SectionTitle = styled.View`
margin: 20px ${SIZES.padding}
`;

const DateBox = styled.View`
width: 60px;
height: 60px;
border-radius: 15px;
background-color: ${COLORS.white};
justify-content: center;
align-items: center;
`;

const GiftBox = styled.View`
width: 50px;
height: 50px;
border-radius: 15;
background-color: ${COLORS.white};
justify-content: center;
align-items: center;
`;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default Home;
