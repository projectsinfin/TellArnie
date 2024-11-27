import React from 'react';
import {View, TouchableOpacity, StyleSheet, Alert} from 'react-native';
import Swipeable from 'react-native-swipeable';
import NotificationViewContainer from './NotificationViewContainer';
import {
  notificationMessagImg,
  timerImg,
  notificationtodayImg,
  yellowPoniterIcon,
} from '../Assets';

const SwipeableItem = ({onPress, item, onLeftSwipe, onRightSwipe}) => {
  console.log(item);
  const leftContent = (
    <View style={styles.leftSwipe}>{/* <Text>Left Action</Text> */}</View>
  );

  const rightContent = (
    <View style={styles.rightSwipe}>{/* <Text>Right Action</Text> */}</View>
  );

  const utcDateString = item?.createdAt;

  const utcDate = new Date(utcDateString);

  const istOptions = {
    // timeZone: 'Asia/Kolkata',
    hour: 'numeric',
    minute: 'numeric',
  };
  const istDateString = utcDate?.toLocaleString('en-IN', istOptions);

  const formattedDate =
    !isToday &&
    `${utcDate?.getDate()} ${new Intl.DateTimeFormat('en-IN', {
      month: 'short',
    }).format(utcDate)}`;
  // console.log(formattedDate);
  // Check if the notification's date is today
  const isToday =
    utcDate?.toISOString().split('T')[0] ===
    new Date()?.toISOString().split('T')[0];

  return (
    <Swipeable
      leftContent={leftContent}
      rightContent={rightContent}
      onLeftActionRelease={() => onLeftSwipe(item)}
      onRightActionRelease={() => onRightSwipe(item)}>
      <View style={{marginTop: 10}}>
        <TouchableOpacity onPress={onPress}>
          <NotificationViewContainer
            // notificationtodayImg={notificationMessagImg}
            NotificationText={item?.notification_text}
            timerImg={timerImg}
            notificationtodayImg={notificationtodayImg}
            yellowPoniterIcon={item?.read == false ? yellowPoniterIcon : null}
            // showTime={istDateString}
            showTime={isToday ? istDateString : formattedDate}
          />
        </TouchableOpacity>
      </View>
    </Swipeable>
  );
};

const styles = StyleSheet.create({
  leftSwipe: {
    // backgroundColor: 'green',
    // padding: 10,
    // marginTop: 10,
    // justifyContent: 'center',
    // alignItems: 'center',
    // flexDirection: 'row',
    flex: 1,
    marginTop: 10,
    backgroundColor: '#2E1853',
    padding: 18,
    // borderRadius: 10,
  },
  rightSwipe: {
    flex: 1,
    marginTop: 10,
    backgroundColor: '#2E1853',
    padding: 18,
  },
  content: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});

export default SwipeableItem;
