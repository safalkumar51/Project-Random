import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Dimensions, TouchableOpacity } from 'react-native';
import BackButton from '../../components/BackButton';

const { width, height } = Dimensions.get('window');

const HelpScreen = () => {
    const [problem, setProblem] =useState();

    const submitHandler = () => {
        return;
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <BackButton />
                <Text style={styles.headerText}>
                    Help & Support
                </Text>
            </View>
            <Text style={styles.text}>
                If you're experiencing any issues or have questions, please reach out to our support team at support@example.com.
                {"\n\n"}For In-app support :
            </Text>
            <TextInput
                style={styles.InputStyle}
                placeholder='Write your problem here...'
                placeholderTextColor='#666'
                value={problem}
                onChangeText={(problem) => setProblem(problem)}
                autoCapitalize="none"
                autoCorrect={false}
                multiline={true}
                textAlignVertical="top"
                maxLength={300}
            />
            <TouchableOpacity style={styles.submitBtn}>
                <Text style={styles.submitText} onPress={submitHandler}>Start</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

export default HelpScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginHorizontal: -15,
        marginVertical: 15,
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#bbb',
    },
    headerText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    text: {
        fontSize: 16,
        lineHeight: 24,
        marginBottom: 10
    },
    InputStyle: {
        padding: 10,
        width: width * 0.88,
        minHeight: height * 0.2,
        backgroundColor: '#fff',
        fontSize: 16,
        color: '#333',
        borderColor: '#ccc',
        borderRadius: 10,
        borderWidth: 2,
        flex: 1,
    },
    submitBtn: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#2e64e5',
        borderRadius: 11,
        marginHorizontal: width * 0.29,
        marginVertical: 20
    },
    submitText: {
        paddingVertical: 15,
        fontSize: 18,
        fontWeight: 600,
        color: '#ffffff',
    }
});
