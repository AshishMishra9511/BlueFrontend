import React, { Component } from 'react'
import { TouchableOpacity, View, Image, Text, StyleSheet } from 'react-native'
import { BleManager } from 'react-native-ble-plx';


export default class MainContainer extends Component {
    constructor() {
        super();
        this.manager = new BleManager();
        this.state = {
            info: "", 
            values: {},
            devices : [],
            deviceIds: [],
            error : null,
            isScanning:false,
        }
        this.prefixUUID = "f000aa"
        this.suffixUUID = "-0451-4000-b000-000000000000"
        this.sensors = {
            0: "Temperature",
            1: "Accelerometer",
            2: "Humidity",
            3: "Magnetometer",
            4: "Barometer",
            5: "Gyroscope"
        }
    }

    serviceUUID(num) {
        return this.prefixUUID + num + "0" + this.suffixUUID
    }

    notifyUUID(num) {
        return this.prefixUUID + num + "1" + this.suffixUUID
    }

    writeUUID(num) {
        return this.prefixUUID + num + "2" + this.suffixUUID
    }

    scanForDevices() {
        this.setState({isScanning:!this.state.isScanning});
        this.manager.startDeviceScan(null, null, (error, device) => {
            if (error) {
                console.log(error);
                this.setState({ error: error });
                return
            }
            else {
                this.getDevicesFromIds([...this.state.deviceIds,device.id]);
            }
        });
        setTimeout(this.stopScanning,10000);
    }

    stopScanning = () => {
        this.setState({isScanning:!this.state.isScanning});
        this.manager.stopDeviceScan();
        console.log("device scan finished");
    }

    // componentWillMount() {
    //     const subscription = this.manager.onStateChange((state) => {
    //         if (state === 'PoweredOn') {
    //             this.scanAndConnect();
    //             subscription.remove();
    //         }
    //     }, true);
    // }

    onPressHandler = () => {
        console.log("pres");
        this.scanForDevices();
    }

    getDevicesFromIds = (Ids) =>{
        let antiDuplicateIds = Array.from(new Set(Ids))
        let devices = this.manager.devices(antiDuplicateIds)
        devices.then(data => {
            this.setState({devices:data,deviceIds:antiDuplicateIds});
        });
    }

    connectToDevice = device =>{
        device.connect()
        .then(device=>{
            console.log("connected")
        })
        .catch(error =>{
            console.log(error)
        });
    }
 
    render() {
        console.log("devices datataatatat",this.state.devices);
        let deviceIds = this.state.devices.map((element,index)=>{
            return (
                <TouchableOpacity 
                onPress={() => this.connectToDevice(element)}
                style={{ backgroundColor: "#888", height: 50, display: "flex", justifyContent: "center"}}
                >
                <Text>{index}.   {element.name?element.name:element.id}</Text>
                </TouchableOpacity>
            )
        })
        return (
            <View>
                <TouchableOpacity style={{ backgroundColor: "#000", height: 200, display: "flex", justifyContent: "center", alignItems: "center" }} onPress={this.onPressHandler}>
                {this.state.isScanning ? 
                    (<Text style={{ color: "#fff" }}>Scanning</Text>)
                    :
                    (<Text style={{ color: "#fff" }}>Press Here</Text>)}
                </TouchableOpacity>
                {deviceIds}
            </View>
            
        )
    }
}