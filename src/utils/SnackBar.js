import React from 'react';
import { Portal, Snackbar } from 'react-native-paper';
import { s, vs, ms } from 'react-native-size-matters';


const COLORS = {
    success: '#4CAF50',
    error: '#F44336',
    warning: '#FF9800',
};

const CustomSnackBar = ({ visible, message, type, onDismiss }) => {
    return (
        <Portal>
            <Snackbar
                visible={visible}
                onDismiss={onDismiss}
                duration={2500}
                style={{
                    backgroundColor: COLORS[type], position: "absolute",
                    bottom: ms(30),
                    marginHorizontal: ms(20), borderRadius: ms(10),
                }}
                theme={{ colors: { onSurface: "#FFFFFF" } }}
            >
                {message}
            </Snackbar>
        </Portal>
    );
};

export default CustomSnackBar;
