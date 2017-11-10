
enum SensorType {
    //% block=sound
	Sound = 6,
    //% block=gesture
    Gesture = 0x0c,
    //% block=encoder
    Encoder = 0x10,   
    //% block=liner
    Liner = 0x27
    
};

enum LightEvent
{
    //% block=dark
    Dark = 1,
    //% block=light
	Light = 3
};

enum GestureEvent
{
    //% block=left
    Left = 2,
    //% block=right
	Right = 1,
    //% block=up
    Up = 3,
    //% block=down
    Down = 4,
    //% block=forward
    Forward = 5,
    //% block=backward
    Backward = 6,
    //% block=clockwise
    Clockwise = 7,
    //% block=anticlockwise
    Anticlockwise = 8,
    //% block=wave
    Wave = 9
};

enum EncoderEvent
{
    //% block=increase
	Increase = 1,
    //% block=decrease
	Decrease = 2,
    //% block=press
	Press = 3
};

enum ColorEvent
{
    //% block=black
	Black = 0,
    //% block=right
    Red = 1,
    //% block=left
    Green = 2,
    //% block=blue
    Blue = 3,
    //% block=white
    White = 4,
};

enum LinerEvent
{
    //% block=left
	Left = 5,
    //% block=right
    Right = 6
};

/**
 * Functions to operate G2 module.
 */
//% weight=50 color=#E5B646 icon="\uf108" block="Sensor"
namespace sensor
{
    /**
     * Do something when the sound sensor detects a loud sound.
     * @param handler code to run
     */
    //% blockId=sensor_sound_create_event block="on loud sound"
    //% weight=100 blockGap=8
    //% help=
    export function onLoudSound(handler: Action) {
        const eventId = driver.subscribeToEventSource(SensorType.Sound);
        control.onEvent(eventId, LightEvent.Light, handler);
    }
    
    /**
     * Do something when the gesture sensor detects a motion event (move left, up etc...)
     * @param event type of gesture to detect
     * @param handler code to run
     */
    //% blockId=sensor_gesture_create_event block="on Gesture|%event"
    //% weight=99 blockGap=8
    //% help=
    export function onGesture(event: GestureEvent, handler: Action) {
        const eventId = driver.subscribeToEventSource(SensorType.Gesture);
        control.onEvent(eventId, event, handler);
    }
    
    /**
     * Do something when the encoder sensor detects a motion event (increase, decrease etc...)
     * @param event type of encoder to detect
     * @param handler code to run
     */
    //% blockId=sensor_encoder_create_event block="on Encoder|%event"
    //% weight=98 blockGap=8
    //% help=
    export function onEncoder(event: EncoderEvent, handler: Action) {
        const eventId = driver.subscribeToEventSource(SensorType.Encoder);
        control.onEvent(eventId, event, handler);
    }
    
    /**
     * Do something when the liner sensor detects a motion event (left, right etc...)
     * @param event type of liner to detect
     * @param handler code to run
     */
    //% blockId=sensor_liner_create_event block="on Liner|%event"
    //% weight=97 blockGap=8
    //% help=
    export function onLiner(event: LinerEvent, handler: Action) {
        const eventId = driver.subscribeToEventSource(SensorType.Liner);
        control.onEvent(eventId, event, handler);
    }
    
    /**
     * Do something when the color sensor detects a color event (red, blue etc...)
     * @param event type of color to detect
     * @param handler code to run
     */
    //% blockId=sensor_color_create_event block="on Color|%event"
    //% weight=96 blockGap=8
    //% help=
    export function onColor(event: ColorEvent, handler: Action) {
        const eventId = driver.subscribeToEventSource(SensorType.Liner);
        control.onEvent(eventId, event, handler);
    }
    
