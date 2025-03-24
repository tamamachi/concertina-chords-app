import React, { useState } from 'react';
import './styles/App.css';

function App() {
    const [selectedNote, setSelectedNote] = useState('C'); // Default to 'C'
    const [selectedChord, setSelectedChord] = useState('M'); // Default to 'M'
    const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const chordTypes = ['M', 'm', '7', 'm7', 'M7', 'm7-5', 'sus4', 'dim', 'aug']; // Chord types

    const handleNoteClick = (note) => {
        setSelectedNote(note);
    };

    const handleChordClick = (chord) => {
        setSelectedChord(chord);
    };

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
            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}> {/* New chord type selection */}
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
                {selectedChord === 'M' ? selectedNote : `${selectedNote}${selectedChord}`} {/* Adjust display logic */}
            </div>
        </div>
    );
}

export default App;
