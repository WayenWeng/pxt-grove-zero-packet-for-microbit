
enum MotorTpye {
    //% block=servo
    Servo = 0x24,
    //% block=wheel
    Wheel = 0x26
};

/**
 * Functions to operate G2 module.
 */
//% weight=48 color=#A26236 icon="\uf108" block="Motor"
namespace motor
{
    /**
     * Move the servo by a degree.
     * @param degree set the degree you want to move.
     */
    //% blockId=motor_set_servo_move block="servo move|%degree"
    //% degree.min=0 degree.max=180 degree.defl=0
    //% weight=100 blockGap=8
    //% help=
    export function moveServo(degree: number)
    {

    }
    
    /**
     * Read the servo degree.
     */
    //% blockId=motor_read_servo_degree block="servo degree"
    //% weight=100 blockGap=8
    //% help=
    export function readServo(): number
    {
        
        return 0;
    }
    
    /**
     * Set the wheel run by a speed.
     * @param left set the left speed you want to run.
     * @param right set the right speed you want to run.
     */
    //% blockId=motor_set_wheel_run block="wheel run|left|%left|right|%right"
    //% left.min=-255 left.max=255 left.defl=0
    //% right.min=-255 right.max=255 right.defl=0
    //% weight=98 blockGap=8
    //% help=
    export function runWheel(left: number, right: number)
    {

    }
}