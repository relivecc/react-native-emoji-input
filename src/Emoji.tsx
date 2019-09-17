import React from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Image,
  Text,
  ViewStyle
} from "react-native";
import * as _ from "lodash";

const EMOJI_DATASOURCE_VERSION = "4.0.4";

interface Props {
  size: number;
  native: boolean;
  style: ViewStyle;
  labelStyle: ViewStyle;
  onPress: (data: any, event: any) => void;
  onLongPress: (data: any, event: any) => void;
  data: any;
}

class Emoji extends React.PureComponent<Props> {
  // static propTypes = {
  //   data: PropTypes.shape({
  //     char: PropTypes.char,
  //     unified: PropTypes.char
  //   }),
  //   onPress: PropTypes.func,
  //   onLongPress: PropTypes.func,
  //   native: PropTypes.bool,
  //   size: PropTypes.number,
  //   style: PropTypes.object,
  //   labelStyle: PropTypes.object
  // };

  // static defaultProps = {
  //   native: true
  // };

  render() {
    // let imageComponent = null;

    const {
      // native,
      // style,
      // labelStyle,
      data,
      onPress,
      onLongPress
    } = this.props;

    // const emojiComponent = (

    // );

    return onPress || onLongPress ? (
      <TouchableOpacity
        style={styles.emojiWrapper}
        onPress={(evt: any) => {
          onPress && onPress(data, evt);
        }}
        onLongPress={(evt: any) => {
          onLongPress && onLongPress(data, evt);
        }}
      >
        {this.emojiComponent()}
      </TouchableOpacity>
    ) : (
      this.emojiComponent()
    );
  }

  emojiComponent = () => {
    const emojiImageFile = this._getImage(this.props.data);
    const imageStyle = {
      width: this.props.size,
      height: this.props.size
    };
    let imageComponent;

    if (!this.props.native) {
      imageComponent = <Image style={imageStyle} source={emojiImageFile} />;
    } else {
      if (!this.props.data.char) {
        this.props.data.char = this.props.data.unified.replace(
          /(^|-)([a-z0-9]+)/gi,
          (_s: any, _b: any, cp: any) => String.fromCodePoint(parseInt(cp, 16))
        );
      }
    }

    return (
      <View style={StyleSheet.flatten([styles.emojiWrapper, this.props.style])}>
        {this.props.native ? (
          <Text
            style={StyleSheet.flatten([
              styles.labelStyle,
              this.props.labelStyle,
              {
                fontSize: this.props.size
              }
            ])}
          >
            {this.props.data.char}
          </Text>
        ) : (
          imageComponent
        )}
      </View>
    );
  };

  _getImage = (data: any) => {
    let localImage = _.get(data, "localImage");
    if (localImage) return localImage;

    let image = _.get(data, "lib.image");
    let imageSource = localImage || {
      uri: `https://unpkg.com/emoji-datasource-apple@${EMOJI_DATASOURCE_VERSION}/img/apple/64/${image}`
    };
    return imageSource;
  };
}

const styles = StyleSheet.create({
  emojiWrapper: {
    justifyContent: "space-around",
    alignItems: "center",
    flex: 1
  },
  labelStyle: {
    color: "black",
    fontWeight: "bold"
  }
});

export default Emoji;
