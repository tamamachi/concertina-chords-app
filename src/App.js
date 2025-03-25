import React, { useState, useEffect } from 'react';
import './styles/App.css';
import ChordSelector from './components/ChordSelector';
import KeyboardDiagram from './components/KeyboardDiagram';
import useChordPlayability from './hooks/useChordPlayability'; // Import custom hook

function App() {
    const [selectedNote, setSelectedNote] = useState('C');
    const [selectedChord, setSelectedChord] = useState('M');
    const [buttonMode, setButtonMode] = useState('40-button'); // Default to 40-button mode

    const {
        chordKey,
        chordTones,
        isPushPlayable,
        isPullPlayable,
        pushLeftColors,
        pushRightColors,
        pullLeftColors,
        pullRightColors,
        pushToneColors,
        pullToneColors,
    } = useChordPlayability(selectedNote, selectedChord, buttonMode);

    const handleModeChange = (event) => {
        setButtonMode(event.target.value);
    };

    return (
        <div className="App">
            <div style={{ position: 'absolute', top: '10px', left: '10px' }}>
                <label htmlFor="buttonMode">Mode: </label>
                <select id="buttonMode" value={buttonMode} onChange={handleModeChange}>
                    <option value="40-button">40 Button</option>
                    <option value="30-button">30 Button</option>
                </select>
            </div>
            <h1>Concertina Chords App</h1>
            <ChordSelector
                notes={['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']}
                chordTypes={['M', 'm', '7', 'm7', 'M7', 'm7-5', 'sus4', 'dim', 'aug']}
                selectedNote={selectedNote}
                selectedChord={selectedChord}
                onNoteClick={setSelectedNote}
                onChordClick={setSelectedChord}
            />
            <div style={{ marginTop: '30px', textAlign: 'center', fontSize: '24px', fontWeight: 'bold' }}>
                {chordKey}
            </div>
            <div style={{ marginTop: '30px', textAlign: 'center' }}>
                <h2>
                    Push Diagram:{' '}
                    {isPushPlayable
                        ? chordTones.map((tone, index) => (
                              <span
                                  key={index}
                                  style={{
                                      backgroundColor: pushToneColors[tone] || 'transparent',
                                      color: 'black',
                                      padding: '2px 5px',
                                      borderRadius: '3px',
                                      marginRight: '5px',
                                  }}
                              >
                                  {tone}
                              </span>
                          ))
                        : 'Not Playable'}
                </h2>
                <KeyboardDiagram
                    leftButtonColors={isPushPlayable ? pushLeftColors : {}}
                    rightButtonColors={isPushPlayable ? pushRightColors : {}}
                />
            </div>
            <div style={{ marginTop: '30px', textAlign: 'center' }}>
                <h2>
                    Pull Diagram:{' '}
                    {isPullPlayable
                        ? chordTones.map((tone, index) => (
                              <span
                                  key={index}
                                  style={{
                                      backgroundColor: pullToneColors[tone] || 'transparent',
                                      color: 'black',
                                      padding: '2px 5px',
                                      borderRadius: '3px',
                                      marginRight: '5px',
                                  }}
                              >
                                  {tone}
                              </span>
                          ))
                        : 'Not Playable'}
                </h2>
                <KeyboardDiagram
                    leftButtonColors={isPullPlayable ? pullLeftColors : {}}
                    rightButtonColors={isPullPlayable ? pullRightColors : {}}
                />
            </div>
        </div>
    );
}

export default App;
