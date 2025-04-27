import React, { ReactNode } from 'react';
import { StyleSheet, View, Text, Modal as RNModal, TouchableOpacity } from 'react-native';
import { Button } from './Button';

interface ModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  primaryButton?: {
    title: string;
    onPress: () => void;
    loading?: boolean;
  };
  secondaryButton?: {
    title: string;
    onPress: () => void;
  };
}

export function Modal({
  visible,
  onClose,
  title,
  children,
  primaryButton,
  secondaryButton,
}: ModalProps) {
  return (
    <RNModal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {title && <Text style={styles.title}>{title}</Text>}
          
          <View style={styles.content}>{children}</View>
          
          {(primaryButton || secondaryButton) && (
            <View style={styles.buttonContainer}>
              {secondaryButton && (
                <Button
                  title={secondaryButton.title}
                  onPress={secondaryButton.onPress}
                  variant="outline"
                  style={styles.secondaryButton}
                />
              )}
              {primaryButton && (
                <Button
                  title={primaryButton.title}
                  onPress={primaryButton.onPress}
                  loading={primaryButton.loading}
                  style={[
                    styles.primaryButton,
                    secondaryButton ? styles.buttonWithMargin : null,
                  ]}
                />
              )}
            </View>
          )}
        </View>
      </View>
    </RNModal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    width: '100%',
    maxWidth: 400,
    padding: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  content: {
    marginBottom: 24,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  primaryButton: {
    minWidth: 120,
  },
  secondaryButton: {
    minWidth: 120,
  },
  buttonWithMargin: {
    marginLeft: 12,
  },
});