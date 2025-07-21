import React from 'react';
import { StyleSheet, View ,Text ,TextInput} from 'react-native';
import { actions, RichEditor, RichToolbar } from 'react-native-pell-rich-editor';

const RichTextEditor = ({ editorRef, onChange }) => {
  return (
    <View style={styles.container}>
      <RichToolbar
        editor={editorRef}
        actions={[
         // actions.insertImage,
          actions.setBold,
          actions.setItalic,
          actions.insertBulletsList,
          actions.insertOrderedList,
          actions.insertLink,
          actions.keyboard,
          actions.setStrikethrough,
          actions.setUnderline,
          actions.removeFormat,
          actions.insertVideo,
          actions.checkboxList,
          actions.undo,
          actions.redo,
          actions.heading1,
          actions.heading4
        ]}
        iconMap={{
            [actions.heading1]:({tintColor})=><Text style={{color:tintColor}}>H1</Text>,
            [actions.heading4]:({tintColor})=><Text style={{color:tintColor}}>H4</Text>
        }}
        style={styles.richBar}
        flatContainerStyle={styles.listStyle}
        selectedIconTint="green"
        disabled={false}
      />

  <RichEditor  
    ref = {editorRef}
    containerStyle={styles.rich}
    editorStyle={styles.contentStyle}
  placeholder={"what's on your mind ? ....."}
    onChange={onChange}
    />

    </View>
  );
};

export default RichTextEditor;

const styles = StyleSheet.create({
  container: {
    minHeight: 180,
   //backgroundColor: '',
   paddingLeft:10,
   paddingRight:10,
  },
  richBar: {
       borderTopRightRadius:30,
       borderTopLeftRadius:30,
       backgroundColor:'lightgrey',
       padding:10
  },
  listStyle: {
    paddingHorizontal: 10,
  },
  rich:{
    minHeight:120,
    flex:1,
    borderWidth:1.5,
    borderTopWidth:0,
    borderBottomLeftRadius:30,
    borderBottomRightRadius:30,
    borderColor:"lightgray",
   // padding:5,
  }
});
