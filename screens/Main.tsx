import React from "react";
import { Search, Likes, Messages, YourProfile, Donate } from "../screens";
import * as Global from "../Global";
import * as URL from "../URL";
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import * as I18N from "../i18n";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Text } from 'react-native-paper';

const i18n = I18N.getI18n()
const ICON_SIZE = 26;

const Tab = createMaterialBottomTabNavigator();

const SECOND_MS = 1000;
const POLL_ALERT = 5 * SECOND_MS;
const POLL_MESSAGE = 5 * SECOND_MS;

const Main = ({ route, navigation }) => {

  let messageUpdateInterval: NodeJS.Timeout | undefined;
  let alertUpdateInterval: NodeJS.Timeout | undefined;
  let langIso: string | undefined;

  const [newAlert, setNewAlert] = React.useState(false);
  const [newMessage, setHasNewMessage] = React.useState(false);

  async function updateNewAlert() {
    let url;
    if (!langIso) {
      langIso = i18n.locale.slice(0, 2);
      url = Global.format(URL.USER_STATUS_ALERT_LANG, langIso);
    } else {
      url = URL.USER_STATUS_ALERT;
    }
    let response = await Global.Fetch(url);
    let data: boolean = response.data;
    setNewAlert(data);
  }

  async function updateNewMessage() {
    let response = await Global.Fetch(URL.USER_STATUS_MESSAGE);
    let data: boolean = response.data;
    setHasNewMessage(data);
  }

  React.useEffect(() => {
    messageUpdateInterval = setInterval(async () => {
      updateNewAlert();
    }, POLL_MESSAGE);

    alertUpdateInterval = setInterval(async () => {
      updateNewMessage();
    }, POLL_ALERT);

    updateNewAlert();
    updateNewMessage();
    
    Global.SetStorage(Global.STORAGE_SCREEN, Global.SCREEN_SEARCH);
  }, []);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', () => {
      if (messageUpdateInterval) {
        clearInterval(messageUpdateInterval);
      }
      if (alertUpdateInterval) {
        clearInterval(alertUpdateInterval);
      }
    });
    return unsubscribe;
  }, [navigation]);

  function saveScreen(target : string | undefined) {
    if(target) {
      let targetSplitArr = target.split("-");
      let screen = targetSplitArr[0];

      switch(screen) {
        case Global.SCREEN_YOURPROFILE:  Global.SetStorage(Global.STORAGE_SCREEN, Global.SCREEN_YOURPROFILE);
        case Global.SCREEN_CHAT:  Global.SetStorage(Global.STORAGE_SCREEN, Global.SCREEN_CHAT);
        case Global.SCREEN_SEARCH:  Global.SetStorage(Global.STORAGE_SCREEN, Global.SCREEN_SEARCH);
        case Global.SCREEN_LIKES:  Global.SetStorage(Global.STORAGE_SCREEN, Global.SCREEN_LIKES);
        case Global.SCREEN_DONATE:  Global.SetStorage(Global.STORAGE_SCREEN, Global.SCREEN_DONATE);
      }
    }
   
  }

  return (
    <Tab.Navigator initialRouteName={Global.SCREEN_SEARCH}>
      <Tab.Screen
        name={Global.SCREEN_YOURPROFILE}
        component={YourProfile}
        listeners={{
          tabPress: e => {
            saveScreen(e.target);
          },
        }}
        options={{
          tabBarLabel: <Text>{i18n.t('navigation.profile')}</Text>,
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="account" color={color} size={ICON_SIZE} />
          ),
        }}
      />
      <Tab.Screen
        name={Global.SCREEN_CHAT}
        component={Messages}
        listeners={{
          tabPress: e => {
            saveScreen(e.target);
          },
        }}
        options={{
          tabBarBadge: newMessage,
          tabBarLabel: <Text>{i18n.t('navigation.chat')}</Text>,
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="chat" color={color} size={ICON_SIZE} />
          ),
        }}
      />
      <Tab.Screen
        name={Global.SCREEN_SEARCH}
        component={Search}
        listeners={{
          tabPress: e => {
            saveScreen(e.target);
          },
        }}
        options={{
          tabBarLabel: <Text>{i18n.t('navigation.search')}</Text>,
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="magnify" color={color} size={ICON_SIZE} />
          ),
        }}
      />
      <Tab.Screen
        name={Global.SCREEN_LIKES}
        component={Likes}
        listeners={{
          tabPress: e => {
            saveScreen(e.target);
          },
        }}
        options={{
          tabBarBadge: newAlert,
          tabBarLabel: <Text>{i18n.t('navigation.likes')}</Text>,
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="heart" color={color} size={ICON_SIZE} />
          ),
        }}
      />
      <Tab.Screen
        name={Global.SCREEN_DONATE}
        component={Donate}
        listeners={{
          tabPress: e => {
            saveScreen(e.target);
          },
        }}
        options={{
          tabBarLabel: <Text>{i18n.t('navigation.donate')}</Text>,
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="cash-multiple" color={color} size={ICON_SIZE} />
          ),
        }}
      />
    </Tab.Navigator>
  )
};

export default Main;