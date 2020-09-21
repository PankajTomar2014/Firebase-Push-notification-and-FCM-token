

import React, { useEffect } from 'react';
import { View, Text,StyleSheet, Platform } from 'react-native';
import firebase from 'react-native-firebase';
import AsyncStorage from '@react-native-community/async-storage'

const App  = () => {
  useEffect(()=>{
      checkPermission();
      createChannel();
      createNotificationListeners();
  },[])

   //Check whether Push Notifications are enabled or not
   const checkPermission =async ()=> {
    const enabled = await firebase.messaging().hasPermission();
    if (enabled) {
      getToken();
    } else {
     requestPermission();
    }
  }
   //Get Device Registration Token
   const getToken = async () => {
    let fcmToken = await AsyncStorage.getItem('fcmToken');
    console.log("TOKEN=---->>",fcmToken);
    if (!fcmToken) {
      fcmToken = await firebase.messaging().getToken();
      if (fcmToken) {
        console.log('fcmToken:', fcmToken);
        await AsyncStorage.setItem('fcmToken =->>', fcmToken);
      }
    }
  }

    //Request for Push Notification
      const  requestPermission = async()=> {
      try {
        await firebase.messaging().requestPermission();
        // If user allow Push Notification
        getToken();
      } catch (error) {
        // If user do not allow Push Notification
        console.log('Rejected',error);
      }
    }

  const  createChannel = () =>{
    const channel = new firebase.notifications.Android.Channel(
      'channelId','channelName',
      firebase.notifications.Android.Importance.Max).setDescription('Description');
      firebase.notifications().android.createChannel(channel);
    
  };
// Forground Notification.
const createNotificationListeners = () =>{
  firebase.notifications().onNotification((notification)=>{
     if(Platform.OS ==="android"){
       const localNotification = new firebase.notifications.Notification({
        sound: 'default' ,
        show_in_foreground:true,
       })
       .setNotificationId(notification.notificationId)
       .setTitle(notification.title)
       .setSubtitle(notification.body)
       .setData(notification.data)
       .android.setChannelId('channelId')
       .android.setPriority(firebase.notifications.Android.Priority.High)

       firebase.notifications().displayNotification(localNotification)
       .catch((error)=> console.log("error found=->",error))
     }
  });
};


  return (
   <View style={styles.container}>
     <Text>Pnakaj hu main</Text>
   </View>
  );
};

const styles = StyleSheet.create({
container:{
  flex:1,
justifyContent:"center",
alignItems:"center"
}
});

export default App;
