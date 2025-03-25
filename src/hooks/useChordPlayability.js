import { useState, useEffect } from 'react';
import chords from '../data/chords.json';
import keymap from '../data/keymap.json';

const useChordPlayability = (selectedNote, selectedChord) => {
    const [isPushPlayable, setIsPushPlayable] = useState(false);
    const [isPullPlayable, setIsPullPlayable] = useState(false);
    const [toneButtonsPush, setToneButtonsPush] = useState({});
    const [toneButtonsPull, setToneButtonsPull] = useState({});

    const chordKey = selectedChord === 'M' ? selectedNote : `${selectedNote}${selectedChord}`;
    const chordTones = chords[chordKey] || [];

    useEffect(() => {
        updatePlayability(selectedNote, selectedChord);
    }, [selectedNote, selectedChord]);

    const updatePlayability = (note, chord) => {
        const chordKey = chord === 'M' ? note : `${note}${chord}`;
        const chordTones = chords[chordKey] || [];
        setIsPushPlayable(checkPlayability(chordTones, 'push'));
        setIsPullPlayable(checkPlayability(chordTones, 'pull'));
        updateToneButtons(chordTones, 'push', setToneButtonsPush);
        updateToneButtons(chordTones, 'pull', setToneButtonsPull);
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
        const leftButtons = buttons.left || [];
        const rightButtons = buttons.right || [];

        const toneToButtons = tones.reduce((acc, tone) => {
            acc[tone] = {
                left: leftButtons.filter((btn) => btn[action] === tone).map((btn) => btn.button),
                right: rightButtons.filter((btn) => btn[action] === tone).map((btn) => btn.button),
            };
            return acc;
        }, {});
        setToneButtons(toneToButtons);
    };

    const getButtonColors = (toneButtons, baseHue) => {
        const leftButtonColors = {};
        const rightButtonColors = {};
        Object.entries(toneButtons).forEach(([tone, sides], index) => {
            const hue = (baseHue + index * 20) % 360;
            const color = `hsl(${hue}, 100%, 50%)`;
            sides.left.forEach((button) => {
                leftButtonColors[button] = color;
            });
            sides.right.forEach((button) => {
                rightButtonColors[button] = color;
            });
        });
        return { leftButtonColors, rightButtonColors };
    };

    const getToneColors = (toneButtons, baseHue) => {
        const toneColors = {};
        Object.keys(toneButtons).forEach((tone, index) => {
            const hue = (baseHue + index * 20) % 360;
            toneColors[tone] = `hsl(${hue}, 100%, 50%)`;
        });
        return toneColors;
    };

    const { leftButtonColors: pushLeftColors, rightButtonColors: pushRightColors } = getButtonColors(toneButtonsPush, 0);
    const { leftButtonColors: pullLeftColors, rightButtonColors: pullRightColors } = getButtonColors(toneButtonsPull, 180);
    const pushToneColors = getToneColors(toneButtonsPush, 0);
    const pullToneColors = getToneColors(toneButtonsPull, 180);

    return {
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
    };
};

export default useChordPlayability;
