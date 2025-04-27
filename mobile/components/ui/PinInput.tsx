import React, { useRef } from 'react';
import { View, TextInput, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window'); // Ambil lebar layar

interface PinInputProps {
  pin: string;
  setPin: (value: string) => void;
}

export const PinInput = ({ pin, setPin }: PinInputProps) => {
  const inputs = useRef<Array<TextInput | null>>([]);

  const handleChange = (text: string, index: number) => {
    let newPin = pin.split('');
    if (text.length > 1) {
      newPin = text.split('').slice(0, 6);
      setPin(newPin.join(''));
      return;
    }
    newPin[index] = text;
    setPin(newPin.join(''));

    if (text && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !pin[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  // Hitung width kotak
  const inputWidth = Math.min(50, (width - 80) / 6); 
  // 80 itu padding kanan kiri biar aman, maksimal 50px per box

  return (
    <View style={styles.container}>
      {Array(6)
        .fill(0)
        .map((_, index) => (
          <TextInput
            key={index}
            ref={(ref) => (inputs.current[index] = ref)}
            style={[styles.input, { width: inputWidth, height: inputWidth + 8 }]}
            value={pin[index] || ''}
            onChangeText={(text) => handleChange(text, index)}
            onKeyPress={(e) => handleKeyPress(e, index)}
            keyboardType="numeric"
            maxLength={1}
            secureTextEntry
          />
        ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 20,
    flexWrap: 'nowrap',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginHorizontal: 4,
    textAlign: 'center',
    fontSize: 24,
  },
});
