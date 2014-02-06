/*
 * Hikoboshi v0.2.2
 * A Web Audio-based soft synth
 *
 * by stage7 of Genshiken
 *
 * This software is released under Yet-To-Be-Decided License.
 */

/*
 * Durations:
 * 4 -		whole note
 * 2 -		half note
 * 1 -		quarter note
 * 0.5 -	eighth note
 * 0.25 -	sixteenth note
 * 0.125 -	thirty-second note
 */

var freqPower = 1.059463094; // twelfth root of 2;
var sampleRate = 192000; // TODO: make this dynamic
var crossfade_samples = 300;

function getNoteFreq(diff){ // diff is number of steps to A-4 (440 Hz) either positive (+diff) or negative (-diff)
    var freq = 440 * Math.pow(freqPower, diff);
    return freq;
}

function concatFloat32Array(first, second){
    var firstLength = first.length;
    var result = new Float32Array(firstLength + second.length);

    result.set(first);
    result.set(second, firstLength);

    return result;
}

function getFloat32ArraySamples(array, samples){ // get only the first given number of samples from a Float32Array
    var result = new Float32Array(samples);
    for(var i = 0; i < samples; i++)
        result[i] = array[i];

    return result;
}

function rest(duration){
    // actual note duration in samples
    var samples = quarterLength * duration * sampleRate;
    var noteData = new Float32Array(samples);
    for(var i = 0; i < samples; i++){
        noteData[i] = 0;
    }

    return noteData;
}

function square(note, cycle, duration, isNumSamples){
    // first, calculate the frequency so we can get the period later
    var freq = getNoteFreq(note);
    // actual note duration in samples
    if(isNumSamples == false)
        var samples = quarterLength * duration * sampleRate;
    else
        var samples = Math.floor(duration);
    // now, calculate the number of samples per period given this frequency
    var period = sampleRate / freq;
    // also set this cummulative value to be used in the loop as a boundary for the period
    var periodBoundary = period;
    // set these samples as 1 for each period (set the relative cycle samples)
    var positiveSamplesPerPeriod = cycle * period;
    var positiveSamplesBoundary = 0;
    // finally we have to fill the first 100cycle% samples of each period with 1's and the rest with -1's
    var noteData = new Float32Array(samples);
    for(var i = 0; i < samples; i++){
        if (i < periodBoundary - 1){
            if (positiveSamplesBoundary < positiveSamplesPerPeriod){
                noteData[i] = 1;
                positiveSamplesBoundary++;
            } else {
                noteData[i] = -1;
            }
        } else {
            noteData[i] = -1;
            periodBoundary += period;
            positiveSamplesBoundary = 0;
        }
    }
    noteData = vibrato(noteData, 6, 4, 1);
    return noteData;
}

function periodDuration(note, sampleRate){
    return sampleRate / getNoteFreq(note);
}

function arpeggio(baseNote, secondNote, thirdNote, cycle, duration){
    var arpeggioResolution = 1 / 32;
    // actual arpeggio duration in samples
    var samples = quarterLength * duration * sampleRate;
    // arpeggio note duration in samples given its resolution (lower bound)
    var arpeggioNote = quarterLength * arpeggioResolution * sampleRate;
    var noteData = new Float32Array(0); // initialize the note
    var currentNote = 0;
    var currentDuration = 0;
    var currentArpeggioPeriod = 0;

    while (currentDuration < samples){
        if (thirdNote != null){
            switch(currentNote % 3){
                case 0:
                    var currentNoteValue = baseNote;
                    break;
                case 1:
                    var currentNoteValue = secondNote;
                    break;
                case 2:
                    var currentNoteValue = thirdNote;
                    break;
            }
        } else {
            switch(currentNote % 2){
                case 0:
                    var currentNoteValue = baseNote;
                    break;
                case 1:
                    var currentNoteValue = secondNote;
                    break;
            }
        }
        // calculate duration of arpeggio note based on period: how many samples do I need
        // lower bound for current note generation
        var nextLimit = currentArpeggioPeriod + arpeggioNote;
        // how many samples should the next note last at least given the last note overflow?
        var minNoteDuration = Math.floor(nextLimit - currentDuration);
        // how long this note's period will last
        var period = periodDuration(currentNoteValue, sampleRate);
        // and now, how many periods will we need; we stop when we are just over minNoteDuration
        var numPeriods = Math.ceil(minNoteDuration / period);
        // generate the actual note with its proper duration in samples
        noteData = concatFloat32Array(noteData, square(currentNoteValue, cycle, period * numPeriods, true));

        currentNote++;
        currentArpeggioPeriod += arpeggioNote;
        currentDuration = currentDuration + Math.floor(period * numPeriods);
    }
        
    // cut the array at the proper number of samples
    return getFloat32ArraySamples(noteData, samples);
}

function square_bandlimited(note, cycle, duration) {
    // first, calculate the frequency so we can get the period later
    var freq = getNoteFreq(note);
    // actual note duration in samples
    var samples = quarterLength * duration * sampleRate;
    // now, calculate the number of samples per period given this frequency
    var noteData = new Float32Array(samples);
    for(var i = 0; i < samples; i++){
        noteData[i] = 0;
        var f = freq;
        var current_harmonic = 1;
        while (f < (sampleRate/2))
        {
            var period = sampleRate / f;
            noteData[i] += (1.0/current_harmonic) * Math.sin(2*Math.PI*i/period);
            current_harmonic += 2;
            f = freq * current_harmonic;
        }

    }

    for(var i=0; i<crossfade_samples; ++i) {
        var value = (i/crossfade_samples);
        noteData[i] *= value;
        noteData[samples-i-1] *= value;
    }

    return noteData;
}

function vibrato(noteData, depth, speed, type) {
    // type 1: sinus vibrato
    // type 2: triangle vibrato
    // depth, speed: 0-F
    var depthDec = parseInt(depth, 16);
    var speedDec = parseInt(speed, 16);
    var noteDataLength = noteData.length;
    var result = new Float32Array(noteDataLength);

    switch(type){
        case 2:
            var fx = new Float32Array(noteDataLength);
            for(var i = 0; i < noteDataLength; i++)
                result[i] = (1 + ((-2) * Math.abs(Math.round(0.5 * (i / 1000) * (0.01 + (speedDec * 2.5) / 100)) - (0.5 * (i / 1000) * (0.01 + (speedDec * 2.5) / 100))) * ((depthDec + 1) / 16))) * noteData[i];
            break;
        case 1:
        default:
            for(var i = 0; i < noteDataLength; i++)
                result[i] = (1 - (Math.abs(Math.sin((i / 1000) * (0.01 + (speedDec * 2.5) / 100))) * ((depthDec + 1) / 16))) * noteData[i];
            break;
    }

    return result;
}

function tremolo(){}