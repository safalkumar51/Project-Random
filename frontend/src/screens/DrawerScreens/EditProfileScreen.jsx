import { StyleSheet, Text, View, ScrollView, Pressable, Modal, TouchableOpacity, PermissionsAndroid, Platform, Animated, Alert } from 'react-native';
import { useEffect, useRef } from 'react';

import BackButton from '../../components/BackButton';
import { Image } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Button, Input } from 'react-native-elements';
import { useState } from 'react';

import ImageCropPicker from 'react-native-image-crop-picker';
import SharedHeader from '../../components/SharedHeader';
import { SafeAreaView } from 'react-native-safe-area-context';
import FormButton from '../../components/FormButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import baseURL from '../../assets/config';



const EditProfileScreen = () => {
    const navigation = useNavigation();
    const headerTranslateY = useRef(new Animated.Value(0)).current;

    const [name, setname] = useState("")
    const [modalVisible, setModalVisible] = useState(false);
    const [imageUri, setImageUri] = useState(null);
    const [bio, setBio] = useState('');
    const [password, setPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const requestPermissions = async () => {
        if (Platform.OS === 'android') {
            try {
                const granted = await PermissionsAndroid.requestMultiple([
                    PermissionsAndroid.PERMISSIONS.CAMERA,
                    PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                ]);
                console.log('Permissions:', granted);
            } catch (err) {
                console.warn(err);
            }
        }
    };

    const changeProfilePhotoHandler = async (image) => {
        try{

            const authToken = await AsyncStorage.getItem('authToken');

            if (!authToken) {
                navigation.replace("LoginScreen");
                return;
            }

            const formData = new FormData();

            const uriParts = image.path.split('/');
            const filename = uriParts[uriParts.length - 1];

            // Normalize file path for iOS and Android
            const normalizedPath =
                Platform.OS === 'ios'
                    ? image.path.replace('file://', '')
                    : image.path;

            // Append to FormData
            formData.append('profilepic', {
                uri: normalizedPath,        // Local file URI without 'file://' for iOS
                type: image.mime,   // MIME type like 'image/jpeg' or 'video/mp4'
                name: filename,                 // File name like 'photo.jpg'
            });

            const response = await axios.post(`${ baseURL }/user/changeprofilephoto`, formData, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                    'Content-Type': 'multipart/form-data',
                }
            });

            if (response.data.success) {
                Alert.alert("Profile Picture Changed Successfully!");
                navigation.goBack();
            } else {
                console.error(response.data.message);
                if (response.data.message === 'Log In Required!') {
                    await AsyncStorage.removeItem('authToken');
                    navigation.replace("LoginScreen");
                }
            }

        } catch(err){
            console.error('Error changing profile picture:', err);
        }
    }

    const editProfileHandler = async () => {
        if (!name.trim()) {
            Alert.alert("Name field can't be empty");
            return;
        }
        /*if(name === profile.name){
            Alert.alert("Invalid Request");
            return;
        }*/

        try {

            const authToken = await AsyncStorage.getItem('authToken');

            if (!authToken) {
                navigation.replace("LoginScreen");
                return;
            }

            const response = await axios.post(`${ baseURL }/user/editprofile`, {
                name,
                bio
            }, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                }
            });
            if (response.data.success) {
                Alert.alert("Edit Profile")
            }
            else {
                console.error(response.data.message);
                if (response.data.message === 'Log In Required!') {
                    await AsyncStorage.removeItem('authToken');
                    navigation.replace("LoginScreen");
                }
            }

        } catch (err) {
            console.error('Error editing profile:', err);
        }
    }

    const changePasswordHandler = async () => {
        if (!password || !newPassword || !confirmPassword) {
            Alert.alert("All fields are required!");
            return;
        }
        if (newPassword !== confirmPassword) {
            Alert.alert(
                "Change Password Failed!!",
                "Enter Password Carefully!"
            );
            return;
        }

        if (newPassword.length < 8) {
            Alert.alert("Password must contain alteast 8 characters.");
            return;
        }

        try {

            const authToken = await AsyncStorage.getItem('authToken');

            if (!authToken) {
                navigation.replace("LoginScreen");
                return;
            }

            const response = await axios.post(`${ baseURL }/user/changepassword`, {
                oldPassword: password,
                newPassword
            }, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                }
            });
            if (response.data.success) {
                Alert.alert("Password Changed Successfully")
            }
            else {
                console.error(response.data.message);
                if (response.data.message === 'Log In Required!') {
                    await AsyncStorage.removeItem('authToken');
                    navigation.replace("LoginScreen");
                }
            }

        } catch (err) {
            console.error("Change Password Failed :", err);
        }
    }

    useEffect(() => {
        requestPermissions();
    }, []);

    const handleCamera = () => {
        ImageCropPicker.openCamera({
            compressImageMaxHeight: 300,
            compressImageMaxWidth: 300,
            cropperToolbarTitle: 'Crop Image',
            cropping: true,
        }).then(image => {
            setImageUri({ path: image.path, mime: image.mime });
            changeProfilePhotoHandler(image);
            setModalVisible(false);
        }).catch(err => {
            console.log("Camera error:", err);
            setModalVisible(false);
        });
    };


    const handleGallery = () => {
        ImageCropPicker.openPicker({
            compressImageMaxHeight: 300,
            compressImageMaxWidth: 300,
            cropperToolbarTitle: 'Crop Image',
            cropping: true,
        }).then(image => {
            setImageUri({ path: image.path, mime: image.mime });
            changeProfilePhotoHandler(image);
            setModalVisible(false);
        }).catch(err => {
            console.log("Gallery error:", err);
            setModalVisible(false);
        });
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.container}>
                <ScrollView style={{ flex: 1 }}>

                    <SharedHeader
                        scrollY={headerTranslateY}
                        title="Edit Profile"
                        leftComponent={<BackButton />}
                    />

                    {/* form */}

                    <View style={styles.form}>
                        <View style={styles.avatarContainer}>
                            <Image
                                source={{ uri: imageUri?.path || "https://upload.wikimedia.org/wikipedia/en/thumb/d/df/Andrew_Garfield_as_Spider-Man.jpg/250px-Andrew_Garfield_as_Spider-Man.jpg" }} style={styles.avatar}
                            />

                            <TouchableOpacity style={styles.cameraIcon} onPress={() => setModalVisible(true)} >
                                <Ionicons
                                    name="camera"
                                    size={24}
                                    color="black"

                                />
                            </TouchableOpacity>
                        </View>
                        <Text style={{ fontSize: 17, color: "#333", marginLeft: 10 }}>
                            Profile details
                        </Text>

                        <Input
                            placeholder="Enter your name"
                            value={name}
                            onChangeText={setname}
                            leftIcon={
                                <Ionicons name="person-outline" size={20} color="gray" />}
                            inputContainerStyle={styles.inputContainer}
                            inputStyle={styles.inputText}
                            placeholderTextColor="gray"
                        />
                        <Input
                            placeholder="Enter your Bio"
                            value={bio}
                            onChangeText={setBio}
                            multiline={true}

                            inputContainerStyle={styles.BioInputContainer}
                            inputStyle={styles.BioInputText}
                            placeholderTextColor="gray"

                        />
                        <FormButton
                            buttonTitle={"Update Profile"}
                            onPress={editProfileHandler}
                        />
                        {/* password section  */}
                        <Text style={{ fontSize: 17, color: "#333", paddingLeft: 10, paddingVertical: 20, borderTopColor: 'black', borderTopWidth: 2 }}>
                            Change Password
                        </Text>

                        <View style={{ marginTop: 5 }}>
                            <Input
                                placeholder="Enter your Existing Password"
                                value={password}
                                onChangeText={setPassword}
                                leftIcon={
                                    <Ionicons name="lock-closed-outline" size={20} color="gray" />}
                                inputContainerStyle={styles.PasswordInputContainer}
                                inputStyle={styles.inputText}
                                placeholderTextColor="gray"
                            />
                            <Input
                                placeholder="Enter New Password"
                                value={newPassword}
                                onChangeText={setNewPassword}
                                leftIcon={
                                    <Ionicons name="lock-closed-outline" size={20} color="gray" />}
                                inputContainerStyle={styles.PasswordInputContainer}
                                inputStyle={styles.inputText}
                                placeholderTextColor="gray"
                            />
                            <Input
                                placeholder="Confirm New Password"
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                leftIcon={
                                    <Ionicons name="lock-closed-outline" size={20} color="gray" />}
                                inputContainerStyle={styles.PasswordInputContainer}
                                inputStyle={styles.inputText}
                                placeholderTextColor="gray"
                            />
                            <FormButton
                                buttonTitle={"Update Password"}
                                onPress={changePasswordHandler}
                            />
                        </View>

                    </View>


                </ScrollView>

                {/* Model for selection between take picture or select from gallary */}
                <Modal
                    visible={modalVisible}
                    transparent={true}
                    animationType="slide"
                    onRequestClose={() => setModalVisible(false)}
                >
                    <View style={{
                        flex: 1,
                        justifyContent: 'flex-end',
                        backgroundColor: 'rgba(0,0,0,0.4)',
                    }}>
                        <View style={{
                            backgroundColor: 'white',
                            padding: 20,
                            borderTopLeftRadius: 20,
                            borderTopRightRadius: 20,
                        }}>
                            <TouchableOpacity onPress={handleCamera} style={styles.modalOption}>
                                <Ionicons name="camera-outline" size={25} color="#333" />
                                <Text style={styles.modalText}>Take Picture</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleGallery} style={styles.modalOption}>
                                <Ionicons name="images-outline" size={22} color="#333" />
                                <Text style={styles.modalText}> Choose from Gallery</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.modalOption}>
                                <Ionicons name="close-outline" size={22} color="red" />
                                <Text style={[styles.modalText, { color: 'red' }]}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>

            </View>
        </SafeAreaView>
    );
};

