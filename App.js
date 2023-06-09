import * as Location from "expo-location";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const API_KEY = "39e5860d0427416c1aac4f75c6d7713a";

export default function App() {
  const [city, setCity] = useState("Loading...");
  const [days, setDays] = useState([]);
  const [ok, setOk] = useState(true);
  const getWeather = async () => {
    let { granted } = await Location.requestForegroundPermissionsAsync();
    if (!granted) {
      setOk(false);
    }
    let {
      coords: { latitude, longitude },
    } = await Location.getCurrentPositionAsync({ accuracy: 5 });
    const location = await Location.reverseGeocodeAsync(
      { longitude, latitude },
      { useGoogleMaps: false }
    );
    setCity(location[0].city);
    const response = await fetch(
      `https://api.openweathermap.org/data/3.0/onecall?lat=${latitude}&lon=${longitude}&exclude=alerts&appid=${API_KEY}&units=metric`
    );
    const json = await response.json();
    setDays(json.daily);
  };
  useEffect(() => {
    getWeather();
  }, []);
  return (
    <View style={styles.container}>
      <View style={styles.city}>
        <Text style={styles.cityName}>{city}</Text>
        <Text></Text>
      </View>
      <ScrollView
        horizontal={true}
        pagingEnabled={true}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.weather}
      >
        {days.length === 0 ? (
          <View style={styles.day}>
            <ActivityIndicator
              color="white"
              size="large"
              style={{ marginTop: 10 }}
            />
          </View>
        ) : (
          days.map((day, index) => {
            const fullDate = new Date(day.dt * 1000);
            const month = fullDate.getMonth() + 1;
            const date = fullDate.getDate();
            return (
              <View style={styles.day} key={index}>
                <Text style={styles.temp}>
                  {parseFloat(day.temp.day).toFixed(1)}
                </Text>
                <Text style={styles.description}>{day.weather[0].main}</Text>
                <Text style={styles.tinyText}>{`${month}.${date}`}</Text>
                <Text style={styles.tinyText}>
                  {day.weather[0].description}
                </Text>
              </View>
            );
          })
        )}
        {/* <View style={styles.day}>
          <Text style={styles.temp}>27</Text>
          <Text style={styles.description}>Sunny</Text>
        </View>
        <View style={styles.day}>
          <Text style={styles.temp}>27</Text>
          <Text style={styles.description}>Sunny</Text>
        </View>
        <View style={styles.day}>
          <Text style={styles.temp}>27</Text>
          <Text style={styles.description}>Sunny</Text>
        </View>
        <View style={styles.day}>
          <Text style={styles.temp}>27</Text>
          <Text style={styles.description}>Sunny</Text>
        </View> */}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "tomato",
  },
  city: {
    flex: 1.2,
    justifyContent: "center",
    alignItems: "center",
  },
  cityName: {
    fontSize: 68,
    fontWeight: 500,
  },
  weather: {},
  day: {
    width: SCREEN_WIDTH,
    alignItems: "center",
  },
  temp: {
    marginTop: 50,
    fontSize: 178,
  },
  description: {
    marginTop: -30,
    fontSize: 60,
  },
  tinyText: {
    fontSize: 20,
  },
});
