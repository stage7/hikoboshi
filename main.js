window.onload = function() {

    var audioContext = new AudioContext();
    var seconds = 50; // time the song will last

    // Creates a one-channel buffer with sampleRate length, using sampleRate sampling rate = 1 second of audio
    var buffer = audioContext.createBuffer(1, audioContext.sampleRate * seconds, audioContext.sampleRate);

    // Get a reference to the buffer data array
    // (just accessing channel 0 because there's only 1 channel)
    var data = buffer.getChannelData(0);
    
    // And fill it with a nice wave playing in A-4 (440 Hz)
    var bufferLength = audioContext.sampleRate * seconds; // seconds * 48 kHz, Game Boy is 11468 Hz
    var increase = 2.0 * Math.PI / bufferLength;
    var t = 0;
    
    var nota = new Float32Array;
    // nota = concatFloat32Array(nota, square(9, 0.75, 0.5, false));
    // nota = concatFloat32Array(nota, square(11, 0.75, 0.5, false));
    // nota = concatFloat32Array(nota, arpeggio(9, 12, 16, 0.75, 1.5));
    // nota = concatFloat32Array(nota, square(11, 0.75, 0.5, false));
    // nota = concatFloat32Array(nota, arpeggio(5, 9, 12, 0.75, 1.5));
    // nota = concatFloat32Array(nota, square(7, 0.75, 0.5, false));
    // nota = concatFloat32Array(nota, arpeggio(0, 4, 7, 0.75, 2));
    // nota = concatFloat32Array(nota, rest(1));
    // nota = concatFloat32Array(nota, square(9, 0.75, 0.5, false));
    // nota = concatFloat32Array(nota, square(11, 0.75, 0.5, false));
    // nota = concatFloat32Array(nota, arpeggio(9, 12, 16, 0.75, 1.5));
    // nota = concatFloat32Array(nota, square(11, 0.75, 0.5, false));
    // nota = concatFloat32Array(nota, arpeggio(5, 9, 12, 0.75, 1.5));
    // nota = concatFloat32Array(nota, square(7, 0.75, 0.5, false));
    // nota = concatFloat32Array(nota, arpeggio(7, 12, 16, 0.75, 2));
    // nota = concatFloat32Array(nota, rest(1));
    // nota = concatFloat32Array(nota, square(16, 0.75, 0.5, false));
    // nota = concatFloat32Array(nota, square(14, 0.75, 0.5, false));
    // nota = concatFloat32Array(nota, arpeggio(9, 12, 16, 0.75, 1.5));
    // nota = concatFloat32Array(nota, square(11, 0.75, 0.5, false));
    // nota = concatFloat32Array(nota, arpeggio(5, 9, 12, 0.75, 1.5));
    // nota = concatFloat32Array(nota, square(7, 0.75, 0.5, false));
    // nota = concatFloat32Array(nota, arpeggio(0, 4, 7, 0.75, 2));
    // nota = concatFloat32Array(nota, square(8, 0.75, 1, false));
    // nota = concatFloat32Array(nota, square(11, 0.75, 1, false));
    // nota = concatFloat32Array(nota, arpeggio(5, 9, 12, 0.75, 1.5));
    // nota = concatFloat32Array(nota, square(9, 0.75, 0.5, false));
    // nota = concatFloat32Array(nota, square(7, 0.75, 1, false));
    // nota = concatFloat32Array(nota, square(11, 0.75, 1, false));
    // nota = concatFloat32Array(nota, arpeggio(9, 12, 16, 0.75, 2.5));
    // nota = concatFloat32Array(nota, rest(1));

    nota = concatFloat32Array(nota, square(9, 0.75, 0.5, false));
    nota = concatFloat32Array(nota, square(11, 0.75, 0.5, false));
    nota = concatFloat32Array(nota, square(12, 0.75, 1.5, false));
    nota = concatFloat32Array(nota, square(11, 0.75, 0.5, false));
    nota = concatFloat32Array(nota, square(9, 0.75, 1.5, false));
    nota = concatFloat32Array(nota, square(7, 0.75, 0.5, false));
    nota = concatFloat32Array(nota, square(7, 0.75, 2, false));
    nota = concatFloat32Array(nota, rest(1));
    nota = concatFloat32Array(nota, square(9, 0.75, 0.5, false));
    nota = concatFloat32Array(nota, square(11, 0.75, 0.5, false));
    nota = concatFloat32Array(nota, square(12, 0.75, 1.5, false));
    nota = concatFloat32Array(nota, square(11, 0.75, 0.5, false));
    nota = concatFloat32Array(nota, square(9, 0.75, 1.5, false));
    nota = concatFloat32Array(nota, square(7, 0.75, 0.5, false));
    nota = concatFloat32Array(nota, square(16, 0.75, 2, false));
    nota = concatFloat32Array(nota, rest(1));
    nota = concatFloat32Array(nota, square(16, 0.75, 0.5, false));
    nota = concatFloat32Array(nota, square(14, 0.75, 0.5, false));
    nota = concatFloat32Array(nota, square(12, 0.75, 1.5, false));
    nota = concatFloat32Array(nota, square(11, 0.75, 0.5, false));
    nota = concatFloat32Array(nota, square(9, 0.75, 1.5, false));
    nota = concatFloat32Array(nota, square(7, 0.75, 0.5, false));
    nota = concatFloat32Array(nota, square(7, 0.75, 2, false));
    nota = concatFloat32Array(nota, square(8, 0.75, 1, false));
    nota = concatFloat32Array(nota, square(11, 0.75, 1, false));
    nota = concatFloat32Array(nota, square(9, 0.75, 1.25, false));
    nota = concatFloat32Array(nota, rest(0.25));
    nota = concatFloat32Array(nota, square(9, 0.75, 0.5, false));
    nota = concatFloat32Array(nota, square(7, 0.75, 1, false));
    nota = concatFloat32Array(nota, square(11, 0.75, 1, false));
    nota = concatFloat32Array(nota, square(9, 0.75, 2.5, false));
    nota = concatFloat32Array(nota, rest(1));
    
    for(var i = 0; i < bufferLength; i++) {
        //data[i] = 2*(Math.floor(Math.cos(t)*(i/bufferLength))+0.5); // we're using cos because it starts at 0 so we won't clip when we start playing
        data[i] = (nota[4*i]+nota[4*i+1]+nota[4*i+2]+nota[4*i+3])/4;
        t += increase;
    }

    // Creates an audio buffer source - something that can play the buffer, and set it to loop
    var bufferSource = audioContext.createBufferSource();
    bufferSource.loop = false;
    bufferSource.buffer = buffer;

    // if you don't connect it, you don't hear it ;-)
    var filter = audioContext.createBiquadFilter();
    filter.type = filter.LOWPASS;
    filter.frequency.value = 18000; // 18 kHz ought to be enough for anybody
    filter.Q.value = 0;
    filter.gain.value = 0;
    
    bufferSource.connect(filter);
    filter.connect(audioContext.destination);
    //bufferSource.connect(audioContext.destination);

    // PLAY!
    bufferSource.start(0);
};