import React from 'react';

const ChordSelector = ({ notes, chordTypes, selectedNote, selectedChord, onNoteClick, onChordClick }) => {
    return (
        <div style={{ textAlign: 'center' }}>
            <div
                style={{
                    display: 'flex',
                    flexWrap: 'wrap', // Allow wrapping
                    justifyContent: 'center',
                    gap: '10px',
                    marginTop: '20px',
                }}
            >
                {notes.map((note) => (
                    <button
                        key={note}
                        onClick={() => onNoteClick(note)}
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
            <div
                style={{
                    display: 'flex',
                    flexWrap: 'wrap', // Allow wrapping
                    justifyContent: 'center',
                    gap: '10px',
                    marginTop: '20px',
                }}
            >
                {chordTypes.map((chord) => (
                    <button
                        key={chord}
                        onClick={() => onChordClick(chord)}
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
        </div>
    );
};

export default ChordSelector;
