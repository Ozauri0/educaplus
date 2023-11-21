import React, { useEffect, useState } from 'react';
import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCol, IonContent, IonGrid, IonHeader, IonImg, IonInput, IonPage, IonRow, IonTitle, IonToolbar } from '@ionic/react';
import { useParams } from 'react-router-dom';
import { getCurso, getInscripciones, registerInscripcion } from '../api/auth';
import { Curso, Inscripcion } from '../types';
import { useAuth } from '../context/AuthContext';

const CursoData: React.FC = () => {

	const { id } = useParams<{ id: string }>(); // Obtener la ID del URL
	const { currentUser } = useAuth()
	const [cursoDataa, setCursoDataa] = useState<Curso>();
	const [cursosInscritos, setCursosInscritos] = useState<number[]>([]);
	const [bannerUrl, setBannerUrl] = useState<string>("")
	const [files, setFiles] = useState<string[]>([]);

	const fetchFiles = async () => {
		try {
			const response = await fetch(`http://localhost:4000/api/list-files/curso/${id}`);
			const data = await response.json();
			setFiles(data);
		} catch (error) {
			console.error('Error al obtener la lista de archivos:', error);
		}
	};


	const handleInscripcion = async (id_curso: number) => {

		try {
			const inscripcion: Inscripcion = { id_curso: id_curso, id_docente: currentUser?.id }
			const response = await registerInscripcion(inscripcion);

			if (response.status == 200) {
				// Manejar el éxito de la operación
				console.log('Inscripción exitosa');
				fetchInscripciones();
				fetchCurso();
			} else {
				// Manejar errores
				console.error('Error al realizar la inscripción');
			}
		} catch (error) {
			console.error('Error al realizar la inscripción', error);
		}
	};

	const fetchCurso = async () => {
		try {
			const response = await getCurso(id);
			setCursoDataa(response.data);
		} catch (error) {
			console.log(error);
		}
	}

	const fetchInscripciones = async () => {
		try {
			const response = await getInscripciones(currentUser?.id);

			if (response.status === 200) {
				const data = await response.data

				// Extraer las ID de los cursos en los que el usuario está inscrito
				const inscripciones = data.map((inscripcion: Inscripcion) => inscripcion.id_curso)
				setCursosInscritos(inscripciones);
			} else {
				// Manejar errores si la respuesta no es exitosa
				console.error('Error al obtener inscripciones:', response.statusText);
			}
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		fetchInscripciones();
		fetchCurso()
		fetchFiles();
	}, [])

	console.log('Inscrito curso', cursosInscritos)
	console.log('Curso', cursoDataa)

	const handleFileUpload = async (e: any) => {
		const file = e.target.files[0];

		// Crea un objeto FormData
		const formData = new FormData();

		// Agrega el archivo al objeto FormData
		formData.append('file', file);
		const ruta = `cursos/${id}`

		// Usa Axios para enviar una solicitud POST al servidor
		try {
			const response = await fetch(`http://localhost:4000/api/upload/${ruta}`, {
				method: 'POST',
				body: formData,
			});

			// Maneja la respuesta del servidor
			console.log(response);
		} catch (error) {
			console.error('Error al subir el archivo:', error);
		}
	};

	const handleBannerUpload = async (e: any) => {
		const file = e.target.files[0];

		// Crea un objeto FormData
		const formData = new FormData();

		// Agrega el archivo al objeto FormData
		formData.append('file', file);

		try {
			const response = await fetch(`http://localhost:4000/api/upload/banner/${id}`, {
				method: 'POST',
				body: formData,
			});

			if (response.status === 200) {
				const newBannerUrl = `http://localhost:4000/uploads/cursos/${id}/banner?${Date.now()}`;
				setBannerUrl(newBannerUrl); // Actualiza el estado con la nueva URL del banner
			}
			// Maneja la respuesta del servidor
			console.log(response);
		} catch (error) {
			console.error('Error al subir el archivo:', error);
		}
	};

	const filteredFiles = files.filter(file => file !== 'banner');

	return (
		<IonPage>
			<IonHeader>
				<IonToolbar>
					<IonTitle>Educa +</IonTitle>
				</IonToolbar>
			</IonHeader>
			<IonContent fullscreen>
				<IonHeader collapse="condense">
					<IonToolbar>
						<IonTitle size="large">Cursos</IonTitle>
					</IonToolbar>
				</IonHeader>
				{cursoDataa && (
					<IonCard key={cursoDataa.id}>
						<IonGrid>
							<IonRow>
								<IonCol size="12" size-md="6" offset-md="3">
									<IonImg src={bannerUrl || `http://localhost:4000/uploads/cursos/${id}/banner`} /> {/* Usa el estado bannerUrl */}
									<IonCardHeader>
										<IonCardTitle>{cursoDataa.nombre_curso}</IonCardTitle>
										<IonCardSubtitle>{cursoDataa.descripcion}</IonCardSubtitle>
									</IonCardHeader>
									<IonCardContent>
										{/* <p>Inicio: {new Date(cursoDataa.fecha_inicio).toLocaleDateString()}</p>
										<p>Fin: {new Date(cursoDataa.fecha_termino).toLocaleDateString()}</p> */}
										<p>Cupos: {cursoDataa.cupos_restantes} / {cursoDataa.limite_cupos}</p>
										{/* <p>Cupos restantes: {curso.cupos_restantes}</p> */}
									</IonCardContent>
									{/* <IonButton href={`/Curso/${cursoDataa.id}`}>Ir al curso</IonButton> */}
									{cursosInscritos.includes(cursoDataa.id) ? (
										<IonButton color='danger' expand="block" onClick={() => handleInscripcion(cursoDataa.id)}>
											Desinscribirse
										</IonButton>
									) : (
										<IonButton expand="block" onClick={() => handleInscripcion(cursoDataa.id)}>
											Inscribirse
										</IonButton>
									)}
								</IonCol>
							</IonRow>
						</IonGrid>
					</IonCard>
				)}
				<IonCard>
					<IonGrid color='white'>
						<IonRow>
							<IonCol>
								<p>Subir archivo</p>
								<input type='file' onChange={handleFileUpload} />
							</IonCol>
						</IonRow>
						<IonRow>
							<IonCol>
								<p>Subir banner</p>
								<input type='file' onChange={handleBannerUpload} />
							</IonCol>
						</IonRow>
					</IonGrid>
				</IonCard>
				<IonCard>
					<IonCardHeader>
						<IonCardTitle>Recursos</IonCardTitle>
					</IonCardHeader>
					<IonCardContent>
						{filteredFiles.map((file, index) => (
							<p key={index}>
								<a href={`http://localhost:4000/uploads/cursos/${id}/${file}`} target="_blank" rel="noopener noreferrer">
									{file}
								</a>
							</p>
						))}
					</IonCardContent>
				</IonCard>
			</IonContent>
		</IonPage>
	);
}

export default CursoData;