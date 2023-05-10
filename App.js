import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import {useEffect, useMemo, useState} from "react";
import * as Location from 'expo-location';

export default function App() {
  const [location, setLocation] = useState(null);


  useEffect(() => {
    let subscription = null;

    (async () => {

      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        return;
      }

      subscription = await Location.watchPositionAsync({
        accuracy: Location.Accuracy.BestForNavigation,
        timeInterval: 1000,
        distanceInterval : 20
      }, (next) => {
        setLocation(next)
      });
    })();

    return () => {
      subscription?.remove();
    }
  }, []);

  const speed = useMemo(() => {
    const speed = location?.coords?.speed ?? 0;
    return {
      kmh: Math.round(speed * 18/5),
      ms: Math.round(speed),
    }
  }, [location]);

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Text style={styles.text}>{speed.kmh} km/h</Text>
      <Text style={styles.text}>{speed.ms} m/s</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1f1f1f',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 48,
  },
  text: {
    color: '#fff',
    fontSize: 86,
  }
});
