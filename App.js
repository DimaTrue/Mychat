import React, {Component} from 'react';
import {StyleSheet, View} from 'react-native';
import io from 'socket.io-client';
import {GiftedChat} from 'react-native-gifted-chat';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chatMessages: [],
    };
  }

  componentDidMount() {
    this.socket = io('http://127.0.0.1:3000');
    this.socket.on('chat message', msg => {
      this.setState({chatMessages: [msg, ...this.state.chatMessages]});
    });
  }

  submitChatMessage = messages => {
    this.socket.emit('chat message', messages[0]);
  };

  render() {
    return (
      <View style={styles.container}>
        <GiftedChat
          messages={this.state.chatMessages}
          onSend={chatMessages => this.submitChatMessage(chatMessages)}
          user={{
            _id: 1,
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: 400,
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  chatMessage: {
    borderWidth: 2,
    top: 500,
  },
  textInput: {
    height: 40,
    borderWidth: 2,
    top: 600,
  },
});

export default App;
