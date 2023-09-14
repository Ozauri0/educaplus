import {connect} from "../database/db.js";

export const getDocentes = async (req, res) => {
	try {
		const db = await connect();
		const [result] = await db.query("SELECT * FROM docente");
		console.log(result);
		res.json(result);
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: "Hola Mundo" });
		console.log(error);
	}
};
export const getDocente = async (req, res) => {
	try {
		const { id } = req.params;
		const db = await connect();
		const result = await db.query("SELECT * FROM docente WHERE id = ?", id);
		console.log(result[0]);
		res.json(result[0]);
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: "Internal server error" });
		console.log(error);
	}
};

export const register = async (req, res) => {
	try {
		const { nombres, apellidos, rut, correo, contrasena, telefono } = req.body;

		if (!nombres || !apellidos || !rut || !correo || !contrasena || !telefono) {
			return res.status(400).json({ message: "Must fill every field" });
		}

		const docente = { nombres, apellidos, rut, correo, contrasena, telefono };
		const db = await connect();
		const [mailExists] = await db.query("SELECT correo FROM docente WHERE correo = ?", [correo]);

		if (mailExists.length > 0) {
			console.log(mailExists);
			return res.status(400).json({ message: "Email already in use" });
		}

		const result = await db.query("INSERT INTO docente SET ?", [docente]);
		res.json(result);
		console.log("Docente registrado");

	} catch (error) {
		res.status(500).json({ message: "No se pudo realizar el registro" });
		console.log(error);
	}
};

export const login = async (req, res) => {
	try {
		const { correo, contrasena } = req.body;
		if (!correo || !contrasena) {
			return res.status(400).json({ message: "Must fill every field" });
		}
		const db = await connect();
		const [result] = await db.query("SELECT id FROM docente WHERE correo = ? AND contrasena = ?", [correo, contrasena]);
		if (result.length != 1) {
			return res.status(400).json({ message: "Invalid credentials" });
		}
		return res.status(200).json({ message: "Logged in" });
	} catch (error) {
		res.status(500).json({ message: "Internal server error" });
		console.log(error);
	}
};