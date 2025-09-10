import { useEffect, useState } from 'react';
import { Capacitor } from '@capacitor/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Storage } from '@capacitor/storage';
import { Device } from '@capacitor/device';
import { Network } from '@capacitor/network';
import { StatusBar, Style } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';

export const useCapacitor = () => {
  const [isNative, setIsNative] = useState(false);
  const [deviceInfo, setDeviceInfo] = useState<any>(null);
  const [networkStatus, setNetworkStatus] = useState<any>(null);

  useEffect(() => {
    const initCapacitor = async () => {
      // Check if running on native platform
      setIsNative(Capacitor.isNativePlatform());

      // Get device info
      if (Capacitor.isNativePlatform()) {
        try {
          const info = await Device.getInfo();
          setDeviceInfo(info);

          // Set status bar style
          await StatusBar.setStyle({ style: Style.Light });
          
          // Hide splash screen after app loads
          await SplashScreen.hide();

          // Get network status
          const status = await Network.getStatus();
          setNetworkStatus(status);

          // Listen for network changes
          Network.addListener('networkStatusChange', (status) => {
            setNetworkStatus(status);
          });

        } catch (error) {
          console.error('Capacitor initialization error:', error);
        }
      }
    };

    initCapacitor();
  }, []);

  const takePicture = async () => {
    if (!Capacitor.isNativePlatform()) {
      throw new Error('Camera not available on web platform');
    }

    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera
      });

      return image.dataUrl;
    } catch (error) {
      console.error('Camera error:', error);
      throw error;
    }
  };

  const selectImage = async () => {
    if (!Capacitor.isNativePlatform()) {
      throw new Error('Photo library not available on web platform');
    }

    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Photos
      });

      return image.dataUrl;
    } catch (error) {
      console.error('Photo selection error:', error);
      throw error;
    }
  };

  const storeData = async (key: string, value: any) => {
    try {
      await Storage.set({
        key,
        value: JSON.stringify(value)
      });
    } catch (error) {
      console.error('Storage error:', error);
      throw error;
    }
  };

  const getData = async (key: string) => {
    try {
      const { value } = await Storage.get({ key });
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error('Storage retrieval error:', error);
      return null;
    }
  };

  const removeData = async (key: string) => {
    try {
      await Storage.remove({ key });
    } catch (error) {
      console.error('Storage removal error:', error);
      throw error;
    }
  };

  return {
    isNative,
    deviceInfo,
    networkStatus,
    takePicture,
    selectImage,
    storeData,
    getData,
    removeData
  };
};