    /**
     * Set the sound sensor threshold for triggering an event.
     * @param value the value of threshold level
     */
    //% blockId=sensor_set_sound_threshold block="set sound threshold to|%value"
    //% value.min=0 value.max=1023 value.defl=200
    //% weight=100 blockGap=8
    //% advanced=true
    //% help=
    export function setSoundThreshold(value: number)
    {
        let data: Buffer = pins.createBuffer(5);
        data[0] = 0x03;
        data[1] = 1; // 0: Low threshold; 1: High threshold
        data[2] = value & 0xff;
        data[3] = value >> 8;
        data[4] = 0; // 0: Save to ram; 1: Save to flash.
        driver.i2cSendBytes(6, data);
    }
    
    /**
     * Get the noise level from the sound sensor.
     */
    //% blockId=grove_get_sound_value block="sound level"
    //% weight=99 blockGap=8
    //% advanced=true
    //% help=
    export function soundLevel(): number
    {
        let data: Buffer = pins.createBuffer(2);
        driver.i2cSendByte(0x06, 2);
        data = driver.i2cReceiveBytes(0x06, 2);
        return (data[0] + data[1] * 256);
    }

    /**
     * See if the sound sensor detected a loud sound.
     */
    //% blockId=sensor_is_sound_event_generate block="Loud sound was triggered"
    //% weight=97 blockGap=8
    //% advanced=true
    //% help=
    export function wasLoudSoundTriggered(): boolean
    {
        if(driver.addrBuffer[SensorType.Sound] == 0)onLoudSound(() => {});
        if(driver.lastStatus[SensorType.Sound] == 3) return true;
        return false;
    }
    
    /**
     * Get the gesture sensor event, see if it detected a motion (move left etc...)
     * @param type of gesture device
     * @param event of gesture device
     */
    //% blockId=sensor_is_gesture_event_generate block="Gesture|%event|was triggered"
    //% weight=96 blockGap=8
    //% advanced=true
    //% help=
    export function wasGestureTriggered(event: GestureEvent): boolean
    {
        let eventValue = event;
        if(driver.addrBuffer[SensorType.Gesture] == 0)onGesture(event, () => {});
        if(driver.lastStatus[SensorType.Gesture] == eventValue)return true;
        return false;
    }
    
    /**
     * Get the encoder sensor event, see if it detected a motion (increase, decrease etc...)
     * @param type of encoder device
     * @param event of encoder device
     */
    //% blockId=sensor_is_encoder_event_generate block="Encoder|%event|was triggered"
    //% weight=95 blockGap=8
    //% advanced=true
    //% help=
    export function wasEncoderTriggered(event: EncoderEvent): boolean
    {
        let eventValue = event;
        if(driver.addrBuffer[SensorType.Encoder] == 0)onEncoder(event, () => {});
        if(driver.lastStatus[SensorType.Encoder] == eventValue)return true;
        return false;
    }
    
    /**
     * Get the liner sensor event, see if it detected a motion (left, right etc...)
     * @param type of liner device
     * @param event of liner device
     */
    //% blockId=sensor_is_liner_event_generate block="Liner|%event|was triggered"
    //% weight=94 blockGap=8
    //% advanced=true
    //% help=
    export function wasLinerTriggered(event: LinerEvent): boolean
    {
        let eventValue = event;
        if(driver.addrBuffer[SensorType.Liner] == 0)onLiner(event, () => {});
        if(driver.lastStatus[SensorType.Liner] == eventValue)return true;
        return false;
    }
    
    /**
     * Get the color sensor event, see if it detected a motion (red, blue etc...)
     * @param type of color device
     * @param event of color device
     */
    //% blockId=sensor_is_color_event_generate block="Color|%event|was triggered"
    //% weight=93 blockGap=8
    //% advanced=true
    //% help=
    export function wasColorTriggered(event: ColorEvent): boolean
    {
        let eventValue = event;
        if(driver.addrBuffer[SensorType.Liner] == 0)onColor(event, () => {});
        if(driver.lastStatus[SensorType.Liner] == eventValue)return true;
        return false;
    }
}