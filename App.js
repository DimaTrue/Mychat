import React from 'react';
import {GiftedChat} from 'react-native-gifted-chat';
import PubNubReact from 'pubnub-react';

import {PUBLISH_KEY, SUBSCRIBE_KEY} from './keys/keys';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.pubnub = new PubNubReact({
      publishKey: PUBLISH_KEY,
      subscribeKey: SUBSCRIBE_KEY,
    });
    this.pubnub.init(this);
    this.id = this.randomid();
  }
  state = {
    messages: [],
  };

  UNSAFE_componentWillMount() {
    this.setState({
      messages: [
        {
          _id: 1,
          text: 'Hello developer',
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'React Native',
            avatar: 'https://placeimg.com/140/140/any',
          },
        },
      ],
    });

    this.pubnub.subscribe({channels: ['channel1'], withPresence: true});

    this.pubnub.getMessage('ReactChat', m => {
      this.setState(previousState => ({
        messages: GiftedChat.append(previousState.messages, m['message']),
      }));
    });

    this.pubnub.getStatus(st => {
      console.log(st);
      this.pubnub.publish({
        message: 'hello world from react',
        channel: 'channel1',
      });
    });
  }

  componentWillUnmount() {
    this.pubnub.unsubscribe({channels: ['channel1']});
  }

  componentDidMount() {
    this.pubnub.history(
      {channel: 'MainChat', reverse: true, count: 15},
      (status, res) => {
        let newmessage = [];
        res.messages.forEach(function(element, index) {
          newmessage[index] = element.entry[0];
        });
        console.log(newmessage);
        this.setState(previousState => ({
          messages: GiftedChat.append(
            previousState.messages,
            newmessage.reverse(),
          ),
        }));
      },
    );
  }

  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }));
    this.pubnub.publish({
      message: messages,
      channel: 'Channel1',
    });
  }

  randomid = () => {
    return Math.floor(Math.random() * 100);
  };

  render() {
    return (
      <GiftedChat
        messages={this.state.messages}
        onSend={messages => this.onSend(messages)}
        user={{
          _id: this.id,
        }}
      />
    );
  }
}
