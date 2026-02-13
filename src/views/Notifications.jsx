import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { bold, regular } from '../config/Constants';
import { blackColor, whiteColor } from '../utils/globalColors';
import { useDispatch, useSelector } from 'react-redux';
import { LoadNotificationsAction } from '../redux/actions/NotificationsActions';
import Moment from 'moment';
import { useNavigation } from '@react-navigation/native';
import Icon, { Icons } from '../components/Icons';
import { StatusBar } from '../components/StatusBar';
import { s, vs, ms } from 'react-native-size-matters';
import NotificationsShimmer from '../components/NotificationsShimmer';

const Notifications = (props) => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const [isInitialLoad, setIsInitialLoad] = useState(true);

    // Get notifications data from Redux store
    const { data, loading } = useSelector(state => state.notifications);

    useEffect(() => {
        get_notifation();
    }, []);

    // Set isInitialLoad to false when loading completes
    useEffect(() => {
        if (!loading && isInitialLoad) {
            setIsInitialLoad(false);
        }
    }, [loading]);

    const get_notifation = async () => {
        try {
            await dispatch(LoadNotificationsAction(1));
        } catch (error) {
            console.log('Error loading notifications:', error);
            alert('Sorry something went wrong');
        }
    }

    const notification_details = (data) => {
        navigation.navigate("NotificationDetails", { data: data });
    }

    const handleBackButtonClick = () => {
        navigation.goBack()
    }

    // Group notifications by date
    const groupNotificationsByDate = (notifications) => {
        const grouped = {};
        const today = Moment().startOf('day');
        const yesterday = Moment().subtract(1, 'days').startOf('day');

        notifications.forEach(notification => {
            const notifDate = Moment(notification.created_at);
            let dateKey;

            if (notifDate.isSame(today, 'day')) {
                dateKey = "Today's";
            } else if (notifDate.isSame(yesterday, 'day')) {
                dateKey = "Yesterday";
            } else {
                dateKey = notifDate.format('ddd, DD MMM');
            }

            if (!grouped[dateKey]) {
                grouped[dateKey] = [];
            }
            grouped[dateKey].push(notification);
        });
        return grouped;
    };

    const groupedNotifications = groupNotificationsByDate(data);

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar />
            <View style={styles.fullGradient}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.headerButton}
                        onPress={handleBackButtonClick}
                    >
                        <Icon type={Icons.Ionicons} name="arrow-back" color={blackColor} size={ms(20)} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Notification</Text>
                </View>

                {loading && isInitialLoad ? (
                    <NotificationsShimmer />
                ) : (
                    <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                        {data.length === 0 ? (
                            <View style={styles.emptyContainer}>
                                <Text style={styles.emptyText}>No notifications</Text>
                            </View>
                        ) : (
                            Object.keys(groupedNotifications).map((dateKey, index) => (
                                <View key={index} style={styles.dateGroup}>
                                    {/* Date Header */}
                                    <Text style={styles.dateHeader}>{dateKey}</Text>

                                    {/* Notifications for this date */}
                                    {groupedNotifications[dateKey].map((item, idx) => (
                                        <TouchableOpacity
                                            key={idx}
                                            style={styles.notificationCard}
                                            onPress={() => notification_details(item)}
                                        >
                                            <Text style={styles.notificationTitle}>{item.title}</Text>
                                            <Text style={styles.notificationDescription} numberOfLines={2}>
                                                {item.description}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            ))
                        )}
                    </ScrollView>
                )}
            </View>
        </SafeAreaView>
    )
}

export default Notifications;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: whiteColor,
    },
    fullGradient: {
        flex: 1,
        paddingHorizontal: ms(15),
        paddingTop: ms(30),
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        // paddingHorizontal: s(20),
        paddingVertical: vs(15),
        backgroundColor: whiteColor,
    },
    headerButton: {
        width: ms(38),
        height: ms(38),
        borderRadius: ms(19),
        backgroundColor: whiteColor,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        flex: 1,
        fontSize: ms(20),
        fontWeight: '600',
        color: blackColor,
        marginLeft: s(15),
    },
    scrollView: {
        flex: 1,
        // paddingHorizontal: s(20),
    },
    dateGroup: {
        marginBottom: vs(20),
    },
    dateHeader: {
        fontSize: ms(16),
        fontWeight: '600',
        color: blackColor,
        marginBottom: vs(10),
        marginTop: vs(10),
    },
    notificationCard: {
        backgroundColor: '#F5F5F5',
        borderRadius: ms(12),
        padding: s(15),
        marginBottom: vs(10),
    },
    notificationTitle: {
        fontSize: ms(15),
        fontWeight: '600',
        color: blackColor,
        marginBottom: vs(5),
    },
    notificationDescription: {
        fontSize: ms(13),
        color: '#666',
        lineHeight: vs(18),
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: vs(100),
    },
    emptyText: {
        fontSize: ms(16),
        fontWeight: '600',
        color: '#999',
    },
});
