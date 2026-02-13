import MaskedView from "@react-native-masked-view/masked-view";
import { View } from "react-native";
import { Text } from "react-native";
import LinearGradient from "react-native-linear-gradient";

export const GradientText = ({ colors, ...props }) => {
    return (
      <MaskedView maskElement={<Text {...props} />}>
        <LinearGradient
          colors={colors}
          
        >
          <Text {...props} style={[props.style, { opacity: 0 }]} />
        </LinearGradient>
      </MaskedView>
    );
  };
  
  export const GradientView = ({ colors, ...props }) => {
    return (
      <MaskedView maskElement={<View {...props} />}>
        <LinearGradient
          colors={colors}
          
        >
          <View {...props} style={[props.style, { opacity: 0 }]} />
        </LinearGradient>
      </MaskedView>
    );
  };