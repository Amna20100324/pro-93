import React, { Component } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image,
  ImageBackground,
  TextInput
} from "react-native";
import * as Permissions from "expo-permissions";
import { BarCodeScanner } from "expo-barcode-scanner";
import db from "../config";

const bgImage = require("../assets/background2.png");
const appIcon = require("../assets/appIcon.png");
const appName = require("../assets/appName.png");

export default class TransactionScreen extends Component {
    constructor (props){
    super (props);
    this.state = {
    domState: "normal",
    hasCameraPermissions: null,
    scanned: false,
    bookId: "",
    studentId: ""
  };
}

getCameraPermissions = async domState => {
  const { status } = await Permissions.askAsync(Permissions.CAMERA);

  this.setState({
  /*status === "granted" is true when user has granted permission
  status === "granted" is false when user has not granted the permission
  */
  hasCameraPermissions: status === "granted",
  domState: domState,
  scanned: false
});
};

handleBarCodeScanned = async ({ type, data }) => {
const { domState } = this.state;

if (domState === "bookId") {
  this.setState({
    bookId: data,
    domstate: "normal",
    scanned: true
  });
}else if (domState === "studentId") {
  this.setState({
    studentId: data,
    domState:"normal",
    scanned: true
  });
  }
 };

 handleTransaction = () => {
  var { bookId } = this.state;
  db.collection("books")
  .doc(bookId)
  .get()
  .then(doc => {
  var book = doc.data();
  if (book.is_book_available) {
  this.initiateBookIssue();
   } else {
  this. initiateBookReturn();
   }
  });
};

 initiateBookIssue = () => {
  console.log("Book issued to the student!");
 };

 initiateBookReturn = () => {
  console.log("Book returned to the library!");
 }; 

 render(){
  const {bookId, studentId, domState, scanned }= this.state;
  if (domState !== "normal") {
    return (
      <BarCodeScanner
      on BarCodeScanner ={ scanned ? undefined : this.handleBarCodeScanned}
      style={StyleSheet.absoluteFillObject}
      />
    );
  }
  return(
    <View style={style.container}>
      <ImageBackground source={bgImage} style={styles.bgImage}>
       <View style={styles.upperContainer}>
        <Image source={appIcon} style={styles.appIcon}/>
        <Image source={appName} style={styles.appName}/>
       </View>
       <View style={styles.lowerContainer}>
        <View style={styles.textInputContainer}>
          <TextInput
          style={styles.textinput}
          placeholder={"Book Id"}
          placeholderTextColor={"#FFFFFF"}
          value={bookId}
          />
          <TouchableOpacity
          style={styles.scanbutton}
          onPress={()  => this.getCameraPermissions("bookId")}
          >
            <Text style={styles.scanbuttonText}>Scan</Text>
          </TouchableOpacity>
          </View>
          <View style={[styles.textInputContainer, {marginTop: 25 }]}>
            <TextInput
            style={styles.textinput}
            placeholder={"Student Id "}
            placeholderTextColor={"#FFFFFF"}
            value={studentId}
            />
            <TouchableOpacity
            style={styles.scanbutton}
            onPress={() => this.getCameraPermissions(studentId)}
            >
              <Text style={styles.scanbuttonText}>Scan</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
           style={[styles.button, {marginTop: 25}]}
           onPress={this.handleTransaction}
          >
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
       </View>
      </ImageBackground>
    </View>
  );
}
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:"#FFFFFF"
  },
  bgImage:{
    flex:1,
    resizeMode: "cover",
    justifyContent: "center",
    alignItems: "center"
  },
  upperContainer:{
    flex:0.5,
    justifyContent:"center",
    alignItems: "center"
  },
  appIcon:{
    width:200,
    height:200,
    resizeMode: "contain",
    marginTop: 80
  },
  appName:{
    width:80,
    height:80,
    resizeMode: "contain"
  },
  lowerContainer:{
    flex:0.5,
    alignItems: "center"
  },
  textInputContainer:{
    borderWidth:2,
    borderRadius:10,
    flexDirection:£row,
    backgroundColor: "#9DFD24",
    borderColor: "#FFFFFF"
  },
})