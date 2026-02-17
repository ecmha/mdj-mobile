import API from "@/lib/fetch";
import { DeviceDto } from "./types.d";
import Storage from "@/lib/storage";

export default class DeviceService {
    static async registerDevice(payload: DeviceDto) {
        try {
            console.log('Registering device: ', payload);
            const deviceToken = await Storage.retrieve(Storage.DEVICE_TOKEN_KEY);
            const response = await API.post('devices', { body: JSON.stringify(payload) }, { 'x-mdj-device-token': deviceToken });
            console.log('Device registered successfully: ', response);
            await Storage.save(Storage.DEVICE_TOKEN_KEY, response.deviceToken);
            return response;
        } catch (error) {
            console.info('Error registering device: ', error);
        }

    }
}