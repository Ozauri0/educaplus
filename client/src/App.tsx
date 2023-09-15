import React from "react";
import { Redirect, Route } from "react-router-dom";
import {
	IonApp,
	IonIcon,
	IonLabel,
	IonRouterOutlet,
	IonTabBar,
	IonTabButton,
	IonTabs,
	setupIonicReact,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ellipse, person, menu, logoGoogle } from "ionicons/icons";

import Cursos from "./pages/Cursos";
import Recursos from "./pages/Recursos";
import Perfil from "./pages/Perfil";
import Inicio from "./pages/Inicio";
import Registro from "./pages/Registro";
import Login from "./pages/Login";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/* Theme variables */
import "./theme/variables.css";

setupIonicReact();

const App: React.FC = () => (
	<IonApp>
		<AuthProvider>
			<IonReactRouter>
				<IonTabs>
					<IonRouterOutlet>
						<Route exact path="/Cursos">
							<Cursos />
						</Route>
						<Route exact path="/Recursos">
							<Recursos />
						</Route>
						<Route exact path="/Inicio">
							<Inicio />
						</Route>
						<Route exact path="/Perfil">
							<Perfil />
						</Route>
						<Route exact path="/">
							<Redirect to="/Inicio" />
						</Route>
						<Route exact path="/hAsesoria">
							<Redirect to="/hAsesoria" />
							<Recursos />
						</Route>
					</IonRouterOutlet>
					<IonTabBar slot="bottom">
						<IonTabButton tab="Perfil" href="/Perfil">
							<IonIcon aria-hidden="true" icon={person} />
							<IonLabel>Perfil</IonLabel>
						</IonTabButton>
						<IonTabButton tab="Inicio" href="/Inicio">
							<IonIcon aria-hidden="true" icon={logoGoogle} />
							<IonLabel>Menu</IonLabel>
						</IonTabButton>
						<IonTabButton tab="Cursos" href="/Cursos">
							<IonIcon aria-hidden="true" icon={ellipse} />
							<IonLabel>Cursos</IonLabel>
						</IonTabButton>
						<IonTabButton tab="Recursos" href="/Recursos">
							<IonIcon aria-hidden="true" icon={menu} />
							<IonLabel>Recursos</IonLabel>
						</IonTabButton>
					</IonTabBar>
				</IonTabs>
				{/* Aquí se movio Cuenta a fuera de IonTabs para que al estar en esta pagina no se pueda acceder al menú */}
				<Route exact path="/Login">
					<Login />
				</Route>
				<Route
					exact
					path="/Registro"
					render={() => {
						return useAuth.isAuthenticated ? <Login /> : <Registro />;
					}}
				></Route>
			</IonReactRouter>
		</AuthProvider>
	</IonApp>
);

export default App;
