import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

export function RescueCard({ onResend, onEdit, onSwitch }: { onResend: () => void; onEdit: () => void; onSwitch: () => void; }) {
  return (
    <View style={{ backgroundColor: '#111827', borderColor: '#1f2937', borderWidth: 1, borderRadius: 12, padding: 16, marginTop: 12 }}>
      <Text style={{ color: 'white', fontWeight: '600', marginBottom: 6 }}>Still waiting for approval</Text>
      <Text style={{ color: '#9ca3af', marginBottom: 12 }}>This usually completes in ~45s. Didn’t get a prompt?</Text>
      <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
        <TouchableOpacity onPress={onResend} style={{ backgroundColor: '#2563eb', paddingVertical: 10, paddingHorizontal: 14, borderRadius: 10, marginRight: 8, marginBottom: 8 }}>
          <Text style={{ color: 'white', fontWeight: '700' }}>Resend approval</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onEdit} style={{ borderColor: '#334155', borderWidth: 1, paddingVertical: 10, paddingHorizontal: 14, borderRadius: 10, marginRight: 8, marginBottom: 8 }}>
          <Text style={{ color: 'white', fontWeight: '700' }}>Change number</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onSwitch} style={{ borderColor: '#334155', borderWidth: 1, paddingVertical: 10, paddingHorizontal: 14, borderRadius: 10, marginBottom: 8 }}>
          <Text style={{ color: 'white', fontWeight: '700' }}>Use Bank or Card</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

