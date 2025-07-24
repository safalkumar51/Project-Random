import { StyleSheet, Text, View, Image } from 'react-native'
import React from 'react'

const ProfileCard = ({ name, email, profileImage, bio }) => {
    return (
        <View style={styles.profileCard}>
            <View style={styles.profileContainer}>
                <Image style={styles.profileImg} source={{ uri: profileImage }} />
                <Text style={styles.name}>{name}</Text>
                <Text style={styles.email}>{email}</Text>
            </View>
            
            {bio && (
                <View style={styles.bioContainer}>
                    <Text>{bio}</Text>
                </View>
            )}
        </View>
    )
}

export default ProfileCard

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