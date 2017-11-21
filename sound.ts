enum SoundType {
    //% block=buzzer
    Buzzer = 8,
};

/**
 *
 */
enum BeatFractionType
{
    //% block="1"
	Whole = 0,
    //% block="2"
	Double = 1,
    //% block="4"
	Quadruple = 2,
    //% block="8"
	Octuple = 3,
    //% block="1/2"
	Half = 4,
    //% block="1/4"
	Quarter = 5,
    //% block="1/8"
	Eighth = 6,
    //% block="1/16"
	Sixteenth = 7
};

const Notes = [
    Note.C3, Note.CSharp3, Note.D3, Note.Eb3, Note.E3, Note.F3, Note.FSharp3, Note.G3, Note.GSharp3, Note.A3, Note.Bb3, Note.B3,
    Note.C4, Note.CSharp4, Note.D4, Note.Eb4, Note.E4, Note.F4, Note.FSharp4, Note.G4, Note.GSharp4, Note.A4, Note.Bb4, Note.B4,
    Note.C5, Note.CSharp5, Note.D5, Note.Eb5, Note.E5, Note.F5, Note.FSharp5, Note.G5, Note.GSharp5, Note.A5, Note.Bb5, Note.B5
]

enum MelodyType
{
    //% block="ba ding"
    BaDing = 0,
    //% block="wawawawaa"
	Wawawawaa = 1,
    //% block="jump up"
	JumpUp = 2,
    //% block="jump down"
	JumpDown = 3,
    //% block="power up"
	PowerUp = 4,
    //% block="power down"
	PowerDown = 5,
    //% block="magic wand"
	MagicWand = 6,
    //% block="siren"
	Siren = 7,
};

enum RepeatType
{
    //% block="once"
    Once = 0,
    //% block="forever"
    Forever = 1,
};

/**
 * Functions to operate Grove Zero device.
 */
//% weight=49 color=#B64B4D icon="\uf028" block="Sound"
namespace sound
{
    /**
     * Play a tone for the length of the beat time.
     * @param frequency the frequency of the tone to play.
     * @param ms tone duration in milliseconds (ms)
     */
    //% blockId=sound_buzzer_play_tone block="play tone|%note=sound_buzzer_note|for %beat=sound_buzzer_beat"
    //% weight=100 blockGap=8
    export function playTone(frequency: number, ms: number)
    {

        let data: Buffer = pins.createBuffer(5);
        data[0] = 0x12;
        data[1] = frequency & 0xff;
        data[2] = (frequency >> 8) & 0xff;

        // 0 is a special value for playing infinitely (used by ringTone)
        if (ms == 0) {
            ms = 1;
        }
        data[3] = ms & 0xff;
        data[4] = (ms >> 8) & 0xff;

        driver.i2cSendBytes(8, data);
        basic.pause(ms);
    }

    /**
     * Play a tone continuously.
     * @param frequency the frequency of the tone to play.
     */
    //% blockId=sound_buzzer_ring_tone block="ring tone|%note=sound_buzzer_note"
    //% weight=99
    //% useEnumVal=1
    export function ringTone(frequency: number)
    {
        let data: Buffer = pins.createBuffer(5);
        data[0] = 0x12;
        data[1] = frequency & 0xff;
        data[2] = (frequency >> 8) & 0xff;

        // 0 is a special value for playing infinitely
        data[3] = 0;
        data[4] = 0;

        driver.i2cSendBytes(8, data);
    }

    /**
     * Starts playing a sound.
     * @param melody the melody needed to play.
     * @param repeat the repeating type.
     */
    //% blockId=sound_buzzer_play_melody block="play sound|%melody"
    //% weight=98
    export function playSound(melody: MelodyType)
    {
        let data: Buffer = pins.createBuffer(3);
        data[0] = 0x03;
        data[1] = melody;
        data[2] = RepeatType.Once;
        driver.i2cSendBytes(8, data);
    }

    /**
     * Rest (play nothing) for a given time duration.
     * @param time the stop play time
     */
    //% blockId=sound_buzzer_rest_for_time block="rest for %time=sound_buzzer_beat"
    //% weight=96
    export function rest(time: number)
    {
        stopPlay();
        basic.pause(time);
    }


    /**
     * Return the duration of a beat in milliseconds (the beat fraction).
     * @param fraction the fraction of the current whole note, eg: BeatFractionType.Half
     */
    //% blockId=sound_buzzer_beat block="%fraction|beat"
    //% weight=1 blockGap=8
    export function beat(fraction: BeatFractionType = BeatFractionType.Whole): number {
        let bpm = sound.getTempo();
        let beat = 60000 / bpm;
        switch(fraction) {
            case BeatFractionType.Half: beat /= 2; break;
            case BeatFractionType.Quarter: beat /= 4; break;
            case BeatFractionType.Eighth: beat /= 8; break;
            case BeatFractionType.Sixteenth: beat /= 16; break;
            case BeatFractionType.Double: beat *= 2; break;
            case BeatFractionType.Quadruple: beat *= 4; break;
            case BeatFractionType.Octuple: beat *= 8; break;
        }
        return beat >> 0;
    }

    /**
     * Set tempo to a number of beats per minute (bpm).
     * @param bpm beats Per Minute, eg: 120
     */
    //% blockId=sound_buzzer_set_tempo_to block="set tempo to (bpm)|%bpm"
    //% value.bpm=60 value.bpm=960
    //% weight=95 blockGap=8
    export function setTempoTo(bpm: number = 120)
    {
        let data: Buffer = pins.createBuffer(4);
        data[0] = 0x05;
        data[1] = bpm & 0xff;
        data[2] = (bpm >> 8) & 0xff;
        data[3] = 0; // 0: Save to ram; 1: Save to flash.
        driver.i2cSendBytes(8, data);
    }

    /**
     * Change tempo by a number beats per minute (bpm).
     * @param bpm increase tempo by +bpm, or decrease tempo by -bpm. eg: 10
     */
    //% blockId=sound_buzzer_change_tempo_by block="change tempo by (bpm)|%bpm"
    //% weight=94 blockGap=8
    export function changeTempoBy(bpm: number)
    {
        let data: Buffer = pins.createBuffer(5);
        data[0] = 0x06;
        if(bpm >= 0)data[1] = 1;
        else
        {
            data[1] = 0;
            bpm = bpm * (-1);
        }
        data[2] = bpm & 0xff;
        data[3] = (bpm >> 8) & 0xff;
        data[4] = 0; // 0: Save to ram; 1: Save to flash.
        driver.i2cSendBytes(8, data);
    }

    /**
     * Get the current tempo in beats per minute (bpm).
     */
    //% blockId=sound_get_buzzer_tempo_to block="tempo (bpm)"
    //% weight=93
    export function getTempo(): number
    {
        let data: Buffer = pins.createBuffer(2);
        driver.i2cSendByte(8, 0x07);
        data = driver.i2cReceiveBytes(8, 2);
        return (data[0] + data[1] * 256);
    }

    /**
     * Returns the frequency of a note.
     * @param note the note name, eg: Note.C4
     */
    //% blockId=sound_buzzer_note block="%note"
    //% note.fieldEditor="note" note.defl="262"
    //% note.fieldOptions.editorColour="#B64B4D" note.fieldOptions.decompileLiterals=true
    //% useEnumVal=1 shim=TD_ID
    //% weight=2 blockGap=8
    export function notePicker(note: Note): number {
        return note;
    }

    export function stopPlay() {
        driver.i2cSendByte(8, 0x04);
    }
}