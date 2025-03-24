import React, { useState, useEffect } from 'react';
import './styles/App.css';
import chords from './data/chords.json'; // Import chord data
import keymap from './data/keymap.json'; // Import keymap data
import KeyboardDiagram from './components/KeyboardDiagram'; // Import the new component

function App() {
    const [selectedNote, setSelectedNote] = useState('C'); // Default to 'C'
    const [selectedChord, setSelectedChord] = useState('M'); // Default to 'M'
    const [isPushPlayable, setIsPushPlayable] = useState(false); // Playability for push
    const [isPullPlayable, setIsPullPlayable] = useState(false); // Playability for pull
    const [toneButtonsPush, setToneButtonsPush] = useState({}); // Buttons for push
    const [toneButtonsPull, setToneButtonsPull] = useState({}); // Buttons for pull
    const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const chordTypes = ['M', 'm', '7', 'm7', 'M7', 'm7-5', 'sus4', 'dim', 'aug']; // Chord types

    useEffect(() => {
        // Initialize playability and button information for C major on page load
        updatePlayability('C', 'M');
    }, []);

    const handleNoteClick = (note) => {
        setSelectedNote(note);
        updatePlayability(note, selectedChord);
    };

    const handleChordClick = (chord) => {
        setSelectedChord(chord);
        updatePlayability(selectedNote, chord);
    };

    const updatePlayability = (note, chord) => {
        const chordKey = chord === 'M' ? note : `${note}${chord}`;
        const chordTones = chords[chordKey] || [];
        const pushPlayable = checkPlayability(chordTones, 'push'); // Check playability for push
        const pullPlayable = checkPlayability(chordTones, 'pull'); // Check playability for pull
        setIsPushPlayable(pushPlayable);
        setIsPullPlayable(pullPlayable);
        updateToneButtons(chordTones, 'push', setToneButtonsPush); // Update buttons for push
        updateToneButtons(chordTones, 'pull', setToneButtonsPull); // Update buttons for pull
    };

    const checkPlayability = (tones, action) => {
        const buttons = keymap['40-button'];
        const sideButtons = [...buttons.left, ...buttons.right];
        const filteredButtons = sideButtons.filter((btn) => tones.includes(btn[action]));

        const backtrack = (index, currentSet) => {
            if (currentSet.length > tones.length) return false;
            const currentTones = currentSet.map((btn) => btn[action]);
            if (tones.every((tone) => currentTones.includes(tone))) return true;
            for (let i = index; i < filteredButtons.length; i++) {
                if (backtrack(i + 1, [...currentSet, filteredButtons[i]])) return true;
            }
            return false;
        };

        return backtrack(0, []);
    };

    const updateToneButtons = (tones, action, setToneButtons) => {
        const buttons = keymap['40-button'];
        const leftButtons = buttons.left || []; // Default to empty array if undefined
        const rightButtons = buttons.right || []; // Default to empty array if undefined

        const toneToButtons = tones.reduce((acc, tone) => {
            acc[tone] = {
                left: leftButtons
                    .filter((btn) => btn[action] === tone)
                    .map((btn) => btn.button),
                right: rightButtons
                    .filter((btn) => btn[action] === tone)
                    .map((btn) => btn.button),
            };
            return acc;
        }, {});
        setToneButtons(toneToButtons);
    };

    const chordKey = selectedChord === 'M' ? selectedNote : `${selectedNote}${selectedChord}`;
    const chordTones = chords[chordKey] || []; // Get chord tones from JSON

    return (
        <div className="App">
            <h1>Concertina Chords App</h1>
            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                {notes.map((note) => (
                    <button
                        key={note}
                        onClick={() => handleNoteClick(note)}
                        style={{
                            padding: '10px 20px',
                            backgroundColor: selectedNote === note ? 'blue' : 'white',
                            color: selectedNote === note ? 'white' : 'black',
                            border: '1px solid black',
                            borderRadius: '5px',
                            cursor: 'pointer',
                        }}
                    >
                        {note}
                    </button>
                ))}
            </div>
            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                {chordTypes.map((chord) => (
                    <button
                        key={chord}
                        onClick={() => handleChordClick(chord)}
                        style={{
                            padding: '10px 20px',
                            backgroundColor: selectedChord === chord ? 'green' : 'white',
                            color: selectedChord === chord ? 'white' : 'black',
                            border: '1px solid black',
                            borderRadius: '5px',
                            cursor: 'pointer',
                        }}
                    >
                        {chord}
                    </button>
                ))}
            </div>
            <div style={{ marginTop: '30px', textAlign: 'center', fontSize: '24px', fontWeight: 'bold' }}>
                {chordKey}
            </div>
            <div style={{ marginTop: '10px', textAlign: 'center', fontSize: '18px', color: 'gray' }}>
                {chordTones.join(', ')} {/* Display chord tones */}
            </div>
            <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '18px', color: isPushPlayable ? 'green' : 'red' }}>
                Push: {isPushPlayable ? 'Playable' : 'Not Playable'}
            </div>
            <div style={{ marginTop: '10px', textAlign: 'center', fontSize: '18px', color: isPullPlayable ? 'green' : 'red' }}>
                Pull: {isPullPlayable ? 'Playable' : 'Not Playable'}
            </div>
            <div style={{ marginTop: '20px', textAlign: 'center' }}>
                <h2>Buttons for Each Tone (Push)</h2>
                {Object.entries(toneButtonsPush).map(([tone, buttons]) => (
                    <div key={tone}>
                        <strong>{tone}:</strong> 
                        <div>Left: {buttons.left?.join(', ') || 'None'}</div>
                        <div>Right: {buttons.right?.join(', ') || 'None'}</div>
                    </div>
                ))}
            </div>
            <div style={{ marginTop: '20px', textAlign: 'center' }}>
                <h2>Buttons for Each Tone (Pull)</h2>
                {Object.entries(toneButtonsPull).map(([tone, buttons]) => (
                    <div key={tone}>
                        <strong>{tone}:</strong> 
                        <div>Left: {buttons.left?.join(', ') || 'None'}</div>
                        <div>Right: {buttons.right?.join(', ') || 'None'}</div>
                    </div>
                ))}
            </div>
            <div style={{ marginTop: '30px', textAlign: 'center' }}>
                <h2>Concertina Keyboard Layout</h2>
                <KeyboardDiagram />
            </div>
        </div>
    );
}

export default App;
