const getConnection = require("../config/db");

const addNote = async (req, res) => {
    try {
        let { title, content } = req.body;
        const connection = await getConnection();
        const result = await connection.query("INSERT INTO notes (title, content) VALUES (?,?)", [title, content]);
        if (result.affectedRows > 0) {
            res.send({
                message: "Not başarıyla eklendi",
                id: result.insertId.toString,
                title: title,
                content: content,
            })
        } else {
            res.send({ message: "Not eklenirken hata oluştu" })
        }
    } catch (error) {
        console.log(error)
    }
}

const getNotes = async (req, res) => {
    try {
        const connection = await getConnection();
        const result = await connection.query("SELECT * FROM notes")
        res.send(result)
    } catch (error) {
        console.log(error)
    }

}

const getNoteById = async (req, res) => {
    try {
        let id = req.params.id;
        const connection = await getConnection();
        const result = await connection.query("SELECT * FROM notes WHERE id = ?", [id]);
        if (result[0]) {
            res.send({
                message: "İlgili not getirildi"
            })
        } else {
            res.send({ message: "İlgili not bulunamadı" })
        }
    } catch (error) {
        console.log(error)
    }
}

const updateNote = async (req, res) => {
    try {
        let id = req.params.id;
        let { title, content } = req.body;
        const connection = await getConnection();
        const result = await connection.query("UPDATE notes SET title = ?, content = ? WHERE id = ?", [title, content, id])
        if (result.affectedRows > 0) {
            res.send({ message: "Not başarıyla güncellendi" })
        } else {
            res.send({ message: "Not güncellenirken hata oluştu" })
        }
    } catch (error) {
        console.log(error)
    }
}

const deleteNote = async (req, res) => {
    try {
        let id = req.params.id;
        const connection = await getConnection();
        const result = await connection.query("DELETE FROM notes WHERE id = ?", [id]);
        if (result.affectedRows > 0) {
            res.send({ message: "Not başarıyla silindi" })
        } else {
            res.send({ message: "Not silinirken hata oluştu" })
        }
    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    addNote,
    getNotes,
    getNoteById,
    updateNote,
    deleteNote
}