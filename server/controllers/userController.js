const getConnection = require("../config/db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({
            success: false,
            message: "Lütfen tüm alanları doldurun."
        });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({
            success: false,
            message: "Geçerli bir email adresi giriniz."
        });
    }

    if (password.length < 6) {
        return res.status(400).json({
            success: false,
            message: "Şifre en az 6 karakter olmalıdır."
        });
    }

    try {
        const connection = await getConnection();
        const [existingUser] = await connection.query("SELECT id FROM users WHERE email = ?", [email]);
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "Bu email adresi zaten kullanılıyor."
            });
        }

        const hash = await bcrypt.hash(password, 12);

        const result = await connection.query(
            "INSERT INTO users (name, email, password) VALUES (?,?,?)",
            [name, email, hash]
        );
        const userId = result.insertId;

        const jwtSecret = process.env.SECRET;
        if (!jwtSecret) {
            console.error('JWT Secret bulunamadı!');
            return res.status(500).json({
                success: false,
                message: "Sunucu yapılandırma hatası."
            });
        }

        const token = jwt.sign(
            { userId, email, name },
            jwtSecret,
            { expiresIn: "30d" }
        );

        return res.status(201).json({
            success: true,
            message: "Kullanıcı başarıyla oluşturuldu.",
            data: {
                token,
                user: { id: userId, name, email }
            }
        });

    } catch (error) {
        console.error("Kayıt sırasında hata:", error);

        return res.status(500).json({
            success: false,
            message: "Sunucu hatası. Lütfen daha sonra tekrar deneyin."
        });

    } 
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Lütfen tüm alanları doldurun." });
        }

        const connection = await getConnection();
        const rows = await connection.query("SELECT * FROM users WHERE email = ?", [email]);
        const user = rows[0];

        if (!user) {
            return res.status(404).json({ message: "Kullanıcı bulunamadı." });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: "Yanlış şifre." });
        }

        const token = jwt.sign(
            { userId: user.id, email: user.email },
            process.env.SECRET,
            { expiresIn: "24h" }
        );

        res.status(200).json({
            message: "Giriş başarılı!",
            token: token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        console.error("Giriş yaparken bir hata oluştu:", error);
        res.status(500).json({ message: "Sunucu hatası. Lütfen daha sonra tekrar deneyin." });
    }
};

module.exports = { loginUser, registerUser }