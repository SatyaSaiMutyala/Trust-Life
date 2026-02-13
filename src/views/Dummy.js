import { Text } from "react-native"
import { View } from "react-native-animatable"
import MapView, { Marker } from "react-native-maps"
import { height_50 } from "../config/Constants"


const Dummy = () => {
    return(
        <>
        <View><Text>Hey Buddy Light Weight...!</Text></View>
        <View>
              <MapView
                        style={{ width: '100%', height: height_50 }}
                        initialRegion={{
                          latitude: 37.78845,
                          longitude: -122.4321,
                          latitudeDelta: 0.0922,
                          longitudeDelta: 0.0421,
                        }}
                      >
                        <Marker coordinate={{ latitude: 37.78845, longitude: -122.4321 }} />
                      </MapView>
        </View>
        </>
    )
}

export default Dummy;