import { StyleSheet, Text, View,TextInput, TouchableOpacity, Alert, } from 'react-native'
import React, { useEffect, useRef , useState } from 'react'

const OtpScreen = () => {
    const text1 = useRef();
    const text2 = useRef();
    const text3 = useRef();
    const text4 = useRef();
    const text5 = useRef();
    const text6 = useRef();
    const [f1, setf1] = useState('');
    const [f2, setf2] = useState('');
    const [f3, setf3] = useState('');
    const [f4, setf4] = useState('');
    const [f5, setf5] = useState('');
    const [f6, setf6] = useState('');

    const [count, setcount] = useState(60);
    
    useEffect(()=>{
    const interval =     setInterval(()=>{
        if(count==0){
            clearInterval(interval)
        }
        else{
            setcount(count-1);
        }
            
        },1000)
        return ()=>{
            clearInterval(interval)
        }
    },[count])

    const otpValidate=()=>{
        let otp = '123456';
        let enterdOtp = f1+f2+f3+f4+f5+f6;
        if(enterdOtp == otp){
            Alert.alert('OTP Verfied');
        }
        else{
            Alert.alert('Wrong OTP');
        }
    }

  return (
    <View style={styles.otpContainer}>
        <Text style={styles.title}>OTP Verification</Text>
        <View style={styles.otpView}>
             <TextInput 
              ref={text1} 
             style={[styles.inputView,{borderColor:f1.length >=1 ? 'royalblue' : 'grey'}]}
             keyboardType="number-pad"
             maxLength={1}
             value={f1}
             // after filling one box it will move to the next box 
             onChangeText={txt=>{
                setf1(txt);
                if(txt.length >=1){
                    text2.current.focus();
                }
             }}
             />
              <TextInput  
              ref={text2} 
           style={[styles.inputView,{borderColor:f2.length >=1 ? 'royalblue' : 'grey'}]}
              keyboardType="number-pad"
             maxLength={1}
             value={f2}
              onChangeText={txt=>{
                setf2(txt);
                if(txt.length >=1){
                    text3.current.focus();
                }
               else  if(txt.length <1){
                    text1.current.focus();
                }
             }}
             />
               <TextInput  ref={text3} 
                style={[styles.inputView,{borderColor:f3.length >=1 ? 'royalblue' : 'grey'}]}
               keyboardType="number-pad"
             maxLength={1}
             value={f3}
              onChangeText={txt=>{
                setf3(txt);
                if(txt.length >=1){
                    text4.current.focus();
                }
                if(txt.length <1){
                    text2.current.focus();
                }
             }}
             />
                <TextInput  
                ref={text4} 
               style={[styles.inputView,{borderColor:f4.length >=1 ? 'royalblue' : 'grey'}]}
                keyboardType="number-pad"
             maxLength={1}
             value={f4}
              onChangeText={txt=>{
                setf4(txt);
                if(txt.length >=1){
                    
                    text5.current.focus();
                }
                if(txt.length <1){
                    text3.current.focus();
                }
             }}
             />
                 <TextInput  
                 ref={text5} 
           style={[styles.inputView,{borderColor:f5.length >=1 ? 'royalblue' : 'grey'}]}
                 keyboardType="number-pad"
             maxLength={1}
             value={f5}
              onChangeText={txt=>{
                 setf5(txt);
                if(txt.length >=1){
                   
                    text6.current.focus();
                }
              else  if(txt.length <1){
                    text4.current.focus();
                }
             }}
             />
                  <TextInput 
                  ref={text6}
                    style={[styles.inputView,{borderColor:f6.length >=1 ? 'royalblue' : 'grey'}]}
                    keyboardType="number-pad"
                 maxLength={1}
                 value={f6}
                  onChangeText={txt=>{
                setf6(txt);
                if(txt.length <1){
                    text5.current.focus();
                }
             }}
             />
              
              
        </View>
        <View style = {styles.resendBtn}>
            <Text style={{fontSize:15,fontWeight:"700",color: count==0 ? 'royalblue': 'grey'}}
            onPress={()=>{
                setcount(60);
            }}
            >Resend OTP</Text>
           {count !==0 && (
             <Text style={{marginLeft:10,fontSize:15,fontWeight:""}}>{count + ' seconds'}</Text>
           )}
        </View>

      <TouchableOpacity 
      disabled={
        f1 !== '' &&
         f2 !== '' &&
          f3 !== '' && 
          f4 !== '' && 
          f5 !== '' && 
          f6 !==''?
           false :true
      }
      style={[styles.verifyButton,
      {backgroundColor: 
        f1 !== '' &&
       f2 !== '' &&
        f3 !== '' && 
        f4  !== '' &&
         f5 !== '' &&
          f6 !=='' 
          ?'royalblue' : 'grey'}]}
          onPress={()=> otpValidate()}>
        <Text style={styles.verifyButtonTxt}>Verify OTP</Text>
      </TouchableOpacity>
      
    </View>
  )
}

export default OtpScreen

const styles = StyleSheet.create({
    otpContainer:{
        flex:1
        
    },
     title:{
        alignSelf:'center',
        marginTop:100,
        fontWeight:'700',
        fontSize:28,
        color:'#333',

    },
    otpView:{
     
        width:"100%",
        justifyContent:'center',
        alignItems:'center',
        flexDirection:'row',
        marginTop:100,
    },
    inputView:{
        width:50,
        height:50,
        borderWidth:3,
        borderRadius:10,
        marginLeft:8,
        textAlign:'center',
        fontSize:18,
        fontWeight:"700",
        
    },
    verifyButton:{
        width:"90%",
        height:50,
        backgroundColor:"royalblue",
        borderRadius:20,
        alignSelf:'center',
        justifyContent:"center",
        marginTop:50,
        alignItems:"center"

    },
    verifyButtonTxt:{
        color:"white",
        fontSize:20,
        fontWeight:"700"

    },
    resendBtn:{
        flexDirection:"row",
        alignSelf:'center',
       // justifyContent:'center',
        marginTop:30,
        marginBottom:10,

    }


   
})