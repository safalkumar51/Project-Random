import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    Image,
    Alert,
    Platform,
    TextInput
} from 'react-native';
import React, { useRef, useState } from 'react';

import { useDispatch } from 'react-redux';


// import RichTextEditor from '../../components/RichTextEditor';
import Icons from 'react-native-vector-icons/FontAwesome6';
import ImagePicker from 'react-native-image-crop-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

import SharedHeader from '../../components/SharedHeader';
import baseURL from '../../assets/config';
import { addFeedPost } from '../../redux/slices/feedSlice';
import { addMyPost } from '../../redux/slices/myPostsSlice';

const AddPostScreen = () => {

    const navigation = useNavigation();

    // const bodyRef = useRef('');
    // const editorRef = useRef(null);
   
    const [bodyText , setBodyText] = useState('');

    const [selectedMedia, setSelectedMedia] = useState(null);

    const dispatch = useDispatch();

    const loading = useRef(false);

    const cropperOptions = {
        width: 1600, // A suggested starting width
        height: 1200, // A suggested starting height to create a 1:1 box
        cropping: true,
        freeStyleCropEnabled: false,
        hideBottomControls: true,
        compressImageQuality: 0.8,      // Max quality (min compression)
        compressImageFormat: 'PNG',   // Lossless format
    };

    const chooseFromGallery = () => {
        ImagePicker.openPicker(cropperOptions)
            .then(image => {
                setSelectedMedia({ path: image.path, mime: image.mime });
            })
            .catch(err => {
                if (err.code !== 'E_PICKER_CANCELLED') {
                    console.log('Gallery Picker Error: ', err);
                }
            });
    };

    const takePhotoFromCamera = () => {
        ImagePicker.openCamera(cropperOptions)
            .then(image => {
                handleImageValidation(image);
            })
            .catch(err => {
                if (err.code !== 'E_PICKER_CANCELLED') {
                    console.log('Camera Picker Error: ', err);
                }
            });
    };

    const removeMedia = () => {
        setSelectedMedia(null);
    };

    const submitHandler = async () => {
        loading.current = true;
        try {
            const authToken = await AsyncStorage.getItem('authToken');

            if (!authToken) {
                navigation.replace("LoginScreen");
                return;
            }

            if (!bodyText.trim() && !selectedMedia) {
                Alert.alert("Empty Post", "Please add some text or media.");
                return;
            }

            const formData = new FormData();
            formData.append('caption', bodyText.trim());
            
            if(selectedMedia){
                const uriParts = selectedMedia.path.split('/');
                const name = uriParts[uriParts.length - 1];

                // Normalize file path for iOS and Android
                const normalizedPath =
                    Platform.OS === 'ios'
                        ? selectedMedia.path.replace('file://', '')
                        : selectedMedia.path;

                // Append to FormData
                formData.append('postpic', {
                    uri: normalizedPath,        // Local file URI without 'file://' for iOS
                    type: selectedMedia.mime,   // MIME type like 'image/jpeg' or 'video/mp4'
                    name: name,                 // File name like 'photo.jpg'
                });
            }

            const response = await axios.post(`${baseURL}/post/upload`, formData, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                    'Content-Type': 'multipart/form-data',
                }
            });

            if (response.data.success) {
                Alert.alert("Post uploaded!");
                dispatch(addMyPost(response.data.post));
                dispatch(addFeedPost(response.data.post));
                navigation.goBack();
            } else {
                console.error(response.data.message);
                if (response.data.message === 'Log In Required!') {
                    await AsyncStorage.removeItem('authToken');
                    navigation.replace("LoginScreen");
                }
            }

        } catch (err) {
            console.error("Add Post Error: ", err);
        }
        loading.current = false;;
    };

    if (loading.current) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" />
                <Text>Loading...</Text>
            </View>
        )
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={{ flex: 1 }}>
                <SharedHeader
                    scrollY={0}
                    title="Create Post"
                />

                <ScrollView
                    contentContainerStyle={{ paddingVertical: 80 }}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled">
                    {/* removed richtexteditor */}

                    <View style={styles.textEditor}>
                     <TextInput
                   
                   style={styles.textInput}
                   placeholder = "What's on your mind ...."
                   placeholderTextColor = "gray"
                   multiline
                   value={bodyText}
                   onChangeText = {setBodyText}

                     />

                    </View>
                    


                    {/* MEDIA PREVIEW */}
                    {selectedMedia && (
                        <View style={styles.previewWrapper}>
                            {selectedMedia.mime.startsWith('image') ? (
                                <>
                                    <Image
                                        source={{ uri: selectedMedia.path }}
                                        style={styles.previewImage}
                                        resizeMode="cover"
                                    />
                                    <TouchableOpacity style={styles.removeButton} onPress={removeMedia}>
                                        <Text style={styles.removeText}>×</Text>
                                    </TouchableOpacity>
                                </>
                            ) : (
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Text style={styles.videoText}>
                                        Video selected: {selectedMedia.path.split('/').pop()}
                                    </Text>
                                    <TouchableOpacity onPress={removeMedia}>
                                        <Text style={styles.removeText}>×</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>
                    )}

                    <View style={styles.media}>
                        <Text style={styles.addImageTxt}>Add to your Post</Text>
                        <View style={styles.mediaIcon}>
                            <TouchableOpacity onPress={chooseFromGallery}>
                                <Icons name="image" size={25} color="gray" />
                            </TouchableOpacity>
                            {/* <TouchableOpacity onPress={chooseVideoFromGallery}>
                                <Icons name="video" size={25} color="gray" />
                            </TouchableOpacity> */}
                            <TouchableOpacity onPress={takePhotoFromCamera}>
                                <Icons name="camera" size={25} color="gray" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
                {/* on sunbmit function pending */}
                <View style={styles.postButtonWrapper}>
                    <TouchableOpacity style={styles.postBtn} onPress={submitHandler}>
                        <Text style={styles.postBtnTxt}>POST</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};

export default AddPostScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    Header: {
        flexDirection: 'row',
        // alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    headerTxt: {
        fontWeight: 'bold',
        fontSize: 25,
        // marginLeft: 80,
        textAlign: 'center',
    },
    textEditor: {
        paddingHorizontal: 16,
        marginTop: 10,
    },
    previewWrapper: {
        marginTop: 1,
        marginHorizontal: 16,
        position: 'relative',
        alignItems: 'center',
    },
    previewImage: {
        width: '95%',
       // height: 200,
       aspectRatio:16/12,
        borderRadius: 30,
    },
    removeButton: {
        position: 'absolute',
        top: 10,
        right: 20,
        backgroundColor: 'rgba(0,0,0,0.6)',
        borderRadius: 50,
        paddingHorizontal: 10,
        //paddingVertical:10,
    },
    removeText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    videoText: {
        color: 'gray',
        fontStyle: 'italic',
        flex: 1,
        marginHorizontal: 16,
    },
    media: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderWidth: 1.5,
        padding: 12,
        paddingHorizontal: 18,
        borderRadius: 20,
        borderColor: 'lightgray',
        marginHorizontal: 26,
        marginTop: 20,
        marignLeft: 30,
        // marginRight:30,
    },
    mediaIcon: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    postBtn: {
        backgroundColor: 'royalblue',
        height: 50,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',


    },
    postBtnTxt: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 18,

    },
    postButtonWrapper: {
        position: 'absolute',
        bottom: 10,
        left: 16,
        right: 16,
        backgroundColor: 'white',
        borderRadius: 10,

        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
    },
    addImageTxt: {
        fontWeight: 'bold',
        fontSize: 15,
        color: 'gray',
    },
    textInput:{
        minHeight : 100,
        borderWidth :1 ,
        borderColor : "lightgray",
        borderRadius : 10,
        padding : 10,
        fontSize : 16,
        textAlignVertical  : 'top',
        backgroundColor : '#f9f9f9',
        marginBottom:20
    }
});
