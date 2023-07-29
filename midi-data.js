var isMidiReady = false;

function connectMIDI() {
    navigator.requestMIDIAccess()
    .then(
        (midi) => {
            midiReady(midi)
        },
        (err) => console.log('Something went wrong', err));
}

function midiReady(midi) {
    // Also react to device changes.
    midi.addEventListener('statechange', (event) => initDevices(event.target));
    initDevices(midi); // see the next section!
}

function initDevices(midi) {
    // Reset.
    midiOut = [];
    
    // MIDI devices that you send data to.
    const outputs = midi.outputs.values();
    for (let output = outputs.next(); output && !output.done; output = outputs.next()) {
        // console.log(output.value);
        midiOut.push(output.value);
    }
    
    // for (const output of midiOut) {
    //     console.log(output);
    //     sendMidiMessage(60,100,500);
    // }

    isMidiReady = true;
}

function sendMidiMessage(pitch, velocity, duration) {
    const NOTE_ON = 0x90;
    const NOTE_OFF = 0x80;
    
    const device = midiOut[1];
    const msgOn = [NOTE_ON, pitch, velocity];
    const msgOff = [NOTE_OFF, pitch, velocity];
    
    // First send the note on;
    device.send(msgOn); 
        
    // Then send the note off. You can send this separately if you want 
    // (i.e. when the button is released)
    device.send(msgOff, duration); 
}
