FROM node:20-alpine

WORKDIR /app

# Copiamos la definición de paquetes
COPY package*.json ./

# Instalamos las dependencias dentro de la imagen
RUN npm install

# Copiamos todo el código fuente
COPY . .

# Exponemos el puerto de Vite
EXPOSE 5173

# Comando para arrancar el servidor en modo desarrollo accesible desde fuera
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
