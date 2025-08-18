import { Image, StyleSheet, Text, TouchableOpacity, View, Dimensions, Alert } from 'react-native';
import React, { useEffect, useMemo, useRef } from 'react';
import { useNavigation } from '@react-navigation/native';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';

import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

import baseURL from '../assets/config';
import { selectRequestsById } from '../redux/selectors/requestsSelectors';
import { removeRequest, updateRequestsStatus } from '../redux/slices/requestsSlice';
import { updateRequestStatus } from '../redux/slices/requestSlice';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const { width } = Dimensions.get('window');

const ActivityCard = ({ requestId }) => {
    const navigation = useNavigation();
    const loading = useRef(false);

    const dispatch = useDispatch();

    const request = useSelector(state => selectRequestsById(state, requestId), shallowEqual);

    const requestData = useMemo(() => request, [request]);
    const time = useMemo(() => dayjs(requestData?.createdAt).fromNow(), [requestData?.createdAt]);

    const getProfileHandler = () => {
        navigation.navigate("OtherProfileScreen", { otherId: requestData.from._id });
    };

    const connectHandler = async () => {
        if (loading.current) return;
        loading.current = true;
        try {
            const authToken = await AsyncStorage.getItem('authToken');
            if (!authToken) {
                navigation.replace("LoginScreen");
                return;
            }

            const response = await axios.post(`${baseURL}/connection/accept`, {
                requestId,
                senderId: requestData.from._id
            }, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                }
            });

            if (response.data.success) {
                dispatch(updateRequestStatus({ requestId, status: response.data.status }));
                dispatch(updateRequestsStatus({ requestId, status: response.data.status }));
            } else {
                console.error(response.data.message);
                if (response.data.message === 'Log In Required!') {
                    await AsyncStorage.removeItem('authToken');
                    navigation.replace("LoginScreen");
                }
            }
        } catch (err) {
            console.error('Error connecting:', err);
        }
        loading.current = false;
    };

    const removeHandler = async () => {
        if (loading.current) return;
        loading.current = true;
        try {
            const authToken = await AsyncStorage.getItem('authToken');
            if (!authToken) {
                navigation.replace("LoginScreen");
                return;
            }

            const response = await axios.post(`${baseURL}/connection/reject`, {
                requestId,
                senderId: requestData.from._id
            }, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                }
            });

            if (response.data.success) {
                // Remove from requests slice
                dispatch(removeRequest(requestId));
                dispatch(clearRequest(requestId));
                dispatch(clearOtherProfile());
                dispatch(clearOtherPosts());
                // Sync with otherProfileSlice if the profile is open later
                //dispatch(setOtherProfileStatus("none"));

            } else {
                console.error(response.data.message);
                if (response.data.message === 'Log In Required!') {
                    await AsyncStorage.removeItem('authToken');
                    navigation.replace("LoginScreen");
                }
            }
        } catch (err) {
            console.error('Error rejecting:', err);
        }
        loading.current = false;
    };

    return (
        <View style={styles.card}>
            <View style={styles.upper}>
                <TouchableOpacity style={styles.userInfo} onPress={getProfileHandler}>
                    <Image style={styles.avatar} source={{ uri: requestData?.from.profilepic }} />
                    <View style={styles.nameTime}>
                        <Text style={styles.name} numberOfLines={1} ellipsizeMode="tail">{requestData?.from.name}</Text>
                        <Text style={styles.time}>{time}</Text>
                    </View>
                </TouchableOpacity>

                {(requestData?.status !== "pending") && (
                    <View style={styles.statusWrapper}>
                        <Text style={[styles.statusText, requestData?.status === "connected" ? styles.connected : styles.requested]}>
                            {requestData?.status.charAt(0).toUpperCase() + requestData?.status.slice(1)}
                        </Text>
                    </View>
                )}
            </View>

            {requestData?.status === "pending" && (
                <View style={styles.lower}>
                    <TouchableOpacity style={styles.connectBtn} onPress={connectHandler}>
                        <Text style={styles.connectTxt}>Connect</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.removeBtn} onPress={removeHandler}>
                        <Text style={styles.removeTxt}>Remove</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};

export default React.memo(ActivityCard);

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#f9f9f9',
        borderRadius: 14,
        marginVertical: 2,
        width: width * 0.95,
        alignSelf: 'center',
        padding: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 5,
    },
    upper: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#ddd',
    },
    nameTime: {
        marginLeft: 12,
        flex: 1,
        overflow: 'hidden',
    },
    name: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    time: {
        fontSize: 12,
        color: '#777',
        marginTop: 2,
    },
    statusWrapper: {
        paddingHorizontal: 20,
        paddingVertical: 6,
        borderRadius: 20,
        backgroundColor: '#e0e0e0',
        marginLeft: 10,
        flexShrink: 0,
    },
    statusText: {
        fontSize: 14,
        fontWeight: '500',
        textTransform: 'capitalize',
    },
    requested: {
        color: '#4f7cf0',
        fontWeight: '600',
    },
    connected: {
        color: '#2e7d32',
        fontWeight: '600',
    },
    lower: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 5,
    },
    connectBtn: {
        backgroundColor: '#2e64e5',
        paddingVertical: 8,
        paddingHorizontal: 30,
        borderRadius: 10,
        flex: 1,
        marginRight: 6,
        alignItems: 'center',
    },
    connectTxt: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 15,
    },
    removeBtn: {
        backgroundColor: '#d32f2f',
        paddingVertical: 8,
        paddingHorizontal: 30,
        borderRadius: 10,
        flex: 1,
        marginLeft: 6,
        alignItems: 'center',
    },
    removeTxt: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 15,
    },
});
