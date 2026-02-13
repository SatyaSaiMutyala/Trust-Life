import React, { Component } from 'react';
import { BackHandler, View, StyleSheet } from 'react-native';
import { img_url, chat_pusher, api_url, image_upload } from '../config/Constants';
import { GiftedChat, Actions } from 'react-native-gifted-chat';
import database from '@react-native-firebase/database';
//import NotificationSounds, { playSampleSound } from  'react-native-notification-sounds';
import { connect } from 'react-redux';
import { updateProfilePicture } from '../actions/CurrentAddressActions';
import * as ImagePicker from "react-native-image-picker";
import RNFetchBlob from "rn-fetch-blob";
import ImgToBase64 from 'react-native-image-base64';
import Loader from '../components/Loader';
import axios from 'axios';
import * as colors from '../assets/css/Colors';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { StatusBar } from '../components/StatusBar';

const options = {
  title: 'Select a photo',
  takePhotoButtonTitle: 'Take a photo',
  chooseFromLibraryButtonTitle: 'Choose from gallery',
  base64: true,
  quality: 1,
  maxWidth: 500,
  maxHeight: 500,
};

class DoctorChat extends Component<Props> {
  constructor(props) {
    super(props)
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    this.state = {
      messages: [],
      id: this.props.route.params.id,
      loading: false,
      img_data: '',
      img_data: ""
    }
    console.log(img_url + this.props.profile_picture)
  }

  componentWillMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  handleBackButtonClick() {
    this.props.navigation.goBack(null);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  componentDidMount() {
    this.refOn(message =>
      this.setState(previousState => ({
        messages: GiftedChat.append(previousState.messages, message),
      })
      )
    );
  }

  refOn = callback => {
    database().ref(`/chat/${this.state.id}`)
      .limitToLast(20)
      .on('child_added', snapshot => callback(this.parse(snapshot)));
  }

  parse = snapshot => {
    if (this.state.messages.length > 0) {
      // this.notification_sound();
    }
    const { text, user, image } = snapshot.val();
    const { key: _id } = snapshot;
    const message = { _id, text, user, image };
    return message;
  };

  onSend = messages => {
    for (let i = 0; i < messages.length; i++) {
      const { text, user, image } = messages[i];
      const message = { text, user, image };
      database().ref(`/chat/${this.state.id}`).push(message);
      this.chat_pusher(message.text);
    }
  }

  notification_sound = () => {
    NotificationSounds.getNotifications('notification').then(soundsList => {
      console.warn('SOUNDS', JSON.stringify(soundsList));

      playSampleSound(soundsList[1]);

    });
  }

  chat_pusher = async (message) => {
    await axios({
      method: "post",
      url: api_url + chat_pusher,
      data: { type: 2, consultation_id: this.state.id, message: message },
    })
      .then(async (response) => {
        //alert(JSON.stringify(response))
      })
      .catch((error) => {
        //alert(error)
      });
  }

  select_photo = async () => {
    ImagePicker.launchImageLibrary(options, async (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        const source = response.assets[0].uri;
        this.setState({ img_data: response.data });
        await ImgToBase64.getBase64String(response.assets[0].uri)
          .then(async base64String => {
            await this.profileimageupdate(base64String);
          }).catch(err => console.log(err));
      }
    });
  }

  profileimageupdate = async (data_img) => {
    this.setState({ isLoading: true });
    RNFetchBlob.fetch('POST', api_url + image_upload, {
      'Content-Type': 'multipart/form-data',
    }, [
      {
        name: 'image',
        filename: 'image.png',
        data: data_img
      }
    ]).then(async (resp) => {
      this.setState({ isLoading: false });
      let data = resp.data;
        data = JSON.parse(data);
      let message = {
        user: {
          _id: global.id + '-Cr',
          name: global.customer_name,
          avatar: img_url + this.props.profile_picture
        },
        image: img_url + data.result
      };
      database().ref(`/chat/${this.state.id}`).push(message);
    }).catch((err) => {
      this.setState({ isLoading: false });
      console.log(err);
      alert(err)
    })
  }

  renderActions = (props) => {

    return (
      <Actions
        {...props}
        containerStyle={styles.chat_style1}
        icon={() => (
          <FontAwesome name='paperclip'
            size={25}
            color='black'
            style={styles.chat_style2}
          />
        )}
        options={{
          'Choose From Library': () => {
            this.select_photo();
          },
          Cancel: () => {
            console.log('Cancel');
          },
        }}
        optionTintColor="#222B45"
      />
    )
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <GiftedChat
          messages={this.state.messages}
          onSend={messages => this.onSend(messages)}
          user={{
            _id: global.id + '-Cr',
            name: global.customer_name,
            avatar: img_url + this.props.profile_picture
          }}
          renderActions={this.renderActions} 
          showUserAvatar
        />
        <Loader visible={this.state.loading} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  chat_style1: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center', marginLeft: 4, marginRight: 4, marginBottom: 0 },
  chat_style2: { color: colors.theme_fg },
});

function mapStateToProps(state) {
  return {
    profile_picture: state.current_location.profile_picture,

  };
}

const mapDispatchToProps = (dispatch) => ({
  updateProfilePicture: (data) => dispatch(updateProfilePicture(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(DoctorChat);

