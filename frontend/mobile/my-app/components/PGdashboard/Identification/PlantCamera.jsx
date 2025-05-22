import React, { useRef, useState, useEffect } from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import * as ImagePicker from 'expo-image-picker';
import { CameraView, useCameraPermissions } from "expo-camera";
import { Ionicons } from '@expo/vector-icons';

export default function PlantCamera({ onPhotoTaken, onCancel }) {
  const cameraRef = useRef(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [showTip, setShowTip] = useState(false);
  useEffect(() => {
    if (!permission?.granted) {
      requestPermission();
    }

    setShowTip(true);
    const timer = setTimeout(() => {
      setShowTip(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, [permission]);


  const takePhoto = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync({ base64: true, quality: 0.8 });
      onPhotoTaken(photo.uri);
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
      base64: true,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const selected = result.assets[0];
      onPhotoTaken(selected.uri);
    }
  };

  if (!permission?.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text>No access to camera.</Text>
        <TouchableOpacity onPress={requestPermission} style={styles.permissionButton}>
          <Text>Grant Permission</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onCancel} style={{ marginTop: 20 }}>
          <Text>Cancel</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.fullscreenContainer}>
      <CameraView style={{ flex: 1 }} ref={cameraRef} mode="photo" cameraPosition="back">
       {showTip && (
                 <View style={styles.tipPopupBelowButton}>
                   <Text style={styles.tipText}>Move closer to the plant!</Text>
                 </View>
               )}
        <View style={styles.cameraBar}>
          {/* upload img button */}
          <TouchableOpacity onPress={pickImage} style={styles.switchButton}>
            <Ionicons name="image-outline" size={26} color="white" />
            <Text style={styles.modelText}>Upload</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={takePhoto} style={styles.shutterButton} />

            <TouchableOpacity onPress={onCancel} style={styles.cancelButton}>
              <Ionicons name="close-circle-outline" size={24} color="white" />
            </TouchableOpacity>

        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  defaultContainer: {
    width: '100%',
    height: 400,
    overflow: 'hidden',
    borderRadius: 10,
  },
  fullscreenContainer: {
    flex: 1,
    backgroundColor: 'black',
  },
  cameraBar: {
    position: 'absolute',
    bottom: 100,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  shutterButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#E5E5E5",
    borderWidth: 5,
    borderColor: "#FFF",
  },
  cancelButton: {
    padding: 10,
  },
  switchButton: {
    width: 70,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modelText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 12,
    marginTop: 2,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  permissionButton: {
    marginTop: 20,
    backgroundColor: '#ddd',
    padding: 10,
    borderRadius: 5,
  },
    tipPopupBelowButton: {
      position: 'absolute',
      top: '5%',
      left: '50%',
      transform: [{ translateX: -100 }],
      width: 200,
      backgroundColor: '#FFF',
      padding: 8,
      borderRadius: 8,
      elevation: 4,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
    },

    tipText: {
      fontSize: 14,
      textAlign: 'center',
    },
cancelButton: {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: 'rgba(255, 255, 255, 0.1)', 
  paddingHorizontal: 16,
  paddingVertical: 10,
  borderRadius: 25,
  borderWidth: 1,
  borderColor: '#FFF',
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.3,
  shadowRadius: 4,
},

});