export default EditProfileScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    inputContainer: {
        borderBottomWidth: 0,
        backgroundColor: '#f5f5f5',
        borderRadius: 10,
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
    inputText: {
        fontSize: 16,
        color: '#333',
    },

    PasswordInputContainer: {
        borderBottomWidth: 0,
        backgroundColor: '#f5f5f5',
        borderRadius: 10,
        paddingHorizontal: 10,
        paddingVertical: 5,
        marginTop: -17,
        // marginBottom:-10
    },
    avatarContainer: {
        height: 120,
        width: 120,
        alignSelf: 'center',
    },

    avatar: {
        width: '100%',
        height: '100%',
        borderRadius: 100,
        borderWidth: 1,
        borderColor: "lightgray",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.40,
        shadowRadius: 50,
        elevation: 7,
    },
    Header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        height: 50,
        position: 'relative',
        marginLeft: 10
    },
    headerTxt: {
        fontWeight: 'bold',
        fontSize: 30,
        position: 'absolute',
        left: 0,
        right: 0,
        textAlign: 'center',
    },
    cameraIcon: {
        position: "absolute",
        bottom: 0,
        right: -10,
        padding: 8,
        borderRadius: 50,
        backgroundColor: "white",
        // shadowColor: "red",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 5,
        elevation: 7,
    },
    form: {
        gap: 12,
        marginTop: 10,
        paddingTop: 60
    },
    input: {
        flexDirection: 'row',
        borderWidth: 0.5,
        borderColor: "red",
        borderRadius: 1,
        padding: 17,
        paddingHorizontal: 20,
        gap: 15,
    },

    BioInputContainer: {
        borderBottomWidth: 0,
        backgroundColor: '#f5f5f5',
        borderRadius: 10,
        paddingHorizontal: 10,
        paddingVertical: 10,
        marginTop: -27,
        height: 80,
        alignItems: "flex-start",
        flexDirection: 'row',
        marginBottom: -20

    },
    BioInputText: {
        fontSize: 16,
        color: '#333',
        // height:100,

    },
    updateButton: {
        backgroundColor: '#55a3e7ff',
        borderRadius: 10,
        paddingVertical: 14,
        paddingHorizontal: 20,
        marginLeft: 10,
        marginRight: 10,
        // marginTop:-10

    },
    updateButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
    },
    updateProfileButton: {
        backgroundColor: '#55a3e7ff',
        borderRadius: 10,
        paddingVertical: 14,
        paddingHorizontal: 20,
        marginLeft: 10,
        marginRight: 10,
        // marginTop:-10

    },
    modalOption: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        paddingVertical: 12,
    },

    modalText: {
        fontSize: 18,
        color: '#333',
    },


});