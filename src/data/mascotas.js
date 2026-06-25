import cobiImg from '../assets/COBI.png'
import amparaImg from '../assets/AMPARA.png'

export const MASCOTAS = {
  cobi: {
    id: 'cobi',
    nombre: 'Cobi',
    animal: 'Cóndor',
    imagen: cobiImg,
    icono: 'flight',
    descripcion: 'Vuela alto y ve todo el panorama',
  },
  ampara: {
    id: 'ampara',
    nombre: 'Ampara',
    animal: 'Huemul',
    imagen: amparaImg,
    icono: 'forest',
    descripcion: 'Protege con cercanía y calma',
  },
}

export const TOUR_PASOS = {
  1: {
    ruta: '/home',
    targetId: 'tour-target-documentos',
    texto: 'Aquí puedes ver y subir tus documentos. Te voy a avisar antes de que se venza cualquiera.',
    siguienteRuta: '/home',
  },
  2: {
    ruta: '/home',
    targetId: 'tour-target-subsidios',
    texto: 'Acá te muestro a cuántos subsidios eres elegible y a cuáles ya te has inscrito.',
    siguienteRuta: '/home',
  },
  3: {
    ruta: '/home',
    targetId: 'tour-target-seguimiento',
    texto: 'Cuando te inscribas a un subsidio, aquí puedes seguir el estado de tu postulación paso a paso.',
    siguienteRuta: '/marketplace',
  },
  4: {
    ruta: '/marketplace',
    targetId: 'tour-target-marketplace',
    texto: 'Aquí encuentras maestros, ferreterías y empresas para tu reconstrucción.',
    siguienteRuta: '/subsidios',
  },
  5: {
    ruta: '/subsidios',
    targetId: 'tour-target-lista-subsidios',
    texto: 'Esta es la lista completa de subsidios y tu % de match con cada uno.',
    siguienteRuta: '/asistente',
  },
  6: {
    ruta: '/asistente',
    targetId: 'tour-target-chat',
    texto: 'Y si tienes dudas, siempre puedes preguntarme aquí. ¡Estoy para ayudarte!',
    siguienteRuta: '/home',
  },
}

export const TOTAL_PASOS_TOUR = Object.keys(TOUR_PASOS).length