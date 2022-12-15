import * as Location from "expo-location";
import { StyleSheet, Text, View, ScrollView, Dimensions } from "react-native";
import { useEffect, useState } from "react";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const API_KEY = "da4dc289d9f56bed3aaf787f30be7515";

export default function App() {
  // 변수
  const [city, setCity] = useState("Loading...");
  const [days, setDays] = useState([]);
  const [ok, setOk] = useState(true);

  // 위치 받아오는 함수
  const getWeather = async () => {
    // 사용 허가
    const granted = await Location.requestForegroundPermissionsAsync();
    if (!granted) setOk(false);

    // 경, 위도 받아오기
    const {
      coords: { latitude, longitude },
    } = await Location.getCurrentPositionAsync({ accuracy: 1 });

    // 구글맵에서 위치 받아오기
    const location = await Location.reverseGeocodeAsync(
      {
        latitude,
        longitude,
      },
      { useGoogleMaps: false }
    );

    // 시티 설정
    setCity(location[0].city);
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`
    ).then(value => value.json());
    // setDays(response.list);
  };

  // 렌더링 될 때마다 getWeather 실행
  useEffect(() => {
    getWeather();
  }, []);

  // view
  return (
    <View style={styles.container}>
      <View style={styles.city}>
        <Text style={styles.cityName}>{city}</Text>
      </View>
      <ScrollView
        pagingEnabled
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.weather}
      >
        <View style={styles.day}>
          <Text style={styles.temp}>27</Text>
          <Text style={styles.description}>Sunny</Text>
        </View>
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "gold" },
  city: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  cityName: {
    fontSize: 60,
    fontWeight: "500",
  },
  weather: {},
  day: {
    width: SCREEN_WIDTH,
    alignItems: "center",
  },
  temp: { fontSize: 175, marginTop: 50 },
  description: { fontSize: 60 },
});
