import { StyleSheet, Text, View, Image } from 'react-native'
import React, { useEffect } from 'react'
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import { selectOtherProfileById } from '../redux/selectors/otherProfileSelectors';
import { selectMyProfileById } from '../redux/selectors/myProfileSelectors';

const ProfileCard = ({ profileId, counter }) => {
    let profile = {};
    if(counter === 1){
        profile = useSelector(state => selectOtherProfileById(state, profileId), shallowEqual);
    } else {
        profile = useSelector(state => selectMyProfileById(state, profileId), shallowEqual);
    }

    return (
        <View style={styles.profileCard}>
            <View style={styles.profileContainer}>
                <Image style={styles.profileImg} source={{ uri: profile?.profilepic }} />
                <Text style={styles.name}>{profile?.name}</Text>
                <Text style={styles.email}>{profile?.email}</Text>
            </View>
            
            {profile?.bio && (
                <View style={styles.bioContainer}>
                    <Text>{profile?.bio}</Text>
                </View>
            )}
        </View>
    )
}

export default React.memo(ProfileCard)

const styles = StyleSheet.create({
    profileCard: {
        flex: 0.5,
        width: '100%',
        height: '100%',
    },
    profileContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    profileImg: {
        width: 200,
        height: 200,
        // backgroundColor: '#DC143C',
        borderRadius: 100,
    },
    name: {
        fontSize: 24,
        fontWeight: 500,
    },
    email: {
        fontSize: 20,
    },
    bioContainer: {
        padding: 15,
    }
})