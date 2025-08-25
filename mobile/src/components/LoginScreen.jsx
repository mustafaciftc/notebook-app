import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { login, reset } from "../store/authSlice";

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const dispatch = useDispatch();
    const { isLoading, isError, isSuccess, message, token } = useSelector(
        (state) => state.auth
    );

    useEffect(() => {
        if (isError) {
            Alert.alert("Giriş Hatası", message);
        }

        if (isSuccess && token) {
            Alert.alert("Başarılı", "Giriş işlemi başarılı!");
            navigation.navigate("Home");
        }

        dispatch(reset());
    }, [isLoading, isError, isSuccess, message, token, navigation, dispatch]);

    const handleLogin = () => {
        if (email && password) {
            dispatch(login({ email, password }));
        } else {
            Alert.alert("Uyarı", "Lütfen e-posta ve şifrenizi girin.");
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.formContainer}>
                <Text style={styles.title}>Hoşgeldin!</Text>
                <Text style={styles.subtitle}>Hesabınıza giriş yapın</Text>

                <TextInput
                    style={styles.input}
                    placeholder="E-posta Adresi"
                    placeholderTextColor="#8A9B8E"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />

                <TextInput
                    style={styles.input}
                    placeholder="Şifre"
                    placeholderTextColor="#8A9B8E"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />

                <TouchableOpacity
                    style={isLoading ? styles.buttonDisabled : styles.button}
                    onPress={handleLogin}
                    disabled={isLoading}
                >
                    <Text style={styles.buttonText}>
                        {isLoading ? "Giriş Yapılıyor..." : "Giriş Yap"}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate("Register")}>
                    <Text style={styles.linkText}>
                        Hesabın yok mu? <Text style={styles.linkTextBold}>Kayıt Ol</Text>
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        // React Native için gradient alternatifi
        backgroundColor: "#E8F5E8",
    },
    formContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 30,
        marginHorizontal: 20,
        marginVertical: 60,
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        borderRadius: 25,
        shadowColor: "#2D5A3D",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.15,
        shadowRadius: 20,
        elevation: 15,
    },
    title: {
        fontSize: 32,
        fontWeight: "800",
        marginBottom: 8,
        color: "#2D5A3D",
        textAlign: "center",
        letterSpacing: 0.5,
    },
    subtitle: {
        fontSize: 16,
        color: "#6B8E73",
        marginBottom: 35,
        textAlign: "center",
        fontWeight: "400",
    },
    input: {
        width: "100%",
        height: 55,
        backgroundColor: "#F8FBF8",
        borderRadius: 15,
        paddingHorizontal: 20,
        marginBottom: 18,
        fontSize: 16,
        borderWidth: 2,
        borderColor: "#E1F0E3",
        shadowColor: "#4A7C59",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 4,
        color: "#2D5A3D",
    },
    button: {
        width: "100%",
        height: 55,
        backgroundColor: "#4A7C59",
        borderRadius: 30, // Oval buton
        justifyContent: "center",
        alignItems: "center",
        marginTop: 15,
        marginBottom: 25,
        shadowColor: "#4A7C59",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 8,
        // Gradient efekti için
        borderWidth: 0,
    },
    buttonDisabled: {
        width: "100%",
        height: 55,
        backgroundColor: "#A8C8B0",
        borderRadius: 30, // Oval buton
        justifyContent: "center",
        alignItems: "center",
        marginTop: 15,
        marginBottom: 25,
        shadowColor: "#A8C8B0",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    buttonText: {
        color: "#FFFFFF",
        fontSize: 18,
        fontWeight: "700",
        letterSpacing: 0.5,
    },
    linkText: {
        marginTop: 20,
        color: "#6B8E73",
        fontSize: 15,
        textAlign: "center",
    },
    linkTextBold: {
        fontWeight: "700",
        color: "#4A7C59",
    }
});

export default LoginScreen;