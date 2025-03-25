import React, { useState, useEffect } from 'react';
import './styles/App.css';
import chords from './data/chords.json'; // Import chord data
import keymap from './data/keymap.json'; // Import keymap data
import KeyboardDiagram from './components/KeyboardDiagram'; // Import the new component
import ChordSelector from './components/ChordSelector'; // Import ChordSelector

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
        const buttons = keymap['30-button'];
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
        const buttons = keymap['30-button'];
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

    const getToneColors = (toneButtons, baseHue) => {
        const toneColors = {};
        Object.keys(toneButtons).forEach((tone, index) => {
            const hue = (baseHue + index * 20) % 360; // Increment hue by 20 degrees for each tone
            toneColors[tone] = `hsl(${hue}, 100%, 50%)`; // Generate HSL color
        });
        return toneColors;
    };

    const getButtonColors = (toneButtons, baseHue) => {
        const leftButtonColors = {};
        const rightButtonColors = {};
        Object.entries(toneButtons).forEach(([tone, sides], index) => {
            const hue = (baseHue + index * 20) % 360; // Increment hue by 20 degrees for each tone
            const color = `hsl(${hue}, 100%, 50%)`; // Generate HSL color
            sides.left.forEach((button) => {
                leftButtonColors[button] = color; // Color left-hand buttons
            });
            sides.right.forEach((button) => {
                rightButtonColors[button] = color; // Color right-hand buttons
            });
        });
        return { leftButtonColors, rightButtonColors };
    };

    const renderChordTonesWithColors = (chordTones, toneColors) => {
        return chordTones.map((tone, index) => (
            <span
                key={index}
                style={{
                    backgroundColor: toneColors[tone] || 'transparent', // Use the tone color for background
                    color: 'black', // Default text color
                    padding: '2px 5px',
                    borderRadius: '3px',
                    marginRight: '5px',
                }}
            >
                {tone}
            </span>
        ));
    };

    const chordKey = selectedChord === 'M' ? selectedNote : `${selectedNote}${selectedChord}`;
    const chordTones = chords[chordKey] || []; // Get chord tones from JSON
    const { leftButtonColors: pushLeftColors, rightButtonColors: pushRightColors } = getButtonColors(toneButtonsPush, 0); // Push starts at hue 0
    const { leftButtonColors: pullLeftColors, rightButtonColors: pullRightColors } = getButtonColors(toneButtonsPull, 180); // Pull starts at hue 210
    const pushToneColors = getToneColors(toneButtonsPush, 0); // Push starts at hue 0
    const pullToneColors = getToneColors(toneButtonsPull, 180); // Pull starts at hue 180

    return (
        <div className="App">
            <h1>Concertina Chords App</h1>
            <ChordSelector
                notes={notes}
                chordTypes={chordTypes}
                selectedNote={selectedNote}
                selectedChord={selectedChord}
                onNoteClick={handleNoteClick}
                onChordClick={handleChordClick}
            />
            <div style={{ marginTop: '30px', textAlign: 'center' }}>
                <h2>
                    Push Diagram:{' '}
                    {isPushPlayable
                        ? renderChordTonesWithColors(chordTones, pushToneColors)
                        : 'Not Playable'}
                </h2>
                <KeyboardDiagram
                    leftButtonColors={isPushPlayable ? pushLeftColors : {}} // Clear colors if not playable
                    rightButtonColors={isPushPlayable ? pushRightColors : {}} // Clear colors if not playable
                />
            </div>
            <div style={{ marginTop: '30px', textAlign: 'center' }}>
                <h2>
                    Pull Diagram:{' '}
                    {isPullPlayable
                        ? renderChordTonesWithColors(chordTones, pullToneColors)
                        : 'Not Playable'}
                </h2>
                <KeyboardDiagram
                    leftButtonColors={isPullPlayable ? pullLeftColors : {}} // Clear colors if not playable
                    rightButtonColors={isPullPlayable ? pullRightColors : {}} // Clear colors if not playable
                />
            </div>
            <div style={{ marginTop: '30px', textAlign: 'center' }}>
                <h2>Debug Information</h2>
                <div>
                    <strong>Chord Tones:</strong> {chordTones.join(', ')}
                </div>
                <div>
                    <strong>Push Buttons:</strong> {JSON.stringify(toneButtonsPush, null, 2)}
                </div>
                <div>
                    <strong>Pull Buttons:</strong> {JSON.stringify(toneButtonsPull, null, 2)}
                </div>
            </div>
        </div>
    );
}

export default App;
