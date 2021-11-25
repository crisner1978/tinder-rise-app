import React, { useState, useEffect } from 'react'
import { SafeAreaView, Text, View, TextInput, Button, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, FlatList } from 'react-native'
import Header from "../components/Header"
import getMatchedUserInfo from "../lib/getMatchedUserInfo"
import useAuth from "../hooks/useAuth"
import { useRoute } from "@react-navigation/core";
import tw from 'tailwind-rn'
import SenderMessage from '../components/SenderMessage'
import ReceiverMessage from "../components/ReceiverMessage"
import { addDoc, collection, serverTimestamp, onSnapshot, orderBy, query } from "@firebase/firestore"
import { db } from "../firebase"

const MessageScreen = () => {
    const [input, setInput] = useState('')
    const [messages, setMessages] = useState([])
    const { user } = useAuth()
    const { params: { matchDetails } } = useRoute()

    useEffect(() => 
        onSnapshot(
            query(
                collection(db, 'matches', matchDetails.id, 'messages'), 
                orderBy('timestamp', 'desc')
                ), snapshot => setMessages(snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }))))
   , [db, matchDetails])
    
    const sendMessage = () => {
        addDoc(collection(db, 'matches', matchDetails.id, 'messages'), {
            timestamp: serverTimestamp(),
            userId: user.uid,
            displayName: user.displayName,
            photoURL: matchDetails.users[user.uid].photoURL,
            message: input,
        })
        setInput('');
    }

    return (
        <SafeAreaView style={tw('flex-1')}>
            <Header title={getMatchedUserInfo(matchDetails.users, user.uid)?.displayName} callEnabled />
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={tw('flex-1')}
                keyboardVeritcalOffset={10}
            >

            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <FlatList 
                    data={messages} 
                    style={tw('pl-4')}
                    inverted={-1}
                    keyExtractor={item => item.id}
                    renderItem={({ item: message }) => 
                        message.userId === user.uid ? (
                            <SenderMessage key={message.id} message={message} />
                        ) : (
                            <ReceiverMessage key={message.id} message={message} />
                        )}
                    />
            </TouchableWithoutFeedback>
            <View style={tw('flex-row justify-between items-center border-t border-gray-200 px-5 py-2')}>
                <TextInput 
                    style={tw('h-10 text-lg')}
                    placeholder="Send a Message..."
                    onChangeText={setInput}
                    onSubmitEditing={sendMessage}
                    value={input}
                />
                <Button title="Send" color="#FF5864" onPress={sendMessage} />
            </View>
            </KeyboardAvoidingView>

            
        </SafeAreaView>
    )
}

export default MessageScreen
